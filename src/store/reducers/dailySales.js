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
    DPK_BBF,
    LOGOUT,
    BAR_DATA,
    SUMMARY_RECORD_SALES
} from '../types'

const initialState = {
    dailySales: {},
    payments: {},
    dailyIncoming:[],
    cummulative: {},
    dailySupplies: {},
    lpoRecords: [],
    paymentRecords: {
        bankPayment: [],
        posPayment: [],
        expenses: []
    },
    bulkReports: {
        balances: {
            pms: null,
            ago: null,
            dpk: null
        },
        supply: [],
        sales: [],
        expenses: [],
        dipping: []
    },
    linkedData: { page: 1 },
    balanceBF: {},
    pmsBBF: {},
    agoBBF: {},
    dpkBBF: {},
    barData: {},
    summary: {},
}

const dailySalesReducer = (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {

        case SALES_DATA:{
            return {
                ...state,
                dailySales: payload,
            }
        }

        case EXPENSES_AND_PAYMENTS:{
            return {
                ...state,
                payments: payload
            }
        }

        case DAILY_INCOMING_ORDER: {
            return {
                ...state,
                dailyIncoming: payload
            }
        }

        case CUMMULATIVES: {
            return {
                ...state,
                cummulative: payload
            }
        }

        case DAILY_SALES_SUPPLY: {
            return {
                ...state,
                dailySupplies: payload
            }
        }

        case LPO_RECORDS:{
            return{
                ...state,
                lpoRecords: payload
            }
        }

        case PAYMENTS_RECORDS:{
            return{
                ...state,
                paymentRecords: payload
            }
        }

        case BULK_REPORTS: {
            return{
                ...state,
                bulkReports: payload
            }
        }

        case RECORD_SALES: {
            return{
                ...state,
                linkedData: payload
            }
        }

        case BALANCE_BF: {
            return {
                ...state,
                balanceBF: payload
            }
        }

        case PMS_BBF: {
            return {
                ...state,
                pmsBBF: payload
            }
        }

        case AGO_BBF: {
            return {
                ...state,
                agoBBF: payload
            }
        }

        case DPK_BBF: {
            return {
                ...state,
                dpkBBF: payload
            }
        }

        case BAR_DATA: {
            return {
                ...state,
                barData: payload
            }
        }

        case SUMMARY_RECORD_SALES: {
            return {
                ...state,
                summary: payload
            }
        }

        case LOGOUT:{
            return {
                ...state,
                dailySales: {},
                payments: {},
                dailyIncoming:[],
                cummulative: {},
                dailySupplies: {},
                lpoRecords: [],
                paymentRecords: {
                    bankPayment: [],
                    posPayment: [],
                    expenses: []
                },
                bulkReports: {},
                linkedData: { page: 1 },
                balanceBF: {},
                pmsBBF: {},
                agoBBF: {},
                dpkBBF: {}
            }
        }

        default: {
            return state
        }
    }
}

export default dailySalesReducer;