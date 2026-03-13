const express = require("express");
const { generateAISuggestions, getQuickStats } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get AI study suggestions
router.get("/suggestions", generateAISuggestions);

// Get quick stats for dashboard widget
router.get("/stats", getQuickStats);

module.exports = router;
