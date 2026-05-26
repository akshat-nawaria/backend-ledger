const accountModel = require("../models/account.model");

async function createAccountController(req, res) {
    try {
        const user = req.user;

        // 1. Add a safety check to ensure the user exists
        if (!user || !user._id) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized: User information is missing." 
            });
        }

        // 2. Create the account
        const account = await accountModel.create({
            user: user._id
        });

        // 3. Send success response
        return res.status(201).json({
            success: true,
            account
        });

    } catch (error) {
        // Catch any other unexpected errors so the server doesn't crash
        console.error("Error creating account:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
}

module.exports = {
    createAccountController
};