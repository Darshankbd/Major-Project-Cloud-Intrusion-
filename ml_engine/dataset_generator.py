import numpy as np
import pandas as pd
import os

def generate_cloud_ids_dataset(num_samples=15000, random_seed=42):
    np.random.seed(random_seed)
    print(f"Generating synthetic Cloud IDS dataset with {num_samples} flow records...")

    class_probs = [0.60, 0.15, 0.10, 0.07, 0.05, 0.03]
    class_labels = ['BENIGN', 'DoS_DDoS', 'Port_Scan', 'Brute_Force', 'Malware_C2', 'IAM_Privilege_Escalation']
    labels = np.random.choice(len(class_labels), size=num_samples, p=class_probs)

    data = []
    protocols = ['TCP', 'UDP', 'ICMP']
    services = ['HTTP', 'HTTPS', 'SSH', 'DNS', 'RDP', 'FTP', 'SMTP', 'C2_Custom']
    flags = ['SF', 'S0', 'REJ', 'RSTO', 'RSTOS0', 'SH', 'S1']
    regions = ['us-east-1', 'us-west-2', 'eu-central-1', 'ap-south-1', 'sa-east-1']

    for i in range(num_samples):
        cls = labels[i]
        
        if cls == 0:  # BENIGN
            duration = float(np.random.exponential(scale=2.5))
            proto = np.random.choice(['TCP', 'UDP', 'ICMP'], p=[0.7, 0.25, 0.05])
            service = np.random.choice(['HTTPS', 'HTTP', 'DNS', 'SSH'], p=[0.6, 0.25, 0.1, 0.05])
            flag = np.random.choice(['SF', 'S1'], p=[0.95, 0.05])
            src_pkts = int(np.random.randint(2, 50))
            dst_pkts = int(np.random.randint(2, 60))
            src_bytes = float(src_pkts * np.random.uniform(60, 1400))
            dst_bytes = float(dst_pkts * np.random.uniform(60, 1400))
            pkt_len_mean = float(np.random.uniform(200, 800))
            pkt_len_std = float(np.random.uniform(50, 300))
            header_bytes = float((src_pkts + dst_pkts) * 32)
            payload_entropy = float(np.random.uniform(1.5, 4.5))
            failed_logins = 0
            iam_risk_score = float(np.random.uniform(0.0, 2.0))
            same_srv_rate = float(np.random.uniform(0.7, 1.0))
            diff_srv_rate = float(np.random.uniform(0.0, 0.2))
            serror_rate = float(np.random.uniform(0.0, 0.05))
            rerror_rate = float(np.random.uniform(0.0, 0.05))
            
        elif cls == 1:  # DoS_DDoS
            duration = float(np.random.uniform(0.001, 0.5))
            proto = np.random.choice(['TCP', 'UDP', 'ICMP'], p=[0.6, 0.3, 0.1])
            service = np.random.choice(['HTTP', 'HTTPS', 'DNS'], p=[0.5, 0.4, 0.1])
            flag = np.random.choice(['S0', 'REJ', 'RSTO'], p=[0.6, 0.3, 0.1])
            src_pkts = int(np.random.randint(500, 10000))
            dst_pkts = int(np.random.randint(0, 10))
            src_bytes = float(src_pkts * np.random.uniform(40, 120))
            dst_bytes = float(dst_pkts * np.random.uniform(0, 60))
            pkt_len_mean = float(np.random.uniform(40, 100))
            pkt_len_std = float(np.random.uniform(0, 20))
            header_bytes = float(src_pkts * 40)
            payload_entropy = float(np.random.uniform(0.2, 2.0))
            failed_logins = 0
            iam_risk_score = float(np.random.uniform(0.5, 3.0))
            same_srv_rate = float(np.random.uniform(0.9, 1.0))
            diff_srv_rate = float(np.random.uniform(0.0, 0.1))
            serror_rate = float(np.random.uniform(0.7, 1.0))
            rerror_rate = float(np.random.uniform(0.1, 0.5))
            
        elif cls == 2:  # Port_Scan
            duration = float(np.random.uniform(0.01, 1.0))
            proto = 'TCP'
            service = np.random.choice(['HTTP', 'SSH', 'RDP', 'FTP', 'SMTP'], p=[0.2, 0.2, 0.2, 0.2, 0.2])
            flag = np.random.choice(['S0', 'REJ', 'RSTO'], p=[0.5, 0.4, 0.1])
            src_pkts = int(np.random.randint(1, 3))
            dst_pkts = int(np.random.randint(0, 2))
            src_bytes = float(src_pkts * 44)
            dst_bytes = float(dst_pkts * 40)
            pkt_len_mean = 44.0
            pkt_len_std = float(np.random.uniform(0, 5))
            header_bytes = float(src_pkts * 40)
            payload_entropy = float(np.random.uniform(0.0, 1.0))
            failed_logins = 0
            iam_risk_score = float(np.random.uniform(1.0, 3.0))
            same_srv_rate = float(np.random.uniform(0.05, 0.3))
            diff_srv_rate = float(np.random.uniform(0.7, 1.0))
            serror_rate = float(np.random.uniform(0.4, 0.9))
            rerror_rate = float(np.random.uniform(0.3, 0.8))
            
        elif cls == 3:  # Brute_Force
            duration = float(np.random.uniform(5.0, 120.0))
            proto = 'TCP'
            service = np.random.choice(['SSH', 'RDP', 'FTP'], p=[0.6, 0.3, 0.1])
            flag = np.random.choice(['SF', 'REJ'], p=[0.7, 0.3])
            src_pkts = int(np.random.randint(30, 300))
            dst_pkts = int(np.random.randint(30, 300))
            src_bytes = float(src_pkts * np.random.uniform(100, 300))
            dst_bytes = float(dst_pkts * np.random.uniform(100, 300))
            pkt_len_mean = float(np.random.uniform(100, 250))
            pkt_len_std = float(np.random.uniform(20, 80))
            header_bytes = float((src_pkts + dst_pkts) * 32)
            payload_entropy = float(np.random.uniform(2.0, 4.0))
            failed_logins = int(np.random.randint(5, 50))
            iam_risk_score = float(np.random.uniform(3.0, 7.0))
            same_srv_rate = float(np.random.uniform(0.8, 1.0))
            diff_srv_rate = float(np.random.uniform(0.0, 0.2))
            serror_rate = float(np.random.uniform(0.1, 0.3))
            rerror_rate = float(np.random.uniform(0.1, 0.4))
            
        elif cls == 4:  # Malware_C2
            duration = float(np.random.uniform(30.0, 600.0))
            proto = 'TCP'
            service = np.random.choice(['HTTPS', 'C2_Custom'], p=[0.7, 0.3])
            flag = 'SF'
            src_pkts = int(np.random.randint(50, 500))
            dst_pkts = int(np.random.randint(50, 500))
            src_bytes = float(src_pkts * np.random.uniform(500, 2000))
            dst_bytes = float(dst_pkts * np.random.uniform(200, 1000))
            pkt_len_mean = float(np.random.uniform(400, 1200))
            pkt_len_std = float(np.random.uniform(100, 400))
            header_bytes = float((src_pkts + dst_pkts) * 32)
            payload_entropy = float(np.random.uniform(6.5, 7.95))
            failed_logins = 0
            iam_risk_score = float(np.random.uniform(4.0, 8.5))
            same_srv_rate = float(np.random.uniform(0.6, 0.9))
            diff_srv_rate = float(np.random.uniform(0.1, 0.3))
            serror_rate = float(np.random.uniform(0.0, 0.1))
            rerror_rate = float(np.random.uniform(0.0, 0.1))
            
        else:  # IAM_Privilege_Escalation
            duration = float(np.random.uniform(1.0, 45.0))
            proto = 'TCP'
            service = 'HTTPS'
            flag = 'SF'
            src_pkts = int(np.random.randint(10, 80))
            dst_pkts = int(np.random.randint(10, 80))
            src_bytes = float(src_pkts * np.random.uniform(200, 800))
            dst_bytes = float(dst_pkts * np.random.uniform(400, 1500))
            pkt_len_mean = float(np.random.uniform(300, 900))
            pkt_len_std = float(np.random.uniform(80, 250))
            header_bytes = float((src_pkts + dst_pkts) * 32)
            payload_entropy = float(np.random.uniform(3.5, 5.5))
            failed_logins = int(np.random.randint(1, 10))
            iam_risk_score = float(np.random.uniform(8.0, 10.0))
            same_srv_rate = float(np.random.uniform(0.5, 0.8))
            diff_srv_rate = float(np.random.uniform(0.2, 0.5))
            serror_rate = float(np.random.uniform(0.0, 0.1))
            rerror_rate = float(np.random.uniform(0.0, 0.1))

        region = np.random.choice(regions)

        data.append({
            'duration': round(duration, 4),
            'protocol_type': proto,
            'service': service,
            'flag': flag,
            'src_bytes': round(src_bytes, 2),
            'dst_bytes': round(dst_bytes, 2),
            'src_pkts': src_pkts,
            'dst_pkts': dst_pkts,
            'pkt_len_mean': round(pkt_len_mean, 2),
            'pkt_len_std': round(pkt_len_std, 2),
            'header_bytes': round(header_bytes, 2),
            'payload_entropy': round(payload_entropy, 3),
            'failed_logins': failed_logins,
            'iam_risk_score': round(iam_risk_score, 2),
            'same_srv_rate': round(same_srv_rate, 3),
            'diff_srv_rate': round(diff_srv_rate, 3),
            'serror_rate': round(serror_rate, 3),
            'rerror_rate': round(rerror_rate, 3),
            'cloud_region': region,
            'label': class_labels[cls],
            'target': cls
        })

    df = pd.DataFrame(data)
    os.makedirs('ml_engine/data', exist_ok=True)
    csv_path = 'ml_engine/data/cloud_ids_dataset.csv'
    df.to_csv(csv_path, index=False)
    print(f"Dataset saved to {csv_path}.")
    return df

if __name__ == '__main__':
    generate_cloud_ids_dataset()
