import { 
    CREATE_PRODUCT_ORDER ,
    SEARCH_PRODUCT_ORDER,
    LOGOUT
} from '../types'

const initialState = {
    productOrder: [],
    searchData: []
}

const productOrderReducer = (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {

        case CREATE_PRODUCT_ORDER:{
            return {
                ...state,
                productOrder: payload,
                searchData: payload
            }
        }

        case SEARCH_PRODUCT_ORDER:{
            const search = state.searchData.filter(data => !data.depot.toUpperCase().indexOf(payload.toUpperCase()) ||
                !data.status.toUpperCase().indexOf(payload.toUpperCase())
            );
            return {
                ...state,
                productOrder: search,
            }
        }

        case LOGOUT:{
            return {
                ...state,
                productOrder: [],
                searchData: []
            }
        }

        default: {
            return state
        }
    }
}

export default productOrderReducer;