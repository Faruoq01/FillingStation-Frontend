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
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    internetConnection: (state, action) => {
      state.connection = action.payload;
    },
    historyTags: (state, action) => {
      state.historyTag = action.payload;
    },
    setConnection: (state, action) => {
      state.connection = action.payload;
    },
    clearAuth: () => initialState,
    goToLogin: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  login,
  updateUser,
  internetConnection,
  historyTags,
  clearAuth,
  setConnection,
  goToLogin,
} = authSlice.actions;

export default authSlice.reducer;
