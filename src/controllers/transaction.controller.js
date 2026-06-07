const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const accountModel = require("../models/account.model")
const emailService = require("../services/email.service")
const userModel = require("../models/user.model") // Required to find the SYSTEM BANK user
const mongoose = require("mongoose")

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
 * 1. Validate request
 * 2. Validate idempotency key
 * 3. Check account status
 * 4. Derive sender balance from ledger
 * 5. Create transaction (PENDING)
 * 6. Create DEBIT ledger entry
 * 7. Create CREDIT ledger entry
 * 8. Mark transaction COMPLETED
 * 9. Commit MongoDB session
 * 10. Send email notification
 */
async function createTransaction(req, res) {

    /**
     * 1. Validate request
     */
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body

    // 🔴 FIX 1: Prevent negative amounts and zero
    if (amount <= 0) return res.status(400).json({ message: "Amount must be greater than 0" });

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "FromAccount, toAccount, amount and idempotencyKey are required"
        })
    }

    // SECURITY FIX: Ensure the fromAccount belongs to the logged-in user
    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
        user: req.user._id 
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    if (!fromUserAccount) {
        return res.status(403).json({
            message: "Forbidden: You do not own this account or it does not exist"
        })
    }

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid toAccount"
        })
    }

    /**
     * 2. Validate idempotency key
     */
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            })
        }
        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({
                message: "Transaction is still processing",
            })
        }
        if (isTransactionAlreadyExists.status === "FAILED" || isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(409).json({
                message: `Transaction ${isTransactionAlreadyExists.status.toLowerCase()}. Please retry with a NEW idempotency key.`
            })
        }
    }

    /**
     * 3. Check account status
     */
    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both fromAccount and toAccount must be ACTIVE to process transaction"
        })
    }

    /**
     * 4. Fast Pre-Check Balance (Optimization)
     */
    const initialBalance = await fromUserAccount.getBalance()

    if (initialBalance < amount) {
        return res.status(400).json({
            message: `Insufficient balance. Current balance is ${initialBalance}. Requested amount is ${amount}`
        })
    }

    /**
     * 5. Create PENDING Transaction OUTSIDE the Session (🟡 FIX 5)
     */
    let transaction;
    try {
        transaction = await transactionModel.create({
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to initialize transaction" });
    }

    /**
     * 6. Start DB Session & Transaction
     */
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        // 🟠 FIX 3: Acquire a write lock on the fromAccount to prevent concurrent double spending.
        await accountModel.findOneAndUpdate(
            { _id: fromAccount },
            { $set: { updatedAt: new Date() } },
            { session, new: true }
        );
        
        // Calculate balance inside the try block AFTER acquiring the lock!
        // We must update getBalance to accept a session in the model.
        const balance = await fromUserAccount.getBalance(session);
        
        if (balance < amount) {
             await session.abortTransaction();
             session.endSession();
             
             // 🟡 FIX 5: Update the external transaction to FAILED
             await transactionModel.updateOne({ _id: transaction._id }, { status: "FAILED" });
             
             return res.status(400).json({
                 message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`
             });
        }

        const debitLedgerEntry = await ledgerModel.create([ {
            account: fromAccount,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        } ], { session })

        // Simulating processing delay
        await new Promise((resolve) => setTimeout(resolve, 15 * 100));

        const creditLedgerEntry = await ledgerModel.create([ {
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        } ], { session })

        await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            { session }
        )

        // 9. Commit MongoDB session
        await session.commitTransaction()
        session.endSession()

        // 10. Send email notification (Moved inside try block so it only sends on success)
        if (req.user && req.user.email) {
            await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)
        }

        // Fetch the updated transaction to return back to user
        transaction = await transactionModel.findById(transaction._id);

        return res.status(201).json({
            message: "Transaction completed successfully",
            transaction: transaction
        })

    } catch (error) {
        // CRITICAL FIX: Rollback database changes on failure
        await session.abortTransaction()
        session.endSession()
        
        console.error("Transaction Error:", error);

        // 🟡 FIX 5: Mark the transaction as FAILED so idempotency key is consumed.
        await transactionModel.updateOne({ _id: transaction._id }, { status: "FAILED" });

        return res.status(500).json({
            message: "Transaction failed due to an internal error, please retry",
        })
    }
}



/**
 * - Create Initial Funds Transaction
 */
async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body
    if (amount <= 0) return res.status(400).json({ message: "Amount must be greater than 0" });

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "toAccount, amount and idempotencyKey are required"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid toAccount"
        })
    }

    // FIX: Find the SYSTEM BANK user, not the currently logged in user
    const systemUser = await userModel.findOne({ systemUser: true });
    
    if (!systemUser) {
        return res.status(500).json({
            message: "System user not found in the database"
        })
    }

    // FIX: Find the account belonging to the SYSTEM BANK
    const fromUserAccount = await accountModel.findOne({
        user: systemUser._id
    })

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "System user account not found"
        })
    }

    // 🟡 FIX 5: Create PENDING Transaction OUTSIDE the Session
    let transaction;
    try {
        transaction = await transactionModel.create({
            fromAccount: fromUserAccount._id,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to initialize initial funds transaction" });
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const debitLedgerEntry = await ledgerModel.create([ {
            account: fromUserAccount._id,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        } ], { session })

        const creditLedgerEntry = await ledgerModel.create([ {
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        } ], { session })

        await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            { session }
        )

        await session.commitTransaction()
        session.endSession()

        // Fetch updated transaction
        transaction = await transactionModel.findById(transaction._id);

        return res.status(201).json({
            message: "Initial funds transaction completed successfully",
            transaction: transaction
        })
        
    } catch (error) {
        // CRITICAL FIX: Rollback database changes on failure
        await session.abortTransaction()
        session.endSession()
        
        console.error("Initial Funds Error:", error);

        // 🟡 FIX 5: Mark the transaction as FAILED so idempotency key is consumed.
        await transactionModel.updateOne({ _id: transaction._id }, { status: "FAILED" });

        return res.status(500).json({
            message: "Transaction failed due to an internal error."
        })
    }
}


module.exports = {
    createTransaction,
    createInitialFundsTransaction
}