import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balances: {
    pms: 0,
    ago: 0,
    dpk: 0,
  },
  supply: {
    pms: 0,
    ago: 0,
    dpk: 0,
  },
  sales: [],
  rtVolumes: [],
  lpo: [],
  expenses: [],
  payments: {
    bank: [],
    pos: [],
    netToBank: 0,
    outstanding: 0,
  },
  balanceCF: {
    pms: 0,
    ago: 0,
    dpk: 0,
  },
  dipping: [],
  tankLevels: [],
  remarks: [],
};

export const comprehensiveSlice = createSlice({
  name: "comprehensive",
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
  },
});

// Action creators are generated for each case reducer function
export const { login, logout, updateUser, internetConnection } =
  comprehensiveSlice.actions;

export default comprehensiveSlice.reducer;
