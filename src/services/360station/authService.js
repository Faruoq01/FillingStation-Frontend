import APIs from '../connections/api';
import swal from 'sweetalert';
import { removeSpinner } from '../../storage/outlet';
import { store } from '../../storage/store';

const AuthService = {
 register: async (data) => {
  try {
   const { data: data_1 } = await APIs.post('/register', data);
   store.dispatch(removeSpinner());
   if (data_1.status === 200)
    swal('Success!', 'User registration successful', 'success');
   return data_1;
  } catch (err) {
   store.dispatch(removeSpinner());
   console.log('Auth service err', err);
   throw err;
  }
 },

 login: async (data) => {
  try {
   const { data: data_1 } = await APIs.post('/login', data);
   window?.ReactNativeWebView?.postMessage(
    JSON.stringify({ type: 'auth', auth_data: data_1 }),
   );
   setHeadersAndStorage(data_1);
   return data_1;
  } catch (err) {
   store.dispatch(removeSpinner());
   console.log('Auth service err', err);
   throw err;
  }
 },

 logout: () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
 },
};

const setHeadersAndStorage = (data) => {
 APIs.defaults.headers['Authorization'] = `Bearer ${data.token}`;
 localStorage.setItem('user', JSON.stringify(data.user));
 localStorage.setItem('token', data.token);
};

export default AuthService;
