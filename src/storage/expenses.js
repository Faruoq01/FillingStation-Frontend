import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expense: [],
  searchData: [],
};

export const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    allExpenses: (state, action) => {
      state.expense = action.payload;
      state.searchData = action.payload;
    },
    searchExpenses: (state, action) => {
      const search = state.searchData.filter(
        (data) =>
          !data.expenseName
            .toUpperCase()
            .indexOf(action.payload.toUpperCase()) ||
          !data.dateCreated.toUpperCase().indexOf(action.payload.toUpperCase())
      );
      state.expense = search;
    },
  },
});

// Action creators are generated for each case reducer function
export const { allExpenses, searchExpenses } = expensesSlice.actions;

export default expensesSlice.reducer;
