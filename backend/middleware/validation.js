const { body, validationResult } = require("express-validator");

/**
 * Middleware to check validation results
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Validation rules for signup
 */
const signupValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("role")
    .optional()
    .isIn(["student", "mentor"])
    .withMessage("Role must be either 'student' or 'mentor'"),

  handleValidationErrors
];

/**
 * Validation rules for login
 */
const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  handleValidationErrors
];

/**
 * Validation rules for daily report submission
 */
const reportValidation = [
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),

  body("timeSlots")
    .optional()
    .isArray()
    .withMessage("timeSlots must be an array"),

  body("timeSlots.*.startTime")
    .trim()
    .notEmpty()
    .withMessage("Time slot start time is required"),

  body("timeSlots.*.endTime")
    .trim()
    .notEmpty()
    .withMessage("Time slot end time is required"),

  body("timeSlots.*.subject")
    .trim()
    .notEmpty()
    .withMessage("Time slot subject is required")
    .isIn(['physics', 'chemistry', 'math', 'biology'])
    .withMessage("Subject must be physics, chemistry, math, or biology"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must not exceed 500 characters"),

  handleValidationErrors
];

/**
 * Validation rules for timetable submission
 */
const timetableValidation = [
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),

  body("tasks")
    .isArray({ min: 1 })
    .withMessage("Tasks array must contain at least one task"),

  body("tasks.*.title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ max: 200 })
    .withMessage("Task title must not exceed 200 characters"),

  body("tasks.*.startTime")
    .trim()
    .notEmpty()
    .withMessage("Task start time is required"),

  body("tasks.*.endTime")
    .optional()
    .trim(),

  handleValidationErrors
];

module.exports = {
  signupValidation,
  loginValidation,
  reportValidation,
  timetableValidation,
  handleValidationErrors
};
