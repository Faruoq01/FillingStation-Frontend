import APIs from './api';

const HistoryService = {

    allRecords: (data) => {
        return APIs.post('/history/allRecords', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },

    // getAnalysisData: (data) => {
    //     return APIs.post('/analysis/analysisData', data)
    //     .then(({ data }) => {
    //         return data;
    //     })
    //      .catch(err => {
    //         console.log("Auth service err", err);
    //         throw err
    //     })
    // },
}

export default HistoryService;