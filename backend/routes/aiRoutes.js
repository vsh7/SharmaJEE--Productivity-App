const express = require("express");
const { generateAISuggestions, getQuickStats } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");
const { aiRateLimiter, generalApiLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get AI study suggestions (with strict rate limiting)
router.get("/suggestions", aiRateLimiter, generateAISuggestions);

// Get quick stats for dashboard widget (lighter rate limiting)
router.get("/stats", generalApiLimiter, getQuickStats);

module.exports = router;
