import {
  PAYMENT,
  CERTIFICATE,
  RECEIPT,
  SEARCH_PAYMENT,
  LOGOUT,
  SINGLE_PAYMENT,
  E_STATIOPN_SINGLE_PAYMENT,
} from "../types";

const initialState = {
  payment: [],
  certificate: {},
  receipt: {},
  searchData: [],
  singlePayment: {},
  eStationSinglePayment: {},
};

const paymentReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case PAYMENT: {
      return {
        ...state,
        payment: payload,
        searchData: payload,
      };
    }

    case RECEIPT: {
      return {
        ...state,
        receipt: payload,
      };
    }
    case E_STATIOPN_SINGLE_PAYMENT: {
      return {
        ...state,
        eStationSinglePayment: payload,
      };
    }

    case CERTIFICATE: {
      return {
        ...state,
        certificate: payload,
      };
    }

    case SEARCH_PAYMENT: {
      const search = state.searchData.filter(
        (data) =>
          !data.organisationalName
            .toUpperCase()
            .indexOf(payload.toUpperCase()) ||
          !data.contactPerson.toUpperCase().indexOf(payload.toUpperCase())
      );
      return {
        ...state,
        payment: search,
      };
    }
    case SINGLE_PAYMENT: {
      return {
        ...state,
        singlePayment: payload,
      };
    }

    case LOGOUT: {
      return {
        ...state,
        payment: [],
        certificate: {},
        receipt: {},
        searchData: [],
      };
    }

    default: {
      return state;
    }
  }
};

export default paymentReducer;
