const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const rateLimit = require("express-rate-limit");
const winston = require("winston");
require("dotenv").config();

// Validate required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "JWT_REFRESH_SECRET"];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "student-productivity" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" })
  ]
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

// Input sanitization utility
const sanitizeInput = input => {
  if (typeof input === "string") {
    return input.replace(/[<>"'&]/g, match => {
      const map = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "&": "&amp;"
      };
      return map[match];
    });
  }
  return input;
};

// Import routes
const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const calendarRoutes = require("./routes/calendar.routes");
const pomodoroRoutes = require("./routes/pomodoro.routes");
const noteRoutes = require("./routes/note.routes");
const userRoutes = require("./routes/user.routes");

// Initialize express app
const app = express();

// Set up rate limiting with user-specific limits
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 1000,
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res
      .status(429)
      .json({ error: "Too many requests, please try again later" });
  }
});

// Apply security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"]
      }
    }
  })
);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.CLIENT_URL
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Authorization"]
  })
);

// Only apply rate limiting in production
if (process.env.NODE_ENV === "production") {
  app.use(limiter);
}

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" })); // Reduced limit for security
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(cookieParser());

// Input sanitization middleware
app.use((req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    });
  }
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/pomodoro", pomodoroRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);

// Serve static assets in production (not needed on Vercel, but safe fallback)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error("Server error", {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent")
  });

  let error = { ...err };
  error.message = err.message;

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map(val => val.message)
      .join(", ");
    error = { message, statusCode: 400 };
  }

  if (err.code === 11000) {
    error = { message: "Duplicate field value", statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    error:
      process.env.NODE_ENV === "production" ? {} : { stack: err.stack }
  });
});

// Connect to MongoDB with security options
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info("MongoDB Connected");
    console.log("MongoDB Connected");
  })
  .catch(err => {
    logger.error("MongoDB connection error", { error: err.message });
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Create logs directory if it doesn't exist
const fs = require("fs");
if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

// ✅ Export app for Vercel (instead of app.listen)
module.exports = app;
