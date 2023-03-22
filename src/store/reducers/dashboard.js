import { 
    DASHBOARD,
    DASHBOARD_RECORDS,
    DASHBOARD_EMPLOYEES,
    CHANGE_STATUS,
    CHANGE_ALL_STATUS,
    STORE_SINGLE_USER,
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
        station: [],
        payments: {
            totalPayments: 0,
            totalPosPayments: 0,
            netToBank: 0
        }
    },

    employees:[],
    searchData: [],
    utils:{},
    singleUser:{}
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

            const addSelection = payload.map(item => {
                return {...item, selected: "0"};
            });

            return{
                ...state,
                employees: addSelection,
                searchData: payload,
            }
        }

        case STORE_SINGLE_USER: {
            return {
                ...state,
                singleUser: payload
            }
        }

        case CHANGE_STATUS: {
            const newList = [...state.employees];
            const findID = newList.findIndex(data => data._id === payload._id);
            newList[findID] = payload;

            return {
                ...state,
                employees: newList
            }
        }

        case CHANGE_ALL_STATUS: {
            const newList = [...state.employees];
            const updated = newList.map(data => {
                return {...data, selected: payload? "1": "0"}
            });
            
            return{
                ...state,
                employees: updated
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
                    station: [],
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