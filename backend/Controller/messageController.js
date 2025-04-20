const MessageModel = require("../Model/messageModel.js");
const User = require("../Model/userModel");
const { getReceiverSocketId, io } = require("../server.js");

exports.retrieveMessages = async (req, res) => {
  try {
    const receiver = req.params.userID;
    const sender = req.user._id;
    const receiversDetails = await User.findById(receiver).select(
      "-password -createdAt -isActive"
    );

    if (!receiversDetails) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    const messages = await MessageModel.find({
      conversationBetween: { $all: [sender, receiver] },
    })
      .select("-conversationBetween")
      .populate({
        path: "sender receiver",
        select: "-password -createdAt -isActive",
      });

    res.status(200).json({ chatHeader: receiversDetails, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiver, message } = req.body;
    const sender = req.user._id;

    const receiverDetails = await User.findById(receiver);
    if (!receiverDetails) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    const newMessage = new MessageModel({
      conversationBetween: [sender, receiver],
      sender,
      receiver,
      message,
    });
    await newMessage.save();
    const receiverSocketId = getReceiverSocketId(receiver);
    const senderSocketId = getReceiverSocketId(sender);
    const emitEventTo = [senderSocketId, receiverSocketId];

    if (receiverSocketId && senderSocketId) {
      emitEventTo.forEach((socketID) => {
        io.to(socketID).emit("getMessageEvent");
      });
    }
    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
