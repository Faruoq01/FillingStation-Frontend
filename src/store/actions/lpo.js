import {
  CREATE_LPO,
  CREATE_LPO_SALES,
  SEARCH_LPO_LIST,
  SEARCH_LPO,
  SINGLE_LPO,
} from "../types";

export const createLPO = (params) => (dispatch) => {
  dispatch(CREATE_LPO(params));
};

export const createLPOSales = (params) => (dispatch) => {
  dispatch({ type: CREATE_LPO_SALES, payload: params });
};

export const searchLPOList = (params) => (dispatch) => {
  dispatch({ type: SEARCH_LPO_LIST, payload: params });
};

export const searchLPO = (params) => (dispatch) => {
  dispatch(SEARCH_LPO(params));
};

export const singleLPORecord = (params) => (dispatch) => {
  dispatch({ type: SINGLE_LPO, payload: params });
};
