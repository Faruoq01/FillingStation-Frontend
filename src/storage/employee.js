import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  staffUsers: [],
  searchData: [],
  singleEmployee: {},
};

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    storeStaffUsers: (state, action) => {
      state.staffUsers = action.payload;
      state.searchData = action.payload;
    },
    searchStaffs: (state, action) => {
      const search = state.searchData.filter(
        (data) =>
          !data.staffName.toUpperCase().indexOf(action.payload.toUpperCase()) ||
          !data.email.toUpperCase().indexOf(action.payload.toUpperCase())
      );
      state.staffUsers = search;
    },
    singleEmployee: (state, action) => {
      state.singlePayment = action.payload;
    },
    clearEmployees: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const { storeStaffUsers, searchStaffs, singleEmployee, clearEmployees } =
  employeeSlice.actions;

export default employeeSlice.reducer;
