import json
from datetime import datetime

def generate_firewall_rules(source_ip, attack_type, severity="High", port=None):
    """
    Generates actionable mitigation rules for iptables (Linux OS firewall)
    and AWS EC2 Security Group JSON / AWS CLI policy commands.
    """
    port_str = f"--dport {port}" if port else ""
    
    # 1. Linux iptables mitigation command
    iptables_rule = f"iptables -I INPUT -s {source_ip} -j DROP"
    if port:
        iptables_rule += f" && iptables -I INPUT -p tcp -s {source_ip} --dport {port} -j REJECT"

    # 2. AWS Security Group Ingress Revocation / NACL Deny Rule
    aws_sg_cli = (
        f"aws ec2 authorize-security-group-egress --group-id sg-0idsdefense "
        f"--protocol -1 --port -1 --cidr {source_ip}/32"
    )
    
    aws_nacl_rule = {
        "RuleNumber": 50,
        "Protocol": "-1",
        "RuleAction": "deny",
        "Egress": False,
        "CidrBlock": f"{source_ip}/32",
        "Description": f"Auto-blocked by Cloud-IDS ML ({attack_type} detected, severity: {severity})"
    }

    # 3. Cloudflare / WAF IP Access Rule
    waf_rule = {
        "mode": "block",
        "configuration": {
            "target": "ip",
            "value": source_ip
        },
        "notes": f"Cloud-IDS Trigger: {attack_type} intrusion attempt flagged at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    }

    # 4. Recommended Security Mitigation steps
    recommendations = [
        f"Block source IP {source_ip} at perimeter router / load balancer.",
        f"Isolate impacted internal endpoints communicating with {source_ip} to quarantine VLAN.",
        f"Review authentication logs for unauthorized credential stuffing / brute force."
    ]
    if attack_type == 'DoS':
        recommendations.append("Enable rate-limiting and Cloudflare Under Attack mode on targeted URI.")
    elif attack_type == 'Probe':
        recommendations.append("Close unneeded open listening ports and review security group ingress.")
    elif attack_type in ['R2L', 'U2R']:
        recommendations.append("Rotate exposed SSH/FTP credentials and force immediate active session terminations.")

    return {
        "source_ip": source_ip,
        "attack_type": attack_type,
        "severity": severity,
        "timestamp": datetime.now().isoformat(),
        "iptables_command": iptables_rule,
        "aws_sg_command": aws_sg_cli,
        "aws_nacl_policy": aws_nacl_rule,
        "waf_policy": waf_rule,
        "recommended_actions": recommendations
    }
