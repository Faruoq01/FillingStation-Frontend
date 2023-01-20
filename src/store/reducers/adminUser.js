import { 
    ADMIN_USER,
    SEARCH_USERS,
    LOGOUT
} from '../types'

const initialState = {
    adminUsers: [],
    searchData: [],
}

const adminUserReducer = (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {

        case ADMIN_USER:{
            return {
                ...state,
                adminUsers: payload,
                searchData: payload,
            }
        }

        case SEARCH_USERS:{
            const search = state.searchData.filter(data => !data.staffName.toUpperCase().indexOf(payload.toUpperCase()) ||
                !data.email.toUpperCase().indexOf(payload.toUpperCase())
            );
            return {
                ...state,
                adminUsers: search,
            }
        }

        case LOGOUT:{
            return {
                ...state,
                adminUsers: [],
                searchData: [],
            }
        }

        default: {
            return state
        }
    }
}

export default adminUserReducer;