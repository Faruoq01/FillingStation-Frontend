import { 
    UPDATE_PUMPS,
    SELECTED_PUMPS,
    DESELECT_PUMP_LIST,
    UPDATE_LOAD,
    CHAMGE_STATION,
    CHANGE_DATE
} from '../types';

export const updateRecords = (params) => dispatch => {
    dispatch({ type: UPDATE_PUMPS, payload: params});
}

export const selectedListPumps = (params) => dispatch => {
    dispatch({ type: SELECTED_PUMPS, payload: params});
}

export const desselectedListPumps = (params) => dispatch => {
    dispatch({ type: DESELECT_PUMP_LIST, payload: params});
}

export const updatePayload = (params) => dispatch => {
    dispatch({ type: UPDATE_LOAD, payload: params});
}

export const changeStation = (params) => dispatch => {
    dispatch({ type: CHAMGE_STATION, payload: params});
}

export const changeDate = (params) => dispatch => {
    dispatch({ type: CHANGE_DATE, payload: params});
}

