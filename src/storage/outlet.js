import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openModal: 0,
  loadingSpinner: false,
  newOutlet: {},
  allOutlets: [],
  newTank: {},
  tankList: [],
  searchData: [],
  pumpList: [],
  mainPumpList: [],
  mainTankList: [],
  oneTank: {},
  oneStation: {},
  searchStation: [],
  adminOutlet: null,
  tankListType: "",
};

export const outletSlice = createSlice({
  name: "outlet",
  initialState,
  reducers: {
    adminOutlet: (state, action) => {
      state.adminOutlet = action.payload;
    },
    getAllStations: (state, action) => {
      state.allOutlets = action.payload;
      state.searchStation = action.payload;
    },
    tankListType: (state, action) => {
      state.tankListType = action.payload;
    },
    openModal: (state, action) => {
      state.openModal = action.payload;
    },
    closeModal: (state, action) => {
      state.openModal = action.payload;
    },
    newOutlet: (state, action) => {
      state.newOutlet = action.payload;
      state.adminOutlet = action.payload;
    },
    getAllOutletTanks: (state, action) => {
      const load = action.payload.map((data) => {
        let craze = { ...data };
        craze["sales"] = "0";
        craze["outlet"] = null;
        craze["pumps"] = [];
        craze["beforeSales"] = craze.currentLevel;
        craze["afterSales"] = "0";
        craze["RTlitre"] = "0";
        return craze;
      });

      state.tankList = load;
      state.mainTankList = load.filter((data) => data.productType === "PMS");
      state.searchData = load;
    },
    getAllPumps: (state, action) => {
      const load = action.payload.map((data) => {
        let craze = { ...data };
        craze["identity"] = null;
        craze["closingMeter"] = "0";
        craze["newTotalizer"] = "Enter closing meter";
        craze["RTlitre"] = "0";
        return craze;
      });

      state.pumpList = load;
      state.mainPumpList = load.filter((data) => data.productType === "PMS");
    },
    getOneTank: (state, action) => {
      state.oneTank = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  adminOutlet,
  getAllStations,
  tankListType,
  openModal,
  closeModal,
  newOutlet,
  getAllOutletTanks,
  getAllPumps,
  getOneTank,
} = outletSlice.actions;

export default outletSlice.reducer;
