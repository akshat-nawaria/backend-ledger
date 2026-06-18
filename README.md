# 🏦 LedgerX — Financial Infrastructure & Core Banking

![LedgerX Banner](https://via.placeholder.com/1000x300/0b0f1a/ffffff?text=LedgerX+Financial+Infrastructure)

**LedgerX** is a highly robust, full-stack application that serves as a core banking and immutable ledger system. Engineered for absolute financial data integrity, it prevents race conditions, double-spending, and orphaned records using advanced computer science and database principles. 

The application is structured as a modern **Monorepo**, containing a secure Node.js backend API and a premium React/Vite frontend interface.

---

## ✨ Key Features & Architecture

### 🛡️ Backend & Core Banking Engine
The backend doesn't just store balances; it *calculates* them dynamically to prevent database drift.
- **Double-Entry Bookkeeping:** Account balances are not stored as static numbers. They are dynamically calculated `(Credits - Debits)` at runtime directly from an immutable ledger of transactions.
- **ACID Transactions:** Powered by MongoDB Sessions, fund transfers are executed as strict atomic operations. If a transfer fails mid-way (e.g., server crash), the entire database rolls back to prevent "lost money".
- **Pessimistic Concurrency Control:** Implements write locks (`findOneAndUpdate`) on user accounts during a transfer to completely eliminate race conditions and double-spending vulnerabilities.
- **Idempotency:** The API strictly requires an `idempotencyKey` for every transaction. If a network timeout causes the frontend to retry a request, the backend recognizes the key and safely ignores the duplicate request.
- **Immutable Audit Trail:** Mongoose pre-hooks strictly block any modifications (`updateOne`), replacements (`findOneAndReplace`), or deletions (`deleteOne`) to ledger entries. History cannot be rewritten.
- **Soft Deletion:** Accounts can be closed, but never deleted from the database. This preserves the mathematical integrity of historical transactions. An account can only be closed if its balance is exactly `₹0.00`.

### 💻 Premium Frontend Interface
A sleek, responsive, and highly interactive user interface designed to feel like a modern, enterprise-grade fintech platform.
- **Public & Private Zones:** The app utilizes CSS custom variables to split the aesthetic into two zones: a "Light/Aurora" zone for public marketing/auth pages, and a strict "Dark Mode" zone for private financial dashboards.
- **React Context Auth:** Global state management utilizing `AuthContext` to seamlessly protect private routes (`PrivateLayout`) and manage JWT tokens.
- **Axios Interceptors:** Automatic injection of Authorization headers and global error handling for network requests.

### 📧 Automated Notification System
A non-blocking background email service powered by `Nodemailer` and Gmail OAuth2/App Passwords. Users receive instant email receipts for:
1. **Registration:** Welcome emails upon creating an account.
2. **Opening Accounts:** Alerts when a new sub-ledger/account is opened.
3. **Fund Transfers:** Detailed receipts of completed or failed transactions.

---

## 🛠️ Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM, Axios, Lucide-React, Vanilla CSS3 |
| **Backend** | Node.js, Express.js, Cors, Cookie-Parser |
| **Database** | MongoDB (Replica Sets required), Mongoose ORM |
| **Security** | JSON Web Tokens (JWT), Bcrypt.js, TTL Indexes |
| **Services** | Nodemailer |

---

## 🚀 Installation & Local Setup

### Prerequisites
- Node.js installed (v16+)
- A MongoDB cluster with **Replica Sets** enabled (Required for MongoDB ACID Transactions. Note: *MongoDB Atlas free tier uses replica sets by default*).

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd backend-ledger
```

### 2. Backend Setup
Navigate into the backend directory and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key

# Email Configuration (Use Gmail App Passwords)
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_APP_PASSWORD=your_16_digit_app_password
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a **new terminal window**, navigate to the frontend directory, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start instantly at `http://localhost:5173`.

---

## 📖 API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /register` - Register a new user and trigger a welcome email.
- `POST /login` - Authenticate credentials and issue a JWT.
- `POST /logout` - Invalidate the current session using a MongoDB TTL Blacklist.

### Accounts (`/api/accounts`)
- `POST /` - Open a new financial account/ledger (triggers email).
- `GET /` - Retrieve all accounts belonging to the authenticated user.
- `GET /balance/:accountId` - Dynamically calculate and fetch the real-time balance.
- `DELETE /:accountId` - Soft delete (close) an account. *Fails if balance > 0.*

### Transactions (`/api/transactions`)
- `GET /` - Retrieve a full array of the user's immutable ledger entries (Credits/Debits).
- `POST /` - Initiate a secure fund transfer between two accounts.
  - *Requires Payload:* `{ fromAccount, toAccount, amount, idempotencyKey }`
- `POST /system/initial-funds` - System-level endpoint to seed an account with initial liquidity.

---

## 🔒 Security Flow: The Token Blacklist
When a user logs out, their JWT is stored in a `tokenBlackList` MongoDB collection. The `authMiddleware` intercepts all requests and verifies the token against this blacklist. To prevent the database from growing infinitely, the collection utilizes a **Time-To-Live (TTL) Index** (`expireAfterSeconds: 259200`) which automatically permanently deletes the token from the database after 3 days.

---
*Built with precision for the future of decentralized finance.*
