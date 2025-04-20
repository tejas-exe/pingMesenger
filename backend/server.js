const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { default: mongoose } = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

const MongoDb = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://admin:admin@node.yetoeyg.mongodb.net/pingMessenger`
    );
    console.log(`
      ✅💾 =============================
            MongoDB connected successfully!
      ============================= 🚀🌱
      `);
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

const userDetails = {};
function getReceiverSocketId(userId) {
  return userDetails[userId];
}

module.exports = { userDetails, getReceiverSocketId, MongoDb, io, app, server };
