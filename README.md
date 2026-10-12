# Dynamic Form Builder & Response Management System

A full-stack web application that allows users to create dynamic forms, collect responses, manage submissions, and analyze form data without changing application code.

## 🚀 Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Access and refresh token support
- Password reset and password change
- Role-based access control (Admin and User)

### Dynamic Form Builder
- Create, update, view, and delete forms
- Enable or disable forms
- Add dynamic fields to forms
- Support for Text, Number, Email, Date, Dropdown, Checkbox, Radio, File Upload, and Rating fields
- Configure required fields and field options
- Conditional field visibility

### Response Management
- Public and authenticated form submissions
- Validate required fields
- View and manage form responses
- Search and filter responses
- Update responses
- View response history

### Dashboard & Analytics
- Dashboard with form and response statistics
- Form analytics and response summaries
- Activity logs for tracking user actions

### Export
- Export form responses to Excel
- Export form responses to PDF

## 🛠️ Tech Stack

**Backend**
- Python
- FastAPI
- SQLAlchemy
- Alembic
- Pydantic
- PostgreSQL
- JWT Authentication
- Celery and Redis

**Frontend**
- React
- TypeScript
- Vite
- Material UI (MUI)
- Axios
- React Router
- React Hook Form
- Chart.js

**Tools**
- Git and GitHub
- Docker

## 📁 Project Structure

```text
Dynamic_Form_Builder_Response_Management_System_Structure/
├── backend/
│   ├── alembic/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── tasks/
│   │   └── utils/
│   ├── tests/
│   ├── Dockerfile
│   ├── alembic.ini
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── theme/
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## ⚙️ Prerequisites

Install the following before running the project:

- Python 3.12 or a compatible Python version
- Node.js and npm
- PostgreSQL
- Redis (for background tasks)
- Git

## 🔧 Backend Setup

Open a terminal and navigate to the backend folder:

```bash
cd backend
```

Create and activate a virtual environment.

**Windows:**

```cmd
py -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file inside the `backend/` directory and configure your local database and authentication settings.

```env
DATABASE_URL=postgresql+psycopg2://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/dynamic
SECRET_KEY=replace_with_a_long_random_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

Create the PostgreSQL database named `dynamic` or update the database name in `DATABASE_URL` to match your configuration.

### Database Migration

Run the database migrations:

```bash
py -m alembic upgrade head
```

### Start the Backend

```bash
py -m uvicorn app.main:app --reload --port 8000
```

Backend API: http://127.0.0.1:8000

Interactive API documentation: http://127.0.0.1:8000/docs

## 🎨 Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal, usually:

http://localhost:5173

Make sure the frontend API base URL is configured to point to the running backend.

## 🧪 Testing

Run backend tests from the backend directory:

```bash
pytest
```

Ensure PostgreSQL and any required environment variables are configured before running the tests.

## 🔐 Security Notes

- Never commit `.env` files or real credentials to GitHub.
- Use a strong, randomly generated secret key outside development.
- Configure production database credentials and CORS settings before deployment.
- Do not use development credentials in production.

## 👨‍💻 Author

**Deepak K**

GitHub: [Deepak081504](https://github.com/Deepak081504)

## 📄 License

No license has been specified for this project yet.
