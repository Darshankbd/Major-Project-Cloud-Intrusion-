import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "cloud_ids.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'Analyst',
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Alerts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        source_ip TEXT NOT NULL,
        destination_ip TEXT NOT NULL,
        attack_type TEXT NOT NULL,
        severity TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Active',
        confidence REAL,
        mitigated INTEGER DEFAULT 0,
        firewall_rule TEXT
    )
    """)

    # Detection History Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS detection_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        source_ip TEXT NOT NULL,
        destination_ip TEXT NOT NULL,
        protocol TEXT NOT NULL,
        service TEXT NOT NULL,
        duration REAL,
        src_bytes INTEGER,
        dst_bytes INTEGER,
        prediction TEXT NOT NULL,
        confidence REAL,
        severity TEXT,
        dataset_source TEXT
    )
    """)

    # Datasets Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS datasets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        rows_count INTEGER,
        features_count INTEGER,
        missing_values INTEGER DEFAULT 0,
        source_type TEXT,
        features_list TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Trained Models Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trained_models (
        id TEXT PRIMARY KEY,
        algorithm TEXT NOT NULL,
        dataset_id TEXT NOT NULL,
        accuracy REAL,
        precision REAL,
        recall REAL,
        f1_score REAL,
        file_path TEXT,
        trained_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Settings Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    )
    """)

    # Seed Default Users
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)",
                       ("admin", "admin123", "Admin", "admin@cloudids.local"))
        cursor.execute("INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)",
                       ("analyst", "analyst123", "Analyst", "analyst@cloudids.local"))

    # Seed Initial Settings
    default_settings = {
        "auto_block_critical": "true",
        "alert_threshold": "0.75",
        "telemetry_speed_ms": "1200",
        "aws_sg_sync": "false",
        "iptables_auto_apply": "false"
    }
    for k, v in default_settings.items():
        cursor.execute("INSERT OR IGNORE INTO system_settings (key, value) VALUES (?, ?)", (k, v))

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully at:", DB_PATH)
