const express = require("express");
const cors = require("cors");
const path = require('path');
const bodyParser = require("body-parser");
const { OAuth2Client } = require("google-auth-library");
const fileUpload = require('express-fileupload');
const { default: mongoose } = require("mongoose");
const authRoutes = require('./routes/authRoutes');
const app = express();
const PORT = 5000;
require('dotenv').config(); 
// Replace with your correct Google OAuth Client ID
const CLIENT_ID = "533388546852-j694mp7ko7b87isk8vk13c241ce6228j.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// connect mongodb url  
const db_url = process.env.DATABASE_URL;
mongoose.connect(db_url);

// Middleware
app.use(fileUpload());
app.use(cors());
app.use(bodyParser.json()); 

// Routes
app.get("/", (req, res) => {
  res.send("Google Sign-In Backend Running ✅");
}); 
app.use('/api/auth/', authRoutes);


// Middleware
app.use(cors());
app.use(express.json());

// Replace with your EchoGPT API key
const ECHOGPT_API_KEY = "echogpt-yYH54ZQ0a3-PAhIPqZeGS-uRzIqzUleo-dB0iSGSmY6-mPy6_Id8-SgJ5xGBjXR63P5z";
const ECHOGPT_API_URL = "https://api.echogpt.com/v1/chat/history";



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});