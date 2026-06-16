# Backend Ledger & Core Banking API

A robust Node.js and Express-based application that serves as a core banking/ledger system. This project implements advanced financial engineering concepts such as **Double-Entry Bookkeeping**, **ACID Transactions**, **Concurrency Locks**, and **Idempotency** to guarantee perfect data consistency and prevent common vulnerabilities like double-spending.

## Features

- **Double-Entry Bookkeeping:** Account balances are dynamically calculated `(Credits - Debits)` directly from an immutable ledger rather than being statically stored, eliminating data drift.
- **ACID Transactions:** Utilizes MongoDB Sessions to ensure fund transfers are executed as atomic, all-or-nothing operations.
- **Concurrency Control:** Implements pessimistic write locks (`findOneAndUpdate`) on user accounts to prevent race conditions during concurrent transaction processing.
- **Idempotency:** API requires an `idempotencyKey` to safely handle network retries, completely preventing duplicate fund transfers.
- **Immutable Audit Trail:** Strict Mongoose pre-hooks block any modifications or deletions to ledger entries.
- **Secure Authentication:** JWT-based authentication with a secure Token Blacklist mechanism backed by a MongoDB TTL index for session termination.
- **Email Notifications:** Automated transaction and registration emails using Nodemailer with OAuth2.

## Technology Stack

- **Runtime:** Node.js
- **Web Framework:** Express.js
- **Database:** MongoDB
- **ORM:** Mongoose
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Services:** Nodemailer (Gmail OAuth2)

## Installation & Setup

### Prerequisites
- Node.js installed
- A MongoDB cluster with **Replica Sets** enabled (Required for MongoDB ACID Transactions. MongoDB Atlas uses replica sets by default).

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd backend-ledger
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
EMAIL_USER=your_gmail_address
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
```

### 4. Start the server
```bash
npm run dev
```

## API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Authenticate and receive a JWT
- `POST /logout` - Invalidate the current session token

### Accounts (`/api/accounts`)
- `POST /` - Create a new account
- `GET /` - Retrieve all accounts for the logged-in user
- `GET /balance/:accountId` - Get the dynamically calculated real-time balance

### Transactions (`/api/transactions`)
- `POST /` - Initiate a secure fund transfer between two accounts.
  - *Requires Payload:* `{ fromAccount, toAccount, amount, idempotencyKey }`
- `POST /system/initial-funds` - System-level endpoint to seed an account with initial funds.

## Architecture & Transaction Flow

The transaction process follows a strict 10-step flow to ensure complete accuracy:
1. **Validate Input:** Ensure positive amounts and proper account ownership.
2. **Idempotency Check:** Verify the `idempotencyKey` to prevent duplicate processing.
3. **Account Status Check:** Ensure both accounts are active.
4. **Pre-Check Balance:** Fail fast if funds are insufficient.
5. **Initialize:** Create a PENDING transaction record.
6. **Start Session:** Begin a MongoDB ACID Transaction.
7. **Write Lock:** Acquire a lock on the sender's account to prevent concurrent spending.
8. **Ledger Entries:** Create immutable DEBIT and CREDIT entries.
9. **Commit:** Mark transaction as COMPLETED and commit the database session.
10. **Notify:** Send success email to the user.

## License
ISC
