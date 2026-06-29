# CareerPilot AI

CareerPilot AI is a full-stack web application that helps students and freshers track job and internship applications, analyze job descriptions, identify missing skills, and prepare smarter for placements.

## One-Line Description

An AI-assisted job application tracker and placement preparation platform for students and freshers.

## Tech Stack

- **Frontend:** React.js + Vite
- **Styling:** Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** In-memory (Week 4) → PostgreSQL (Week 5+)
- **API Testing:** Postman / Thunder Client
- **AI Feature:** Gemini API (planned)
- **Authentication:** JWT (planned)
- **Deployment:** Vercel + Render (planned)

## Features

- Job and internship application tracker (Kanban board)
- Create, Read, Update, Delete (CRUD) applications via REST API
- Search applications by company, role, or location
- Dashboard with live stats (total, interviewing, offers, avg resume score)
- Loading states and error notifications
- Dark mode support

---

## How to Run the Backend Locally

### Prerequisites
- Node.js v18+ installed
- npm installed

### Steps

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# (Edit .env if needed — default PORT is 5000)

# 4. Start the dev server (with hot reload via nodemon)
npm run dev

# OR start the production server
npm start
```

The backend will be available at: **http://localhost:5000**

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/applications` | List all applications |
| GET | `/api/applications/stats` | Dashboard stats |
| GET | `/api/applications/search?q=` | Search applications |
| GET | `/api/applications/:id` | Get single application |
| POST | `/api/applications` | Create new application |
| PUT | `/api/applications/:id` | Update application |
| PATCH | `/api/applications/:id` | Partially update application |
| DELETE | `/api/applications/:id` | Delete application |

---

## How to Run the Frontend Locally

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

> ⚠️ Make sure the backend is running on port 5000 before using the dashboard.
