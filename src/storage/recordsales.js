import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  PMS: [],
  AGO: [],
  DPK: [],
  selectedPumps: [],
  selectedTanks: [],
  load: {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
  },
  currentDate: null,
  linkedData: { page: 1 },
  lpo: [],
  searchData2: [],
};

export const recordsalesSlice = createSlice({
  name: "recordsales",
  initialState,
  reducers: {
    changeDate: (state, action) => {
      state.currentDate = action.payload;
    },
    changeStation: (state, action) => {
      state.currentDate = action.payload;
      state.PMS = [];
      state.AGO = [];
      state.DPK = [];
      state.selectedPumps = [];
      state.selectedTanks = [];
      state.load = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
      };
    },
    updatePayload: (state, action) => {
      state.load = action.payload;
    },
    passRecordSales: (state, action) => {
      state.linkedData = action.payload;
    },
    createLPO: (state, action) => {
      state.lpo = action.payload;
      state.searchData2 = action.payload;
    },
    desselectedListPumps: (state, action) => {
      const removePump = () => {
        const currentList = [...state.selectedPumps];
        const filteredPump = currentList.filter(
          (data) => data._id !== action.payload.selected._id
        );

        return filteredPump;
      };

      const removeTank = () => {
        const currentList = [...state.selectedPumps];
        const currentTankList = [...state.selectedTanks];
        const loads = { ...state.load };
        const availableID = currentList.filter(
          (data) => data.hostTank === action.payload.tank._id
        );

        if (availableID.length === 0) {
          const filteredTank = currentTankList.filter(
            (data) => data._id !== action.payload.tank._id
          );
          const filteredPayload = loads["1"].filter(
            (data) => data._id !== action.payload.tank._id
          );

          return { list: filteredTank, pay: filteredPayload };
        } else {
          return { list: currentTankList, pay: loads["1"] };
        }
      };
      state.selectedPumps = removePump();
      state.selectedTanks = removeTank().list;
      state.load = {
        0: state.load["0"],
        1: removeTank().pay,
        2: state.load["2"],
        3: state.load["3"],
        4: state.load["4"],
        5: state.load["5"],
        6: state.load["6"],
        7: state.load["7"],
        8: state.load["8"],
      };
    },
    selectedListPumps: (state, action) => {
      const updateSelectedPumps = () => {
        const currentList = [...state.selectedPumps];
        const findID = currentList.findIndex(
          (data) => data._id === action.payload.selected._id
        );

        if (findID === -1) {
          return [...currentList, action.payload.selected];
        } else {
          currentList[findID] = action.payload.selected;
          return currentList;
        }
      };

      const updateSelectedTanks = () => {
        const currentList = [...state.selectedTanks];
        const findID = currentList.findIndex(
          (data) => data._id === action.payload.tank._id
        );

        if (findID === -1) {
          return [...currentList, action.payload.tank];
        } else {
          currentList[findID] = action.payload.tank;
          return currentList;
        }
      };
      state.selectedPumps = updateSelectedPumps();
      state.selectedTanks = updateSelectedTanks();
    },
    updateSelectedPumps: (state, action) => {
      state.selectedPumps = action.payload;
    },
    updateSelectedTanks: (state, action) => {
      state.selectedTanks = action.payload;
    },
    updateRecords: (state, action) => {
      state.PMS = action.payload.pms;
      state.AGO = action.payload.ago;
      state.DPK = action.payload.dpk;
    },
    updatePmsList: (state, action) => {
      state.PMS = action.payload;
    },
    updateAgoList: (state, action) => {
      state.AGO = action.payload;
    },
    updateDpkList: (state, action) => {
      state.DPK = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  changeDate,
  changeStation,
  updatePayload,
  passRecordSales,
  desselectedListPumps,
  selectedListPumps,
  updateSelectedPumps,
  updateSelectedTanks,
  updateRecords,
  updatePmsList,
  updateAgoList,
  updateDpkList,
  createLPO,
} = recordsalesSlice.actions;

export default recordsalesSlice.reducer;
