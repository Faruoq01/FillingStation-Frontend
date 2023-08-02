import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
const date = moment().format("YYYY-MM-DD").split(" ")[0];

const initialState = {
  analysisData: {
    expenses: 0,
    payments: 0,
    profit: 0,
    totalSales: 0,
    totalVarience: 0,
    sales: {
      quantity: {
        pms: 0,
        ago: 0,
        dpk: 0,
      },
      price: {
        pms: 0,
        ago: 0,
        dpk: 0,
      },
    },
    varience: {
      quantity: {
        pms: 0,
        ago: 0,
        dpk: 0,
      },
      price: {
        pms: 0,
        ago: 0,
        dpk: 0,
      },
    },
  },
  dateRange: [date, date],
  dipping: [],
};

export const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    setAnalysisData: (state, action) => {
      state.analysisData = action.payload;
    },
    dateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    setDipping: (state, action) => {
      state.dipping = action.payload;
    },
    clearAnalysis: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const { setAnalysisData, dateRange, setDipping, clearAnalysis } = analysisSlice.actions;

export default analysisSlice.reducer;
