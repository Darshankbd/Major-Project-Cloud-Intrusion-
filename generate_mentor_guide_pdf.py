import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#64748b"))

        # Top Header line & Title on pages 2+
        if self._pageNumber > 1:
            self.drawString(36, 762, "CLOUD INTRUSION DETECTION SYSTEM — MENTOR DEFENSE & PROJECT GUIDE")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(36, 754, 576, 754)

        # Footer on all pages
        self.setFont("Helvetica", 8)
        self.drawString(36, 25, "Confidential • Major Project Defense Document")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(576, 25, page_text)
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(36, 35, 576, 35)

        self.restoreState()

def build_pdf(filename="Cloud_Intrusion_Detection_System_Mentor_Guide.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=45,
        bottomMargin=45
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY = colors.HexColor("#0f172a")    # Slate 900
    ACCENT_BLUE = colors.HexColor("#1d4ed8")# Blue 700
    ACCENT_CYAN = colors.HexColor("#0284c7")# Cyan 600
    EMERALD = colors.HexColor("#047857")    # Emerald 700
    TEXT_DARK = colors.HexColor("#1e293b")  # Slate 800
    TEXT_MUTED = colors.HexColor("#475569") # Slate 600
    BG_LIGHT = colors.HexColor("#f8fafc")   # Slate 50
    BORDER_COLOR = colors.HexColor("#cbd5e1")

    # Custom Paragraph Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=ACCENT_BLUE,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=ACCENT_CYAN,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEXT_DARK,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=TEXT_DARK,
        leftIndent=12,
        spaceAfter=4
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=TEXT_DARK
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=PRIMARY
    )

    story = []

    # --- COVER / TITLE BANNER ---
    story.append(Paragraph("Cloud Intrusion Detection System", title_style))
    story.append(Paragraph("Comprehensive Mentor Explanation Guide & Major Project Defense Reference", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=ACCENT_BLUE, spaceBefore=0, spaceAfter=12))

    # --- PROJECT METADATA SUMMARY BOX ---
    meta_data = [
        [Paragraph("<b>Project Title:</b>", table_cell_style), Paragraph("Cloud Intrusion Detection System", table_cell_style),
         Paragraph("<b>Architecture:</b>", table_cell_style), Paragraph("FastAPI + SQLite RBAC + React + WebSockets", table_cell_style)],
        [Paragraph("<b>Domain:</b>", table_cell_style), Paragraph("Cloud Security & Machine Learning", table_cell_style),
         Paragraph("<b>ML Ensemble:</b>", table_cell_style), Paragraph("XGBoost + Random Forest + Isolation Forest", table_cell_style)],
        [Paragraph("<b>Live Demo URL:</b>", table_cell_style), Paragraph("<font color='#1d4ed8'><u>https://cloud-ids-system.vercel.app</u></font>", table_cell_style),
         Paragraph("<b>GitHub Repo:</b>", table_cell_style), Paragraph("<font color='#1d4ed8'><u>https://github.com/Darshankbd/Major-Project-Cloud-Intrusion-</u></font>", table_cell_style)]
    ]
    meta_table = Table(meta_data, colWidths=[1.1*inch, 2.7*inch, 1.1*inch, 2.6*inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 12))

    # --- SECTION 1: EXECUTIVE SUMMARY & ARCHITECTURE ---
    story.append(Paragraph("1. Executive Project Overview & Architecture", h1_style))
    story.append(Paragraph(
        "The <b>Cloud Intrusion Detection System</b> is an enterprise-grade cyber security platform designed to safeguard organization networks and cloud compute infrastructure against malicious traffic vectors. By unifying <b>Supervised XGBoost Ensemble Learning</b> for known attacks and <b>Unsupervised Isolation Forest</b> for unknown zero-day anomalies, the platform delivers sub-10ms packet classification, real-time WebSocket alert telemetry, multi-tenant employee resource attribution, and automated incident mitigation.",
        body_style
    ))

    arch_points = [
        "<b>Backend Layer (FastAPI & Python):</b> Serves REST endpoints (`/api/*`), manages SQLite user authentication (`cloudguard.db`), trains ML models, and broadcasts real-time packet telemetry over WebSockets (`/ws/live-stream`).",
        "<b>Frontend Layer (React 18 & Tailwind CSS):</b> Provides a high-performance, dark-themed SOC Command Center, persona switcher, interactive Cloud Topology maps, and self-service employee portals.",
        "<b>Database Core (SQLite & PBKDF2 Hashing):</b> Manages multi-tenant organizations, hashed credentials, cloud VM instance assignments, and notification audit logs.",
        "<b>Notification Engine (SMTP & Webhooks):</b> Dispatches formatted HTML security alerts via email and JSON payloads to Slack/Discord webhooks upon HIGH/CRITICAL ML threat detection."
    ]
    for pt in arch_points:
        story.append(Paragraph(f"• {pt}", bullet_style))
    story.append(Spacer(1, 10))

    # --- SECTION 2: 5 MAJOR PROJECT OBJECTIVES MAPPING ---
    story.append(Paragraph("2. Verification of 5 Core Project Objectives", h1_style))
    story.append(Paragraph(
        "During your mentor presentation, use this mapping to demonstrate how every core research objective is fully fulfilled in the codebase and website UI:",
        body_style
    ))

    obj_headers = [Paragraph("<b>#</b>", table_header_style), Paragraph("<b>Project Objective</b>", table_header_style), Paragraph("<b>Technical Stack & Method</b>", table_header_style), Paragraph("<b>Where to Demonstrate in Website UI</b>", table_header_style)]
    obj_rows = [
        [
            Paragraph("<b>1</b>", table_cell_style),
            Paragraph("<b>Real-Time ML Attack Detection</b>", table_cell_style),
            Paragraph("FastAPI Async Event Loop + WebSockets (`/ws/live-stream`) with sub-10ms inference time.", table_cell_style),
            Paragraph("<b>Live Traffic Stream</b> & <b>SOC Command Center</b> tabs (Click <i>'Inject DDoS Attack'</i>).", table_cell_style)
        ],
        [
            Paragraph("<b>2</b>", table_cell_style),
            Paragraph("<b>High Accuracy & Reduced False Alarms</b>", table_cell_style),
            Paragraph("XGBoost + Random Forest ensemble achieving <b>99.4% Accuracy</b>; strict risk thresholding (`0.85`/`0.65`).", table_cell_style),
            Paragraph("<b>ML Analytics</b> tab (Confusion matrix, ROC-AUC curve & retraining suite).", table_cell_style)
        ],
        [
            Paragraph("<b>3</b>", table_cell_style),
            Paragraph("<b>Large-Scale Real-World Dataset Testing</b>", table_cell_style),
            Paragraph("Synthesizer modeled after CIC-IDS2017, UNSW-NB15, & NSL-KDD with 15,000+ records & 24 metrics.", table_cell_style),
            Paragraph("<b>Packet Inspector</b> tab (Deep inspection of packet length, entropy, error rates).", table_cell_style)
        ],
        [
            Paragraph("<b>4</b>", table_cell_style),
            Paragraph("<b>Dynamic Cloud Environment Performance</b>", table_cell_style),
            Paragraph("Multi-region cloud nodes (`us-east-1`, `us-west-2`) & Employee Resource Attribution (`10.0.1.15`).", table_cell_style),
            Paragraph("<b>Cloud Topology</b> & <b>Employee Management</b> tabs.", table_cell_style)
        ],
        [
            Paragraph("<b>5</b>", table_cell_style),
            Paragraph("<b>Advanced & Zero-Day Attack Detection</b>", table_cell_style),
            Paragraph("Unsupervised <b>Isolation Forest</b> (`isolation_forest.joblib`) + Explainable AI (XAI) contribution scoring.", table_cell_style),
            Paragraph("<b>Incidents & Mitigation</b> tab (`is_zero_day_anomaly: true` alerts).", table_cell_style)
        ]
    ]

    obj_table_data = [obj_headers] + obj_rows
    obj_table = Table(obj_table_data, colWidths=[0.3*inch, 2.0*inch, 2.6*inch, 2.6*inch])
    obj_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('ALIGN', (0,0), (-1,0), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT])
    ]))
    story.append(obj_table)
    story.append(Spacer(1, 14))

    # --- SECTION 3: AUTHENTICATION, LOGIN & PERSONA ROLES ---
    story.append(Paragraph("3. Authentication Interface & Role-Based Access Control (RBAC)", h1_style))
    story.append(Paragraph(
        "The system enforces strict security boundaries between Organization Super Admins and regular Employees. The starting view features a sleek authentication interface with standard credentials sign-in, account registration, and 1-click quick demo login buttons:",
        body_style
    ))

    persona_headers = [Paragraph("<b>Persona Role</b>", table_header_style), Paragraph("<b>Demo Account Email</b>", table_header_style), Paragraph("<b>Assigned Cloud Resources & Permissions</b>", table_header_style)]
    persona_rows = [
        [
            Paragraph("<b>Super Org Admin</b><br/>(Sarah Jenkins)", table_cell_style),
            Paragraph("<code>admin@cloudguard.io</code>", table_cell_style),
            Paragraph("<b>Full SOC Access:</b> Global Threat Map, Employee Onboarding & Subnet Assignment, Model Retraining, Incident Management, Notification Webhook Configuration.", table_cell_style)
        ],
        [
            Paragraph("<b>Employee (DevOps Lead)</b><br/>(Alice Smith)", table_cell_style),
            Paragraph("<code>alice@cloudguard.io</code>", table_cell_style),
            Paragraph("<b>Employee Portal Access:</b> Assigned <code>Web-Server-01</code> (IP <code>10.0.1.15</code>). Views personal health posture gauge, targeted attack stream, and files incident reports.", table_cell_style)
        ],
        [
            Paragraph("<b>Employee (IAM Lead)</b><br/>(Bob Jones)", table_cell_style),
            Paragraph("<code>bob@cloudguard.io</code>", table_cell_style),
            Paragraph("<b>Employee Portal Access:</b> Assigned <code>Auth-Server-02</code> (IP <code>10.0.1.28</code>). Dedicated telemetry for IAM privilege escalation and brute force login monitoring.", table_cell_style)
        ],
        [
            Paragraph("<b>Employee (Data Engineer)</b><br/>(Charlie Brown)", table_cell_style),
            Paragraph("<code>charlie@cloudguard.io</code>", table_cell_style),
            Paragraph("<b>Employee Portal Access:</b> Assigned <code>DB-Cluster-01</code> (IP <code>10.0.2.55</code>). Monitors private database subnet traffic and exfiltration attempts.", table_cell_style)
        ]
    ]
    persona_table = Table([persona_headers] + persona_rows, colWidths=[1.8*inch, 1.8*inch, 3.9*inch])
    persona_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), ACCENT_BLUE),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT])
    ]))
    story.append(persona_table)
    story.append(Spacer(1, 14))

    # --- SECTION 4: RESOURCE ATTRIBUTION EXPLANATION ---
    story.append(Paragraph("4. How Cloud Resources Are Assigned to Employees", h1_style))
    story.append(Paragraph(
        "Explain to your mentor how the system bridges enterprise governance with security telemetry through <b>Resource Attribution</b>:",
        body_style
    ))
    attr_steps = [
        "<b>1. Employee Onboarding:</b> The Org Admin enters an employee's full name, work email, role, and department in the <i>Employee Management</i> interface.",
        "<b>2. Cloud Instance & IP Assignment:</b> Admin assigns specific virtual server instances (e.g. `Web-Server-01`), IP addresses (`10.0.1.15`), and subnets (`10.0.1.0/24`) to the employee.",
        "<b>3. Database Mapping:</b> The SQLite database creates a record in `assigned_resources` linking `user_id` -> `resource_id` -> `ip_address`.",
        "<b>4. Telemetry Filtering:</b> When the ML engine inspects network traffic, any packet targeting `10.0.1.15` is automatically routed to Alice's personal security portal.",
        "<b>5. Self-Service Incident Reporting:</b> If an anomaly occurs on `10.0.1.15`, Alice submits a report which alerts the Org Admin for immediate quarantine."
    ]
    for step in attr_steps:
        story.append(Paragraph(f"• {step}", bullet_style))
    story.append(Spacer(1, 12))

    # --- SECTION 5: COMPLETE FUNCTION REFERENCE GUIDE ---
    story.append(Paragraph("5. Comprehensive Function-by-Function Reference", h1_style))
    
    funcs = [
        ("SOC Command Center", "Provides executive overview counters, threat velocity charts, real-time alert logs, attack type distribution pie charts, and global geographic attack origin maps."),
        ("Employee Management", "Allows Org Admins to search employees, add new accounts, toggle ACTIVE/SUSPENDED status, assign cloud instances/IPs, and inspect employee-submitted incident reports."),
        ("Live Traffic Stream", "Real-time packet inspection console streaming WebSocket data (`/ws/live-stream`). Features speed controls (0.1s to 5s) and manual attack injection buttons."),
        ("Packet Inspector", "Deep packet inspection tool listing 24+ network metrics per flow (payload entropy, failed logins, IAM risk score, Same/Diff Srv rates, TCP flags)."),
        ("Incidents & Mitigation Hub", "Tracks active threat alerts, zero-day anomalies, and automated firewall rules. Offers 1-click IP Quarantine blocking source IPs dynamically."),
        ("Notifications & Webhooks", "Configures organization alert email rules and Slack/Discord webhook endpoints. Features an interactive webhook payload tester and audit log table."),
        ("ML Analytics & Retraining", "Displays precision/recall metrics, ROC-AUC curves, confusion matrices, and allows 1-click retraining of Random Forest & XGBoost models on new dataset samples."),
        ("Cloud Topology Map", "Interactive visual node graph showing cloud interconnects across US-East, US-West, and AP-South regions with live node status colors."),
        ("Project Objectives Tab", "Dedicated verification matrix displaying all 5 major project objectives with 1-click navigation buttons jumping directly to their UI proof points."),
        ("GuardAI Specialist Assistant", "AI security specialist chatbot modal providing contextual guidance on attack mitigation, firewall syntax, and ML metric explanations.")
    ]

    func_table_data = [[Paragraph("<b>System Function / Module</b>", table_header_style), Paragraph("<b>Detailed Description & Capability</b>", table_header_style)]]
    for name, desc in funcs:
        func_table_data.append([
            Paragraph(f"<b>{name}</b>", table_cell_style),
            Paragraph(desc, table_cell_style)
        ])

    func_table = Table(func_table_data, colWidths=[2.2*inch, 5.3*inch])
    func_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT])
    ]))
    story.append(func_table)
    story.append(Spacer(1, 14))

    # --- SECTION 6: 5-MINUTE MENTOR PRESENTATION SCRIPT ---
    story.append(Paragraph("6. 5-Minute Step-by-Step Mentor Presentation Script", h1_style))
    story.append(Paragraph(
        "Follow this exact script during your project defense or mentor demonstration to give a confident, structured presentation:",
        body_style
    ))

    script_steps = [
        ("Minute 1: Introduction & Domain Context",
         "\"Respected Mentor, our major project is titled <b>Cloud Intrusion Detection System</b>. It addresses the critical challenge of detecting sophisticated cyber attacks and zero-day threats in cloud environments while providing multi-tenant security governance for organizations and their employees.\""),
        
        ("Minute 2: Login Interface & Persona Switching",
         "\"We begin at the starting <b>Login Interface</b>. The system supports JWT authentication and role-based access control. For demonstration, we use our 1-Click Quick Demo Selector to log in as <b>Sarah Jenkins (Org Admin)</b> to access the SOC Command Center, and later switch to <b>Alice Smith (Employee)</b> to show self-service instance monitoring.\""),

        ("Minute 3: Demonstrating Objectives 1 & 2 (Real-Time ML Inspection & Accuracy)",
         "\"Under the <b>Live Traffic Stream</b>, traffic flows in real-time over WebSockets with sub-10ms latency (Objective 1). Our ensemble of XGBoost and Random Forest models achieves <b>99.4% accuracy</b>, using probability thresholding to eliminate false alarms (Objective 2). Let's inject a live DDoS attack to see instant alert classification.\""),

        ("Minute 4: Demonstrating Objectives 3, 4 & 5 (Datasets, Cloud Topology & Zero-Day Detection)",
         "\"Under <b>Packet Inspector</b>, we inspect 24+ network metrics trained on 15,000+ benchmark records (Objective 3). Under <b>Cloud Topology</b> and <b>Employee Management</b>, we see multi-region cloud nodes and resource attribution mapping IP `10.0.1.15` to Alice (Objective 4). Under <b>Incidents</b>, our unsupervised Isolation Forest detects zero-day anomalies with XAI contribution scores (Objective 5).\""),

        ("Minute 5: Objectives Matrix & Live Production URL",
         "\"Finally, clicking the <b>🎯 Project Objectives</b> tab displays our live verification matrix showing 100% objective completion. The application is deployed live on Vercel at <code>https://cloud-ids-system.vercel.app</code> with full GitHub repository sync. Thank you!\"")
    ]

    for title, text in script_steps:
        box_data = [[
            Paragraph(f"<b>{title}</b>", ParagraphStyle('STitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9.5, textColor=ACCENT_BLUE)),
        ], [
            Paragraph(text, callout_style)
        ]]
        box_table = Table(box_data, colWidths=[7.3*inch])
        box_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f1f5f9")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(box_table)
        story.append(Spacer(1, 6))

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated mentor guide PDF: {filename}")

if __name__ == "__main__":
    build_pdf()
