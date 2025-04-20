// socketSlice.js
import { createSlice } from "@reduxjs/toolkit";

const onlineUserSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
    onlineUsers: [],
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    clearSocket: (state) => {
      state.socket = null;
      state.onlineUsers = [];
    },
  },
});

export const { setSocket, setOnlineUsers, clearSocket } =
  onlineUserSlice.actions;

export const onlineUsers = onlineUserSlice.reducer;
