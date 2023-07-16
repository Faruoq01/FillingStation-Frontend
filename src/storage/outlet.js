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
    },
  },
});

// Action creators are generated for each case reducer function
export const { adminOutlet, getAllStations } = outletSlice.actions;

export default outletSlice.reducer;
