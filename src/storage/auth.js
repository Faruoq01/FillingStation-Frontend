import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || {},
  token: localStorage.getItem("token") || "",
  isLoggedIn: !!JSON.parse(localStorage.getItem("user")),
  connection: true,
  historyTag: "All tags",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = {};
      state.token = "";
      state.isLoggedIn = false;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    internetConnection: (state, action) => {
      state.connection = action.payload;
    },
    historyTags: (state, action) => {
      state.historyTag = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, updateUser, internetConnection, historyTags } =
  authSlice.actions;

export default authSlice.reducer;
