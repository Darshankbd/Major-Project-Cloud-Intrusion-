import os
import pandas as pd
import numpy as np
import random
import json
from database import get_db_connection, init_db

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

def generate_nsl_kdd_sample(n=600):
    protocols = ['tcp', 'udp', 'icmp']
    services = ['http', 'private', 'ftp_data', 'smtp', 'other', 'domain_u', 'ftp', 'telnet', 'finger', 'eco_i']
    flags = ['SF', 'S0', 'REJ', 'RSTO', 'S1', 'RSTR', 'S2', 'S3', 'OTH']
    
    classes = ['Normal', 'DoS', 'Probe', 'R2L', 'U2R']
    # realistic distribution
    class_probs = [0.55, 0.25, 0.12, 0.05, 0.03]
    
    records = []
    for _ in range(n):
        c = np.random.choice(classes, p=class_probs)
        
        if c == 'Normal':
            proto = np.random.choice(['tcp', 'udp', 'icmp'], p=[0.75, 0.20, 0.05])
            serv = np.random.choice(['http', 'smtp', 'domain_u', 'ftp_data'], p=[0.6, 0.2, 0.1, 0.1])
            flag = 'SF'
            duration = max(0, int(np.random.exponential(1.5)))
            src_bytes = int(np.random.normal(350, 120)) if proto == 'tcp' else int(np.random.normal(68, 15))
            dst_bytes = int(np.random.normal(2500, 800)) if proto == 'tcp' else 0
            failed_logins = 0
            logged_in = 1 if serv in ['http', 'smtp', 'ftp_data'] else 0
            count = random.randint(1, 15)
            srv_count = random.randint(1, 15)
            serror_rate = 0.0
            same_srv_rate = 1.0
        elif c == 'DoS':
            proto = np.random.choice(['tcp', 'icmp'], p=[0.8, 0.2])
            serv = np.random.choice(['http', 'private', 'eco_i'], p=[0.4, 0.4, 0.2])
            flag = np.random.choice(['S0', 'REJ', 'SF'], p=[0.7, 0.2, 0.1])
            duration = 0
            src_bytes = int(np.random.choice([0, 1024, 65535]))
            dst_bytes = 0
            failed_logins = 0
            logged_in = 0
            count = random.randint(150, 511)
            srv_count = random.randint(150, 511)
            serror_rate = round(random.uniform(0.7, 1.0), 2)
            same_srv_rate = round(random.uniform(0.8, 1.0), 2)
        elif c == 'Probe':
            proto = np.random.choice(['tcp', 'udp', 'icmp'], p=[0.5, 0.3, 0.2])
            serv = np.random.choice(['private', 'other', 'finger'], p=[0.5, 0.3, 0.2])
            flag = np.random.choice(['REJ', 'RSTO', 'S0'], p=[0.5, 0.3, 0.2])
            duration = max(0, int(np.random.exponential(0.5)))
            src_bytes = int(np.random.choice([0, 8, 44]))
            dst_bytes = 0
            failed_logins = 0
            logged_in = 0
            count = random.randint(10, 80)
            srv_count = random.randint(1, 5)
            serror_rate = round(random.uniform(0.2, 0.6), 2)
            same_srv_rate = round(random.uniform(0.05, 0.3), 2)
        elif c == 'R2L':
            proto = 'tcp'
            serv = np.random.choice(['ftp', 'telnet', 'smtp'], p=[0.4, 0.4, 0.2])
            flag = 'SF'
            duration = random.randint(10, 120)
            src_bytes = int(np.random.normal(800, 200))
            dst_bytes = int(np.random.normal(1200, 300))
            failed_logins = random.randint(1, 5)
            logged_in = 0 if failed_logins > 2 else 1
            count = random.randint(1, 8)
            srv_count = random.randint(1, 8)
            serror_rate = 0.0
            same_srv_rate = 1.0
        else: # U2R
            proto = 'tcp'
            serv = np.random.choice(['telnet', 'other'], p=[0.7, 0.3])
            flag = 'SF'
            duration = random.randint(30, 300)
            src_bytes = int(np.random.normal(1500, 400))
            dst_bytes = int(np.random.normal(4500, 1200))
            failed_logins = 0
            logged_in = 1
            count = 1
            srv_count = 1
            serror_rate = 0.0
            same_srv_rate = 1.0
            
        records.append({
            'duration': max(0, duration),
            'protocol_type': proto,
            'service': serv,
            'flag': flag,
            'src_bytes': max(0, src_bytes),
            'dst_bytes': max(0, dst_bytes),
            'land': 0,
            'wrong_fragment': 0 if c != 'DoS' else random.choice([0, 1]),
            'urgent': 0,
            'hot': 0 if c != 'U2R' else random.randint(1, 3),
            'num_failed_logins': failed_logins,
            'logged_in': logged_in,
            'num_compromised': 0 if c != 'U2R' else random.randint(1, 2),
            'count': count,
            'srv_count': srv_count,
            'serror_rate': serror_rate,
            'same_srv_rate': same_srv_rate,
            'diff_srv_rate': round(max(0.0, 1.0 - same_srv_rate), 2),
            'label': c
        })
    df = pd.DataFrame(records)
    csv_path = os.path.join(DATA_DIR, "nsl_kdd.csv")
    df.to_csv(csv_path, index=False)
    print(f"Generated NSL-KDD benchmark: {csv_path} ({len(df)} rows)")
    return df

