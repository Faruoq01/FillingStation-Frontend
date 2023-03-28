import AuthService from '../../services/authService';
import { LOGIN, LOGOUT, SPINNER, REMOVE_SPINNER, UPDATE_USER_DATA, CONNECTION_ERROR } from '../types';

export const login = (params, history) => dispatch => {
    
    return AuthService.login(params)
    .then(data => {
        const auth = data.user.userType === "admin" || data.user.userType === "superAdmin" || data.user.userType === "staff";
        dispatch({ type: LOGIN, payload: data });
        if(!("status" in data.user) && data.user.userType === "superAdmin" ) history.push('/home');
        if(auth && data.user.status === "1" ) history.push('/home');
    })
    .catch(err => {
            
    })
}

export const register = (params, props) => {
    return AuthService.register(params)
    .then(() => {
        props.reg(prev => !prev);
    })
    .catch(err => {
            
    })
}

export const setSpinner = () => dispatch => {
    dispatch({ type: SPINNER })
}

export const removeSpinner = () => dispatch => {
    dispatch({ type: REMOVE_SPINNER })
}

export const logout = () => dispatch => {
    AuthService.logout()
    dispatch({ type: LOGOUT })
}

export const updateUser = (param) => dispatch => {
    dispatch({ type: UPDATE_USER_DATA, payload: param })
}

export const network = (param) => dispatch => {
    dispatch({ type: CONNECTION_ERROR, payload: param })
}