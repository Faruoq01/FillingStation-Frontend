import { createSlice } from "@reduxjs/toolkit";

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const initialState = {
  updatedDate: "",
  overageType: "PMS",
  dailysales: 0,
  sales: {
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
  tankLevels: {
    pms: {
      afterSales: 0,
      tankCapacity: 0,
    },
    ago: {
      afterSales: 0,
      tankCapacity: 0,
    },
    dpk: {
      afterSales: 0,
      tankCapacity: 0,
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
  expenses: {
    expenses: 0,
    payments: 0,
  },
  graph: {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#06805B",
      },
      {
        label: "Dataset 2",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#108CFF",
      },
    ],
  },
  supply: {
    pms: 0,
    ago: 0,
    dpk: 0,
  },
  netToBank: {
    bankPayments: 0,
    posPayments: 0,
    netToBank: 0,
    outstandingBalance: 0,
  },
};

export const dailysales = createSlice({
  name: "dailysales",
  initialState,
  reducers: {
    setDateValue: (state, action) => {
      state.updatedDate = action.payload;
    },
    sales: (state, action) => {
      state.sales = action.payload;
    },
    tankLevels: (state, action) => {
      state.tankLevels = action.payload;
    },
    overage: (state, action) => {
      state.overage = action.payload;
    },
    expenses: (state, action) => {
      state.expenses = action.payload;
    },
    overageType: (state, action) => {
      state.overageType = action.payload;
    },
    graph: (state, action) => {
      state.graph = action.payload;
    },
    supply: (state, action) => {
      state.supply = action.payload;
    },
    netToBank: (state, action) => {
      state.netToBank = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  sales,
  setDateValue,
  tankLevels,
  overage,
  overageType,
  expenses,
  graph,
  supply,
  netToBank,
} = dailysales.actions;

export default dailysales.reducer;
