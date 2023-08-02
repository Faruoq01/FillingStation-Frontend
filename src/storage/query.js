import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: [],
  searchData: [],
};

export const querySlice = createSlice({
  name: "query",
  initialState,
  reducers: {
    createQuery: (state, action) => {
      state.query = action.payload;
      state.searchData = action.payload;
    },
    searchQuery: (state, action) => {
      const search = state.searchData.filter(
        (data) =>
          !data.employeeName
            .toUpperCase()
            .indexOf(action.payload.toUpperCase()) ||
          !data.queryTitle.toUpperCase().indexOf(action.payload.toUpperCase())
      );
      state.query = search;
    },
    clearQuery: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const { createQuery, searchQuery, clearQuery } = querySlice.actions;

export default querySlice.reducer;
