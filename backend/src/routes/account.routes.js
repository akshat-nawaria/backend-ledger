const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const accountController = require("../controllers/account.controller")

const router = express.Router()


/**
 * - POST /api/accounts/
 * - create a new account
 * - protected route
 */
router.post("/", authMiddleware.authMiddleware, accountController.createAccountController)

/**
 * - GET /api/accounts/
 * - get all accounts of the logged-in user
 * - protected route
 */
router.get("/", authMiddleware.authMiddleware, accountController.getUserAccountsController)

/**
 * - GET /api/accounts/balance/:accountId
 */
router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController)

/**
 * - DELETE /api/accounts/:accountId
 * - soft delete an account (set status to CLOSED)
 */
router.delete("/:accountId", authMiddleware.authMiddleware, accountController.deleteAccountController)

module.exports = router