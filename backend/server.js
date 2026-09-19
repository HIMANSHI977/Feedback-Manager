import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import feedbackRoutes from "./routes/feedbackRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3005;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/feedback", feedbackRoutes);

try {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("MongoDB connected successfully");

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error(
    "MongoDB connection failed:",
    error.message
  );
}