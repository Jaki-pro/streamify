const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config();
const client_id = process.env.CLIENT_ID
const client = new OAuth2Client(client_id);
exports.googleSign = async (req, res) => {
  console.log("client id", client_id);
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Token not provided" });
  }
  try {
    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: client_id, // Correct audience check
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture, aud } = payload;
    // Validate audience
    if (aud !== client_id) {
      return res.status(401).json({ message: "Token audience mismatch" });
    }
    // console.log("Verified Google User:", { sub, email, name, picture });
    // Respond with user info

    // save to db if it is new
    const user = {
      username: name,
      email: email,
      profilePicture: picture,
      subscribers: 0,
      subscribedChannels: [],
      watchHistory: [],
      likedVideos: [],
      savedVideos: [],
      role: "user",
    };
    const existingUser = await User.findOne({ email });
    let newUser;
    if (existingUser) {
       newUser=existingUser;
    }
    else await User.create(user);
    // Generate JWT token
    const accessToken = jwt.sign({ email, role: user.role}, process.env.JWT_ACCESS_SECRET);
    //console.log('access token', accessToken);
    // Set HTTP-only cookie
     
    // console.log("Set-Cookie header:", res.getHeaders()["set-cookie"]);
    res.status(200).cookie("token", accessToken, {
      httpOnly: true, 
      secure: true,
      sameSite: "none", 
      maxAge: 3600000, 
    }).json({
      message: "User authenticated",
      user: user,
      accessToken: accessToken
    });

  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};