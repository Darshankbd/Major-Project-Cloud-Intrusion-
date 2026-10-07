from fastapi import APIRouter, HTTPException, BackgroundTasks, Response
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from backend.app.ml.predictor import predictor_service
from backend.app.services.traffic_simulator import traffic_simulator
from backend.app.services.alert_engine import alert_engine_service
from backend.app.services.report_generator import generate_pdf_report
from backend.app.db.database import (
    get_user_by_email, get_all_users, create_user, assign_resource_to_user, 
    update_user_status, create_incident_report, get_employee_incidents,
    get_org_settings, update_org_settings, get_notification_logs, hash_password
)
from ml_engine.train_models import train_and_evaluate

router = APIRouter()

# Pydantic Request Models
class LoginRequest(BaseModel):
    email: str
    password: str

class FlowPredictRequest(BaseModel):
    duration: float = Field(default=0.05)
    protocol_type: str = Field(default="TCP")
    service: str = Field(default="HTTPS")
    flag: str = Field(default="SF")
    src_bytes: float = Field(default=500.0)
    dst_bytes: float = Field(default=1200.0)
    src_pkts: int = Field(default=10)
    dst_pkts: int = Field(default=12)
    pkt_len_mean: float = Field(default=450.0)
    pkt_len_std: float = Field(default=120.0)
    header_bytes: float = Field(default=640.0)
    payload_entropy: float = Field(default=3.5)
    failed_logins: int = Field(default=0)
    iam_risk_score: float = Field(default=1.5)
    same_srv_rate: float = Field(default=0.95)
    diff_srv_rate: float = Field(default=0.05)
    serror_rate: float = Field(default=0.0)
    rerror_rate: float = Field(default=0.0)
    cloud_region: str = Field(default="us-east-1")

class AddEmployeeRequest(BaseModel):
    email: str
    password: str = "Employee@123"
    full_name: str
    department: str = "DevOps Engineering"
    role: str = "EMPLOYEE"

class AssignResourceRequest(BaseModel):
    resource_id: str
    resource_name: str
    ip_address: str
    subnet: str

class StatusUpdateRequest(BaseModel):
    status: str

class IncidentReportRequest(BaseModel):
    user_id: str
    user_name: str
    user_email: str
    title: str
    description: str
    severity: str = "HIGH"

class OrgSettingsRequest(BaseModel):
    webhook_url: str
    notification_email: str

class InjectAttackRequest(BaseModel):
    attack_type: str
    count: int = 5

class MitigateRequest(BaseModel):
    action: str = "Block Source IP"
    admin_user: str = "SOC_Admin"

class SpeedRequest(BaseModel):
    interval: float = 1.0

class AIChatRequest(BaseModel):
    question: str

