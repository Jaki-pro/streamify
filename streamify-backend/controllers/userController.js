const jwt = require("jsonwebtoken");  
const User = require("../models/User");
exports.me = async  (req, res) => {
  //console.log("access secret", process.env.JWT_ACCESS_SECRET);
  const token = req?.headers?.authorization;
  const accessToken = token?.split(" ")[1];
 // console.log("token of cookie: ", accessToken);
  try {
    const user = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    
    const myself = await User.findOne({email: user?.email});
    res.status(200).json({ user: myself });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};