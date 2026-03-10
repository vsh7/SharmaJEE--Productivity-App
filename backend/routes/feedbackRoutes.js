const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getMyFeedback } = require("../controllers/feedbackController");

router.get("/my-feedback", protect, getMyFeedback);

module.exports = router;
