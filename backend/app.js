import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import feedbackRoutes from "./routes/feedbackRoutes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(
  express.static(
    path.join(__dirname, "../frontend")
  )
);

// API routes
app.use("/api/feedback", feedbackRoutes);

// MongoDB connection
await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB connected successfully");

export default app;