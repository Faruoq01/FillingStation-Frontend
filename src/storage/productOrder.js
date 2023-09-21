import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productorder: [],
  searchData: [],
  singleProductOrder: {},
  deliveredProduct: [],
};

export const productSlice = createSlice({
  name: "productorder",
  initialState,
  reducers: {
    setProductOrder: (state, action) => {
      state.productorder = action.payload;
      state.searchData = action.payload;
    },
    singleProductOrderRecord: (state, action) => {
      state.singleProductOrder = action.payload;
    },
    searchProduct: (state, action) => {
      const search = state.searchData.filter(
        (data) =>
          !data.depot.toUpperCase().indexOf(action.payload.toUpperCase()) ||
          !data.status.toUpperCase().indexOf(action.payload.toUpperCase())
      );
      state.productorder = search;
    },
    setDeliveredProduct: (state, action) => {
      state.deliveredProduct = action.payload;
    },
    clearProductOrder: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const {
  setProductOrder,
  singleProductOrderRecord,
  searchProduct,
  clearProductOrder,
  setDeliveredProduct,
} = productSlice.actions;

export default productSlice.reducer;
