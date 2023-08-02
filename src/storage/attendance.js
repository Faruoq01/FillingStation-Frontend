import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  attendance: [],
  searchData: [],
};

export const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    createAttendance: (state, action) => {
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
    clearAttendance: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const { createAttendance, searchQuery, clearAttendance } =
  attendanceSlice.actions;

export default attendanceSlice.reducer;
