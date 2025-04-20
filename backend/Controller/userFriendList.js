const UserFriendList = require("../Model/userFriendListModel");

exports.createUserFriendList = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userFriendListEntry = new UserFriendList({
      userId,
      userFriendList: [],
    });
    userFriendListEntry.save();
    return res.status(201).json({ message: "Chat created successfully" });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Something went wrong", error: error.message });
  }
};

exports.addFriendToFriendList = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user._id;

  try {
    const userFriendList = await UserFriendList.findOne({ userId });
    if (!userFriendList) {
      return res.status(404).json({ error: "User Friend List not found" });
    }
    if (userFriendList.userFriendList.includes(friendId)) {
      return res.status(400).json({ error: "Friend already in the list" });
    }
    userFriendList.userFriendList.push(friendId);
    await userFriendList.save();

    const friendList = await UserFriendList.findOne({ userId: friendId });
    if (!friendList) {
      return res.status(404).json({ error: "Friend's Friend List not found" });
    }
    friendList.userFriendList.push(userId);
    await friendList.save();

    return res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUsersFriendList = async (req, res) => {
  try {
    const userId = req.user._id;
    const userFriendList = await UserFriendList.find({
      userId: { $eq: userId },
    })
      .populate({
        path: "userFriendList",
        select: "-password -createdAt -isActive",
      })
      .select("-__v");

    res.status(200).json({ user: userFriendList });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Internal Server Error" });
  }
};
