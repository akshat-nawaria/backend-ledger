const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth.routes")
const cookieParser = require("cookie-parser");
const accountRouter = require("../src/routes/account.routes")
const transactionRouter = require("./routes/transaction.routes")
const app = express();

const clientOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({
    origin: clientOrigin,
    credentials: true
}));
app.use(express.json())
app.use(cookieParser());


/**
 * - user routes
 */

app.get("/", (req,res)=>{
    res.send("Ledger server is up and running")
})

app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/transactions", transactionRouter)

module.exports = app