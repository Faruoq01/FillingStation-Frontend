import { ANALYSIS_DATA, HISTORY_TAG } from '../types';

export const setAnalysisData = (param) => dispatch => {
    dispatch({ type: ANALYSIS_DATA, payload: param })
}

export const historyTags = (param) => dispatch => {
    dispatch({ type: HISTORY_TAG, payload: param })
}