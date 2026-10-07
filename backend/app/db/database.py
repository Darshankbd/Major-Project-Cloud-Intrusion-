import sqlite3
import os
import time
import hashlib
from typing import List, Dict, Optional, Any

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "cloudguard.db")

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # 1. Organizations
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS organizations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        domain TEXT NOT NULL,
        license_tier TEXT DEFAULT 'ENTERPRISE',
        webhook_url TEXT DEFAULT 'https://hooks.slack.com/services/CLOUDGUARD/ALERT/WEBHOOK',
        notification_email TEXT DEFAULT 'security-officer@cloudguard.io',
        created_at TEXT NOT NULL
    )
    """)

    # 2. Users (Admins & Employees)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        org_id TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL, -- ORG_ADMIN, EMPLOYEE
        department TEXT DEFAULT 'Security Operations',
        status TEXT DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED
        created_at TEXT NOT NULL,
        last_login TEXT,
        FOREIGN KEY (org_id) REFERENCES organizations(id)
    )
    """)

    # 3. Assigned Cloud Resources
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS assigned_resources (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        resource_id TEXT NOT NULL,
        resource_name TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        subnet TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    # 4. Employee Incident / Anomaly Reports
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS employee_incidents (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        user_email TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        severity TEXT DEFAULT 'HIGH',
        status TEXT DEFAULT 'OPEN', -- OPEN, INVESTIGATING, RESOLVED
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    # 5. Notification Audit Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notification_logs (
        id TEXT PRIMARY KEY,
        alert_id TEXT NOT NULL,
        channel TEXT NOT NULL, -- EMAIL, WEBHOOK, IN_APP
        recipient TEXT NOT NULL,
        payload TEXT NOT NULL,
        status TEXT DEFAULT 'SENT',
        sent_at TEXT NOT NULL
    )
    """)

    conn.commit()

    # Seed Default Enterprise Organization & Users if empty
    cursor.execute("SELECT COUNT(*) FROM organizations")
    if cursor.fetchone()[0] == 0:
        now = time.strftime("%Y-%m-%d %H:%M:%S")
        org_id = "ORG-CLOUDGUARD-01"
        
        cursor.execute("""
        INSERT INTO organizations (id, name, domain, license_tier, webhook_url, notification_email, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (org_id, "CloudGuard Enterprise Corp", "cloudguard.io", "ENTERPRISE_PLUS", 
              "https://hooks.slack.com/services/CLOUDGUARD/ALERT/WEBHOOK", "security-officer@cloudguard.io", now))

        # Admin User
        admin_id = "USR-ADMIN-001"
        cursor.execute("""
        INSERT INTO users (id, org_id, email, password_hash, full_name, role, department, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (admin_id, org_id, "admin@cloudguard.io", hash_password("Admin@123"), "Sarah Jenkins (SOC Director)", "ORG_ADMIN", "Global Cyber Command", "ACTIVE", now))

        # Employee 1: Alice (DevOps Lead)
        emp1_id = "USR-EMP-001"
        cursor.execute("""
        INSERT INTO users (id, org_id, email, password_hash, full_name, role, department, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (emp1_id, org_id, "alice@cloudguard.io", hash_password("Alice@123"), "Alice Smith", "EMPLOYEE", "DevOps Engineering", "ACTIVE", now))

        cursor.execute("""
        INSERT INTO assigned_resources (id, user_id, resource_id, resource_name, ip_address, subnet)
        VALUES (?, ?, ?, ?, ?, ?)
        """, ("RES-001", emp1_id, "VM-101", "Web-Server-01", "10.0.1.15", "Public Web Subnet (10.0.1.0/24)"))

        # Employee 2: Bob (Auth Engineer)
        emp2_id = "USR-EMP-002"
        cursor.execute("""
        INSERT INTO users (id, org_id, email, password_hash, full_name, role, department, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (emp2_id, org_id, "bob@cloudguard.io", hash_password("Bob@123"), "Bob Jones", "EMPLOYEE", "IAM & Authentication", "ACTIVE", now))

        cursor.execute("""
        INSERT INTO assigned_resources (id, user_id, resource_id, resource_name, ip_address, subnet)
        VALUES (?, ?, ?, ?, ?, ?)
        """, ("RES-002", emp2_id, "VM-102", "Auth-Server-02", "10.0.1.28", "Public Web Subnet (10.0.1.0/24)"))

        # Employee 3: Charlie (Data Platform Engineer)
        emp3_id = "USR-EMP-003"
        cursor.execute("""
        INSERT INTO users (id, org_id, email, password_hash, full_name, role, department, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (emp3_id, org_id, "charlie@cloudguard.io", hash_password("Charlie@123"), "Charlie Brown", "EMPLOYEE", "Data Infrastructure", "ACTIVE", now))

        cursor.execute("""
        INSERT INTO assigned_resources (id, user_id, resource_id, resource_name, ip_address, subnet)
        VALUES (?, ?, ?, ?, ?, ?)
        """, ("RES-003", emp3_id, "VM-201", "DB-Cluster-01", "10.0.2.55", "Private DB Subnet (10.0.2.0/24)"))

        conn.commit()

    conn.close()

# Database Helper Functions
def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email = ?", (email,))
    row = c.fetchone()
    conn.close()
    return dict(row) if row else None

def get_all_users(org_id: str) -> List[Dict[str, Any]]:
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id, org_id, email, full_name, role, department, status, created_at, last_login FROM users WHERE org_id = ?", (org_id,))
    rows = c.fetchall()
    
    users = []
    for r in rows:
        u = dict(r)
        # Fetch assigned resources for each user
        c.execute("SELECT * FROM assigned_resources WHERE user_id = ?", (u['id'],))
        u['assigned_resources'] = [dict(res) for res in c.fetchall()]
        users.append(u)
    conn.close()
    return users

def create_user(org_id: str, email: str, password: str, full_name: str, role: str, department: str) -> Dict[str, Any]:
    conn = get_db()
    c = conn.cursor()
    now = time.strftime("%Y-%m-%d %H:%M:%S")
    user_id = f"USR-EMP-{int(time.time()*1000) % 100000}"
    
    c.execute("""
    INSERT INTO users (id, org_id, email, password_hash, full_name, role, department, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?)
    """, (user_id, org_id, email, hash_password(password), full_name, role, department, now))
    
    conn.commit()
    conn.close()
    return get_user_by_email(email)

def assign_resource_to_user(user_id: str, resource_id: str, resource_name: str, ip_address: str, subnet: str) -> Dict[str, Any]:
    conn = get_db()
    c = conn.cursor()
    res_id = f"RES-{int(time.time()*1000) % 100000}"
    
    c.execute("""
    INSERT INTO assigned_resources (id, user_id, resource_id, resource_name, ip_address, subnet)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (res_id, user_id, resource_id, resource_name, ip_address, subnet))
    
    conn.commit()
    conn.close()
    return {"id": res_id, "user_id": user_id, "resource_name": resource_name, "ip_address": ip_address}

def update_user_status(user_id: str, status: str) -> bool:
    conn = get_db()
    c = conn.cursor()
    c.execute("UPDATE users SET status = ? WHERE id = ?", (status, user_id))
    conn.commit()
    conn.close()
    return True

def create_incident_report(user_id: str, user_name: str, user_email: str, title: str, description: str, severity: str = 'HIGH') -> Dict[str, Any]:
    conn = get_db()
    c = conn.cursor()
    now = time.strftime("%Y-%m-%d %H:%M:%S")
    inc_id = f"INC-{int(time.time()*1000) % 100000}"
    
    c.execute("""
    INSERT INTO employee_incidents (id, user_id, user_name, user_email, title, description, severity, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'OPEN', ?)
    """, (inc_id, user_id, user_name, user_email, title, description, severity, now))
    
    conn.commit()
    conn.close()
    return {"id": inc_id, "title": title, "status": "OPEN", "created_at": now}

def get_employee_incidents() -> List[Dict[str, Any]]:
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM employee_incidents ORDER BY created_at DESC")
    rows = c.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_org_settings(org_id: str) -> Dict[str, Any]:
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM organizations WHERE id = ?", (org_id,))
    row = c.fetchone()
    conn.close()
    return dict(row) if row else {}

def update_org_settings(org_id: str, webhook_url: str, notification_email: str) -> bool:
    conn = get_db()
    c = conn.cursor()
    c.execute("UPDATE organizations SET webhook_url = ?, notification_email = ? WHERE id = ?", (webhook_url, notification_email, org_id))
    conn.commit()
    conn.close()
    return True

def log_notification(alert_id: str, channel: str, recipient: str, payload: str, status: str = "SENT"):
    conn = get_db()
    c = conn.cursor()
    now = time.strftime("%Y-%m-%d %H:%M:%S")
    n_id = f"NOTIF-{int(time.time()*1000) % 100000}"
    c.execute("""
    INSERT INTO notification_logs (id, alert_id, channel, recipient, payload, status, sent_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (n_id, alert_id, channel, recipient, payload, status, now))
    conn.commit()
    conn.close()

def get_notification_logs() -> List[Dict[str, Any]]:
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM notification_logs ORDER BY sent_at DESC LIMIT 50")
    rows = c.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# Run initialization on import
init_db()
