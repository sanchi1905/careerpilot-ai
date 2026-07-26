import os
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'Week 7: AI Feature Demo', 0, 1, 'C')
        self.ln(10)

def create_pdf():
    pdf = PDF()
    
    # 1. User Input Screen
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '1. User input screen (AI Prep feature)', 0, 1)
    pdf.set_font('Arial', '', 10)
    pdf.multi_cell(0, 10, '[Placeholder for Dashboard UI Screenshot]\n(User sees their application dashboard and clicks the "Sparkles" button to request AI interview preparation for a specific role and company.)')
    
    # 2. Loading State
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '2. Loading state (mid-request)', 0, 1)
    pdf.set_font('Arial', '', 10)
    pdf.multi_cell(0, 10, '[Placeholder for Loading State Screenshot]\n(The AI modal opens and displays a loading spinner with the text "Generating personalized interview questions...". The UI is blocked until the Gemini API responds.)')

    # 3. AI Output Displayed
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '3. Final AI output displayed (with Network tab)', 0, 1)
    pdf.set_font('Arial', '', 10)
    pdf.multi_cell(0, 10, '[Placeholder for Final AI Output Screenshot]\n(The AI modal updates to show exactly 3 likely interview questions and 1 actionable Pro Tip. The browser DevTools Network tab is open, showing a successful POST request to /api/ai/prep with a 200 OK status.)')

    pdf.output('W7_AIFeatureDemo_TBI-26100454.pdf', 'F')

if __name__ == '__main__':
    create_pdf()
