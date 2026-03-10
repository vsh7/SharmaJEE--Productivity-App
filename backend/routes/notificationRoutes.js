const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { registerToken } = require("../controllers/notificationController");

router.post("/register-token", protect, registerToken);

module.exports = router;
