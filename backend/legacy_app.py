import os
import json
import io
import pandas as pd
from flask import Flask, request, jsonify, send_file, Response
from flask_cors import CORS
from database import get_db_connection, init_db
from ml_engine import CloudIDSPipeline, default_pipeline, MODELS_DIR, CLASS_LABELS
from mitigation_engine import generate_firewall_rules
from report_generator import generate_pdf_report, generate_csv_report
from telemetry_streamer import generate_live_packet

app = Flask(__name__)
CORS(app)

# Ensure DB and directories exist
init_db()

# Cache of pipelines per dataset
pipelines = {
    "nsl-kdd": default_pipeline,
    "cicids2017": CloudIDSPipeline("cicids2017"),
    "unsw-nb15": CloudIDSPipeline("unsw-nb15")
}

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "system": "Cloud-IDS ML v2.5",
        "framework": "Flask / Scikit-Learn",
        "active_models": list(pipelines["nsl-kdd"].trained_models.keys()) or ["Random Forest", "Decision Tree"]
    })

# --- AUTHENTICATION ---
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password)).fetchone()
    conn.close()

    if user:
        return jsonify({
            "success": True,
            "user": {
                "id": user['id'],
                "username": user['username'],
                "role": user['role'],
                "email": user['email']
            }
        })
    return jsonify({"success": False, "message": "Invalid username or password"}), 401

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    role = data.get('role', 'Analyst')
    email = data.get('email', '')

    if not username or not password:
        return jsonify({"success": False, "message": "Username and password required"}), 400

    try:
        conn = get_db_connection()
        conn.execute("INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)",
                     (username, password, role, email))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "User registered successfully"})
    except Exception as e:
        return jsonify({"success": False, "message": "Username already exists or database error"}), 400

# --- DATASETS ---
@app.route('/api/datasets', methods=['GET'])
def get_datasets():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM datasets ORDER BY created_at DESC").fetchall()
    conn.close()
    
    datasets_list = []
    for r in rows:
        feat_list = json.loads(r['features_list']) if r['features_list'] else []
        datasets_list.append({
            "id": r['id'],
            "name": r['name'],
            "rows": r['rows_count'],
            "features": r['features_count'],
            "missing_values": r['missing_values'],
            "source_type": r['source_type'],
            "features_preview": feat_list[:8],
            "description": r['description'],
            "created_at": r['created_at']
        })
    return jsonify({"datasets": datasets_list})

