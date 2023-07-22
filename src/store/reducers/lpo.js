import { createReducer } from "@reduxjs/toolkit";
import {
  CREATE_LPO,
  CREATE_LPO_SALES,
  SEARCH_LPO_LIST,
  SEARCH_LPO,
  SINGLE_LPO,
  LOGOUT,
} from "../types";

const initialState = {
  lpo: [],
  lpoSales: [],
  searchData: [],
  searchData2: [],
  singleLPO: {},
};

const lpoReducerw = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case CREATE_LPO_SALES: {
      return {
        ...state,
        lpoSales: payload,
        searchData: payload,
      };
    }

    case LOGOUT: {
      return {
        ...state,
        lpo: [],
        lpoSales: [],
        searchData: [],
        searchData2: [],
        singleLPO: {},
      };
    }

    default: {
      return state;
    }
  }
};

export default lpoReducer;

const ASSET_MODAL = createAction < boolean > "asset-modal/action";
const lpoReducer = createReducer(initialState, (builder) => {
  builder.addCase(LOGOUT, (state, action) => ({
    ...state,
    lpo: [],
    lpoSales: [],
    searchData: [],
    searchData2: [],
    singleLPO: {},
  }));
  builder.addCase(SINGLE_LPO, (state, action) => ({
    ...state,
    singleLPO: action.payload,
  }));
  builder.addCase(SEARCH_LPO_LIST, (state, action) => {
    const search = state.searchData.filter(
      (data) =>
        !data.accountName.toUpperCase().indexOf(action.payload.toUpperCase()) ||
        !data.productType.toUpperCase().indexOf(action.payload.toUpperCase())
    );
    return {
      ...state,
      lpoSales: search,
    };
  });
  builder.addCase(CREATE_LPO_SALES, (state, action) => ({
    ...state,
    lpoSales: action?.payload,
    searchData: action?.payload,
  }));
  builder.addCase(CREATE_LPO, (state, action) => ({
    ...state,
    lpo: action.payload,
    searchData2: action.payload,
  }));
  builder.addCase(SEARCH_LPO, (state, action) => {
    const search = state.searchData2.filter(
      (data) =>
        !data.companyName.toUpperCase().indexOf(action.payload.toUpperCase()) ||
        !data.paymentStructure
          .toUpperCase()
          .indexOf(action.payload.toUpperCase())
    );
    return {
      ...state,
      lpo: search,
    };
  });
});

export { ASSET_MODAL, ITEMS_MODAL };
