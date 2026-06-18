const mongoose  = require("mongoose");



function connectToDB(){
    return mongoose.connect(process.env.MONGO_URI)
    .then(async ()=>{
        console.log("Server is connected to DB");
        
        // 🟡 FIX: Ensure collections exist for transactions to work
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        
        if (!collectionNames.includes('ledgers')) await db.createCollection('ledgers');
        if (!collectionNames.includes('transactions')) await db.createCollection('transactions');
    })
    .catch(err=>{
        console.log("Error connecting to DB:", err.message);
        process.exit(1);
    })
}

module.exports = connectToDB;
