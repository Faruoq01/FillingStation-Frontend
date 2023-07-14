import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dailySales: {},
  payments: {},
  dailyIncoming: [],
  cummulative: {},
  dailySupplies: {},
  lpoRecords: [],
  paymentRecords: {
    bankPayment: [],
    posPayment: [],
    expenses: [],
  },
  bulkReports: {
    balances: {
      pms: 0,
      ago: 0,
      dpk: 0,
    },
    supply: [],
    sales: [],
    expenses: [],
    dipping: [],
    tankLevels: [],
  },
  linkedData: { page: 1 },
  balanceBF: {},
  pmsBBF: {},
  agoBBF: {},
  dpkBBF: {},
  barData: {},
  summary: {},
  currentDate: "",
  remarks: [],
  overages: [],
  overageType: "PMS",
  supplies: [],
  salesStatus: [],
};

export const dailysales = createSlice({
  name: "dailysales",
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
  dailysales.actions;

export default dailysales.reducer;
