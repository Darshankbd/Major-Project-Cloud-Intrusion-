import time
import random
from backend.app.services.notification_service import notification_dispatcher

class AlertEngine:
    def __init__(self):
        self.alerts = []
        self.rules = [
            {'id': 'RULE-101', 'name': 'DDoS Attack Velocity Threshold', 'metric': 'src_pkts > 1000', 'action': 'Auto-Block IP', 'enabled': True},
            {'id': 'RULE-102', 'name': 'SSH / RDP Brute Force Attempt', 'metric': 'failed_logins > 5', 'action': 'Isolate VM', 'enabled': True},
            {'id': 'RULE-103', 'name': 'High Entropy C2 Channel', 'metric': 'payload_entropy > 6.5', 'action': 'Quarantine Flow', 'enabled': True},
            {'id': 'RULE-104', 'name': 'IAM Privilege Escalation Detection', 'metric': 'iam_risk_score > 8.0', 'action': 'Revoke IAM Access', 'enabled': True}
        ]

    def record_alert(self, flow_data: dict) -> dict:
        if flow_data['severity'] in ['LOW'] and not flow_data['is_zero_day_anomaly']:
            return None

        alert_id = f"ALT-{random.randint(10000, 99999)}"
        alert = {
            'alert_id': alert_id,
            'timestamp': flow_data['timestamp'],
            'flow_id': flow_data['flow_id'],
            'threat_type': flow_data['prediction'],
            'severity': flow_data['severity'],
            'risk_score': flow_data['risk_score'],
            'anomaly_score': flow_data['anomaly_score'],
            'src_ip': flow_data['src_ip'],
            'dst_ip': flow_data['dst_ip'],
            'geo_country': flow_data.get('geo_country', 'Unknown'),
            'service': flow_data['service'],
            'cloud_region': flow_data['cloud_region'],
            'confidence': flow_data['confidence'],
            'status': 'ACTIVE',
            'suggested_action': 'Block Source IP' if flow_data['severity'] == 'CRITICAL' else 'Quarantine Subnet',
            'flow_details': flow_data
        }

        self.alerts.insert(0, alert)
        if len(self.alerts) > 200:
            self.alerts.pop()

        # Dispatch Multi-Channel Notifications (Email / Webhook / In-App)
        notification_dispatcher.dispatch_threat_alert(flow_data, alert_id)

        return alert

    def apply_mitigation(self, alert_id: str, action: str, admin_user: str = "SOC_Admin") -> dict:
        alert = next((a for a in self.alerts if a['alert_id'] == alert_id), None)
        if not alert:
            return {'success': False, 'message': 'Alert ID not found'}

        alert['status'] = 'MITIGATED'
        alert['mitigated_at'] = time.strftime("%Y-%m-%d %H:%M:%S")
        alert['mitigated_by'] = admin_user
        alert['action_taken'] = action

        mitigation_record = {
            'mitigation_id': f"MIT-{random.randint(1000, 9999)}",
            'alert_id': alert_id,
            'src_ip': alert['src_ip'],
            'action': action,
            'timestamp': alert['mitigated_at'],
            'status': 'SUCCESS',
            'details': f"Executed '{action}' on cloud target {alert['dst_ip']} for malicious IP {alert['src_ip']}."
        }

        return {'success': True, 'alert': alert, 'mitigation': mitigation_record}

    def get_summary_stats(self) -> dict:
        total_alerts = len(self.alerts)
        critical_count = sum(1 for a in self.alerts if a['severity'] == 'CRITICAL')
        high_count = sum(1 for a in self.alerts if a['severity'] == 'HIGH')
        medium_count = sum(1 for a in self.alerts if a['severity'] == 'MEDIUM')
        active_count = sum(1 for a in self.alerts if a['status'] == 'ACTIVE')
        mitigated_count = sum(1 for a in self.alerts if a['status'] == 'MITIGATED')

        return {
            'total_alerts': total_alerts,
            'critical': critical_count,
            'high': high_count,
            'medium': medium_count,
            'active': active_count,
            'mitigated': mitigated_count,
            'mitigation_rate': round((mitigated_count / total_alerts * 100) if total_alerts > 0 else 100.0, 1)
        }

alert_engine_service = AlertEngine()
