import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balances: {
    pms: 0,
    ago: 0,
    dpk: 0,
  },
  supply: {
    pms: {
      quantity: 0,
      shortage: 0,
      overage: 0,
    },
    ago: {
      quantity: 0,
      shortage: 0,
      overage: 0,
    },
    dpk: {
      quantity: 0,
      shortage: 0,
      overage: 0,
    },
  },
  sales: [],
  rtVolumes: [],
  lpo: [],
  expenses: [],
  payments: {
    bank: [],
    pos: [],
    netToBank: 0,
    outstanding: 0,
  },
  balanceCF: {
    pms: 0,
    ago: 0,
    dpk: 0,
  },
  dipping: [],
  tankLevels: [],
  remarks: [],
};

export const comprehensiveSlice = createSlice({
  name: "comprehensive",
  initialState,
  reducers: {
    setBalances: (state, action) => {
      state.balances = action.payload;
    },
    setSupply: (state, action) => {
      state.supply = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setBalances, setSupply } = comprehensiveSlice.actions;

export default comprehensiveSlice.reducer;
