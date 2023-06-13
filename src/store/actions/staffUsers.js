import { STAFF_USER, SEARCH_USERS, SINGLE_EMPLOYEE } from "../types";

export const storeStaffUsers = (params) => (dispatch) => {
  dispatch({ type: STAFF_USER, payload: params });
};

export const searchStaffs = (params) => (dispatch) => {
  dispatch({ type: SEARCH_USERS, payload: params });
};
export const singleEmployee = (params) => (dispatch) => {
  dispatch({ type: SINGLE_EMPLOYEE, payload: params });
};
