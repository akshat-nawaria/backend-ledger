const express = require("express");
const authController = require("../controllers/auth.controller")
const router = express.Router()

// POST /api/auth/register -> Register User
router.post("/register", authController.userRegisterController)

// POST /api/auth/login -> Login User
router.post("/login", authController.userLoginController)


module.exports = router