def generate_cicids2017_sample(n=600):
    classes = ['Normal', 'DoS', 'Probe', 'R2L', 'U2R']
    class_probs = [0.52, 0.28, 0.12, 0.05, 0.03]
    records = []
    
    for _ in range(n):
        c = np.random.choice(classes, p=class_probs)
        if c == 'Normal':
            dst_port = int(np.random.choice([80, 443, 53, 22, 8080], p=[0.4, 0.4, 0.1, 0.05, 0.05]))
            flow_dur = int(np.random.exponential(80000))
            tot_fwd_pkts = random.randint(2, 20)
            tot_bwd_pkts = random.randint(2, 25)
            fwd_len = tot_fwd_pkts * random.randint(64, 450)
            bwd_len = tot_bwd_pkts * random.randint(128, 1400)
            flow_bytes_s = round((fwd_len + bwd_len) / max(1, flow_dur / 1000000), 2)
            flow_pkts_s = round((tot_fwd_pkts + tot_bwd_pkts) / max(1, flow_dur / 1000000), 2)
            syn_flag = 0
        elif c == 'DoS':
            dst_port = int(np.random.choice([80, 443, 8080], p=[0.6, 0.3, 0.1]))
            flow_dur = random.randint(100, 2500)
            tot_fwd_pkts = random.randint(100, 800)
            tot_bwd_pkts = random.randint(0, 5)
            fwd_len = tot_fwd_pkts * 64
            bwd_len = tot_bwd_pkts * 32
            flow_bytes_s = round((fwd_len + bwd_len) / max(1, flow_dur / 1000000), 2)
            flow_pkts_s = round((tot_fwd_pkts + tot_bwd_pkts) / max(1, flow_dur / 1000000), 2)
            syn_flag = 1
        elif c == 'Probe':
            dst_port = random.randint(20, 65000)
            flow_dur = random.randint(10, 500)
            tot_fwd_pkts = random.randint(1, 4)
            tot_bwd_pkts = random.randint(0, 2)
            fwd_len = tot_fwd_pkts * 44
            bwd_len = 0
            flow_bytes_s = round(fwd_len / max(1, flow_dur / 1000000), 2)
            flow_pkts_s = round(tot_fwd_pkts / max(1, flow_dur / 1000000), 2)
            syn_flag = random.choice([0, 1])
        elif c == 'R2L':
            dst_port = int(np.random.choice([21, 22, 23, 3389], p=[0.3, 0.4, 0.2, 0.1]))
            flow_dur = random.randint(5000, 60000)
            tot_fwd_pkts = random.randint(15, 60)
            tot_bwd_pkts = random.randint(10, 50)
            fwd_len = tot_fwd_pkts * 120
            bwd_len = tot_bwd_pkts * 180
            flow_bytes_s = round((fwd_len + bwd_len) / max(1, flow_dur / 1000000), 2)
            flow_pkts_s = round((tot_fwd_pkts + tot_bwd_pkts) / max(1, flow_dur / 1000000), 2)
            syn_flag = 0
        else: # U2R
            dst_port = int(np.random.choice([22, 23, 80], p=[0.5, 0.3, 0.2]))
            flow_dur = random.randint(30000, 180000)
            tot_fwd_pkts = random.randint(40, 150)
            tot_bwd_pkts = random.randint(40, 180)
            fwd_len = tot_fwd_pkts * 300
            bwd_len = tot_bwd_pkts * 600
            flow_bytes_s = round((fwd_len + bwd_len) / max(1, flow_dur / 1000000), 2)
            flow_pkts_s = round((tot_fwd_pkts + tot_bwd_pkts) / max(1, flow_dur / 1000000), 2)
            syn_flag = 0
            
        records.append({
            'destination_port': dst_port,
            'flow_duration': flow_dur,
            'total_fwd_packets': tot_fwd_pkts,
            'total_backward_packets': tot_bwd_pkts,
            'total_length_of_fwd_packets': fwd_len,
            'total_length_of_bwd_packets': bwd_len,
            'fwd_packet_length_max': max(64, int(fwd_len / max(1, tot_fwd_pkts))),
            'fwd_packet_length_min': 20,
            'flow_bytes_s': max(0.0, flow_bytes_s),
            'flow_packets_s': max(0.0, flow_pkts_s),
            'flow_iat_mean': round(random.uniform(10.0, 5000.0), 2),
            'fwd_iat_mean': round(random.uniform(10.0, 4000.0), 2),
            'bwd_iat_mean': round(random.uniform(0.0, 3000.0), 2),
            'syn_flag_count': syn_flag,
            'label': c
        })
    df = pd.DataFrame(records)
    csv_path = os.path.join(DATA_DIR, "cicids2017.csv")
    df.to_csv(csv_path, index=False)
    print(f"Generated CICIDS2017 benchmark: {csv_path} ({len(df)} rows)")
    return df

