import { 
    ANALYSIS_DATA,
    LOGOUT
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
}

const analysisReducer = (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {

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