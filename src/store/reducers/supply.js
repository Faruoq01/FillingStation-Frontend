import {
  SUPPLY,
  SEARCH_SUPPLY,
  PENDING_SUPPLY,
  LOGOUT,
  SINGLE_SUPPLY,
} from "../types";

const initialState = {
  supply: [],
  searchData: [],
  pendingSupply: [],
  singleSupply: {},
};

const supplyReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SUPPLY: {
      return {
        ...state,
        supply: payload,
        searchData: payload,
      };
    }

    case SEARCH_SUPPLY: {
      const search = state.searchData.filter(
        (data) =>
          !data.transportationName
            .toUpperCase()
            .indexOf(payload.toUpperCase()) ||
          !data.productType.toUpperCase().indexOf(payload.toUpperCase())
      );
      return {
        ...state,
        supply: search,
      };
    }
    case SINGLE_SUPPLY: {
      return {
        ...state,
        singleSupply: payload,
      };
    }

    case PENDING_SUPPLY: {
      return {
        ...state,
        pendingSupply: payload,
      };
    }

    case LOGOUT: {
      return {
        ...state,
        supply: [],
        searchData: [],
        pendingSupply: [],
      };
    }

    default: {
      return state;
    }
  }
};

export default supplyReducer;
