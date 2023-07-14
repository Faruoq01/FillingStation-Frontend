import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboardData: {
    count: 0,
    tanks: {
      activeTank: { count: 0, list: [] },
      inActiveTank: { count: 0, list: [] },
    },
    pumps: {
      activePumps: { count: 0, list: [] },
      inActivePumps: { count: 0, list: [] },
    },
  },
  dashboardRecords: {
    sales: {
      totalAmount: 0,
      totalVolume: 0,
    },

    supply: {
      pmsSupply: 0,
      agoSupply: 0,
      dpkSupply: 0,
    },
    totalExpenses: 0,
    incoming: [],
    station: [],
    payments: {
      totalPayments: 0,
      totalPosPayments: 0,
      netToBank: 0,
    },
  },

  employees: [],
  searchData: [],
  utils: {},
  singleUser: {},
  dateRange: [new Date(), new Date()],
  sales: [],
};

export const counterSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
