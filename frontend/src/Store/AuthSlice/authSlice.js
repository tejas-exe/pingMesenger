import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getAuthTokenFromCookie } from "../../Utils/utils";

axios.defaults.withCredentials = true;
// Creating the slice for auth
const authReducer = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    signUp(builder);
    login(builder);
    getMyProfile(builder);
  },
});

// Thunk for signing up a user
export const signUpThunk = createAsyncThunk(
  "auth/signUp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/pingMessenger/v1/signup`,
        payload
      );
      return response.data;
    } catch (error) {
      // Return error message if request fails
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Builder function for sign up extra reducer
const signUp = (builder) => {
  builder
    .addCase(signUpThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(signUpThunk.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    })
    .addCase(signUpThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      const errorMessage =
        action.payload?.message || "Sign Up failed. Please try again.";
      toast.error(errorMessage);
    });
};

// Thunk for logging in a user
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/pingMessenger/v1/login`,
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Builder function for login extra reducer
const login = (builder) => {
  builder
    .addCase(loginThunk.pending, (state) => {
      state.loading = true;
    })
    .addCase(loginThunk.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    })
    .addCase(loginThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      const errorMessage =
        action.payload?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    });
};

export const getMyProfileThunk = createAsyncThunk(
  "auth/myProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/pingMessenger/v1/profile`,
        {
          headers: {
            Authorization: getAuthTokenFromCookie(),
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const getMyProfile = (builder) => {
  builder.addCase(getMyProfileThunk.fulfilled, (state, action) => {
    state.user = action.payload;
  });
};

export default authReducer.reducer;
