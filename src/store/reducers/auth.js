import { LOGIN, LOGOUT, SPINNER, REMOVE_SPINNER, UPDATE_USER_DATA, CONNECTION_ERROR } from '../types'

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || {},
    token: localStorage.getItem('token') || '',
    isLoggedIn: !!JSON.parse(localStorage.getItem('user')),
    loadingSpinner: false,
    connection: true,
}

const authReducer = (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {

        case LOGIN:{
            return {
                ...state,
                user: payload.user,
                token: payload.token,
                isLoggedIn: true,
                loadingSpinner: false,
            }
        }

        case LOGOUT:{
            return {
                ...state,
                user: {},
                token: '',
                isLoggedIn: false
            }
        }

        case SPINNER:{
            return {
                ...state,
                loadingSpinner: true,
            }
        }

        case REMOVE_SPINNER:{
            return {
                ...state,
                loadingSpinner: false,
            }
        }

        case UPDATE_USER_DATA: {
            return {
                ...state,
                user: payload
            }
        }

        case CONNECTION_ERROR: {
            return {
                ...state,
                connection: payload
            }
        }

        default: {
            return state
        }
    }

}

export default authReducer