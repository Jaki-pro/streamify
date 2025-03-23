const express = require("express");
const cors = require("cors");
const path = require('path');
const fileUpload = require('express-fileupload');
const { default: mongoose } = require("mongoose");
const authRoutes = require('./routes/authRoutes'); 
const userRoutes = require('./routes/userRoutes'); 
const videoRoutes = require('./routes/videoRoutes'); 
const app = express();
const PORT = 5000;
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Middleware 
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your React app's URL
  credentials: true, // Allow credentials (cookies)
}));
app.options('*', cors());
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
app.use((req, res, next) => {
  res.removeHeader('Cross-Origin-Opener-Policy'); // Remove the COOP header
  next();
});  

app.use('/api/auth', authRoutes); // Mount authRoutes under /api/auth 
app.use('/api/user', userRoutes); //
app.use('/api/videos', videoRoutes); // 

app.get("/", (req, res) => {
  res.send("Google Sign-In Backend Running ✅");
});
app.use("/videos", express.static(path.join(__dirname, "input")));
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});