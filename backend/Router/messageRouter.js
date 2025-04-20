const express = require("express");
const router = express.Router();
const authMiddleware = require("../MidelWare/authMidelware");
const messageController = require("../Controller/messageController");

router.use(authMiddleware.validateToken);

router
  .route("/retrieveMessages/:userID")
  .get(messageController.retrieveMessages);

router.route("/sendMessage").post(messageController.sendMessage);

module.exports = router;
