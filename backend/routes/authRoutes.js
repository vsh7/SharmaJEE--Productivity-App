const express = require("express");
const {signup,login} = require("../controllers/authController");
const router = express.Router();
router.post("/signup",signup);
router.post("/login",login);
const protect = require("../middleware/authMiddleware");
router.get("/me", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

module.exports= router;
