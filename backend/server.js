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

const allowedOrigins = [
  "http://localhost:5173",
  "https://foodify-web-app-front.vercel.app",
];

app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS blocked for origin: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

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

// connect db once per cold start
connectDB();

export default app;