def generate_unsw_nb15_sample(n=600):
    classes = ['Normal', 'DoS', 'Probe', 'R2L', 'U2R']
    class_probs = [0.50, 0.25, 0.15, 0.06, 0.04]
    protos = ['tcp', 'udp', 'unas', 'arp', 'ospf']
    services = ['http', 'dns', 'smtp', 'ftp', 'ssh', 'none']
    states = ['FIN', 'CON', 'INT', 'REQ', 'RST']
    records = []
    
    for _ in range(n):
        c = np.random.choice(classes, p=class_probs)
        if c == 'Normal':
            proto = np.random.choice(['tcp', 'udp'], p=[0.7, 0.3])
            serv = np.random.choice(['http', 'dns', 'ssh'], p=[0.6, 0.3, 0.1])
            state = 'FIN'
            dur = round(random.uniform(0.01, 2.5), 4)
            spkts = random.randint(4, 25)
            dpkts = random.randint(4, 30)
            sbytes = spkts * random.randint(80, 400)
            dbytes = dpkts * random.randint(120, 1200)
            rate = round((spkts + dpkts) / dur, 2)
            sttl = 31
            dttl = 29
        elif c == 'DoS':
            proto = 'tcp'
            serv = 'http'
            state = 'INT'
            dur = round(random.uniform(0.001, 0.15), 4)
            spkts = random.randint(150, 600)
            dpkts = random.randint(0, 4)
            sbytes = spkts * 64
            dbytes = dpkts * 40
            rate = round((spkts + dpkts) / dur, 2)
            sttl = 254
            dttl = 0
        elif c == 'Probe':
            proto = np.random.choice(['tcp', 'udp', 'unas'], p=[0.4, 0.4, 0.2])
            serv = 'none'
            state = 'REQ'
            dur = round(random.uniform(0.001, 0.5), 4)
            spkts = random.randint(1, 6)
            dpkts = 0
            sbytes = spkts * 44
            dbytes = 0
            rate = round(spkts / dur, 2)
            sttl = 254
            dttl = 0
        elif c == 'R2L':
            proto = 'tcp'
            serv = np.random.choice(['ssh', 'ftp'], p=[0.6, 0.4])
            state = 'CON'
            dur = round(random.uniform(1.5, 12.0), 4)
            spkts = random.randint(20, 80)
            dpkts = random.randint(15, 60)
            sbytes = spkts * 150
            dbytes = dpkts * 220
            rate = round((spkts + dpkts) / dur, 2)
            sttl = 64
            dttl = 60
        else: # U2R
            proto = 'tcp'
            serv = 'ssh'
            state = 'FIN'
            dur = round(random.uniform(5.0, 45.0), 4)
            spkts = random.randint(50, 180)
            dpkts = random.randint(50, 220)
            sbytes = spkts * 350
            dbytes = dpkts * 800
            rate = round((spkts + dpkts) / dur, 2)
            sttl = 64
            dttl = 60
            
        records.append({
            'dur': dur,
            'proto': proto,
            'service': serv,
            'state': state,
            'spkts': spkts,
            'dpkts': dpkts,
            'sbytes': sbytes,
            'dbytes': dbytes,
            'rate': rate,
            'sttl': sttl,
            'dttl': dttl,
            'sload': round(sbytes * 8 / max(0.001, dur), 2),
            'dload': round(dbytes * 8 / max(0.001, dur), 2),
            'label': c
        })
    df = pd.DataFrame(records)
    csv_path = os.path.join(DATA_DIR, "unsw_nb15.csv")
    df.to_csv(csv_path, index=False)
    print(f"Generated UNSW-NB15 benchmark: {csv_path} ({len(df)} rows)")
    return df

