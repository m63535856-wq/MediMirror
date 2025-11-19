/**
 * MediMirror Server
 * Express server with GitHub Models API integration
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['GITHUB_TOKEN'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Error: ${envVar} is not set in environment variables`);
    process.exit(1);
  }
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://medimirror.vercel.app"
];

// ===== MIDDLEWARE CONFIGURATION =====

// Security headers with Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS FIX HERE 
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked CORS origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Apply rate limiting to all API routes
app.use("/api/", apiLimiter);

// ===== ROUTES =====

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "Server is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// AI routes
app.use("/api", aiRoutes);

// ===== ERROR HANDLING =====
app.use(notFoundHandler);
app.use(errorHandler);

// ===== SERVER STARTUP =====
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  server.close(() => {
    console.log("✅ Server closed successfully");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("⚠️ Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

const server = app.listen(PORT, () => {
  console.log("\n🚀 ===== MEDIMIRROR SERVER STARTED =====");
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🌍 Allowed Origins:`, allowedOrigins);
  console.log(
    `🤖 GitHub API: ${process.env.GITHUB_TOKEN ? "✅ Configured" : "❌ Not configured"}`
  );
  console.log(
    `⏱️  Rate Limit: ${
      process.env.RATE_LIMIT_MAX_REQUESTS || 15
    } requests per minute`
  );
  console.log("=========================================\n");
});

// Graceful shutdown handlers
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("UNHANDLED_REJECTION");
});

export default app;
