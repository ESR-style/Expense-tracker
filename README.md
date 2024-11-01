# SpendSage - Personal Expense Tracker

A full-stack web application for tracking personal expenses with detailed analytics and visualization.

## Features

- 🔐 User authentication with JWT
- 💰 Track daily and monthly expenses
- 📊 Visual analytics with charts
- 📱 Responsive design for mobile and desktop
- 🔍 Filter transactions by date
- 📋 CRUD operations for expenses
- 📈 Expense trends visualization
- 🔄 Real-time updates

## Tech Stack

### Frontend
- React.js
- TailwindCSS
- Recharts for data visualization
- React Router for navigation

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT for authentication
- bcrypt for password hashing

## Installation

1. Clone the repository
```bash
git clone https://github.com/ESR-style/Expense-tracker.git
```
    
2. Install dependencies for frontend
```
npm install
```

3. Install dependencies for backend
```
cd backend
npm install
```

4. Set up PostgreSQL database
```
CREATE DATABASE expense_tracker;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    type VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

5. Create .env file in backend directory

DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=expense_tracker
JWT_SECRET=your_jwt_secret

## Usage  

1. Start the backend server
```
cd backend
node server.js
```

2. Start the frontend application
```
npm run dev
```

## API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | Login user |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Get all expenses |
| POST | `/api/expenses` | Create new expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |