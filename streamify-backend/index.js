const express = require("express");
const cors = require("cors");
const path = require('path');
const fileUpload = require('express-fileupload');
const { default: mongoose } = require("mongoose");
const authRoutes = require('./routes/authRoutes'); 
const app = express();
const PORT = 5000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Replace with your correct Google OAuth Client ID

// Connect to MongoDB
const db_url = process.env.DATABASE_URL;
mongoose.connect(db_url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.use('/api', authRoutes); // Mount authRoutes under /api/auth 

app.get("/", (req, res) => {
  res.send("Google Sign-In Backend Running ✅");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});