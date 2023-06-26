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
    SUMMARY_RECORD_SALES,
    CURRENT_DATE,
    REMARKS,
    OVERAGES,
    OVERAGE_TYPE,
    SUPPLIES,
    SALES_STATUS
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
            pms: 0,
            ago: 0,
            dpk: 0
        },
        supply: [],
        sales: [],
        expenses: [],
        dipping: [],
        tankLevels: []
    },
    linkedData: { page: 1 },
    balanceBF: {},
    pmsBBF: {},
    agoBBF: {},
    dpkBBF: {},
    barData: {},
    summary: {},
    currentDate: "",
    remarks: [],
    overages: [],
    overageType: 'PMS',
    supplies: [],
    salesStatus: [],
}

const dailySalesReducer = (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {

        case SALES_STATUS: {
            return {
                ...state,
                salesStatus: payload
            }
        }

        case SUPPLIES: {
            return {
                ...state,
                supplies: payload
            }
        }

        case SALES_DATA:{
            return {
                ...state,
                dailySales: payload,
            }
        }

        case OVERAGES: {
            return{
                ...state,
                overages: payload
            }
        }

        case OVERAGE_TYPE: {
            return {
                ...state,
                overageType: payload
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

        case REMARKS: {
            return{
                ...state,
                remarks: payload
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

        case CURRENT_DATE: {
            return{
                ...state,
                currentDate: payload
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