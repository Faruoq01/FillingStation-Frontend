import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lpo: [],
  lpoSales: [],
  searchData: [],
  searchData2: [],
  singleLPO: {},
};

export const lpoSlice = createSlice({
  name: "lpo",
  initialState,
  reducers: {
    createLPO: (state, action) => {
      state.lpo = action.payload;
      state.searchData2 = action.payload;
    },
    searchLPO: (state, action) => {
      const search = state.searchData2.filter(
        (data) =>
          !data.companyName
            .toUpperCase()
            .indexOf(action.payload.toUpperCase()) ||
          !data.paymentStructure
            .toUpperCase()
            .indexOf(action.payload.toUpperCase())
      );
      state.lpo = search;
    },
    singleLPORecord: (state, action) => {
      state.singleLPO = action.payload;
    },
    createLPOSales: (state, action) => {
      state.lpoSales = action.payload;
      state.searchData = action.payload;
    },
    clearLpo: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const {
  createLPO,
  searchLPO,
  singleLPORecord,
  createLPOSales,
  clearLpo,
} = lpoSlice.actions;

export default lpoSlice.reducer;
