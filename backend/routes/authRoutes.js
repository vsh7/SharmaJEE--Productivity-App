const express = require("express");
const {signup,login} = require("../controllers/authController");
const { authRateLimiter } = require("../middleware/rateLimiter");
const router = express.Router();

// Apply rate limiting to auth endpoints to prevent brute force attacks
router.post("/signup", authRateLimiter, signup);
router.post("/login", authRateLimiter, login);

const protect = require("../middleware/authMiddleware");
router.get("/me", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

module.exports= router;
