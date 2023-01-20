import { 
    DAILY_ALL_STATIONS, 
    ADMIN_STATION,
    FORM_STATION,
    LOGOUT
} from '../types';

const initialState = {
    allAdminStations: [{}],
    singleAdminStation: {},
    formStation: null,
}

const dailyRecordReducer = (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {

        case DAILY_ALL_STATIONS:{
            return {
                ...state,
                allAdminStations: payload,
            }
        }

        case ADMIN_STATION:{
            return {
                ...state,
                singleAdminStation: payload,
            }
        }

        case FORM_STATION:{
            return{
                ...state,
                formStation: payload
            }
        }

        case LOGOUT:{
            return {
                ...state,
                allAdminStations: [{}],
                singleAdminStation: {},
                formStation: null,
            }
        }

        default: {
            return state
        }
    }
}

export default dailyRecordReducer;