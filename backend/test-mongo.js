require("dotenv").config();
const mongoose = require("mongoose");

async function testConnection() {
    console.log("Testing MongoDB connection...");
    console.log("Connection string:", process.env.MONGO_URI.replace(/:[^@]*@/, ':****@')); // Hide password

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("✅ MongoDB connected successfully!");

        // Test a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Available collections:", collections.map(c => c.name));

        await mongoose.connection.close();
        console.log("Connection closed.");
    } catch (error) {
        console.error("❌ MongoDB connection failed!");
        console.error("Error:", error.message);
        if (error.code) {
            console.error("Error code:", error.code);
        }
    }
    process.exit(0);
}

testConnection();