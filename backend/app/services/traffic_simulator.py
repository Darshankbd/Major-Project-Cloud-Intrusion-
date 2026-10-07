import asyncio
import random
import time
from typing import List, Set
from fastapi import WebSocket
from backend.app.ml.predictor import predictor_service

class CloudTrafficSimulator:
    def __init__(self):
        self.is_running = False
        self.interval = 1.0
        self.active_websockets: Set[WebSocket] = set()
        self.attack_injection_queue = []
        self.generated_count = 0
        self.threat_count = 0
        self.blocked_ips: Set[str] = set()

    def set_speed(self, interval: float):
        self.interval = max(0.05, min(5.0, interval))

    async def connect_websocket(self, websocket: WebSocket):
        await websocket.accept()
        self.active_websockets.add(websocket)

    def disconnect_websocket(self, websocket: WebSocket):
        if websocket in self.active_websockets:
            self.active_websockets.remove(websocket)

    def start(self):
        self.is_running = True

    def stop(self):
        self.is_running = False

    def inject_attack(self, attack_type: str, count: int = 5):
        valid_attacks = ['DoS_DDoS', 'Port_Scan', 'Brute_Force', 'Malware_C2', 'IAM_Privilege_Escalation']
        if attack_type in valid_attacks:
            for _ in range(count):
                self.attack_injection_queue.append(attack_type)

    def generate_single_flow(self, target_attack: str = None) -> dict:
        self.generated_count += 1
        
        if target_attack:
            cls = target_attack
        elif self.attack_injection_queue:
            cls = self.attack_injection_queue.pop(0)
        else:
            if random.random() < 0.75:
                cls = 'BENIGN'
            else:
                cls = random.choice(['DoS_DDoS', 'Port_Scan', 'Brute_Force', 'Malware_C2', 'IAM_Privilege_Escalation'])

        protocols = ['TCP', 'UDP', 'ICMP']
        regions = ['us-east-1', 'us-west-2', 'eu-central-1', 'ap-south-1']

        geo_sources = [
            {'country': 'United States', 'ip': f"192.168.{random.randint(1, 255)}.{random.randint(1, 255)}"},
            {'country': 'Germany', 'ip': f"85.214.{random.randint(1, 255)}.{random.randint(1, 255)}"},
            {'country': 'China', 'ip': f"114.242.{random.randint(1, 255)}.{random.randint(1, 255)}"},
            {'country': 'Russia', 'ip': f"95.173.{random.randint(1, 255)}.{random.randint(1, 255)}"},
            {'country': 'Brazil', 'ip': f"177.126.{random.randint(1, 255)}.{random.randint(1, 255)}"},
            {'country': 'India', 'ip': f"49.207.{random.randint(1, 255)}.{random.randint(1, 255)}"},
            {'country': 'Japan', 'ip': f"126.158.{random.randint(1, 255)}.{random.randint(1, 255)}"}
        ]
        geo = random.choice(geo_sources)
        src_ip = geo['ip']
        
        # Target assigned employee IPs for demonstration (10.0.1.15, 10.0.1.28, 10.0.2.55)
        dst_ip = random.choice(["10.0.1.15", "10.0.1.28", "10.0.2.55", f"10.0.{random.randint(1, 10)}.{random.randint(1, 255)}"])

        status = 'BLOCKED_BY_FIREWALL' if src_ip in self.blocked_ips else 'INSPECTED'

        if cls == 'BENIGN':
            duration = round(random.expovariate(1/2.5), 4)
            proto = random.choices(protocols, weights=[0.7, 0.25, 0.05])[0]
            service = random.choices(['HTTPS', 'HTTP', 'DNS', 'SSH'], weights=[0.6, 0.25, 0.1, 0.05])[0]
            flag = 'SF'
            src_pkts = random.randint(2, 50)
            dst_pkts = random.randint(2, 60)
            src_bytes = round(src_pkts * random.uniform(60, 1400), 2)
            dst_bytes = round(dst_pkts * random.uniform(60, 1400), 2)
            pkt_len_mean = round(random.uniform(200, 800), 2)
            pkt_len_std = round(random.uniform(50, 300), 2)
            header_bytes = round((src_pkts + dst_pkts) * 32, 2)
            payload_entropy = round(random.uniform(1.5, 4.5), 3)
            failed_logins = 0
            iam_risk_score = round(random.uniform(0.0, 2.0), 2)
            same_srv_rate = round(random.uniform(0.7, 1.0), 3)
            diff_srv_rate = round(random.uniform(0.0, 0.2), 3)
            serror_rate = round(random.uniform(0.0, 0.05), 3)
            rerror_rate = round(random.uniform(0.0, 0.05), 3)
        elif cls == 'DoS_DDoS':
            duration = round(random.uniform(0.001, 0.5), 4)
            proto = random.choice(['TCP', 'UDP', 'ICMP'])
            service = random.choice(['HTTP', 'HTTPS', 'DNS'])
            flag = random.choice(['S0', 'REJ', 'RSTO'])
            src_pkts = random.randint(1000, 8000)
            dst_pkts = random.randint(0, 5)
            src_bytes = round(src_pkts * random.uniform(40, 100), 2)
            dst_bytes = round(dst_pkts * random.uniform(0, 40), 2)
            pkt_len_mean = round(random.uniform(40, 90), 2)
            pkt_len_std = round(random.uniform(0, 15), 2)
            header_bytes = round(src_pkts * 40, 2)
            payload_entropy = round(random.uniform(0.2, 1.8), 3)
            failed_logins = 0
            iam_risk_score = round(random.uniform(0.5, 3.0), 2)
            same_srv_rate = round(random.uniform(0.9, 1.0), 3)
            diff_srv_rate = round(random.uniform(0.0, 0.1), 3)
            serror_rate = round(random.uniform(0.7, 1.0), 3)
            rerror_rate = round(random.uniform(0.1, 0.5), 3)
        elif cls == 'Port_Scan':
            duration = round(random.uniform(0.01, 0.8), 4)
            proto = 'TCP'
            service = random.choice(['HTTP', 'SSH', 'RDP', 'FTP'])
            flag = random.choice(['S0', 'REJ'])
            src_pkts = random.randint(1, 3)
            dst_pkts = random.randint(0, 2)
            src_bytes = round(src_pkts * 44, 2)
            dst_bytes = round(dst_pkts * 40, 2)
            pkt_len_mean = 44.0
            pkt_len_std = round(random.uniform(0, 5), 2)
            header_bytes = round(src_pkts * 40, 2)
            payload_entropy = round(random.uniform(0.0, 1.0), 3)
            failed_logins = 0
            iam_risk_score = round(random.uniform(1.0, 3.0), 2)
            same_srv_rate = round(random.uniform(0.05, 0.3), 3)
            diff_srv_rate = round(random.uniform(0.7, 1.0), 3)
            serror_rate = round(random.uniform(0.4, 0.9), 3)
            rerror_rate = round(random.uniform(0.3, 0.8), 3)
        elif cls == 'Brute_Force':
            duration = round(random.uniform(10.0, 90.0), 4)
            proto = 'TCP'
            service = random.choice(['SSH', 'RDP', 'FTP'])
            flag = random.choice(['SF', 'REJ'])
            src_pkts = random.randint(50, 350)
            dst_pkts = random.randint(50, 350)
            src_bytes = round(src_pkts * random.uniform(120, 320), 2)
            dst_bytes = round(dst_pkts * random.uniform(120, 320), 2)
            pkt_len_mean = round(random.uniform(120, 260), 2)
            pkt_len_std = round(random.uniform(20, 80), 2)
            header_bytes = round((src_pkts + dst_pkts) * 32, 2)
            payload_entropy = round(random.uniform(2.0, 4.2), 3)
            failed_logins = random.randint(10, 60)
            iam_risk_score = round(random.uniform(4.0, 7.5), 2)
            same_srv_rate = round(random.uniform(0.8, 1.0), 3)
            diff_srv_rate = round(random.uniform(0.0, 0.2), 3)
            serror_rate = round(random.uniform(0.1, 0.3), 3)
            rerror_rate = round(random.uniform(0.1, 0.4), 3)
        elif cls == 'Malware_C2':
            duration = round(random.uniform(60.0, 500.0), 4)
            proto = 'TCP'
            service = random.choice(['HTTPS', 'C2_Custom'])
            flag = 'SF'
            src_pkts = random.randint(100, 600)
            dst_pkts = random.randint(100, 600)
            src_bytes = round(src_pkts * random.uniform(600, 2200), 2)
            dst_bytes = round(dst_pkts * random.uniform(300, 1200), 2)
            pkt_len_mean = round(random.uniform(500, 1300), 2)
            pkt_len_std = round(random.uniform(150, 450), 2)
            header_bytes = round((src_pkts + dst_pkts) * 32, 2)
            payload_entropy = round(random.uniform(6.8, 7.95), 3)
            failed_logins = 0
            iam_risk_score = round(random.uniform(5.0, 8.8), 2)
            same_srv_rate = round(random.uniform(0.6, 0.9), 3)
            diff_srv_rate = round(random.uniform(0.1, 0.3), 3)
            serror_rate = round(random.uniform(0.0, 0.1), 3)
            rerror_rate = round(random.uniform(0.0, 0.1), 3)
        else:
            duration = round(random.uniform(2.0, 30.0), 4)
            proto = 'TCP'
            service = 'HTTPS'
            flag = 'SF'
            src_pkts = random.randint(15, 90)
            dst_pkts = random.randint(15, 90)
            src_bytes = round(src_pkts * random.uniform(250, 850), 2)
            dst_bytes = round(dst_pkts * random.uniform(450, 1600), 2)
            pkt_len_mean = round(random.uniform(350, 950), 2)
            pkt_len_std = round(random.uniform(90, 260), 2)
            header_bytes = round((src_pkts + dst_pkts) * 32, 2)
            payload_entropy = round(random.uniform(3.8, 5.8), 3)
            failed_logins = random.randint(2, 12)
            iam_risk_score = round(random.uniform(8.2, 9.9), 2)
            same_srv_rate = round(random.uniform(0.5, 0.8), 3)
            diff_srv_rate = round(random.uniform(0.2, 0.5), 3)
            serror_rate = round(random.uniform(0.0, 0.1), 3)
            rerror_rate = round(random.uniform(0.0, 0.1), 3)

        flow_data = {
            'timestamp': time.strftime("%Y-%m-%d %H:%M:%S"),
            'flow_id': f"FLW-{random.randint(100000, 999999)}",
            'src_ip': src_ip,
            'dst_ip': dst_ip,
            'geo_country': geo['country'],
            'src_port': random.randint(1024, 65535),
            'dst_port': 443 if service == 'HTTPS' else (80 if service == 'HTTP' else (22 if service == 'SSH' else 3389)),
            'duration': duration,
            'protocol_type': proto,
            'service': service,
            'flag': flag,
            'src_bytes': src_bytes,
            'dst_bytes': dst_bytes,
            'src_pkts': src_pkts,
            'dst_pkts': dst_pkts,
            'pkt_len_mean': pkt_len_mean,
            'pkt_len_std': pkt_len_std,
            'header_bytes': header_bytes,
            'payload_entropy': payload_entropy,
            'failed_logins': failed_logins,
            'iam_risk_score': iam_risk_score,
            'same_srv_rate': same_srv_rate,
            'diff_srv_rate': diff_srv_rate,
            'serror_rate': serror_rate,
            'rerror_rate': rerror_rate,
            'cloud_region': random.choice(regions),
            'simulation_status': status
        }

        ml_res = predictor_service.predict_flow(flow_data)
        flow_data.update(ml_res)

        if flow_data['severity'] in ['HIGH', 'CRITICAL']:
            self.threat_count += 1

        return flow_data

    async def broadcast_loop(self):
        while True:
            if self.is_running and self.active_websockets:
                try:
                    flow_record = self.generate_single_flow()
                    dead_sockets = set()
                    for ws in self.active_websockets:
                        try:
                            await ws.send_json(flow_record)
                        except Exception as e:
                            dead_sockets.add(ws)
                    for ws in dead_sockets:
                        self.disconnect_websocket(ws)
                except Exception as e:
                    print(f"Error in traffic simulation broadcast loop: {e}")
            await asyncio.sleep(self.interval)

traffic_simulator = CloudTrafficSimulator()
