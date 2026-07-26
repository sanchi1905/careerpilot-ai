import os
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'Week 8: Frontend Completion', 0, 1, 'C')
        self.ln(10)

def create_pdf():
    pdf = PDF()
    
    # 1. Authenticated dashboard
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '1. Authenticated dashboard', 0, 1)
    pdf.set_font('Arial', '', 10)
    pdf.multi_cell(0, 10, '[Placeholder for Dashboard UI Screenshot]\n(Logged-in user view with real data loaded from the backend API)')
    
    # 2. Create flow
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '2. Create flow', 0, 1)
    pdf.set_font('Arial', '', 10)
    pdf.multi_cell(0, 10, '[Placeholder for Create Flow Screenshot]\n(Form filled and submitted, new record visible in the list)')

    # 3. Update and Delete flow
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '3. Update and Delete flow', 0, 1)
    pdf.set_font('Arial', '', 10)
    pdf.multi_cell(0, 10, '[Placeholder for Update/Delete Flow Screenshot]\n(Record edited successfully, and then deleted from the dashboard)')

    # 4. AI feature UI
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '4. AI feature UI', 0, 1)
    pdf.set_font('Arial', '', 10)
    pdf.multi_cell(0, 10, '[Placeholder for AI Feature Screenshot]\n(Input entered, loading state shown, output displayed with generated questions and tips)')

    # 5. Responsive check
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '5. Responsive check', 0, 1)
    pdf.set_font('Arial', '', 10)
    pdf.multi_cell(0, 10, '[Placeholder for Responsive UI Screenshot]\n(One page at mobile 375px and desktop 1440px side by side showing no layout breaks)')

    # 6. Empty state
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '6. Empty state', 0, 1)
    pdf.set_font('Arial', '', 10)
    pdf.multi_cell(0, 10, '[Placeholder for Empty State Screenshot]\n(Component showing its empty-state design when no data is available)')

    # 7. Network Tab Verification
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '7. Network Tab Verification', 0, 1)
    pdf.set_font('Arial', '', 10)
    pdf.multi_cell(0, 10, '[Placeholder for Network Tab Screenshot]\n(Chrome DevTools Network tab showing at least 3 successful API calls (status 200) fired from the frontend, with URL and response size visible)')

    pdf.output('W8_FrontendCompletion_TBI-26100454.pdf', 'F')

if __name__ == '__main__':
    create_pdf()
