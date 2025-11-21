# Task Manager with Role-Based Access Control (RBAC)

A full-stack Task Management System built with the MERN stack fundamentals (Node.js/Express, React, and SQLite), featuring secure authentication and Role-Based Access Control (RBAC).

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Role-Based Access Control**: Admin and User roles with different permissions
- **Task Management**: Full CRUD operations for tasks
- **RBAC Logic**:
  - **Admin users** can view, edit, and delete all tasks
  - **Regular users** can only view, edit, and delete their own tasks
- **Pagination**: Efficient task listing with pagination support
- **Search & Filter**: Search tasks by title/description and filter by status
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Input Validation**: Backend validation using Joi

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

## 🛠️ Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory:
   ```bash
   cp .env.example .env
   ```
   
   Or manually create `.env` with:
   ```
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-to-a-very-long-random-string
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   
   The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## 📚 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |

### Task Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks` | Get all tasks (with pagination, search, filter) | Protected |
| GET | `/api/tasks/:id` | Get a single task | Protected |
| POST | `/api/tasks` | Create a new task | Protected |
| PUT | `/api/tasks/:id` | Update a task | Protected (own tasks or admin) |
| DELETE | `/api/tasks/:id` | Delete a task | Protected (own tasks or admin) |

### Query Parameters for GET `/api/tasks`

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (`pending`, `in-progress`, `completed`)
- `search` (optional): Search in title and description

### Health Check

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/health` | Server health check | Public |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. After successful login or registration, the token is stored in localStorage and automatically included in all API requests via the Authorization header:

```
Authorization: Bearer <token>
```

## 👤 User Roles

### Regular User (`user`)
- Can create tasks
- Can view, edit, and delete only their own tasks
- Default role for new registrations

### Admin (`admin`)
- Can view, edit, and delete all tasks
- Has full access to all task operations

## 🗄️ Database

The application uses SQLite with two main tables:

### Users Table
- `id`: Primary key
- `username`: Unique username
- `password`: Hashed password (bcrypt)
- `role`: User role (`user` or `admin`)
- `createdAt`: Timestamp

### Tasks Table
- `id`: Primary key
- `title`: Task title
- `description`: Task description
- `status`: Task status (`pending`, `in-progress`, `completed`)
- `createdBy`: Foreign key to users table
- `createdAt`: Timestamp

## 🔧 Making the First User an Admin

To test admin functionality, you can manually update the first registered user to admin role:

1. Open the SQLite database file: `backend/database.sqlite`
2. Run the following SQL command:
   ```sql
   UPDATE users SET role = 'admin' WHERE id = 1;
   ```

Alternatively, you can use a SQLite CLI:
```bash
cd backend
sqlite3 database.sqlite
UPDATE users SET role = 'admin' WHERE id = 1;
.quit
```

## 📁 Project Structure

```
task-manager-rbac/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── taskController.js  # Task CRUD operations
│   ├── middleware/
│   │   ├── auth.js            # JWT protection & admin check
│   │   └── admin.js           # Admin middleware (re-export)
│   ├── models/
│   │   └── index.js           # Database schema & initialization
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── tasks.js           # Task routes
│   ├── .env                   # Environment variables
│   ├── .env.example           # Environment variables template
│   ├── server.js              # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js         # Axios instance with interceptors
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── .gitignore
└── README.md
```

## 🎨 Technologies Used

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **SQLite3**: Database
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **Joi**: Input validation
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variables

### Frontend
- **React**: UI library
- **React Router**: Routing
- **Axios**: HTTP client
- **Tailwind CSS**: Styling
- **Vite**: Build tool

## 🚦 Running the Application

1. **Start the backend** (in one terminal):
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend** (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## 📝 Notes

- The database file (`database.sqlite`) is created automatically on first run
- JWT tokens expire after 7 days
- Passwords must be at least 6 characters long
- Usernames must be at least 3 characters long
- The first registered user should be manually set to admin for testing admin features

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Role-based access control
- Input validation on both frontend and backend
- SQL injection protection (parameterized queries)

## 📄 License

ISC

## 👨‍💻 Author

Task Management System with RBAC

---

**Happy Task Managing!** 🎉