@app.route('/api/datasets/upload', methods=['POST'])
def upload_dataset():
    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file uploaded"}), 400
    
    file = request.files['file']
    if not file.filename.endswith('.csv'):
        return jsonify({"success": False, "message": "Only CSV files are supported"}), 400

    dataset_name = request.form.get('name', file.filename.replace('.csv', ''))
    dataset_id = dataset_name.lower().replace(' ', '_')
    
    upload_path = os.path.join(os.path.dirname(__file__), "data", f"{dataset_id}.csv")
    file.save(upload_path)

    # Profile CSV
    df = pd.read_csv(upload_path)
    rows_count = len(df)
    features_count = len(df.columns)
    missing_count = int(df.isnull().sum().sum())
    features_list = list(df.columns)

    conn = get_db_connection()
    conn.execute("""
        INSERT OR REPLACE INTO datasets 
        (id, name, rows_count, features_count, missing_values, source_type, features_list, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        dataset_id,
        dataset_name,
        rows_count,
        features_count,
        missing_count,
        "Custom Upload (PCAP/CSV)",
        json.dumps(features_list),
        f"Custom uploaded dataset with {rows_count} records and {features_count} extracted features."
    ))
    conn.commit()
    conn.close()

    # Register in memory pipeline
    pipelines[dataset_id] = CloudIDSPipeline(dataset_id)

    return jsonify({
        "success": True,
        "dataset": {
            "id": dataset_id,
            "name": dataset_name,
            "rows": rows_count,
            "features": features_count,
            "missing_values": missing_count,
            "features_preview": features_list[:8]
        }
    })

# --- ML TRAINING & MODELS ---
@app.route('/api/train', methods=['POST'])
def train_models_endpoint():
    data = request.json or {}
    dataset_id = data.get('dataset', 'nsl-kdd')
    algorithms = data.get('algorithms', ['Random Forest', 'Decision Tree'])

    if dataset_id not in pipelines:
        pipelines[dataset_id] = CloudIDSPipeline(dataset_id)

    pipeline = pipelines[dataset_id]
    eval_results = pipeline.train_models(algorithms)

    return jsonify({
        "success": True,
        "dataset": dataset_id,
        "results": eval_results
    })

@app.route('/api/models/download/<dataset_id>/<algo>', methods=['GET'])
def download_model(dataset_id, algo):
    algo_clean = algo.replace(' ', '_').lower()
    filename = f"{dataset_id}_{algo_clean}.joblib"
    path = os.path.join(MODELS_DIR, filename)

    if not os.path.exists(path):
        # Trigger training to generate file
        if dataset_id not in pipelines:
            pipelines[dataset_id] = CloudIDSPipeline(dataset_id)
        pipelines[dataset_id].train_models([algo])
    
    if os.path.exists(path):
        return send_file(path, as_attachment=True, download_name=filename)
    return jsonify({"error": "Model file not found"}), 404

@app.route('/api/models/curves', methods=['GET'])
def get_training_curves():
    dataset_id = request.args.get('dataset', 'nsl-kdd')
    pipeline = pipelines.get(dataset_id, default_pipeline)
    return jsonify(pipeline.get_training_curves())

@app.route('/api/models/confusion-matrix', methods=['GET'])
def get_confusion_matrix():
    dataset_id = request.args.get('dataset', 'nsl-kdd')
    pipeline = pipelines.get(dataset_id, default_pipeline)
    if not pipeline.evaluations:
        pipeline.train_models(["Random Forest", "Decision Tree"])
    return jsonify(pipeline.evaluations)

# --- PREDICTION & EXPLOIT SANDBOX ---
@app.route('/api/predict', methods=['POST'])
def predict_packet():
    data = request.json or {}
    dataset_id = data.get('dataset', 'nsl-kdd')
    pipeline = pipelines.get(dataset_id, default_pipeline)
    
    res = pipeline.predict_vector(data.get('packet', {}))
    return jsonify(res)

@app.route('/api/sandbox/simulate', methods=['POST'])
def simulate_exploit():
    data = request.json or {}
    attack_type = data.get('attack_type', 'DoS')
    source_ip = data.get('source_ip', '198.51.100.24')
    dest_ip = data.get('destination_ip', '10.0.0.50 (Web-App-01)')
    custom_payload = data.get('custom_payload', {})

    # Predict using active pipeline
    dataset_id = data.get('dataset', 'nsl-kdd')
    pipeline = pipelines.get(dataset_id, default_pipeline)
    
    prediction_result = pipeline.predict_vector(custom_payload)
    
    # Generate mitigation firewall rule
    rules = generate_firewall_rules(
        source_ip=source_ip,
        attack_type=prediction_result["prediction"],
        severity=prediction_result["severity"],
        port=custom_payload.get('service_port', 80)
    )

    # Persist alert into DB
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO alerts 
        (source_ip, destination_ip, attack_type, severity, status, confidence, mitigated, firewall_rule)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        source_ip,
        dest_ip,
        prediction_result["prediction"],
        prediction_result["severity"],
        "Active",
        prediction_result["confidence"],
        0,
        rules["iptables_command"]
    ))
    alert_id = cursor.lastrowid

    cursor.execute("""
        INSERT INTO detection_history 
        (source_ip, destination_ip, protocol, service, duration, src_bytes, dst_bytes, prediction, confidence, severity, dataset_source)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        source_ip,
        dest_ip,
        custom_payload.get('protocol_type', 'tcp'),
        custom_payload.get('service', 'http'),
        custom_payload.get('duration', 0.0),
        custom_payload.get('src_bytes', 1024),
        custom_payload.get('dst_bytes', 0),
        prediction_result["prediction"],
        prediction_result["confidence"],
        prediction_result["severity"],
        "Exploit Sandbox Test"
    ))
    conn.commit()
    conn.close()

    return jsonify({
        "alert_id": alert_id,
        "prediction": prediction_result,
        "mitigation": rules
    })

# --- LIVE TELEMETRY STREAM ---
@app.route('/api/telemetry/packet', methods=['GET'])
def get_telemetry_packet():
    packet = generate_live_packet()
    return jsonify(packet)

