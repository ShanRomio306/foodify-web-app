import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import restRoutes from "./routes/restRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import restOrder from "./routes/orderRoutes/restOrder.js";
import userOrder from "./routes/orderRoutes/userOrder.js";

dotenv.config();

const app = express();

app.use(express.json());

/**
 * CORS (Vercel-friendly)
 * Set ALLOWED_ORIGINS in backend env like:
 * ALLOWED_ORIGINS=http://localhost:5173,https://foodify-web-app-front.vercel.app
 */
const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow only configured origins
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  // Helps caches/CDNs handle per-origin responses
  res.setHeader("Vary", "Origin");

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Preflight request
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

// Health check endpoints (safe for production)
app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/version", (req, res) => res.json({ version: "cors-preflight-fix-1" }));

// Routes
app.use("/", userRoutes);
app.use("/", restRoutes);
app.use("/", paymentRoutes);
app.use("/", offerRoutes);
app.use("/", menuRoutes);
app.use("/", cartRoutes);
app.use("/", authRoutes);
app.use("/", restOrder);
app.use("/", userOrder);

// DB connect on cold start (do not crash function if DB fails)
connectDB().catch((err) => {
  console.error("DB connection failed:", err);
});

export default app;
