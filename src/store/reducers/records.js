import { 
    UPDATE_PUMPS,
    UPDATE_SELECTED_PUMPS,
    LOGOUT,
    SELECTED_PUMPS,
    DESELECT_PUMP_LIST,
    UPDATE_LOAD,
    CHAMGE_STATION,
    CHANGE_DATE
} from '../types'

const initialState = {
    PMS: [],
    AGO: [],
    DPK: [],
    selectedPumps: [],
    selectedTanks: [],
    load: {
        '1': [],
        '2': [],
        '3': [],
        '4': [],
        '5': [],
        '6': [],
        '7': [],
    },
    currentDate: null
}

const recordsReducer = (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {

        case CHANGE_DATE: {
            return {
                ...state,
                currentDate: payload
            }
        }

        case UPDATE_LOAD: {
            return {
                ...state,
                load: payload
            }
        }

        case UPDATE_PUMPS:{
            return {
                ...state,
                PMS: payload.pms,
                AGO: payload.ago,
                DPK: payload.dpk,
            }
        }

        case UPDATE_SELECTED_PUMPS:{
            return {
                ...state,
                selectedPumps: payload
            }
        }

        case SELECTED_PUMPS: {

            const updateSelectedPumps = () => {

                const currentList = [...state.selectedPumps];
                const findID = currentList.findIndex(data => data._id === payload.selected._id);

                if(findID === -1){
                    return [...currentList, payload.selected];

                }else{
                    const newList = [...currentList]
                    newList[findID] = {...payload.selected};
                    return newList;
                }
            }

            const updateSelectedTanks = () => {

                const currentList = [...state.selectedTanks];
                const findID = currentList.findIndex(data => data._id === payload.tank._id);

                if(findID === -1){
                    return [...currentList, payload.tank];

                }else{
                    const newList = [...currentList]
                    newList[findID] = {...payload.tank};
                    return newList;
                }
            }

            return {
                ...state,
                PMS: payload.selected.productType === "PMS"? payload.collection: state.PMS,
                AGO: payload.selected.productType === "AGO"? payload.collection: state.AGO,
                DPK: payload.selected.productType === "DPK"? payload.collection: state.DPK,
                selectedPumps: updateSelectedPumps(),
                selectedTanks: updateSelectedTanks(),
            }
        }

        case DESELECT_PUMP_LIST: {

            const removePump = () => {

                const currentList = [...state.selectedPumps];
                const filteredPump = currentList.filter(data => data._id !== payload.selected._id);

                return filteredPump;
            }

            const removeTank = () => {

                const currentList = [...state.selectedPumps];
                const currentTankList = [...state.selectedTanks];
                const loads = {...state.load};
                const availableID = currentList.filter(data => data.hostTank === payload.tank._id);

                if(availableID.length === 1){
                    const filteredTank = currentTankList.filter(data => data._id !== payload.tank._id);
                    const filteredPayload = loads['1'].filter(data => data._id !== payload.tank._id);

                    return {list: filteredTank, pay: filteredPayload};

                }else{
                    return {list: currentTankList, pay: loads['1']}
                }
            }

            return {
                ...state,
                PMS: payload.selected.productType === "PMS"? payload.collection: state.PMS,
                AGO: payload.selected.productType === "AGO"? payload.collection: state.AGO,
                DPK: payload.selected.productType === "DPK"? payload.collection: state.DPK,
                selectedPumps: removePump(),
                selectedTanks: removeTank().list,
                load: {
                    '1': removeTank().pay,
                    '2': state.load['2'],
                    '3': state.load['3'],
                    '4': state.load['4'],
                    '5': state.load['5'],
                    '6': state.load['6'],
                    '7': state.load['7']
                }
            }
        }

        case CHAMGE_STATION:{
            return {
                ...state,
                PMS: [],
                AGO: [],
                DPK: [],
                selectedPumps: [],
                selectedTanks: [],
                load: {
                    '1': [],
                    '2': [],
                    '3': [],
                    '4': [],
                    '5': [],
                    '6': [],
                    '7': [],
                }
            }
        }

        case LOGOUT:{
            return {
                ...state,
                PMS: [],
                AGO: [],
                DPK: [],
                selectedPumps: [],
                selectedTanks: [],
                load: {
                    '1': [],
                    '2': [],
                    '3': [],
                    '4': [],
                    '5': [],
                    '6': [],
                    '7': [],
                }
            }
        }

        default: {
            return state
        }
    }
}

export default recordsReducer;