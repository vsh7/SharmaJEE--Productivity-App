const rateLimit = require("express-rate-limit");

/**
 * AI Rate Limiter
 * Limits AI suggestion requests to prevent abuse and manage API costs
 *
 * Limits:
 * - 5 requests per 15 minutes per user
 * - 10 requests per hour per user
 */
const aiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each user to 5 requests per windowMs
    message: {
        message: "Too many AI requests. Please try again in 15 minutes.",
        retryAfter: "15 minutes"
    },
    standardHeaders: 'draft-7', // Use draft-7 standard
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers

    // Skip rate limiting for successful requests that return "not enough data"
    skip: (req, res) => {
        return false; // Don't skip any requests
    },

    // Custom handler for when limit is exceeded
    handler: (req, res) => {
        console.log(`Rate limit exceeded for user: ${req.user?.email || req.ip}`);
        res.status(429).json({
            message: "Too many AI requests from this account. Please try again later.",
            retryAfter: "15 minutes",
            tip: "AI suggestions are resource-intensive. Use them wisely to get the most value!"
        });
    }
});

/**
 * General API Rate Limiter
 * For general API endpoints to prevent spam
 */
const generalApiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // 30 requests per minute
    message: {
        message: "Too many requests. Please slow down.",
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false
});

/**
 * Auth Rate Limiter
 * Stricter limits for login/signup to prevent brute force
 */
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 login attempts per 15 minutes
    message: {
        message: "Too many authentication attempts. Please try again later.",
        retryAfter: "15 minutes"
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skipSuccessfulRequests: true // Don't count successful logins
});

module.exports = {
    aiRateLimiter,
    generalApiLimiter,
    authRateLimiter
};
