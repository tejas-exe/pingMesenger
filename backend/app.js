// IMPORTS FROM ROUTERS
const authRouter = require("./Router/authRouter");
const userListRouter = require("./Router/userFriendListRouter");
const messagingRouter = require("./Router/messageRouter");
const { MongoDb, userDetails, app, io, server } = require("./server");

app.use("/pingMessenger/v1", authRouter);
app.use("/pingMessenger/v1", userListRouter);
app.use("/pingMessenger/v1", messagingRouter);

io.on("connection", (client) => {
  const userId = client.handshake.query.userId;
  if (userId) {
    userDetails[userId] = client.id;
  }

  io.emit("emitOnlineUser", Object.keys(userDetails));

  client.on("disconnect", () => {
    delete userDetails[userId];
    io.emit("emitOnlineUser", Object.keys(userDetails));
  });
});

// Start the server
server.listen(3000, () => {
  console.log(`
    🚀✨ ===============================
          Server is running on port 3000
    =================================== 🌐😎
    `);
  MongoDb();
});
