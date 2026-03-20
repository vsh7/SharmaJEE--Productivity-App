const express = require("express");
const {signup,login} = require("../controllers/authController");
const { authRateLimiter } = require("../middleware/rateLimiter");
const { signupValidation, loginValidation } = require("../middleware/validation");
const router = express.Router();

// Apply rate limiting to auth endpoints to prevent brute force attacks
router.post("/signup", authRateLimiter, signupValidation, signup);
router.post("/login", authRateLimiter, loginValidation, login);

const protect = require("../middleware/authMiddleware");
router.get("/me", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

module.exports= router;
