import { createSlice } from "@reduxjs/toolkit";

const userStored = localStorage.getItem("user");
let user = null;

try {
  user = userStored ? JSON.parse(userStored) : null;
} catch (error) {
  console.error("❌Error parsing user from localStorage:", error);
  localStorage.removeItem("user");
}

const initialState = {
  accessToken: null,
  user: user,
  isAuthenticated: !!user,
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
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
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
      localStorage.removeItem("user");
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
