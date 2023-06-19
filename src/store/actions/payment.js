import {
  PAYMENT,
  CERTIFICATE,
  RECEIPT,
  SEARCH_PAYMENT,
  SINGLE_PAYMENT,
  E_STATIOPN_SINGLE_PAYMENT,
} from "../types";

export const createPayment = (params) => (dispatch) => {
  dispatch({ type: PAYMENT, payload: params });
};

export const certificate = (params) => (dispatch) => {
  dispatch({ type: CERTIFICATE, payload: params });
};

export const reciepts = (params) => (dispatch) => {
  dispatch({ type: RECEIPT, payload: params });
};

export const searchPayment = (params) => (dispatch) => {
  dispatch({ type: SEARCH_PAYMENT, payload: params });
};

export const singlePaymentAction = (params) => (dispatch) => {
  dispatch({ type: SINGLE_PAYMENT, payload: params });
};
export const eStationSinglePaymentAction = (params) => (dispatch) => {
  dispatch({ type: E_STATIOPN_SINGLE_PAYMENT, payload: params });
};
