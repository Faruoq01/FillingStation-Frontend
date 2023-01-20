import { 
    DASHBOARD,
    DASHBOARD_RECORDS,
    DASHBOARD_EMPLOYEES,
    SEARCH_DASH, 
    UTILS,
    LOGOUT
} from '../types'

const initialState = {
    dashboardData: {
        count:0,
        tanks: {
            activeTank: {count:0, list:[]},
            inActiveTank: {count:0, list:[]}
        },
        pumps: {
            activePumps: {count:0, list:[]},
            inActivePumps: {count:0, list:[]}
        },
    },
    dashboardRecords: {
        sales: {
            totalAmount: 0,
            totalVolume: 0,
        },

        supply:{
            pmsSupply: 0,
            agoSupply: 0,
            dpkSupply: 0
        },
        totalExpenses: 0,
        incoming: [],
        payments: {
            totalPayments: 0,
            totalPosPayments: 0,
            netToBank: 0
        }
    },

    employees:[],
    searchData: [],
    utils:{}
}

const dashboardReducer = (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {

        case DASHBOARD:{
            return {
                ...state,
                dashboardData: payload
            }
        }

        case DASHBOARD_RECORDS: {
            return{
                ...state,
                dashboardRecords: payload
            }
        }

        case DASHBOARD_EMPLOYEES:{
            return{
                ...state,
                employees: payload,
                searchData: payload,
            }
        }

        case SEARCH_DASH:{
            const search = state.searchData.filter(data => !data.staffName.toUpperCase().indexOf(payload.toUpperCase()) ||
                !data.email.toUpperCase().indexOf(payload.toUpperCase())
            );
            return {
                ...state,
                employees: search,
            }
        }

        case UTILS:{
            return{
                ...state,
                utils: payload
            }
        }

        case LOGOUT:{
            return {
                ...state,
                dashboardData: {
                    count:0,
                    tanks: {
                        activeTank: {count:0, list:[]},
                        inActiveTank: {count:0, list:[]}
                    },
                    pumps: {
                        activePumps: {count:0, list:[]},
                        inActivePumps: {count:0, list:[]}
                    },
                },
                dashboardRecords: {
                    sales: {
                        totalAmount: 0,
                        totalVolume: 0,
                    },
            
                    supply:{
                        pmsSupply: 0,
                        agoSupply: 0,
                        dpkSupply: 0
                    },
                    totalExpenses: 0,
                    incoming: [],
                    payments: {
                        totalPayments: 0,
                        totalPosPayments: 0,
                        netToBank: 0
                    }
                },
            
                employees:[],
                searchData: [],
                utils:{}
            }
        }

        default: {
            return state
        }
    }
}

export default dashboardReducer;