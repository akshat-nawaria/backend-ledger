const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const emailService = require("../services/email.service")
const accountModel = require("../models/account.model")
const mongoose = require("mongoose")

/**
 * - Create a new transaction
 * the 10 step transfer flow
 * 1. validate request
 * 2. validate idempotency key
 * 3. check account status
 * 4. derive sender balance from ledger
 * 5. create transaction (pending)
 * 6. create DEBIT ledger entry
 * 7. create CREDIT ledger entry
 * 8. mark transaction completed
 * 9. commit MongoDB session
 * 10. send email notification
 */

async function createTransaction(req,res){
    const {fromAccount, toAccount, amount, idempotencyKey} = req.body

    /**
     * 1. validate request
     */
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message : "fromAccount, toAccount, amount, idempotencyKey are required"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id : fromAccount
    })

    const toUserAccount = await accountModel.findOne({
        _id : toAccount
    })

    if(!fromAccount || !toAccount){
        return res.status(400).json({
            message : "Invalid fromAccount or toAccount"
        })
    }

    /**
     * 2. validate idempotency key
     */
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === "COMPLETED"){
            return res.status(200).json({
                message : "Transaction already processed",
                transaction : isTransactionAlreadyExists
            })
        }

        if(isTransactionAlreadyExists.status === "PENDING"){
            return res.status(200).json({
                message :"Transaction is still processing"
            })
        }

        if(isTransactionAlreadyExists.status === "FAILED"){
            return res.status(500).json({
                message :"Transaction processing failed, please retry"
            })
        }

        if(isTransactionAlreadyExists.status === "REVERSED"){
            return res.status(500).json({
                message :"Transaction was reversed, please retry"
            })
        }
    }


    /**
     * 3. Check account status
     */

    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.send(400).json({
            message : "Both fromAccount and toAccount must be active to process transaction"
        })
    }

    /**
     * 4. Derive sender balance from ledger
     */
    const balance = await fromUserAccount.getBalance()
    if(balance < amount){
        return res.send(400).json({
            message : `Insufficient balance. Current balance is ${balance}, Requested amount is ${amount}`
        })
    }


    /**
     * 5. create transaction (pending)
     */
    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    }, { session })

    const debitLedgerEntry = await ledgerModel.create({
        account : fromAccount,
        amount : amount,
        transaction : transaction._id,
        type : "DEBIT",

    }, { session })

    const creditLedgerEntry = await ledgerModel.create({
        account : toAccount,
        amount : amount,
        transaction : transaction._id,
        type : "CREDIT",
    }, {session})

    transaction.status = "COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    /**
     * 10. send email notification
     */
    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)

    return res.send(201).json({
        message : "Transaction Completed Successfully",
        transaction : transaction
    })
}

module.exports = {
    createTransaction
}