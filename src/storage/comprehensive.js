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
  paymentDetails: {
    totalSales: 0,
    salesAmount: 0,
    bankPayments: 0,
    posPayments: 0,
    netToBank: 0,
    outstandingBalance: 0,
    bankList: [],
    posList: [],
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
    setReturnToTank: (state, action) => {
      state.rtVolumes = action.payload;
    },
    setLpo: (state, action) => {
      state.lpo = action.payload;
    },
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
    setDipping: (state, action) => {
      state.dipping = action.payload;
    },
    setTankLevels: (state, action) => {
      state.tankLevels = action.payload;
    },
    setRemarkList: (state, action) => {
      state.remarks = action.payload;
    },
    setBalanceCF: (state, action) => {
      state.balanceCF = action.payload;
    },
    paymentDetails: (state, action) => {
      state.paymentDetails = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setBalances,
  setSupply,
  setProduct,
  setReturnToTank,
  setLpo,
  setExpenses,
  setDipping,
  setTankLevels,
  setRemarkList,
  setBalanceCF,
  paymentDetails,
} = comprehensiveSlice.actions;

export default comprehensiveSlice.reducer;
