import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  salary: [],
  searchData: [],
};

export const salarySlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    createSalary: (state, action) => {
      state.salary = action.payload;
      state.searchData = action.payload;
    },
    searchSalary: (state, action) => {
      const search = state.searchData.filter(
        (data) =>
          !data.position.toUpperCase().indexOf(action.payload.toUpperCase()) ||
          !data.level.toUpperCase().indexOf(action.payload.toUpperCase())
      );
      state.staffUsers = search;
    },
  },
});

// Action creators are generated for each case reducer function
export const { createSalary, searchSalary } = salarySlice.actions;

export default salarySlice.reducer;
