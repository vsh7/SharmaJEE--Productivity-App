const mongoose = require("mongoose");

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // These options help with SSL/TLS issues
            tls: true,
            tlsAllowInvalidCertificates: false,
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        // Don't exit the process, just log the error
        // This allows the server to run without database for testing
        console.log("Server will run without database connection");
    }
}

module.exports = connectDB;