import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  payment: [],
  certificate: {},
  receipt: {},
  searchData: [],
  singlePayment: {},
  eStationSinglePayment: {},
};

export const regulatorySlice = createSlice({
  name: "regulatory",
  initialState,
  reducers: {
    createPayment: (state, action) => {
      state.payment = action.payload;
      state.searchData = action.payload;
    },
    searchPayment: (state, action) => {
      const search = state.searchData.filter(
        (data) =>
          !data.organisationalName
            .toUpperCase()
            .indexOf(action.payload.toUpperCase()) ||
          !data.contactPerson
            .toUpperCase()
            .indexOf(action.payload.toUpperCase())
      );
      state.payment = search;
    },
    singlePaymentAction: (state, action) => {
      state.singlePayment = action.payload;
    },
    certificate: (state, action) => {
      state.certificate = action.payload;
    },
    reciepts: (state, action) => {
      state.receipt = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  createPayment,
  searchPayment,
  singlePaymentAction,
  certificate,
  reciepts,
} = regulatorySlice.actions;

export default regulatorySlice.reducer;
