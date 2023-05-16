import { 
    ANALYSIS_DATA,
    LOGOUT,
    HISTORY_TAG
} from '../types'

const initialState = {
    analysisData: {
        sales: [],
        lpo: [],
        rtVolumes: [],
        payments: [],
        pospayment: [],
        expenses: [],
        dipping: [{}],
    },
    historyTag: "All tags",
}

const analysisReducer = (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {

        case HISTORY_TAG:{
            return {
                ...state,
                historyTag: payload
            }
        }

        case ANALYSIS_DATA:{
            return {
                ...state,
                analysisData: payload
            }
        }

        case LOGOUT:{
            return {
                ...state,
                analysisData: {
                    sales: [],
                    lpo: [],
                    rtVolumes: [],
                    payments: [],
                    pospayment: [],
                    expenses: [],
                    dipping: []
                },
            }
        }

        default: {
            return state
        }
    }
}

export default analysisReducer;