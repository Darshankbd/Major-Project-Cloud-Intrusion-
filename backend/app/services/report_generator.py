import os
import time
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from backend.app.services.alert_engine import alert_engine_service
from backend.app.ml.predictor import predictor_service

def generate_pdf_report() -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    story = []

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#0F172A'),
        fontName='Helvetica-Bold'
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.HexColor('#475569'),
        fontName='Helvetica'
    )

    h2_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#1E293B'),
        fontName='Helvetica-Bold',
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#334155'),
        fontName='Helvetica'
    )

    story.append(Paragraph("CloudGuard ML-IDS | Enterprise Security Audit Report", title_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph(f"Generated on: {time.strftime('%Y-%m-%d %H:%M:%S UTC')} | Author: Enterprise Security Governance Engine", subtitle_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#3B82F6'), spaceAfter=15))

    story.append(Paragraph("1. Executive Governance Summary", h2_style))
    exec_summary_text = (
        "This enterprise audit document reports on the security posture, multi-tenant RBAC governance, "
        "and threat detection efficacy of the CloudGuard Intrusion Detection System (CloudGuard ML-IDS). "
        "Utilizing a hybrid machine learning architecture (Random Forest, XGBoost, Isolation Forest), "
        "the platform monitors cloud VPC flow logs, protects employee assigned cloud resources, "
        "and dispatches automated multi-channel notifications (Email, Webhook, In-App)."
    )
    story.append(Paragraph(exec_summary_text, body_style))
    story.append(Spacer(1, 12))

    story.append(Paragraph("2. Threat Statistics & Operational Metrics", h2_style))
    stats = alert_engine_service.get_summary_stats()
    
    stats_data = [
        ['Metric Category', 'Value', 'Status'],
        ['Total Security Alerts Analyzed', str(stats['total_alerts']), 'Normal'],
        ['Critical Threats Detected', str(stats['critical']), 'Requires Attention' if stats['critical'] > 0 else 'Optimal'],
        ['High Risk Incidents', str(stats['high']), 'Monitored'],
        ['Active Unhandled Threats', str(stats['active']), 'Active'],
        ['Mitigated Incidents', str(stats['mitigated']), 'Resolved'],
        ['Automated Mitigation Rate', f"{stats['mitigation_rate']}%", 'High Efficacy']
    ]

    t_stats = Table(stats_data, colWidths=[220, 150, 150])
    t_stats.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1E293B')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')])
    ]))
    story.append(t_stats)
    story.append(Spacer(1, 15))

    story.append(Paragraph("3. Machine Learning Model Diagnostics & Benchmark Metrics", h2_style))
    
    meta = predictor_service.metadata
    metrics = meta.get('metrics', {}) if meta else {}

    ml_data = [['Algorithm Model', 'Type', 'Accuracy', 'Precision', 'Recall', 'F1-Score', 'ROC-AUC']]
    
    for model_name, m_info in metrics.items():
        ml_data.append([
            model_name.replace('_', ' ').title(),
            'Supervised' if m_info['type'] == 'supervised_classifier' else 'Anomaly Det.',
            f"{m_info.get('accuracy', 0)*100:.1f}%",
            f"{m_info.get('precision', 0)*100:.1f}%",
            f"{m_info.get('recall', 0)*100:.1f}%",
            f"{m_info.get('f1_score', 0)*100:.1f}%",
            f"{m_info.get('roc_auc', 0)*100:.1f}%" if 'roc_auc' in m_info else 'N/A'
        ])

    t_ml = Table(ml_data, colWidths=[130, 85, 60, 60, 60, 60, 65])
    t_ml.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0F172A')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#94A3B8')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F1F5F9')])
    ]))
    story.append(t_ml)
    story.append(Spacer(1, 15))

    story.append(Paragraph("4. Incident Triage & Mitigation Audit Log", h2_style))
    recent_alerts = alert_engine_service.alerts[:8]

    if not recent_alerts:
        story.append(Paragraph("No active security incidents recorded in current session.", body_style))
    else:
        alert_rows = [['Alert ID', 'Timestamp', 'Threat Type', 'Severity', 'Source IP', 'Status']]
        for a in recent_alerts:
            alert_rows.append([
                a['alert_id'],
                a['timestamp'],
                a['threat_type'],
                a['severity'],
                a['src_ip'],
                a['status']
            ])

        t_alerts = Table(alert_rows, colWidths=[70, 110, 130, 65, 95, 50])
        t_alerts.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#334155')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')])
        ]))
        story.append(t_alerts)

    story.append(Spacer(1, 20))
    story.append(Paragraph("Report End -- CloudGuard ML-IDS Enterprise Deliverable", subtitle_style))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
