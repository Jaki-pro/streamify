 exports.googleSign = async (req, res) => {
    console.log("hello");
    const { token } = req.body;
  //   if (!token) {
  //     return res.status(400).json({ message: "Token not provided" });
  //   }
    try {
      // Verify Google ID Token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Correct audience check
      });
      const payload = ticket.getPayload();
      const { sub, email, name, picture, aud } = payload;
      // Validate audience
      // if (aud !== CLIENT_ID) {
      //   return res.status(401).json({ message: "Token audience mismatch" });
      // }
      //console.log("Verified Google User:", { sub, email, name, picture });
      // Respond with user info
      res.status(200).json({
        message: "User authenticated",
        user: { id: sub, email, name, picture },
      });
  
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401).json({ message: "Invalid token", error: error.message });
    }
  };