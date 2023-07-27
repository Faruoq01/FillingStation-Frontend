import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  supply: [],
  searchData: [],
  pendingSupply: [],
  singleSupply: {},
  daySupply: [],
};

export const supplySlice = createSlice({
  name: "supply",
  initialState,
  reducers: {
    createSupply: (state, action) => {
      state.supply = action.payload;
      state.searchData = action.payload;
    },
    singleSupply: (state, action) => {
      state.singleSupply = action.payload;
    },
    searchSupply: (state, action) => {
      const search = state.searchData.filter(
        (data) =>
          !data.transportationName
            .toUpperCase()
            .indexOf(action.payload.toUpperCase()) ||
          !data.productType.toUpperCase().indexOf(action.payload.toUpperCase())
      );
      state.supply = search;
    },
    daySupply: (state, action) => {
      state.daySupply = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { createSupply, searchSupply, singleSupply, daySupply } =
  supplySlice.actions;

export default supplySlice.reducer;
