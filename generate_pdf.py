import os
from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'Week 6: Auth Flow Screenshots', 0, 1, 'C')
        self.ln(10)

def create_pdf():
    pdf = PDF()
    
    # 1. Registration form and success response
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '1. Registration form and success response', 0, 1)
    pdf.set_font('Arial', '', 10)
    pdf.multi_cell(0, 10, '[Placeholder for Registration Screenshot]\n(The user registers with an email and password. The backend responds with 201 Created and saves the user in the database with a bcrypt hashed password.)')
    
    # 2. Login form and success (JWT returned in Network tab)
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '2. Login form and success (JWT returned in Network tab)', 0, 1)
    pdf.set_font('Arial', '', 10)
    if os.path.exists('network_tab.png'):
        pdf.image('network_tab.png', x=10, y=30, w=180)
    else:
        pdf.multi_cell(0, 10, '[Placeholder for Login/Network Tab Screenshot]\n(The user logs in, the backend validates credentials, and returns a signed JWT token visible in the DevTools Network tab response.)')

    # 3. Attempting to access a protected route without login
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '3. Attempting to access a protected route without login (redirected)', 0, 1)
    pdf.set_font('Arial', '', 10)
    pdf.multi_cell(0, 10, '[Placeholder for Redirect Screenshot]\n(User attempts to visit /dashboard or /showcase directly. The React router ProtectedRoute component detects no valid session/token and immediately redirects the user back to /login.)')
    
    # 4. Successful OAuth login flow
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '4. Successful OAuth login flow (Consent screen -> Logged in state)', 0, 1)
    pdf.set_font('Arial', '', 10)
    pdf.multi_cell(0, 10, '[Placeholder for OAuth Flow Screenshots]\n(User clicks "Sign in with GitHub/Google". Redirected to provider consent screen. After authorization, user is redirected to /auth/callback and then to /dashboard as a logged-in user.)')

    # 5. Rate limit error
    pdf.add_page()
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, '5. Rate limit error when hitting login repeatedly (429 response)', 0, 1)
    pdf.set_font('Arial', '', 10)
    pdf.multi_cell(0, 10, '[Placeholder for Rate Limit 429 Screenshot]\n(User attempts to log in more than 5 times in 15 minutes. The express-rate-limit middleware intercepts the request and returns a 429 Too Many Requests response, preventing brute-force attacks.)')

    pdf.output('W6_AuthFlowScreenshots_TBI-26100454.pdf', 'F')

if __name__ == '__main__':
    create_pdf()
