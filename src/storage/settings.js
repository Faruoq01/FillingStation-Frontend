import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employees: [],
  searchData: [],
  singleUser: {},
};

export const settingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    changeAllEmployeeStatus: (state, action) => {
      const newList = [...state.employees];
      const updated = newList.map((data) => {
        return { ...data, selected: action.payload ? "1" : "0" };
      });

      state.employees = updated;
    },
    changeEmployeeStatus: (state, action) => {
      const newList = [...state.employees];
      const findID = newList.findIndex(
        (data) => data._id === action.payload._id
      );
      newList[findID] = action.payload;
      state.employees = newList;
    },
    dashEmployees: (state, action) => {
      const addSelection = action.payload.map((item) => {
        return { ...item, selected: "0" };
      });

      state.employees = addSelection;
      state.searchData = action.payload;
    },
    storeSingleUser: (state, action) => {
      state.singleUser = action.payload;
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
} = settingSlice.actions;

export default settingSlice.reducer;
