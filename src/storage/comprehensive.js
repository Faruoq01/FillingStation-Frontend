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
  sales: {
    pms: [],
    ago: [],
    dpk: [],
  },
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
    setProduct: (state, action) => {
      switch (action.payload.type) {
        case "PMS": {
          state.sales.pms = action.payload.data;
          break;
        }
        case "AGO": {
          state.sales.ago = action.payload.data;
          break;
        }
        case "DPK": {
          state.sales.dpk = action.payload.data;
          break;
        }
        default: {
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setBalances, setSupply, setProduct } =
  comprehensiveSlice.actions;

export default comprehensiveSlice.reducer;
