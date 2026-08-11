import os
import sys
from reportlab.lib.pagesizes import landscape
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# -----------------------------------------------------------------------------
# CONSTANTS & METADATA
# -----------------------------------------------------------------------------
INTERN_ID = "TBI-26100454"
INTERN_NAME = "Sanchi Sisodia"
UNIVERSITY = "Graphic Era University (GEU)"
PROJECT_TITLE = "CareerPilot AI"
SUBTITLE = "AI-Assisted Job Application Tracker & Placement Prep Platform"
PROGRAM = "AI Full Stack Development Internship — Week 10 Final Deliverable"

URL_FRONTEND = "https://careerpilot-ai.vercel.app"
URL_BACKEND = "https://careerpilot-ai-api.onrender.com"
URL_GITHUB = "https://github.com/sanchi1905/careerpilot-ai"

# Image Paths
IMG_DASHBOARD = "dashboard_overview.png"
IMG_MODAL = "add_application_modal.png"
IMG_SCHEMA = "schema_diagram.png"
IMG_NETWORK = "network_tab.png"

# Color Palette (Modern Indigo/Slate Theme)
PRIMARY_HEX = "#4F46E5"     # Indigo 600
PRIMARY_DARK = "#3730A3"    # Indigo 800
ACCENT_HEX = "#06B6D4"      # Cyan 500
TEXT_DARK = "#1E293B"       # Slate 800
TEXT_MUTED = "#64748B"      # Slate 500
BG_LIGHT = "#F8FAFC"        # Slate 50
CARD_BG = "#FFFFFF"         # White
BORDER_HEX = "#E2E8F0"      # Slate 200

COLOR_PRIMARY = colors.HexColor(PRIMARY_HEX)
COLOR_PRIMARY_DARK = colors.HexColor(PRIMARY_DARK)
COLOR_ACCENT = colors.HexColor(ACCENT_HEX)
COLOR_TEXT_DARK = colors.HexColor(TEXT_DARK)
COLOR_TEXT_MUTED = colors.HexColor(TEXT_MUTED)
COLOR_BG_LIGHT = colors.HexColor(BG_LIGHT)
COLOR_CARD_BG = colors.HexColor(CARD_BG)
COLOR_BORDER = colors.HexColor(BORDER_HEX)

# Slide Dimensions (16:9 Widescreen: 960 x 540 pt)
SLIDE_WIDTH = 960
SLIDE_HEIGHT = 540

class NumberedCanvas(canvas.Canvas):
    """Custom canvas for adding branded background header/footer and page numbers."""
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
        if self._pageNumber == 1:
            # Title slide background decoration
            self.setFillColor(COLOR_PRIMARY)
            self.rect(0, 0, 24, SLIDE_HEIGHT, fill=1, stroke=0)
            self.setFillColor(COLOR_ACCENT)
            self.rect(24, 0, 8, SLIDE_HEIGHT, fill=1, stroke=0)
            return

        # Top Header Bar
        self.setFillColor(COLOR_PRIMARY)
        self.rect(0, SLIDE_HEIGHT - 12, SLIDE_WIDTH, 12, fill=1, stroke=0)
        
        # Header Text
        self.setFont("Helvetica-Bold", 9)
        self.setFillColor(COLOR_TEXT_MUTED)
        self.drawString(40, SLIDE_HEIGHT - 28, f"{PROJECT_TITLE} — Final Presentation")
        
        self.setFont("Helvetica", 9)
        self.drawRightString(SLIDE_WIDTH - 40, SLIDE_HEIGHT - 28, f"Intern ID: {INTERN_ID}")
        
        # Top Divider Line
        self.setStrokeColor(COLOR_BORDER)
        self.setLineWidth(0.75)
        self.line(40, SLIDE_HEIGHT - 34, SLIDE_WIDTH - 40, SLIDE_HEIGHT - 34)

        # Footer Divider Line
        self.line(40, 36, SLIDE_WIDTH - 40, 36)

        # Footer Text
        self.setFont("Helvetica", 8)
        self.setFillColor(COLOR_TEXT_MUTED)
        self.drawString(40, 20, f"{INTERN_NAME} | {UNIVERSITY} | Week 10 Final Deliverable")
        self.drawRightString(SLIDE_WIDTH - 40, 20, f"Slide {self._pageNumber} of {page_count}")


