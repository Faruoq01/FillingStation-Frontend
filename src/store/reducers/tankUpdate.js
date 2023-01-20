import { 
    TANK_UPDATE,
    LOGOUT
} from '../types'

const initialState = {
    tankUpdate: [],
}

const tankUpdateReducer = (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {

        case TANK_UPDATE:{
            return {
                ...state,
                tankUpdate: payload,
            }
        }

        case LOGOUT:{
            return {
                ...state,
                tankUpdate: [],
            }
        }

        default: {
            return state
        }
    }
}

export default tankUpdateReducer;