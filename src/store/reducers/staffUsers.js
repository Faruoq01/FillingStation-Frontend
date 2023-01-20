import { 
    STAFF_USER,
    SEARCH_USERS,
    LOGOUT
} from '../types'

const initialState = {
    staffUsers: [],
    searchData: [],
}

const staffUserReducer = (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {

        case STAFF_USER:{
            return {
                ...state,
                staffUsers: payload,
                searchData: payload,
            }
        }

        case SEARCH_USERS:{
            const search = state.searchData.filter(data => !data.staffName.toUpperCase().indexOf(payload.toUpperCase()) ||
                !data.email.toUpperCase().indexOf(payload.toUpperCase())
            );
            return {
                ...state,
                staffUsers: search,
            }
        }

        case LOGOUT:{
            return {
                ...state,
                staffUsers: [],
                searchData: [],
            }
        }

        default: {
            return state
        }
    }
}

export default staffUserReducer;