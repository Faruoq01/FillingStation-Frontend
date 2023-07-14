import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openModal: 0,
  loadingSpinner: false,
  newOutlet: {},
  allOutlets: [],
  newTank: {},
  tankList: [],
  searchData: [],
  pumpList: [],
  mainPumpList: [],
  mainTankList: [],
  oneTank: {},
  oneStation: {},
  searchStation: [],
  adminOutlet: null,
  tankListType: "",
};

export const authSlice = createSlice({
  name: "outlet",
  initialState,
  reducers: {
    login: (state, payload) => {
      state.user = payload.user;
      state.token = payload.token;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = {};
      state.token = "";
      state.isLoggedIn = false;
    },
    updateUser: (state, payload) => {
      state.user = payload;
    },
    internetConnection: (state, payload) => {
      state.connection = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, updateUser, internetConnection } =
  authSlice.actions;

export default authSlice.reducer;
