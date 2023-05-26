import {
  CREATE_INCOMING_ORDER,
  SEARCH_INCOMING_ORDERS,
  SINGLE_INCOMING_ORDER,
} from "../types";

export const createIncomingOrder = (params) => (dispatch) => {
  dispatch({ type: CREATE_INCOMING_ORDER, payload: params });
};

export const searchIncoming = (params) => (dispatch) => {
  dispatch({ type: SEARCH_INCOMING_ORDERS, payload: params });
};
export const singleIncomingOrderRecord = (params) => (dispatch) => {
  dispatch({ type: SINGLE_INCOMING_ORDER, payload: params });
};
