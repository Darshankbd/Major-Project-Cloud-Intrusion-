import random
import time
from datetime import datetime
from database import get_db_connection
from mitigation_engine import generate_firewall_rules

IPS_NORMAL = ["192.168.1.45", "10.0.1.15", "10.0.2.88", "172.16.0.12", "192.168.1.102"]
IPS_ATTACK = ["185.220.101.5", "45.154.255.89", "194.26.29.112", "91.240.118.230", "198.51.100.42"]
DEST_SERVERS = ["10.0.0.50 (Web-App-01)", "10.0.0.51 (Auth-API-02)", "10.0.0.80 (DB-Cluster-01)"]

def generate_live_packet():
    """Generates a single realistic network flow packet vector for telemetry streaming"""
    is_anomaly = random.random() < 0.28  # 28% chance of an attack to keep dashboard lively
    
    if not is_anomaly:
        source_ip = random.choice(IPS_NORMAL)
        dest_ip = random.choice(DEST_SERVERS)
        proto = random.choice(["tcp", "udp"])
        service = random.choice(["http", "smtp", "domain_u", "ftp_data"])
        flag = "SF"
        duration = round(random.uniform(0.1, 4.5), 2)
        src_bytes = random.randint(120, 800)
        dst_bytes = random.randint(1500, 12000)
        label = "Normal"
        severity = "Low"
        confidence = round(random.uniform(96.0, 99.8), 2)
        count = random.randint(1, 10)
        srv_count = random.randint(1, 10)
        serror_rate = 0.0
    else:
        attack_type = np_choice = random.choices(
            ["DoS", "Probe", "R2L", "U2R"],
            weights=[0.45, 0.35, 0.12, 0.08]
        )[0]
        
        source_ip = random.choice(IPS_ATTACK)
        dest_ip = random.choice(DEST_SERVERS)
        
        if attack_type == "DoS":
            proto = "tcp"
            service = "http"
            flag = "S0"
            duration = 0.0
            src_bytes = random.choice([0, 1024, 65535])
            dst_bytes = 0
            severity = "High"
            confidence = round(random.uniform(97.5, 99.9), 2)
            count = random.randint(200, 500)
            srv_count = random.randint(200, 500)
            serror_rate = 1.0
        elif attack_type == "Probe":
            proto = random.choice(["tcp", "icmp"])
            service = "private"
            flag = "REJ"
            duration = round(random.uniform(0.01, 0.5), 2)
            src_bytes = 44
            dst_bytes = 0
            severity = "Medium"
            confidence = round(random.uniform(94.0, 98.5), 2)
            count = random.randint(40, 120)
            srv_count = random.randint(1, 4)
            serror_rate = 0.4
        elif attack_type == "R2L":
            proto = "tcp"
            service = "telnet"
            flag = "SF"
            duration = round(random.uniform(15.0, 80.0), 2)
            src_bytes = random.randint(600, 1200)
            dst_bytes = random.randint(900, 2000)
            severity = "High"
            confidence = round(random.uniform(92.0, 97.0), 2)
            count = random.randint(2, 6)
            srv_count = random.randint(2, 6)
            serror_rate = 0.0
        else: # U2R
            proto = "tcp"
            service = "telnet"
            flag = "SF"
            duration = round(random.uniform(45.0, 180.0), 2)
            src_bytes = random.randint(1400, 3000)
            dst_bytes = random.randint(4000, 9000)
            severity = "Critical"
            confidence = round(random.uniform(95.0, 99.2), 2)
            count = 1
            srv_count = 1
            serror_rate = 0.0
            
        label = attack_type

    packet_data = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "source_ip": source_ip,
        "destination_ip": dest_ip,
        "protocol": proto,
        "service": service,
        "flag": flag,
        "duration": duration,
        "src_bytes": src_bytes,
        "dst_bytes": dst_bytes,
        "count": count,
        "srv_count": srv_count,
        "serror_rate": serror_rate,
        "prediction": label,
        "confidence": confidence,
        "severity": severity,
        "is_threat": label != "Normal"
    }

    # Automatically persist to SQLite
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO detection_history 
            (source_ip, destination_ip, protocol, service, duration, src_bytes, dst_bytes, prediction, confidence, severity, dataset_source)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (source_ip, dest_ip, proto, service, duration, src_bytes, dst_bytes, label, confidence, severity, "Live Telemetry"))
        
        # If threat, also create alert entry
        if label != "Normal":
            rules = generate_firewall_rules(source_ip, label, severity)
            cursor.execute("""
                INSERT INTO alerts 
                (source_ip, destination_ip, attack_type, severity, status, confidence, mitigated, firewall_rule)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (source_ip, dest_ip, label, severity, "Active", confidence, 0, rules["iptables_command"]))
            
        conn.commit()
        conn.close()
    except Exception as e:
        print("Telemetry logging error:", e)

    return packet_data