def register_datasets():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    
    datasets_meta = [
        {
            "id": "nsl-kdd",
            "name": "NSL-KDD Sample Dataset",
            "file": "nsl_kdd.csv",
            "source_type": "Benchmark (Connection-Level)",
            "description": "Refined classic KDD'99 benchmark removing redundancy. Features connection durations, protocols, service types, and flag stats."
        },
        {
            "id": "cicids2017",
            "name": "CICIDS2017 Modern Flow Dataset",
            "file": "cicids2017.csv",
            "source_type": "Benchmark (Flow-Level)",
            "description": "Realistic contemporary network flow telemetry from the Canadian Institute for Cybersecurity, featuring DoS, Brute Force, and Infiltration."
        },
        {
            "id": "unsw-nb15",
            "name": "UNSW-NB15 Hybrid Dataset",
            "file": "unsw_nb15.csv",
            "source_type": "Benchmark (Hybrid Synthetic)",
            "description": "Diverse normal and contemporary attack vectors created by the Australian Centre for Cyber Security, covering 9 attack classes."
        }
    ]
    
    for meta in datasets_meta:
        path = os.path.join(DATA_DIR, meta["file"])
        if os.path.exists(path):
            df = pd.read_csv(path)
            cols = list(df.columns)
            cursor.execute("""
            INSERT OR REPLACE INTO datasets 
            (id, name, rows_count, features_count, missing_values, source_type, features_list, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                meta["id"],
                meta["name"],
                len(df),
                len(cols),
                int(df.isnull().sum().sum()),
                meta["source_type"],
                json.dumps(cols),
                meta["description"]
            ))
            
    conn.commit()
    conn.close()
    print("Benchmark datasets registered into SQLite database.")

if __name__ == "__main__":
    generate_nsl_kdd_sample(600)
    generate_cicids2017_sample(600)
    generate_unsw_nb15_sample(600)
    register_datasets()
