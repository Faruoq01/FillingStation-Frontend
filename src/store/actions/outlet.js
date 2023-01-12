import OutletService from '../../services/outletService';
import { 
    SPINNER, 
    REMOVE_SPINNER, 
    OPEN_MODAL, 
    CLOSE_MODAL, 
    NEW_OUTLET, 
    NEW_TANK,
    TANK_LIST,
    OUTLET_DATA,
    PUMP_LIST,
    SEARCH_USERS,
    ONE_TANK,
    ONE_STATION,
    SEARCH_STATION,
    SELECTED_PUMPS,
    DESELECTED_PUMPS,
    ADMIN_OUTLET,
    FILTER_PUMPS_RECORD,
    FILTER_TANKS_RECORD,
    TANK_LIST_TYPE
} from '../types';

export const createFillingStation = (params) => dispatch => {
    return OutletService.registerFillingStation(params)
    .then(data => {
        dispatch({ type: NEW_OUTLET, payload: data});
    })
    .catch(err => {
            
    })
}

export const getAllStations = (params) => dispatch => {
    dispatch({ type: OUTLET_DATA, payload: params});
}

export const createTanks = (params) => dispatch => {
    return OutletService.registerTanks(params)
    .then(data => {
        dispatch({type: NEW_TANK, payload: data});
    })
    .catch(err => {
            
    })
}

export const getAllOutletTanks = (params) => dispatch => {
    dispatch({ type: TANK_LIST, payload: params});
}

export const createPumps = (params) => dispatch => {
    return OutletService.registerPumps(params)
    .then(data => {
        console.log(data)
    })
    .catch(err => {
            
    })
}

export const getAllPumps = (params) => dispatch => {
    dispatch({ type: PUMP_LIST, payload: params});
}

export const selectPumps = (params) => dispatch => {
    dispatch({ type: SELECTED_PUMPS, payload: params});
}

export const deselectPumps = (params) => dispatch => {
    dispatch({ type: DESELECTED_PUMPS, payload: params});
}

export const openModal = (param) => dispatch => {
    dispatch({ type: OPEN_MODAL, payload: param })
}

export const closeModal = (param) => dispatch => {
    dispatch({ type: CLOSE_MODAL, payload: param })
}

export const setSpinner = () => dispatch => {
    dispatch({ type: SPINNER })
}

export const removeSpinner = () => dispatch => {
    dispatch({ type: REMOVE_SPINNER })
}

export const searchTanks = (params) => dispatch => {
    dispatch({ type: SEARCH_USERS, payload: params });
}

export const getOneTank = (params) => dispatch => {
    dispatch({ type: ONE_TANK, payload: params });
}

export const oneStation = (params) => dispatch => {
    dispatch({type: ONE_STATION, payload: params});
}

export const adminOutlet = (params) => dispatch => {
    dispatch({type: ADMIN_OUTLET, payload: params});
}

export const searchStations = (params) => dispatch => {
    dispatch({ type: SEARCH_STATION, payload: params });
}

export const filterPumpsRecordSales = (params) => dispatch => {
    dispatch({ type: FILTER_PUMPS_RECORD, payload: params });
}

export const filterTanksRecordSales = (params) => dispatch => {
    dispatch({ type: FILTER_TANKS_RECORD, payload: params });
}

export const tankListType = (params) => dispatch => {
    dispatch({ type: TANK_LIST_TYPE, payload: params });
}