# 1. Authentication Endpoints
@router.post("/auth/login")
def login(request: LoginRequest):
    user = get_user_by_email(request.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or user account not found.")
    
    if user['password_hash'] != hash_password(request.password):
        raise HTTPException(status_code=401, detail="Invalid password.")
    
    if user['status'] != 'ACTIVE':
        raise HTTPException(status_code=403, detail="Account is suspended. Contact Org Admin.")

    token = f"jwt-token-{user['id']}-{int(user['created_at'].replace('-', '').replace(':', '').replace(' ', ''))}"
    return {
        "status": "success",
        "token": token,
        "user": {
            "id": user["id"],
            "org_id": user["org_id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "department": user["department"],
            "status": user["status"]
        }
    }

# 2. Organization & Employee Management Endpoints
@router.get("/org/employees")
def list_employees():
    org_id = "ORG-CLOUDGUARD-01"
    users = get_all_users(org_id)
    return {"employees": users}

@router.post("/org/employees")
def add_employee(request: AddEmployeeRequest):
    existing = get_user_by_email(request.email)
    if existing:
        raise HTTPException(status_code=400, detail="Employee with this email already exists.")
    
    org_id = "ORG-CLOUDGUARD-01"
    new_user = create_user(org_id, request.email, request.password, request.full_name, request.role, request.department)
    return {"status": "success", "employee": new_user}

@router.post("/org/employees/{user_id}/assign-resource")
def assign_resource(user_id: str, request: AssignResourceRequest):
    res = assign_resource_to_user(user_id, request.resource_id, request.resource_name, request.ip_address, request.subnet)
    return {"status": "success", "assignment": res}

@router.patch("/org/employees/{user_id}/status")
def toggle_status(user_id: str, request: StatusUpdateRequest):
    update_user_status(user_id, request.status)
    return {"status": "success", "message": f"User status updated to {request.status}"}

# 3. Employee Self-Service Incident Reporting
@router.post("/employee/incidents")
def submit_employee_incident(request: IncidentReportRequest):
    inc = create_incident_report(
        request.user_id, request.user_name, request.user_email, 
        request.title, request.description, request.severity
    )
    return {"status": "success", "incident": inc}

@router.get("/employee/incidents")
def list_employee_incidents():
    incidents = get_employee_incidents()
    return {"incidents": incidents}

# 4. Organization Settings & Notification Logs
@router.get("/org/settings")
def get_settings():
    org_id = "ORG-CLOUDGUARD-01"
    return get_org_settings(org_id)

@router.post("/org/settings")
def save_settings(request: OrgSettingsRequest):
    org_id = "ORG-CLOUDGUARD-01"
    update_org_settings(org_id, request.webhook_url, request.notification_email)
    return {"status": "success", "message": "Organization security settings saved."}

@router.get("/notifications/logs")
def fetch_notification_logs():
    return {"logs": get_notification_logs()}

# 5. Core ML Predict & Traffic Endpoints
@router.post("/predict")
def predict_single_flow(request: FlowPredictRequest):
    try:
        flow_dict = request.dict()
        result = predictor_service.predict_flow(flow_dict)
        
        flow_dict_full = {**flow_dict, **result, 'timestamp': 'Just now', 'flow_id': 'INSPECTED-FLOW', 'src_ip': 'Client-IP', 'dst_ip': '10.0.0.1'}
        alert = alert_engine_service.record_alert(flow_dict_full)
        if alert:
            result['alert_triggered'] = alert

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/traffic/speed")
def change_traffic_speed(request: SpeedRequest):
    traffic_simulator.set_speed(request.interval)
    return {"status": "success", "interval": traffic_simulator.interval}

@router.post("/traffic/start")
def start_traffic_simulator():
    traffic_simulator.start()
    return {"status": "started", "is_running": True}

@router.post("/traffic/stop")
def stop_traffic_simulator():
    traffic_simulator.stop()
    return {"status": "stopped", "is_running": False}

@router.get("/traffic/status")
def get_traffic_status():
    return {
        "is_running": traffic_simulator.is_running,
        "interval": traffic_simulator.interval,
        "generated_count": traffic_simulator.generated_count,
        "threat_count": traffic_simulator.threat_count,
        "blocked_ips_count": len(traffic_simulator.blocked_ips),
        "blocked_ips": list(traffic_simulator.blocked_ips)
    }

@router.post("/traffic/inject")
def inject_attack(request: InjectAttackRequest):
    traffic_simulator.inject_attack(request.attack_type, request.count)
    return {"status": "success", "message": f"Injected {request.count} {request.attack_type} events."}

@router.get("/alerts")
def get_alerts():
    stats = alert_engine_service.get_summary_stats()
    return {
        "summary": stats,
        "alerts": alert_engine_service.alerts
    }

@router.post("/alerts/{alert_id}/mitigate")
def mitigate_alert(alert_id: str, request: MitigateRequest):
    res = alert_engine_service.apply_mitigation(alert_id, request.action, request.admin_user)
    if not res['success']:
        raise HTTPException(status_code=404, detail=res['message'])
    
    src_ip = res['mitigation']['src_ip']
    traffic_simulator.blocked_ips.add(src_ip)

    return res

@router.get("/metrics")
def get_ml_metrics():
    if not predictor_service.metadata:
        raise HTTPException(status_code=404, detail="ML metadata not available.")
    return predictor_service.metadata

@router.post("/ai-assistant")
def ai_security_analyst(request: AIChatRequest):
    q = request.question.lower()
    
    if "entropy" in q:
        reply = ("Payload entropy measures randomness in bytes (0.0 to 8.0). Normal encrypted HTTPS usually spans 1.5–4.5. "
                 "High entropy (>6.5) often indicates encrypted C2 beaconing, malware exfiltration, or compressed payloads.")
    elif "dos" in q or "ddos" in q:
        reply = ("Denial of Service (DoS/DDoS) floods targets with SYN/UDP packets, resulting in short duration, zero ACK flags, "
                 "and low packet sizes. Mitigation: Auto-Block Source IP & Enable SYN Cookies on Cloud Gateway.")
    elif "isolation forest" in q or "zero day" in q:
        reply = ("Isolation Forest isolates anomalies by randomly partitioning feature trees. Outliers require fewer splits to isolate, "
                 "yielding high anomaly scores for zero-day cloud threats.")
    elif "employee" in q or "org" in q:
        reply = ("Organization Admins can onboard employees, assign cloud instances (VMs/Subnets), and toggle active/suspended statuses. "
                 "Employees receive personalized portals showing security alerts targeting their assigned resources.")
    elif "mitigate" in q or "block" in q:
        reply = ("Mitigation engine executes automated firewall actions: 1) Block IP on Cloud Security Group, 2) Isolate Target VM Subnet, 3) Revoke Compromised IAM Access Keys.")
    else:
        reply = (f"GuardAI Analysis for query '{request.question}': Based on CloudGuard ML-IDS telemetry, system is operating with "
                 f"Random Forest (100% precision) and Isolation Forest anomaly detection. Ensure active security alerts are triaged.")

    return {"question": request.question, "answer": reply}

@router.get("/reports/pdf")
def download_pdf_report():
    try:
        pdf_content = generate_pdf_report()
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=CloudGuard_ML_IDS_Report.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF report: {str(e)}")
