const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");

exports.validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if the authorization header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization token missing or invalid" });
    }

    // Extract token from the authorization header
    const token = authHeader.replace("Bearer ", "");

    // Verify the token
    const decoded = jwt.verify(token, "vanilaChockletStraberryRaberry");

    // Find the user by the decoded token's userId
    const user = await User.findById(decoded.id);

    // If no user or the user is inactive, return an error response
    if (!user || !user.isActive) {
      return res.status(404).json({ message: "No user found with this token" });
    }

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification errors or other exceptions
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Log and handle any other errors
    console.error("Error validating token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
