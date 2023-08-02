import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bank: [],
  searchBank: [],
  pos: [],
  searchPos: [],
};

export const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    allBankPayment: (state, action) => {
      state.bank = action.payload;
      state.searchBank = action.payload;
    },
    searchBankPayment: (state, action) => {
      const search = state.searchBank.filter(
        (data) =>
          !data.bankName.toUpperCase().indexOf(action.payload.toUpperCase()) ||
          !data.tellerNumber.toUpperCase().indexOf(action.payload.toUpperCase())
      );
      state.bank = search;
    },
    allPosPayment: (state, action) => {
      state.pos = action.payload;
      state.searchPos = action.payload;
    },
    searchPosPayment: (state, action) => {
      const search = state.searchPos.filter(
        (data) =>
          !data.posName.toUpperCase().indexOf(action.payload.toUpperCase()) ||
          !data.terminalID.toUpperCase().indexOf(action.payload.toUpperCase())
      );
      state.pos = search;
    },
    clearPayment: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const {
  allBankPayment,
  allPosPayment,
  searchBankPayment,
  searchPosPayment,
  clearPayment,
} = paymentSlice.actions;

export default paymentSlice.reducer;
