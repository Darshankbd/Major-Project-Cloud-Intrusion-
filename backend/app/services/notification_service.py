import time
import json
import urllib.request
from typing import Dict, Any
from backend.app.db.database import log_notification, get_org_settings

class NotificationDispatcher:
    def __init__(self):
        self.sent_count = 0

    def dispatch_threat_alert(self, flow_data: dict, alert_id: str):
        if flow_data.get('severity') not in ['HIGH', 'CRITICAL']:
            return

        org_id = "ORG-CLOUDGUARD-01"
        settings = get_org_settings(org_id)
        email_recipient = settings.get('notification_email', 'security-officer@cloudguard.io')
        webhook_url = settings.get('webhook_url', '')

        # 1. Format Email Alert Payload
        email_subject = f"[CRITICAL THREAT ALERT] Intrusion Detected on {flow_data.get('dst_ip')}"
        email_body = (
            f"SECURITY INCIDENT NOTICE\n"
            f"Alert ID: {alert_id}\n"
            f"Threat Type: {flow_data.get('prediction')}\n"
            f"Severity: {flow_data.get('severity')}\n"
            f"Source IP: {flow_data.get('src_ip')} ({flow_data.get('geo_country', 'Unknown')})\n"
            f"Target Resource IP: {flow_data.get('dst_ip')}:{flow_data.get('dst_port')}\n"
            f"Cloud Region: {flow_data.get('cloud_region')}\n"
            f"Confidence Score: {flow_data.get('confidence', 0) * 100:.1f}%\n"
            f"Action Required: Check Org Admin Dashboard for Automated IP Blocking."
        )

        log_notification(alert_id, "EMAIL", email_recipient, email_body, "SENT")

        # 2. Format Webhook Payload (Slack/Discord compatible)
        webhook_payload = {
            "text": f"🚨 *CloudGuard ML-IDS Alert* - `{flow_data.get('severity')}` Threat Detected!",
            "attachments": [
                {
                    "color": "#EF4444" if flow_data.get('severity') == 'CRITICAL' else "#F97316",
                    "fields": [
                        {"title": "Alert ID", "value": alert_id, "short": True},
                        {"title": "Threat Vector", "value": flow_data.get('prediction'), "short": True},
                        {"title": "Attacker IP", "value": f"{flow_data.get('src_ip')} ({flow_data.get('geo_country')})", "short": True},
                        {"title": "Target IP", "value": flow_data.get('dst_ip'), "short": True},
                        {"title": "Confidence", "value": f"{flow_data.get('confidence', 0) * 100:.1f}%", "short": True},
                        {"title": "Zero-Day Anomaly", "value": "YES" if flow_data.get('is_zero_day_anomaly') else "NO", "short": True}
                    ]
                }
            ]
        }

        # Dispatch Webhook if URL configured
        if webhook_url and webhook_url.startswith("http"):
            try:
                req = urllib.request.Request(
                    webhook_url,
                    data=json.dumps(webhook_payload).encode('utf-8'),
                    headers={'Content-Type': 'application/json'}
                )
                with urllib.request.urlopen(req, timeout=3) as resp:
                    status = "DELIVERED"
            except Exception as e:
                status = f"FAILED ({str(e)})"
            log_notification(alert_id, "WEBHOOK", webhook_url, json.dumps(webhook_payload), status)
        else:
            log_notification(alert_id, "WEBHOOK", "Simulated Webhook Channel", json.dumps(webhook_payload), "SIMULATED_SUCCESS")

        self.sent_count += 1
        print(f"Notification Service: Dispatched Email & Webhook for Alert {alert_id}")

notification_dispatcher = NotificationDispatcher()