# -----------------------------------------------------------------------------
# BUILD PDF PRESENTATION (REPORTLAB)
# -----------------------------------------------------------------------------
def build_pdf_presentation(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=(SLIDE_WIDTH, SLIDE_HEIGHT),
        leftMargin=40,
        rightMargin=40,
        topMargin=45,
        bottomMargin=45
    )

    styles = getSampleStyleSheet()

    # Base custom styles
    title_style = ParagraphStyle(
        'SlideTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=COLOR_PRIMARY_DARK,
        spaceAfter=12
    )

    section_badge_style = ParagraphStyle(
        'SectionBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=COLOR_PRIMARY,
        spaceAfter=4,
        textTransform='uppercase'
    )

    body_style = ParagraphStyle(
        'SlideBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=16,
        textColor=COLOR_TEXT_DARK,
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'SlideBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=15,
        textColor=COLOR_TEXT_DARK,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=6
    )

    bold_bullet_title = lambda title, text: f"<b><font color='{PRIMARY_DARK}'>• {title}:</font></b> {text}"

    story = []

    # =========================================================================
    # SLIDE 1: Title Slide
    # =========================================================================
    story.append(Spacer(1, 40))
    story.append(Paragraph("WEEK 10 FINAL SUBMISSION", section_badge_style))
    story.append(Paragraph(f"<b><font size=28 color='{PRIMARY_HEX}'>{PROJECT_TITLE}</font></b>", title_style))
    story.append(Paragraph(f"<b><font size=14 color='{TEXT_MUTED}'>{SUBTITLE}</font></b>", body_style))
    story.append(Spacer(1, 20))

    # Meta Table Card
    meta_data = [
        [Paragraph("<b>Intern Name:</b>", body_style), Paragraph(INTERN_NAME, body_style),
         Paragraph("<b>Intern ID:</b>", body_style), Paragraph(f"<font color='{PRIMARY_HEX}'><b>{INTERN_ID}</b></font>", body_style)],
        [Paragraph("<b>University:</b>", body_style), Paragraph(UNIVERSITY, body_style),
         Paragraph("<b>Track:</b>", body_style), Paragraph("AI Full Stack Development", body_style)],
        [Paragraph("<b>Live Demo:</b>", body_style), Paragraph(f"<a href='{URL_FRONTEND}' color='{PRIMARY_HEX}'><u>{URL_FRONTEND}</u></a>", body_style),
         Paragraph("<b>Repository:</b>", body_style), Paragraph(f"<a href='{URL_GITHUB}' color='{PRIMARY_HEX}'><u>GitHub Code Link</u></a>", body_style)]
    ]
    t_meta = Table(meta_data, colWidths=[110, 310, 100, 310])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), COLOR_BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_meta)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 2: Problem Statement
    # =========================================================================
    story.append(Paragraph("PROBLEM STATEMENT", section_badge_style))
    story.append(Paragraph("What Problem Are We Solving?", title_style))
    
    col1 = [
        Paragraph("<b><font color='#B91C1C'>Key Challenges Faced by Job Seekers:</font></b>", body_style),
        Paragraph(bold_bullet_title("Application Disorganization", "Students apply to tens/hundreds of roles across LinkedIn, Unstop, and company portals without centralized tracking."), bullet_style),
        Paragraph(bold_bullet_title("Spreadsheet Friction", "Manual Excel sheets are tedious, lack real-time status visibility, and offer zero automated analytics."), bullet_style),
        Paragraph(bold_bullet_title("Generic Interview Prep", "Candidates enter interviews unprepared due to lack of role-specific & company-tailored practice questions."), bullet_style),
        Paragraph(bold_bullet_title("No Skill Gap Insights", "Applicants struggle to identify missing resume keywords before submitting applications."), bullet_style),
    ]

    col2 = [
        Paragraph(f"<b><font color='{PRIMARY_DARK}'>The CareerPilot AI Solution:</font></b>", body_style),
        Paragraph(bold_bullet_title("Centralized Kanban Tracker", "Visual board managing applications across Applied, Interviewing, Offer, and Rejected stages."), bullet_style),
        Paragraph(bold_bullet_title("Instant AI Prep Generator", "Google Gemini 1.5 Flash produces tailored interview questions & strategic tips instantly."), bullet_style),
        Paragraph(bold_bullet_title("Real-Time Placement Analytics", "Live dashboard computing total applications, active interview count, offer rates, and average resume match score."), bullet_style),
        Paragraph(bold_bullet_title("Seamless Auth & Cloud Storage", "Secure persistent data store with JWT and 1-click GitHub OAuth."), bullet_style),
    ]

    t_prob = Table([[col1, col2]], colWidths=[430, 430])
    t_prob.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BACKGROUND', (0,0), (0,0), colors.HexColor('#FEF2F2')),
        ('BACKGROUND', (1,0), (1,0), COLOR_BG_LIGHT),
        ('BOX', (0,0), (0,0), 1, colors.HexColor('#FCA5A5')),
        ('BOX', (1,0), (1,0), 1, COLOR_BORDER),
        ('PADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(t_prob)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 3: Tech Stack & Justification
    # =========================================================================
    story.append(Paragraph("ARCHITECTURE & TECH STACK", section_badge_style))
    story.append(Paragraph("Selected Technologies & Technical Rationale", title_style))

    tech_table_data = [
        [Paragraph("<b>Layer</b>", body_style), Paragraph("<b>Technology Selected</b>", body_style), Paragraph("<b>Rationale & Benefits</b>", body_style)],
        [
            Paragraph("<b>Frontend</b>", body_style),
            Paragraph("<b>React 19 + Vite<br/>Tailwind CSS</b>", body_style),
            Paragraph("• Lightning-fast HMR build times with Vite.<br/>• Component-driven UI modularity & dynamic Kanban state handling.<br/>• Modern, accessible dark/light theme styling using Tailwind.", bullet_style)
        ],
        [
            Paragraph("<b>Backend API</b>", body_style),
            Paragraph("<b>Node.js + Express.js</b>", body_style),
            Paragraph("• Asynchronous, non-blocking I/O ideal for RESTful API services.<br/>• Lightweight middleware architecture (CORS, Express Session, Rate Limiting).<br/>• Seamless native JSON data handling from frontend to database.", bullet_style)
        ],
        [
            Paragraph("<b>Database</b>", body_style),
            Paragraph("<b>MongoDB Atlas<br/>(Mongoose ODM)</b>", body_style),
            Paragraph("• Document-based schema handles optional fields (notes, scores) without NULL overhead.<br/>• Clean Mongoose schema validation & query builder API.<br/>• Cloud-hosted M0 cluster with zero downtime.", bullet_style)
        ],
        [
            Paragraph("<b>AI / Auth</b>", body_style),
            Paragraph("<b>Google Gemini API<br/>JWT + GitHub OAuth</b>", body_style),
            Paragraph("• <b>Gemini 1.5 Flash:</b> High throughput, strict JSON schema output for interview prep.<br/>• <b>JWT & OAuth:</b> Stateless session security with 1-click developer login.", bullet_style)
        ]
    ]

    t_tech = Table(tech_table_data, colWidths=[110, 200, 550])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('PADDING', (0,0), (-1,-1), 7),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    
    # Header row text color fix
    for i in range(3):
        tech_table_data[0][i].style.textColor = colors.white

    story.append(t_tech)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 4: Frontend UI Showcase
    # =========================================================================
    story.append(Paragraph("FRONTEND DELIVERABLES", section_badge_style))
    story.append(Paragraph("User Interface & Interactive Dashboard", title_style))

    fe_desc = Paragraph(f"<b>Live Web App URL:</b> <a href='{URL_FRONTEND}' color='{PRIMARY_HEX}'><u>{URL_FRONTEND}</u></a> — Fully responsive Kanban layout with search, dark mode, & real-time metric cards.", body_style)
    story.append(fe_desc)
    story.append(Spacer(1, 6))

    if os.path.exists(IMG_DASHBOARD) and os.path.exists(IMG_MODAL):
        img1 = Image(IMG_DASHBOARD, width=425, height=240)
        img2 = Image(IMG_MODAL, width=425, height=240)
        t_imgs = Table([[
            [img1, Paragraph("<b>Figure 1:</b> Application Dashboard & Analytics Cards", bullet_style)],
            [img2, Paragraph("<b>Figure 2:</b> Add Application Modal with Resume Scoring", bullet_style)]
        ]], colWidths=[435, 435])
        t_imgs.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ]))
        story.append(t_imgs)
    else:
        story.append(Paragraph("[Frontend Screenshots Embedded Here]", body_style))

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 5: Backend Architecture & Top 2 APIs
    # =========================================================================
    story.append(Paragraph("BACKEND API DESIGN", section_badge_style))
    story.append(Paragraph("Core REST API Endpoints & Verification", title_style))

    api1_box = [
        Paragraph("<b>1. Dashboard Analytics API</b>", ParagraphStyle('H1', parent=body_style, fontSize=12, textColor=COLOR_PRIMARY_DARK)),
        Paragraph("<b>Route:</b> <font color='#0D9488'><code>GET /api/applications/stats</code></font> | <b>Auth:</b> JWT Required", bullet_style),
        Paragraph("<b>Function:</b> Aggregates placement data in real-time across stored MongoDB applications.", bullet_style),
        Paragraph("<b>Output Schema:</b> Total applications, Interview count, Offers, Rejections, and overall Average Resume Match Score.", bullet_style),
    ]

    api2_box = [
        Paragraph("<b>2. AI Interview Prep API</b>", ParagraphStyle('H2', parent=body_style, fontSize=12, textColor=COLOR_PRIMARY_DARK)),
        Paragraph("<b>Route:</b> <font color='#0D9488'><code>POST /api/ai/prep</code></font> | <b>Auth:</b> JWT Required", bullet_style),
        Paragraph("<b>Payload:</b> <code>{ \"company\": \"Google\", \"role\": \"SWE Intern\" }</code>", bullet_style),
        Paragraph("<b>Function:</b> Invokes Gemini 1.5 Flash LLM, returns 3 company-tailored technical/behavioral questions + 1 strategic tip in strict JSON format.", bullet_style),
    ]

    t_apis = Table([[api1_box, api2_box]], colWidths=[430, 430])
    t_apis.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), COLOR_BG_LIGHT),
        ('BACKGROUND', (1,0), (1,0), COLOR_BG_LIGHT),
        ('BOX', (0,0), (0,0), 1, COLOR_BORDER),
        ('BOX', (1,0), (1,0), 1, COLOR_BORDER),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_apis)
    story.append(Spacer(1, 10))

    if os.path.exists(IMG_NETWORK):
        story.append(Paragraph("<b>API Testing & Execution Proof (Network & Postman Inspection):</b>", body_style))
        story.append(Spacer(1, 4))
        img_net = Image(IMG_NETWORK, width=550, height=155)
        story.append(img_net)

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 6: Database Selection & Schema Diagram
    # =========================================================================
    story.append(Paragraph("DATABASE DESIGN", section_badge_style))
    story.append(Paragraph("MongoDB Atlas Document Schema & Justification", title_style))

    db_reasons = [
        Paragraph("<b>Why MongoDB Atlas & Mongoose ODM?</b>", ParagraphStyle('DBH', parent=body_style, textColor=COLOR_PRIMARY_DARK)),
        Paragraph(bold_bullet_title("Document Model Flexibility", "Job records contain dynamic optional fields (e.g. notes, resume score, interview rounds) that fit naturally in BSON documents."), bullet_style),
        Paragraph(bold_bullet_title("Native JSON Data Pipeline", "Seamless end-to-end JSON pipeline from React components $\\rightarrow$ Express routes $\\rightarrow$ MongoDB Atlas collection."), bullet_style),
        Paragraph(bold_bullet_title("Mongoose ODM Integration", "Provides strict schema enforcement, automatic `createdAt`/`updatedAt` timestamps, and expressive helper queries."), bullet_style),
    ]

    if os.path.exists(IMG_SCHEMA):
        img_sch = Image(IMG_SCHEMA, width=380, height=270)
        t_db = Table([[db_reasons, img_sch]], colWidths=[460, 400])
    else:
        t_db = Table([[db_reasons, Paragraph("[Schema Diagram]", body_style)]], colWidths=[460, 400])

    t_db.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_db)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 7: AI Integration & Gemini Use Case
    # =========================================================================
    story.append(Paragraph("AI INTEGRATION", section_badge_style))
    story.append(Paragraph("Google Gemini 1.5 Flash LLM Implementation", title_style))

    col_ai1 = [
        Paragraph("<b>LLM & SDK Architecture</b>", ParagraphStyle('AI1', parent=body_style, textColor=COLOR_PRIMARY_DARK)),
        Paragraph(bold_bullet_title("Selected Model", "Google Gemini 1.5 Flash via official <code>@google/generative-ai</code> SDK."), bullet_style),
        Paragraph(bold_bullet_title("Primary Use Case", "Automated placement prep generation tailored to the candidate's target company and exact job title."), bullet_style),
        Paragraph(bold_bullet_title("Core Capability", "Extracts key responsibilities and outputs 3 highly probable technical/behavioral interview questions + 1 actionable strategy tip."), bullet_style),
    ]

    col_ai2 = [
        Paragraph("<b>Structured JSON Prompting Strategy</b>", ParagraphStyle('AI2', parent=body_style, textColor=COLOR_PRIMARY_DARK)),
        Paragraph(bold_bullet_title("System Prompt Directive", "\"You are an expert tech recruiter and career coach. Given company X and role Y, output exactly 3 interview questions and 1 tip.\""), bullet_style),
        Paragraph(bold_bullet_title("Strict Output Format", "Enforces raw JSON format without markdown ticks, preventing frontend parse failures."), bullet_style),
        Paragraph(bold_bullet_title("Resilience & Fallbacks", "Sanitizes response strings with regex pattern matching before serving payload to UI components."), bullet_style),
    ]

    t_ai = Table([[col_ai1, col_ai2]], colWidths=[430, 430])
    t_ai.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), COLOR_BG_LIGHT),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor('#F0FDFA')),
        ('BOX', (0,0), (0,0), 1, COLOR_BORDER),
        ('BOX', (1,0), (1,0), 1, colors.HexColor('#99F6E4')),
        ('PADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_ai)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 8: Deployment & Hosting Infrastructure
    # =========================================================================
    story.append(Paragraph("CLOUD INFRASTRUCTURE", section_badge_style))
    story.append(Paragraph("Production Hosting Services & Deployment Pipeline", title_style))

    host_data = [
        [Paragraph("<b>Component</b>", body_style), Paragraph("<b>Hosting Provider</b>", body_style), Paragraph("<b>Deployment Details & Capabilities</b>", body_style)],
        [
            Paragraph("<b>Frontend App</b>", body_style),
            Paragraph("<b>Vercel</b>", body_style),
            Paragraph("• Deployed from GitHub main branch with automatic CI/CD.<br/>• Global Edge Network distribution ensuring sub-second asset load times.<br/>• Custom environment variable injection (<code>VITE_API_URL</code>).", bullet_style)
        ],
        [
            Paragraph("<b>Backend API</b>", body_style),
            Paragraph("<b>Render</b>", body_style),
            Paragraph("• Node.js web service running with production <code>npm start</code> process.<br/>• Automated HTTPS SSL termination & environment secrets manager.<br/>• Native CORS handling linked strictly to Vercel origin.", bullet_style)
        ],
        [
            Paragraph("<b>Database</b>", body_style),
            Paragraph("<b>MongoDB Atlas</b>", body_style),
            Paragraph("• Multi-region cloud cluster (M0 Free Tier).<br/>• IP Access Whitelisting (<code>0.0.0.0/0</code> for cloud instance access).<br/>• Automated data persistence & connection pool management.", bullet_style)
        ]
    ]

    t_host = Table(host_data, colWidths=[130, 180, 550])
    t_host.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_PRIMARY_DARK),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    
    for i in range(3):
        host_data[0][i].style.textColor = colors.white

    story.append(t_host)
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 9: Public Access & Live URLs
    # =========================================================================
    story.append(Paragraph("PUBLIC DELIVERABLES", section_badge_style))
    story.append(Paragraph("Live Production Links & Verification", title_style))

    url_table_data = [
        [Paragraph("<b>Resource</b>", body_style), Paragraph("<b>Public Access URL</b>", body_style), Paragraph("<b>Status & Access</b>", body_style)],
        [
            Paragraph("<b>Frontend Web Application</b>", body_style),
            Paragraph(f"<a href='{URL_FRONTEND}' color='{PRIMARY_HEX}'><b><u>{URL_FRONTEND}</u></b></a>", body_style),
            Paragraph("<font color='#16A34A'><b>● Publicly Accessible (Vercel)</b></font>", body_style)
        ],
        [
            Paragraph("<b>Backend REST API</b>", body_style),
            Paragraph(f"<a href='{URL_BACKEND}' color='{PRIMARY_HEX}'><b><u>{URL_BACKEND}</u></b></a>", body_style),
            Paragraph("<font color='#16A34A'><b>● Publicly Accessible (Render)</b></font>", body_style)
        ],
        [
            Paragraph("<b>GitHub Source Repository</b>", body_style),
            Paragraph(f"<a href='{URL_GITHUB}' color='{PRIMARY_HEX}'><b><u>{URL_GITHUB}</u></b></a>", body_style),
            Paragraph("<font color='#16A34A'><b>● Public Open Source Code</b></font>", body_style)
        ]
    ]

    t_url = Table(url_table_data, colWidths=[200, 420, 240])
    t_url.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), COLOR_PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BOX', (0,0), (-1,-1), 1, COLOR_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, COLOR_BORDER),
        ('PADDING', (0,0), (-1,-1), 14),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    for i in range(3):
        url_table_data[0][i].style.textColor = colors.white

    story.append(t_url)
    story.append(Spacer(1, 20))
    story.append(Paragraph("<i>Note: Render backend service auto-spins down after 15 mins of idle time. First request may take 30-40 seconds to warm up.</i>", body_style))
    story.append(PageBreak())

    # =========================================================================
    # SLIDE 10: Internship Reflection & Experience
    # =========================================================================
    story.append(Paragraph("INTERNSHIP REFLECTION", section_badge_style))
    story.append(Paragraph("Key Learnings & Overall Experience", title_style))

    ref_col1 = [
        Paragraph("<b>Technical & Professional Growth</b>", ParagraphStyle('R1', parent=body_style, textColor=COLOR_PRIMARY_DARK)),
        Paragraph(bold_bullet_title("Full-Stack Mastery", "Built end-to-end mastery combining React 19, Express.js REST APIs, and MongoDB cloud storage."), bullet_style),
        Paragraph(bold_bullet_title("Applied AI Skills", "Learned practical LLM integration techniques including prompt engineering, structured JSON responses, and API error resilience."), bullet_style),
        Paragraph(bold_bullet_title("DevOps & Deployment", "Gained real-world experience configuring production environment variables, CORS policies, Vercel deployments, and Render web services."), bullet_style),
    ]

    ref_col2 = [
        Paragraph("<b>Internship Experience & Impact</b>", ParagraphStyle('R2', parent=body_style, textColor=COLOR_PRIMARY_DARK)),
        Paragraph(bold_bullet_title("Structured Progression", "Weekly module deliverables provided clear development goals from initial UI wireframing to production deployment."), bullet_style),
        Paragraph(bold_bullet_title("Problem-Solving Mindset", "Overcame real deployment challenges such as database connection string handling and OAuth callback configurations."), bullet_style),
        Paragraph(bold_bullet_title("Industry Preparedness", "Developed a complete, production-ready portfolio project showcasing modern web and AI engineering skills."), bullet_style),
    ]

    t_ref = Table([[ref_col1, ref_col2]], colWidths=[430, 430])
    t_ref.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), COLOR_BG_LIGHT),
        ('BACKGROUND', (1,0), (1,0), COLOR_BG_LIGHT),
        ('BOX', (0,0), (0,0), 1, COLOR_BORDER),
        ('BOX', (1,0), (1,0), 1, COLOR_BORDER),
        ('PADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_ref)

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] Generated PDF Presentation: {filename}")


