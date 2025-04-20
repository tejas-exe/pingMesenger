/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthTokenFromCookie } from "../../Utils/utils";
import toast from "react-hot-toast";

const initialState = {
  isFriendListModelOpen: false,
  friendList: [],
  myFriends: [],
};

const friendListSlice = createSlice({
  name: "friendList",
  initialState,
  reducers: {
    openCloseModel: (state) => {
      state.isFriendListModelOpen = !state.isFriendListModelOpen;
    },
  },
  extraReducers: (builder) => {
    getFriendList(builder);
    createUserList(builder);
    addFriendToFriendList(builder);
    getMyFriendList(builder);
  },
});

export const { openCloseModel } = friendListSlice.actions;

export const getFriendListThunk = createAsyncThunk(
  "/get/friendList",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/pingMessenger/v1/getUserByUsername?userName=${query}`,
        {
          headers: {
            Authorization: getAuthTokenFromCookie(),
          },
        }
      );
      return response;
    } catch (error) {
      return rejectWithValue([]);
    }
  }
);
const getFriendList = (builder) => {
  builder.addCase(getFriendListThunk.fulfilled, (state, action) => {
    state.friendList = action.payload.data;
  });
  builder.addCase(getFriendListThunk.rejected, (state) => {
    state.friendList = [];
    const errorMessage = "No Username Found";
    toast.error(errorMessage);
  });
};

export const createFriendListThunk = createAsyncThunk(
  "post/createFriendList",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `http://localhost:3000/pingMessenger/v1/createList`,
        {},
        {
          headers: {
            Authorization: getAuthTokenFromCookie(),
          },
        }
      );
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create friend list"
      );
    }
  }
);

const createUserList = (builder) => {
  builder.addCase(createFriendListThunk.rejected, (state, action) => {
    const errorMessage = action.payload || "Failed to Create Friend List";
    toast.error(errorMessage);
  });
};

export const addFriendToFriendListThunk = createAsyncThunk(
  "post/addFriend",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.post(
        `http://localhost:3000/pingMessenger/v1/addFriend`,
        payload,
        {
          headers: {
            Authorization: getAuthTokenFromCookie(),
          },
        }
      );
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.error || "Failed to add friend to list"
      );
    }
  }
);
const addFriendToFriendList = (builder) => {
  builder
    .addCase(addFriendToFriendListThunk.fulfilled, (state, action) => {
      const successMessage = "Added to contact list successfully";
      toast.success(successMessage);
    })
    .addCase(addFriendToFriendListThunk.rejected, (state, action) => {
      console.log(action);

      toast.error(action.payload);
    });
};

export const getMyFriendListThunk = createAsyncThunk(
  "get/getMyFriend",
  async (_, { rejectWithValue }) => {
    try {
      return await axios.get(
        `http://localhost:3000/pingMessenger/v1/getMyFriendList`,

        {
          headers: {
            Authorization: getAuthTokenFromCookie(),
          },
        }
      );
    } catch (error) {
      return rejectWithValue([]);
    }
  }
);
const getMyFriendList = (builder) => {
  builder
    .addCase(getMyFriendListThunk.fulfilled, (state, action) => {
      state.myFriends = action.payload.data.user[0]?.userFriendList;
    })
    .addCase(getMyFriendListThunk.rejected, (state, action) => {
      state.myFriends = [];
      toast.error("Something went wrong");
    });
};

export const friendListReducer = friendListSlice.reducer;
