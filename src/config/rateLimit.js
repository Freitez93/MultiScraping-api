import { config } from "dotenv";
import rateLimit from "express-rate-limit";

// Load environment variables from .env file
config();

// Parse environment variables with defaults
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000; // 1 minuto
const MAX_REQUESTS = Number(process.env.MAX_REQUESTS) || 50;

/**
 * Express rate limiter middleware to prevent excessive requests.
 */
const limiter_request = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  message: "¡Uy, demasiadas peticiones! 🔥",
  standardHeaders: true,
  handler: (req, res) => {
    console.log(`🚨 IP ${req.ip} BLOQUEADA por rate limit!`);
    res.status(429).json({ error: "¡Demasiadas peticiones!" });
  },
});

export default limiter_request;