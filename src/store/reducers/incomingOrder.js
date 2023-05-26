import {
  CREATE_INCOMING_ORDER,
  SEARCH_INCOMING_ORDERS,
  SINGLE_INCOMING_ORDER,
  LOGOUT,
} from "../types";

const initialState = {
  incomingOrder: [],
  searchData: [],
  singleIncomingOrder: {},
};

const incomingOrderReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case CREATE_INCOMING_ORDER: {
      const incoming = payload.map((data) => {
        return { ...data, value: JSON.stringify(data), label: data.wayBillNo };
      });
      return {
        ...state,
        incomingOrder: incoming,
        searchData: incoming,
      };
    }

    case SEARCH_INCOMING_ORDERS: {
      const search = state.searchData.filter(
        (data) =>
          !data.depotStation.toUpperCase().indexOf(payload.toUpperCase()) ||
          !data.product.toUpperCase().indexOf(payload.toUpperCase()) ||
          !data.wayBillNo.toUpperCase().indexOf(payload.toUpperCase())
      );
      return {
        ...state,
        incomingOrder: search,
      };
    }
    case SINGLE_INCOMING_ORDER: {
      return {
        ...state,
        singleIncomingOrder: payload,
      };
    }

    case LOGOUT: {
      return {
        ...state,
        incomingOrder: [],
        searchData: [],
      };
    }

    default: {
      return state;
    }
  }
};

export default incomingOrderReducer;