# --- DASHBOARD & ALERTS ---
@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM detection_history")
    total_inspected = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM detection_history WHERE prediction != 'Normal'")
    threats_detected = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM alerts WHERE status = 'Active'")
    active_alerts = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM alerts WHERE mitigated = 1")
    mitigated_threats = cursor.fetchone()[0]

    # Category breakdown
    cursor.execute("""
        SELECT prediction, COUNT(*) as count 
        FROM detection_history 
        GROUP BY prediction
    """)
    distribution = {row['prediction']: row['count'] for row in cursor.fetchall()}

    # Recent Alerts
    cursor.execute("SELECT * FROM alerts ORDER BY id DESC LIMIT 6")
    recent_alerts = [dict(r) for r in cursor.fetchall()]

    conn.close()

    return jsonify({
        "total_inspected": total_inspected,
        "threats_detected": threats_detected,
        "normal_traffic": total_inspected - threats_detected,
        "active_alerts": active_alerts,
        "mitigated_threats": mitigated_threats,
        "threat_distribution": distribution,
        "recent_alerts": recent_alerts,
        "system_health": "Optimal (Firewall & ML Active)"
    })

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM alerts ORDER BY id DESC LIMIT 50").fetchall()
    conn.close()
    return jsonify({"alerts": [dict(r) for r in rows]})

@app.route('/api/alerts/<int:alert_id>/mitigate', methods=['POST'])
def mitigate_alert(alert_id):
    conn = get_db_connection()
    conn.execute("UPDATE alerts SET status = 'Mitigated', mitigated = 1 WHERE id = ?", (alert_id,))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": f"Alert #{alert_id} mitigated. Firewall rule enforced."})

@app.route('/api/history', methods=['GET'])
def get_history():
    query = request.args.get('search', '').strip()
    severity = request.args.get('severity', '')
    attack_type = request.args.get('attack_type', '')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 15))
    offset = (page - 1) * limit

    conn = get_db_connection()
    sql = "SELECT * FROM detection_history WHERE 1=1"
    params = []

    if query:
        sql += " AND (source_ip LIKE ? OR destination_ip LIKE ? OR service LIKE ?)"
        params.extend([f"%{query}%", f"%{query}%", f"%{query}%"])
    if severity and severity != 'All':
        sql += " AND severity = ?"
        params.append(severity)
    if attack_type and attack_type != 'All':
        sql += " AND prediction = ?"
        params.append(attack_type)

    count_sql = sql.replace("SELECT *", "SELECT COUNT(*)")
    total = conn.execute(count_sql, params).fetchone()[0]

    sql += " ORDER BY id DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    
    rows = conn.execute(sql, params).fetchall()
    conn.close()

    return jsonify({
        "total": total,
        "page": page,
        "limit": limit,
        "logs": [dict(r) for r in rows]
    })

# --- REPORTS ---
@app.route('/api/reports/pdf', methods=['GET'])
def download_pdf_report():
    pdf_bytes = generate_pdf_report()
    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f"cloud_ids_audit_report_{pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    )

@app.route('/api/reports/csv', methods=['GET'])
def download_csv_report():
    csv_str = generate_csv_report()
    return Response(
        csv_str,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=cloud_ids_telemetry_audit.csv"}
    )

# --- SETTINGS ---
@app.route('/api/settings', methods=['GET', 'POST'])
def handle_settings():
    conn = get_db_connection()
    if request.method == 'POST':
        data = request.json or {}
        for k, v in data.items():
            conn.execute("INSERT OR REPLACE INTO system_settings (key, value) VALUES (?, ?)", (str(k), str(v)))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "Settings updated"})
    else:
        rows = conn.execute("SELECT key, value FROM system_settings").fetchall()
        conn.close()
        return jsonify({r['key']: r['value'] for r in rows})

if __name__ == '__main__':
    # Train initial default models to ensure instant responsiveness
    try:
        print("Training baseline Random Forest and Decision Tree models...")
        default_pipeline.train_models(["Random Forest", "Decision Tree", "Support Vector Machine", "Naive Bayes"])
    except Exception as e:
        print("Model pre-training note:", e)
    
    print("Starting Cloud-IDS Flask Backend on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