# -----------------------------------------------------------------------------
# BUILD PPTX PRESENTATION (PYTHON-PPTX)
# -----------------------------------------------------------------------------
def build_pptx_presentation(filename):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Helper colors
    C_PRIMARY = RGBColor(79, 70, 229)
    C_PRIMARY_DARK = RGBColor(55, 48, 163)
    C_DARK = RGBColor(30, 41, 59)
    C_MUTED = RGBColor(100, 116, 139)
    C_BG = RGBColor(248, 250, 252)

    def add_header(slide, title_text, category_text="WEEK 10 SUBMISSION"):
        # Header strip
        top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.15))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = C_PRIMARY
        top_bar.line.color.rgb = C_PRIMARY

        # Category Badge
        tx_box = slide.shapes.add_textbox(Inches(0.6), Inches(0.4), Inches(10), Inches(0.4))
        tf = tx_box.text_frame
        tf.word_wrap = True
        p0 = tf.paragraphs[0]
        p0.text = category_text.upper()
        p0.font.bold = True
        p0.font.size = Pt(11)
        p0.font.color.rgb = C_PRIMARY

        # Title
        p1 = tf.add_paragraph()
        p1.text = title_text
        p1.font.bold = True
        p1.font.size = Pt(22)
        p1.font.color.rgb = C_PRIMARY_DARK

        # Footer
        footer_box = slide.shapes.add_textbox(Inches(0.6), Inches(6.9), Inches(12.133), Inches(0.4))
        ftf = footer_box.text_frame
        fp = ftf.paragraphs[0]
        fp.text = f"{PROJECT_TITLE} | Intern ID: {INTERN_ID} | {INTERN_NAME} | {UNIVERSITY}"
        fp.font.size = Pt(10)
        fp.font.color.rgb = C_MUTED

    # ---------------------------------------------------------
    # SLIDE 1: Title
    # ---------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    # Side bar
    sb = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(0.3), Inches(7.5))
    sb.fill.solid()
    sb.fill.fore_color.rgb = C_PRIMARY
    sb.line.color.rgb = C_PRIMARY

    tb1 = s1.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.5), Inches(4.5))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    
    p = tf1.paragraphs[0]
    p.text = "WEEK 10 FINAL DELIVERABLE PRESENTATION"
    p.font.bold = True
    p.font.size = Pt(14)
    p.font.color.rgb = C_PRIMARY

    p = tf1.add_paragraph()
    p.text = PROJECT_TITLE
    p.font.bold = True
    p.font.size = Pt(40)
    p.font.color.rgb = C_PRIMARY_DARK

    p = tf1.add_paragraph()
    p.text = SUBTITLE
    p.font.size = Pt(18)
    p.font.color.rgb = C_MUTED
    p.space_after = Pt(24)

    p = tf1.add_paragraph()
    p.text = f"Intern Name: {INTERN_NAME}\nIntern ID: {INTERN_ID}\nUniversity: {UNIVERSITY}\nLive App: {URL_FRONTEND}"
    p.font.size = Pt(14)
    p.font.color.rgb = C_DARK

    # ---------------------------------------------------------
    # SLIDE 2: Problem Statement
    # ---------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "What Problem Are We Solving?")
    
    tb2 = s2.shapes.add_textbox(Inches(0.6), Inches(1.5), Inches(12.133), Inches(5.0))
    tf2 = tb2.text_frame
    tf2.word_wrap = True

    p = tf2.paragraphs[0]
    p.text = "Problem Statement & Challenges Faced by Freshers:"
    p.font.bold = True
    p.font.size = Pt(16)
    p.font.color.rgb = C_PRIMARY_DARK

    points_prob = [
        ("Application Disorganization", "Students apply across multiple job portals (LinkedIn, Unstop) with no centralized tracking system."),
        ("Spreadsheet Friction", "Manual Excel sheets are slow, hard to maintain on mobile, and offer no real-time metrics."),
        ("Generic Interview Preparation", "Applicants face interviews unprepared due to lack of company and role-tailored questions."),
        ("The Solution (CareerPilot AI)", "A centralized Kanban dashboard with real-time analytics and instant AI prep generation powered by Google Gemini.")
    ]
    for title, desc in points_prob:
        p = tf2.add_paragraph()
        p.text = f"• {title}: {desc}"
        p.font.size = Pt(14)
        p.font.color.rgb = C_DARK
        p.space_after = Pt(10)

    # ---------------------------------------------------------
    # SLIDE 3: Tech Stack
    # ---------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "Selected Tech Stack & Technical Rationale")
    
    tb3 = s3.shapes.add_textbox(Inches(0.6), Inches(1.5), Inches(12.133), Inches(5.0))
    tf3 = tb3.text_frame
    tf3.word_wrap = True

    tech_points = [
        ("Frontend: React 19 + Vite + Tailwind CSS", "Fast component rendering, Vite HMR, and responsive dark/light mode UI components."),
        ("Backend: Node.js + Express.js", "Asynchronous non-blocking I/O ideal for RESTful JSON APIs and middleware integration."),
        ("Database: MongoDB Atlas (Mongoose ODM)", "Flexible document model handling optional fields (notes, scores) seamlessly with cloud reliability."),
        ("AI Feature: Google Gemini 1.5 Flash", "High throughput, structured JSON schema prompting for rapid interview question generation."),
        ("Auth & Security: JWT + GitHub OAuth", "Stateless session authentication with 1-click developer login integration.")
    ]
    for title, desc in tech_points:
        p = tf3.add_paragraph()
        p.text = f"• {title}: {desc}"
        p.font.size = Pt(14)
        p.font.color.rgb = C_DARK
        p.space_after = Pt(10)

    # ---------------------------------------------------------
    # SLIDE 4: Frontend Screenshots
    # ---------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "Frontend Interface & Live Demonstration")

    tb4 = s4.shapes.add_textbox(Inches(0.6), Inches(1.3), Inches(12.133), Inches(0.5))
    tf4 = tb4.text_frame
    p = tf4.paragraphs[0]
    p.text = f"Live App URL: {URL_FRONTEND}"
    p.font.bold = True
    p.font.size = Pt(14)
    p.font.color.rgb = C_PRIMARY

    if os.path.exists(IMG_DASHBOARD):
        s4.shapes.add_picture(IMG_DASHBOARD, Inches(0.6), Inches(2.0), width=Inches(5.8))
    if os.path.exists(IMG_MODAL):
        s4.shapes.add_picture(IMG_MODAL, Inches(6.8), Inches(2.0), width=Inches(5.8))

    # ---------------------------------------------------------
    # SLIDE 5: Backend APIs
    # ---------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "Backend Architecture: Top 2 APIs")

    tb5 = s5.shapes.add_textbox(Inches(0.6), Inches(1.5), Inches(12.133), Inches(5.0))
    tf5 = tb5.text_frame
    tf5.word_wrap = True

    api_points = [
        ("1. GET /api/applications/stats (Dashboard Analytics)", "Calculates real-time application metrics including total count, interviews scheduled, offers received, and average resume match score."),
        ("2. POST /api/ai/prep (AI Interview Prep Generator)", "Accepts company and role details, sends structured prompts to Gemini 1.5 Flash, and returns 3 tailored interview questions + 1 strategy tip in JSON format.")
    ]
    for title, desc in api_points:
        p = tf5.add_paragraph()
        p.text = f"• {title}: {desc}"
        p.font.size = Pt(14)
        p.font.color.rgb = C_DARK
        p.space_after = Pt(12)

    if os.path.exists(IMG_NETWORK):
        s5.shapes.add_picture(IMG_NETWORK, Inches(0.6), Inches(4.2), width=Inches(8.5))

    # ---------------------------------------------------------
    # SLIDE 6: Database & Schema
    # ---------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "Database Selected & Schema Design")

    tb6 = s6.shapes.add_textbox(Inches(0.6), Inches(1.5), Inches(6.0), Inches(5.0))
    tf6 = tb6.text_frame
    tf6.word_wrap = True

    db_p = [
        ("Database Choice", "MongoDB Atlas (M0 Free Tier) with Mongoose ODM."),
        ("Selection Reasons", "Document flexibility for optional fields (notes, scores), JSON-native data flow, and cloud accessibility."),
        ("Primary Collection", "Application Schema storing company, role, location, status, appliedDate, notes, resumeScore, and timestamps.")
    ]
    for title, desc in db_p:
        p = tf6.add_paragraph()
        p.text = f"• {title}: {desc}"
        p.font.size = Pt(13)
        p.font.color.rgb = C_DARK
        p.space_after = Pt(8)

    if os.path.exists(IMG_SCHEMA):
        s6.shapes.add_picture(IMG_SCHEMA, Inches(6.8), Inches(1.6), width=Inches(5.8))

    # ---------------------------------------------------------
    # SLIDE 7: AI Feature & LLM
    # ---------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "AI Feature & LLM Implementation")

    tb7 = s7.shapes.add_textbox(Inches(0.6), Inches(1.5), Inches(12.133), Inches(5.0))
    tf7 = tb7.text_frame
    tf7.word_wrap = True

    ai_p = [
        ("LLM Model Used", "Google Gemini 1.5 Flash (via @google/generative-ai SDK)."),
        ("Use Case", "Automated candidate interview preparation and personalized placement coaching."),
        ("Prompting Strategy", "Instructs Gemini to return strict JSON schema containing exactly 3 role-specific interview questions and 1 actionable standing-out tip."),
        ("Frontend Integration", "Rendered dynamically inside the application detail views for seamless user experience.")
    ]
    for title, desc in ai_p:
        p = tf7.add_paragraph()
        p.text = f"• {title}: {desc}"
        p.font.size = Pt(14)
        p.font.color.rgb = C_DARK
        p.space_after = Pt(12)

    # ---------------------------------------------------------
    # SLIDE 8: Hosting Services
    # ---------------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "Hosting & Cloud Deployment Services")

    tb8 = s8.shapes.add_textbox(Inches(0.6), Inches(1.5), Inches(12.133), Inches(5.0))
    tf8 = tb8.text_frame
    tf8.word_wrap = True

    host_p = [
        ("Frontend Hosting (Vercel)", "Automated CI/CD git integration, global CDN distribution, edge environment variable management."),
        ("Backend Hosting (Render)", "Node.js Express application host with HTTPS SSL termination and CORS security policy management."),
        ("Database Hosting (MongoDB Atlas)", "Cloud-hosted M0 cluster with IP access controls and automated indexing.")
    ]
    for title, desc in host_p:
        p = tf8.add_paragraph()
        p.text = f"• {title}: {desc}"
        p.font.size = Pt(14)
        p.font.color.rgb = C_DARK
        p.space_after = Pt(12)

    # ---------------------------------------------------------
    # SLIDE 9: Live URLs
    # ---------------------------------------------------------
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "All Live Public URLs")

    tb9 = s9.shapes.add_textbox(Inches(0.6), Inches(1.8), Inches(12.133), Inches(4.5))
    tf9 = tb9.text_frame
    tf9.word_wrap = True

    urls_p = [
        ("Live Frontend Web App", URL_FRONTEND),
        ("Live Backend REST API", URL_BACKEND),
        ("GitHub Source Code Repository", URL_GITHUB)
    ]
    for title, link in urls_p:
        p = tf9.add_paragraph()
        p.text = f"• {title}:\n  {link}"
        p.font.bold = True
        p.font.size = Pt(16)
        p.font.color.rgb = C_PRIMARY_DARK
        p.space_after = Pt(16)

    # ---------------------------------------------------------
    # SLIDE 10: Internship Reflection
    # ---------------------------------------------------------
    s10 = prs.slides.add_slide(blank_layout)
    add_header(s10, "Internship Reflection & Key Learnings")

    tb10 = s10.shapes.add_textbox(Inches(0.6), Inches(1.5), Inches(12.133), Inches(5.0))
    tf10 = tb10.text_frame
    tf10.word_wrap = True

    ref_p = [
        ("Key Learnings", "Mastered full-stack engineering with React and Express, integrated production AI LLM APIs with structured output parsing, and gained hands-on cloud deployment experience."),
        ("Experience", "The weekly structured curriculum provided practical end-to-end development exposure, bridging academic concepts with production-ready software engineering standards.")
    ]
    for title, desc in ref_p:
        p = tf10.add_paragraph()
        p.text = f"• {title}: {desc}"
        p.font.size = Pt(14)
        p.font.color.rgb = C_DARK
        p.space_after = Pt(14)

    prs.save(filename)
    print(f"[SUCCESS] Generated PPTX Presentation: {filename}")


if __name__ == '__main__':
    pdf_out = f"W10_FinalPPT_{INTERN_ID}.pdf"
    pptx_out = f"W10_FinalPPT_{INTERN_ID}.pptx"
    
    build_pdf_presentation(pdf_out)
    build_pptx_presentation(pptx_out)
