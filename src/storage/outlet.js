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
  pdfData: "",
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
        return {
          ...craze,
          sales: 0,
          outlet: null,
          pumps: [],
          beforeSales: craze.currentLevel,
          afterSales: craze.afterSales,
          RTlitre: 0,
        };
      });

      state.tankList = load;
      state.mainTankList = load.filter((data) => data.productType === "PMS");
      state.searchData = load;
    },
    getAllPumps: (state, action) => {
      const load = action.payload.map((data) => {
        let craze = { ...data };
        return {
          ...craze,
          identity: null,
          closingMeter: 0,
          newTotalizer: "Enter closing meter",
          RTlitre: 0,
        };
      });

      state.pumpList = load;
      state.mainPumpList = load.filter((data) => data.productType === "PMS");
    },
    getOneTank: (state, action) => {
      state.oneTank = action.payload;
    },
    searchStations: (state, action) => {
      const search = state.searchStation.filter(
        (data) =>
          !data.outletName
            .toUpperCase()
            .indexOf(action.payload.toUpperCase()) ||
          !data.state.toUpperCase().indexOf(action.payload.toUpperCase()) ||
          !data.city.toUpperCase().indexOf(action.payload.toUpperCase())
      );
      state.allOutlets = search;
    },
    createTanks: (state, action) => {
      state.newTank = action.payload;
    },
    setSpinner: (state) => {
      state.loadingSpinner = true;
    },
    removeSpinner: (state) => {
      state.loadingSpinner = false;
    },
    searchTanks: (state, action) => {},
    setPDFData: (state, action) => {
      state.pdfData = action.payload;
    },
    clearOutlet: () => initialState,
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
  searchTanks,
  searchStations,
  createTanks,
  removeSpinner,
  setSpinner,
  clearOutlet,
  setPDFData,
} = outletSlice.actions;

export default outletSlice.reducer;
