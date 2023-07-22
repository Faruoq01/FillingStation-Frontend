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
  dispatch(CREATE_LPO_SALES(params));
};

export const searchLPOList = (params) => (dispatch) => {
  dispatch(SEARCH_LPO_LIST(params));
};

export const searchLPO = (params) => (dispatch) => {
  dispatch(SEARCH_LPO(params));
};

export const singleLPORecord = (params) => (dispatch) => {
  dispatch(SINGLE_LPO(params));
};
