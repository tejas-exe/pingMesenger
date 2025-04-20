import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice/authSlice";
import { friendListReducer } from "./AddFriend/friendSlice";
import { chatMessageSlice } from "./MessagesSlice/messageSlice";
import { onlineUsers } from "./OnlineUser/onlineUserSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    friendList: friendListReducer,
    messageSummery: chatMessageSlice,
    onlineUsers,
  },
});
