import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getAuthTokenFromCookie } from "../../Utils/utils";

axios.defaults.withCredentials = true;
// Creating the slice for auth
const messageSlice = createSlice({
  name: "messages",
  initialState: { summery: {} },
  extraReducers: (builder) => {
    sendMessage(builder);
    retrieveMessage(builder);
  },
});

export const sendMessageThunk = createAsyncThunk(
  "post/sendMessage",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/pingMessenger/v1/sendMessage`,
        payload,
        {
          headers: {
            Authorization: getAuthTokenFromCookie(),
          },
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(false);
    }
  }
);

const sendMessage = (build) => {
  build.addCase(sendMessageThunk.rejected, () => {
    toast.error("Something went wrong");
  });
};

export const retrieveMessageThunk = createAsyncThunk(
  "get/messagingSummery",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/pingMessenger/v1/retrieveMessages/${userId}`,
        {
          headers: {
            Authorization: getAuthTokenFromCookie(),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error.response?.data || "Failed to retrieve messages"
      );
    }
  }
);

const retrieveMessage = (builder) => {
  builder
    .addCase(retrieveMessageThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error =
        action.payload || "Something went wrong while retrieving messages";
      toast.error(state.error);
    })
    .addCase(retrieveMessageThunk.fulfilled, (state, action) => {
      state.summery = action.payload;
    });
};

export const chatMessageSlice = messageSlice.reducer;
