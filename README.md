# LedgerX — Financial Infrastructure & Core Banking

A robust full-stack application that serves as a core banking/ledger system. The backend implements advanced financial engineering concepts such as **Double-Entry Bookkeeping**, **ACID Transactions**, **Concurrency Locks**, and **Idempotency** to guarantee perfect data consistency. The frontend is a sleek, modern React application built with Vite, offering a premium user experience with public and private authentication zones.

## Features

### Backend Architecture
- **Double-Entry Bookkeeping:** Account balances are dynamically calculated `(Credits - Debits)` directly from an immutable ledger rather than being statically stored, eliminating data drift.
- **ACID Transactions:** Utilizes MongoDB Sessions to ensure fund transfers are executed as atomic, all-or-nothing operations.
- **Concurrency Control:** Implements pessimistic write locks (`findOneAndUpdate`) on user accounts to prevent race conditions during concurrent transaction processing.
- **Idempotency:** API requires an `idempotencyKey` to safely handle network retries, completely preventing duplicate fund transfers.
- **Immutable Audit Trail:** Strict Mongoose pre-hooks block any modifications or deletions to ledger entries.
- **Asynchronous Communications:** Non-blocking email services via Nodemailer for instant API responses.

### Frontend Experience
- **Modern Tech Stack:** React, Vite, React Router DOM, Axios.
- **Premium Design System:** Fully custom UI with public (light) and private (dark) zones, complete with CSS custom properties and micro-animations.
- **Secure Authentication:** Context-based auth state management with JWT request/response interceptors and secure logout capabilities.
- **Ledger Transparency:** Detailed, immutable transaction history tables showing real-time debits and credits.

## Technology Stack

- **Frontend:** React, Vite, CSS3, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Services:** Nodemailer (Gmail OAuth2/App Passwords)

## Installation & Setup

### Prerequisites
- Node.js installed
- A MongoDB cluster with **Replica Sets** enabled (Required for MongoDB ACID Transactions. MongoDB Atlas uses replica sets by default).

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd backend-ledger
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
EMAIL_USER=your_gmail_address
EMAIL_APP_PASSWORD=your_gmail_app_password
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:5173`.

## API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Authenticate and receive a JWT
- `POST /logout` - Invalidate the current session token

### Accounts (`/api/accounts`)
- `POST /` - Create a new account
- `GET /` - Retrieve all accounts for the logged-in user
- `GET /balance/:accountId` - Get the dynamically calculated real-time balance
- `DELETE /:accountId` - Soft delete (close) an account with zero balance

### Transactions (`/api/transactions`)
- `GET /` - Retrieve all immutable ledger entries for the user
- `POST /` - Initiate a secure fund transfer between two accounts
- `POST /system/initial-funds` - System-level endpoint to seed an account with initial funds

## License
ISC
