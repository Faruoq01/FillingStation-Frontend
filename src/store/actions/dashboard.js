import { 
    DASHBOARD,
    DASHBOARD_RECORDS,
    DASHBOARD_EMPLOYEES,
    STORE_SINGLE_USER,
    CHANGE_STATUS,
    CHANGE_ALL_STATUS,
    SEARCH_DASH,
    UTILS
} from '../types';

export const addDashboard = (params) => dispatch => {
    dispatch({ type: DASHBOARD, payload: params});
}

export const dashboardRecordMore = (params) => dispatch => {
    dispatch({ type: DASHBOARD_RECORDS, payload: params});
}

export const dashEmployees = (params) => dispatch => {
    dispatch({ type: DASHBOARD_EMPLOYEES, payload: params});
}

export const changeEmployeeStatus = (params) => dispatch => {
    dispatch({ type: CHANGE_STATUS, payload: params});
}

export const changeAllEmployeeStatus = (params) => dispatch => {
    dispatch({ type: CHANGE_ALL_STATUS, payload: params});
}

export const storeSingleUser = (params) => dispatch => {
    dispatch({ type: STORE_SINGLE_USER, payload: params});
}

export const searchdashStaffs = (params) => dispatch => {
    dispatch({ type: SEARCH_DASH, payload: params});
}

export const utils = (params) => dispatch => {
    dispatch({ type: UTILS, payload: params});
}
