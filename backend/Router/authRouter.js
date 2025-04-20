const express = require("express");
const authController = require("../Controller/authController");
const authMiddleware = require("../MidelWare/authMidelware");
// const userController = require("../Controller/userController"); // Import user controller functions
const router = express.Router();

// Signup and Login
router.post("/signup", authController.signUp);
router.post("/login", authController.loginUser);

//Added middle ware
router.use(authMiddleware.validateToken);
router.get("/getUserByUsername", authController.getUserByUsername);
router.get("/profile", authController.getMyProfile);

module.exports = router;
