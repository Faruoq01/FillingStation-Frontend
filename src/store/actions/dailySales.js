import { 
    SALES_DATA, 
    EXPENSES_AND_PAYMENTS,
    DAILY_INCOMING_ORDER,
    CUMMULATIVES,
    DAILY_SALES_SUPPLY,
    LPO_RECORDS,
    PAYMENTS_RECORDS,
    BULK_REPORTS,
    RECORD_SALES,
    BALANCE_BF,
    PMS_BBF,
    AGO_BBF,
    DPK_BBF
} from '../types';

export const passAllDailySales = (params) => dispatch => {
    dispatch({ type: SALES_DATA, payload: params});
}

export const passExpensesAndPayments = (params) => dispatch => {
    dispatch({ type: EXPENSES_AND_PAYMENTS, payload: params});
}

export const passIncomingOrder = (params) => dispatch => {
    dispatch({ type: DAILY_INCOMING_ORDER, payload: params});
}

export const passCummulative = (params) => dispatch => {
    dispatch({ type: CUMMULATIVES, payload: params});
}

export const dailySupplies = (params) => dispatch => {
    dispatch({ type: DAILY_SALES_SUPPLY, payload: params});
}

export const lpoRecords = (params) => dispatch => {
    dispatch({ type: LPO_RECORDS, payload: params});
}

export const paymentRecords = (params) => dispatch => {
    dispatch({type: PAYMENTS_RECORDS, payload: params})
}

export const bulkReports = (params) => dispatch => {
    dispatch({type: BULK_REPORTS, payload: params})
}

export const passRecordSales = (params) => dispatch => {
    dispatch({ type: RECORD_SALES, payload: params});
}

export const saveBalanceBF = (params) => dispatch => {
    dispatch({ type: BALANCE_BF, payload: params});
}

export const pmsBBF = (params) => dispatch => {
    dispatch({ type: PMS_BBF, payload: params});
}

export const agoBBF = (params) => dispatch => {
    dispatch({ type: AGO_BBF, payload: params});
}

export const dpkBBF = (params) => dispatch => {
    dispatch({ type: DPK_BBF, payload: params});
}


