const mongoose = require("mongoose");

const userFriendListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userFriendList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const UserFriendList = mongoose.model("userFriendList", userFriendListSchema);

module.exports = UserFriendList;
