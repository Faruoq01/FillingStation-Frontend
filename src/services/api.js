import axios from 'axios';
import store from '../store';
import { logout, network, removeSpinner } from '../store/actions/auth';
import swal from 'sweetalert';
import config from '../constants';

const APIs = axios.create({
    baseURL: `${config.BASE_URL}/360-station/api`,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    }
});

APIs.interceptors.response.use(
    res => {
        return res
    },
    err => {

        // network error
        if(err.code === "ERR_NETWORK"){
            store.dispatch(network(false));
        }

        if (err.response.status === 404) {
            swal("Error!", err.response.data.message, "error");
            store.dispatch(removeSpinner());
        }

        if (err.response.status === 401) {
            if (err.response.data.message !== "Incorrect password!") {
                if (err.response.data.error.name === 'TokenExpiredError') {
                    store.dispatch(logout());
                    window.location.href = "/login";
                    return
                }
            }

            swal("Error!", "Incorrect Password", "error");
            store.dispatch(logout());
        }
    }
);

export default APIs;