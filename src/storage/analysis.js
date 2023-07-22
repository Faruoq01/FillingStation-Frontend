import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
const date = moment().format("YYYY-MM-DD").split(" ")[0];

const initialState = {
  analysisData: {},
  overages: [],
  dateRange: [date, date],
};

export const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    setAnalysisData: (state, action) => {
      state.analysisData = action.payload;
    },
    overages: (state, action) => {
      state.overages = action.payload;
    },
    dateRange: (state, action) => {
      state.dateRange = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAnalysisData, overages, dateRange } = analysisSlice.actions;

export default analysisSlice.reducer;
