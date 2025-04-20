const express = require("express");
const UserFriendList = require("../Controller/userFriendList");
const authMiddleware = require("../MidelWare/authMidelware");
const router = express.Router();

//Added middle ware
router.use(authMiddleware.validateToken);
router.post("/createList", UserFriendList.createUserFriendList);
router.post("/addFriend", UserFriendList.addFriendToFriendList);
router.get("/getMyFriendList", UserFriendList.getUsersFriendList);

module.exports = router;
