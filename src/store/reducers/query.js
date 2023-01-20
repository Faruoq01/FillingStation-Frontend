import { 
    QUERY,
    SEARCH_QUERY,
    LOGOUT
} from '../types'

const initialState = {
    query: [],
    searchData: [],
}

const queryReducer = (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {

        case QUERY:{
            return {
                ...state,
                query: payload,
                searchData: payload,
            }
        }

        case SEARCH_QUERY:{
            const search = state.searchData.filter(data => !data.employeeName.toUpperCase().indexOf(payload.toUpperCase()) ||
                !data.queryTitle.toUpperCase().indexOf(payload.toUpperCase())
            );
            return {
                ...state,
                query: search,
            }
        }

        case LOGOUT:{
            return {
                ...state,
                query: [],
                searchData: [],
            }
        }

        default: {
            return state
        }
    }
}

export default queryReducer;