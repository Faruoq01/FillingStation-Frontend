import { combineReducers } from 'redux';
import authReducer from './reducers/auth';
import outletReducer from './reducers/outlet';
import lpoReducer from './reducers/lpo';
import productOrderReducer from './reducers/productOrder';
import incomingOrderReducer from './reducers/incomingOrder';
import supplyReducer from './reducers/supply';
import paymentReducer from './reducers/payment';
import tankUpdateReducer from './reducers/tankUpdate';
import adminUserReducer from './reducers/adminUser';
import staffUserReducer from './reducers/staffUsers';
import salaryReducer from './reducers/salary';
import queryReducer from './reducers/query';
import attendanceReducer from './reducers/attendance';
import expenseReducer from './reducers/expense';
import recordPaymentReducer from './reducers/recordPayments';
import dailySalesReducer from './reducers/dailySales';
import dashboardReducer from './reducers/dashboard';
import analysisReducer from './reducers/analysis';
import dailyRecordReducer from './reducers/dailyRecordReducer';
import recordsReducer from './reducers/records';

export default combineReducers({
    authReducer,
    outletReducer,
    lpoReducer,
    productOrderReducer,
    incomingOrderReducer,
    supplyReducer,
    paymentReducer,
    tankUpdateReducer,
    adminUserReducer,
    staffUserReducer,
    salaryReducer,
    queryReducer,
    attendanceReducer,
    expenseReducer,
    recordPaymentReducer,
    dailySalesReducer,
    dashboardReducer,
    analysisReducer,
    dailyRecordReducer,
    recordsReducer
})