import express from "express";
import cors from "cors";
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

const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
);

app.use(express.json());

// CORS must be before routes
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight immediately
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

// (optional) still keep cors middleware; but header middleware above is the key
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      return allowedOrigins.has(origin) ? cb(null, true) : cb(null, false);
    },
    credentials: true,
  })
);

// routes
app.use("/", userRoutes);
app.use("/", restRoutes);
app.use("/", paymentRoutes);
app.use("/", offerRoutes);
app.use("/", menuRoutes);
app.use("/", cartRoutes);
app.use("/", authRoutes);
app.use("/", restOrder);
app.use("/", userOrder);

// connect DB on cold start (ensure connectDB doesn't call process.exit)
connectDB();

export default app;

