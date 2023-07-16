import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const today = moment().format("YYYY-MM-DD").split(" ")[0];

const initialState = {
  employees: 0,

  products: {
    pms: {
      sales: 0,
      amount: 0,
    },
    ago: {
      sales: 0,
      amount: 0,
    },
    dpk: {
      sales: 0,
      amount: 0,
    },
  },
  graph: {
    weekly: {
      pms: [0, 0, 0, 0, 0, 0, 0],
      ago: [0, 0, 0, 0, 0, 0, 0],
      dpk: [0, 0, 0, 0, 0, 0, 0],
    },
    monthly: {
      pms: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ago: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      dpk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    annually: {
      pms: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ago: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      dpk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  },
  overage: {
    pms: {
      dipping: 0,
      currentLevel: 0,
      capacity: 0,
      supply: 0,
    },
    ago: {
      dipping: 0,
      currentLevel: 0,
      capacity: 0,
      supply: 0,
    },
    dpk: {
      dipping: 0,
      currentLevel: 0,
      capacity: 0,
      supply: 0,
    },
  },
  assets: {
    tanks: {
      activeCounts: 0,
      inactiveCounts: 0,
    },
    pumps: {
      activeCounts: 0,
      inactiveCounts: 0,
    },
  },
  supplies: {
    pms: 0,
    ago: 0,
    dpk: 0,
  },
  paymentsDetails: {
    bankPayments: 0,
    posPayments: 0,
    netToBank: 0,
    outstandingBalance: 0,
  },
  expenses: 0,

  topStations: {
    topPMS: [],
    topAGO: [],
    topDPK: [],
  },

  lpo: {
    pms: 0,
    ago: 0,
    dpk: 0,
  },
  incoming: [],
  overageType: "PMS",
  dateRange: [today, today],
};

export const dashboard = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    employees: (state, action) => {
      state.employees = action.payload;
    },
    products: (state, action) => {
      state.products = action.payload;
    },
    graph: (state) => {},
    overage: (state) => {},
    assets: (state) => {},
    supplies: (state) => {},
    paymentsDetails: (state) => {},
    topStations: (state) => {},
    lpo: (state) => {},
    incoming: (state) => {},
    dateRange: (state, action) => {
      state.dateRange = action.payload;
    },
  },
});

export const {
  employees,
  products,
  graph,
  overage,
  assets,
  supplies,
  paymentsDetails,
  topStations,
  lpo,
  incoming,
  dateRange,
} = dashboard.actions;

export default dashboard.reducer;
