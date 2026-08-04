"""
Week 9 — Deployment Proof PDF Generator
========================================
Run this script AFTER deploying to Vercel + Render and taking screenshots.

Steps:
1. Take the 4 screenshots listed below and save them in the same folder as this script.
2. Run: python generate_w9_pdf.py
3. The file W9_DeploymentProof_TBI-26100454.pdf will be created.

Required screenshots (save with these exact filenames, or update the paths below):
  - w9_vercel_dashboard.png     (Vercel dashboard showing successful frontend deploy)
  - w9_render_dashboard.png     (Render dashboard showing successful backend deploy)
  - w9_live_home.png            (Live app home page with URL visible in browser)
  - w9_live_ai_feature.png      (Live app AI feature or login flow working)
"""

import os
from fpdf import FPDF

INTERN_ID   = 'TBI-26100454'
OUTPUT_FILE = f'W9_DeploymentProof_{INTERN_ID}.pdf'

# Paths to your screenshot files (update filenames if needed)
SCREENSHOTS = [
    {
        'title': '1. Vercel Dashboard — Successful Frontend Deployment',
        'desc':  'Vercel project dashboard showing the latest deployment as "Ready" with the assigned .vercel.app URL visible.',
        'file':  'w9_vercel_dashboard.png',
    },
    {
        'title': '2. Render Dashboard — Successful Backend Deployment',
        'desc':  'Render service dashboard showing the backend web service as "Live" with the .onrender.com URL visible.',
        'file':  'w9_render_dashboard.png',
    },
    {
        'title': '3. Live App Home Page',
        'desc':  'Browser screenshot of the live CareerPilot app home page. The production URL (e.g., careerpilot-ai.vercel.app) is clearly visible in the address bar.',
        'file':  'w9_live_home.png',
    },
    {
        'title': '4. Live App — AI Feature / Login Flow',
        'desc':  'Browser screenshot showing the AI feature (interview prep / job description analysis) working on the live production URL, or the login flow completing successfully.',
        'file':  'w9_live_ai_feature.png',
    },
]


class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 14)
        self.cell(0, 10, 'Week 9: App Deployment & Go-Live', border=0, ln=1, align='C')
        self.set_font('Arial', '', 10)
        self.cell(0, 6, f'CareerPilot AI  |  Intern ID: {INTERN_ID}', border=0, ln=1, align='C')
        self.ln(6)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')


def add_screenshot_page(pdf: PDF, section: dict):
    pdf.add_page()
    # Section title
    pdf.set_font('Arial', 'B', 12)
    pdf.multi_cell(0, 8, section['title'])
    pdf.set_font('Arial', '', 10)
    pdf.multi_cell(0, 6, section['desc'])
    pdf.ln(4)

    img_path = section['file']
    if os.path.exists(img_path):
        # Try to fit image to page width (leaving 20mm margins)
        try:
            pdf.image(img_path, x=10, w=190)
        except Exception as e:
            pdf.set_font('Arial', 'I', 10)
            pdf.multi_cell(0, 6, f'[Could not embed image: {e}]')
    else:
        pdf.set_font('Arial', 'I', 10)
        pdf.set_text_color(180, 0, 0)
        pdf.multi_cell(
            0, 6,
            f'[Screenshot not found: {img_path}]\n'
            f'Please save your screenshot as "{img_path}" in the same folder as this script, '
            f'then re-run this script.'
        )
        pdf.set_text_color(0, 0, 0)


def create_pdf():
    pdf = PDF()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Cover / summary page
    pdf.add_page()
    pdf.set_font('Arial', 'B', 13)
    pdf.cell(0, 10, 'Deployment Summary', ln=1)
    pdf.set_font('Arial', '', 10)
    summary = (
        'CareerPilot AI has been fully deployed to production.\n\n'
        'Frontend:  Vercel  (React 19 + Vite + Tailwind CSS)\n'
        'Backend:   Render  (Node.js + Express.js)\n'
        'Database:  MongoDB Atlas M0 (Mongoose ODM)\n'
        'Auth:      JWT + GitHub OAuth (Passport.js)\n'
        'AI:        Google Gemini API\n\n'
        'Live Frontend URL:  https://careerpilot-ai.vercel.app\n'
        '(Update with your actual Vercel URL before submission)\n\n'
        'Live Backend URL:   https://careerpilot-ai-api.onrender.com\n'
        '(Update with your actual Render URL before submission)\n\n'
        'Known Limitations:\n'
        '  - Render free tier spins down after 15 min of inactivity.\n'
        '    First request after idle takes 30-60 s to wake up.\n'
        '  - MongoDB Atlas M0: 512 MB storage cap (sufficient for demo).\n'
    )
    pdf.multi_cell(0, 7, summary)

    # 4 screenshot pages
    for section in SCREENSHOTS:
        add_screenshot_page(pdf, section)

    pdf.output(OUTPUT_FILE, 'F')
    print(f'\n✅  PDF created: {OUTPUT_FILE}')

    missing = [s['file'] for s in SCREENSHOTS if not os.path.exists(s['file'])]
    if missing:
        print('\n⚠️  The following screenshots are missing — add them and re-run:')
        for f in missing:
            print(f'    {f}')
    else:
        print('All screenshots embedded successfully.')


if __name__ == '__main__':
    create_pdf()
