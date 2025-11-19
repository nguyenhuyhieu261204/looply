import { createSlice } from "@reduxjs/toolkit";

const userStored = localStorage.getItem("user");
const user = userStored ? JSON.parse(userStored) : null;

const initialState = {
  accessToken: null,
  user: user,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, user } = action.payload;
      state.accessToken = accessToken;
      state.user = user;
      state.isAuthenticated = true;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  setCredentials,
  updateUser,
  updateAccessToken,
  clearCredentials,
} = authSlice.actions;

export default authSlice.reducer;
