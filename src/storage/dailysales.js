import { createSlice } from "@reduxjs/toolkit";

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
    overageType: (state, action) => {
      state.overageType = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { sales, setDateValue, tankLevels, overage, overageType } =
  dailysales.actions;

export default dailysales.reducer;
