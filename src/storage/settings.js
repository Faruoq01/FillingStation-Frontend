import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employees: [],
  orgEmployee: [],
  searchData: [],
  singleUser: {},
  selectedUsers: [],
  loader: false
};

export const settingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    changeAllEmployeeStatus: (state, action) => {
      const newList = [...state.orgEmployee];
      const updated = newList.map((data) => {
        return { ...data, selected: action.payload ? "1" : "0" };
      });
      const filterSelected = updated.filter((data) => data.selected === "1");

      state.orgEmployee = updated;
      state.selectedUsers = filterSelected;
    },
    changeEmployeeStatus: (state, action) => {
      const newList = [...state.orgEmployee];
      const findID = newList.findIndex(
        (data) => data._id === action.payload._id
      );
      newList[findID] = action.payload;
      const filterSelected = newList.filter((data) => data.selected === "1");
      state.orgEmployee = newList;
      state.selectedUsers = filterSelected;
    },
    dashEmployees: (state, action) => {
      state.employees = action.payload;
    },
    settingsEmployee: (state, action) => {
      const addSelection = action.payload.map((item) => {
        return { ...item, selected: "0" };
      });

      state.orgEmployee = addSelection;
      state.searchData = action.payload;
    },
    storeSingleUser: (state, action) => {
      state.singleUser = action.payload;
    },
    saveSelectedUsers: (state, action) => {
      state.selectedUsers = action.payload;
    },
    setLoader: (state, action) => {
      state.loader = action.payload;
    },
    clearSetting: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const {
  changeAllEmployeeStatus,
  changeEmployeeStatus,
  dashEmployees,
  storeSingleUser,
  clearSetting,
  settingsEmployee,
  saveSelectedUsers,
  setLoader
} = settingSlice.actions;

export default settingSlice.reducer;
