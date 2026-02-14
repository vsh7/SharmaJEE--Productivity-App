require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();


app.use(express.json());


connectDB();

// it is to connect authentication roites
app.use("/auth", require("./routes/authRoutes"));


app.listen(3000, () => {
  console.log("Server running on port 3000");
});