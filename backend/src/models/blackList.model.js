const mongoose = require("mongoose")


const tokenBlackListSchema = new mongoose.Schema({
    token :{
        type: String,
        required :[true, "Token is required to Blacklist"],
        unique : [true, "Token is already Blacklisted"]
    },
}, {
    timestamps: true
})


tokenBlackListSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 3 });

const tokenBlacklistModel = mongoose.model("tokenBlacklist", tokenBlackListSchema)

module.exports = tokenBlacklistModel;