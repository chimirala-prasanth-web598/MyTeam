const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const certificateRoutes = require("./routes/certificateRoutes");
const PDFDocument = require("pdfkit");
const fs = require("fs");
require("dotenv").config();

const app = express();

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.stack);

  // Handle specific errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  if (err.name === "MongoError" && err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: "Duplicate key error",
    });
  }

  res.status(500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
};

// Connect to Database
connectDB();

// Configure CORS with specific options
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // Allow both localhost and 127.0.0.1
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
  })
);

// Middleware
app.use(express.json({ limit: "50mb" })); // Increase payload limit for base64 images
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, "../frontend")));

// Routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/certificates", certificateRoutes);

// Serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Use error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `Server is accepting requests from http://127.0.0.1:5500 and http://localhost:5500`
  );
});
