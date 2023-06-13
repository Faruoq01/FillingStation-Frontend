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

const lpoReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_LPO: {
      return {
        ...state,
        lpo: payload,
        searchData2: payload,
      };
    }

    case SINGLE_LPO: {
      return {
        ...state,
        singleLPO: payload,
      };
    }

    case CREATE_LPO_SALES: {
      return {
        ...state,
        lpoSales: payload,
        searchData: payload,
      };
    }

    case SEARCH_LPO_LIST: {
      const search = state.searchData.filter(
        (data) =>
          !data.accountName.toUpperCase().indexOf(payload.toUpperCase()) ||
          !data.productType.toUpperCase().indexOf(payload.toUpperCase())
      );
      return {
        ...state,
        lpoSales: search,
      };
    }

    case SEARCH_LPO: {
      const search = state.searchData2.filter(
        (data) =>
          !data.companyName.toUpperCase().indexOf(payload.toUpperCase()) ||
          !data.paymentStructure.toUpperCase().indexOf(payload.toUpperCase())
      );
      return {
        ...state,
        lpo: search,
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
