import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  incomingOrder: [],
  searchData: [],
  singleIncomingOrder: {},
};

export const incomingSlice = createSlice({
  name: "incomingorder",
  initialState,
  reducers: {
    createIncomingOrder: (state, action) => {
      state.incomingOrder = action.payload;
      state.searchData = action.payload;
    },
    singleIncomingOrderRecord: (state, action) => {
      state.singleIncomingOrder = action.payload;
    },
    searchIncoming: (state, action) => {
      const search = state.searchData.filter(
        (data) =>
          !data.depotStation
            .toUpperCase()
            .indexOf(action.payload.toUpperCase()) ||
          !data.product.toUpperCase().indexOf(action.payload.toUpperCase()) ||
          !data.wayBillNo.toUpperCase().indexOf(action.payload.toUpperCase())
      );
      state.incomingOrder = search;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  createIncomingOrder,
  singleIncomingOrderRecord,
  searchIncoming,
} = incomingSlice.actions;

export default incomingSlice.reducer;
