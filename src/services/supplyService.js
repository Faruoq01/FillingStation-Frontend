import APIs from './api';

const SupplyService = {

    createSupply: (data) => {
        return APIs.post('/supply/create', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    pendingSupply: (data) => {
        return APIs.post('/pendingSupply/create', data)
        .then(({data}) => {
            return data.supply;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getAllSupply: (data) => {
        return APIs.post('/supply/allRecords', data)
        .then(({data}) => {
            return data.supply;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getAllPendingSupply: (data) => {
        return APIs.post('/pendingSupply/allRecords', data)
        .then(({data}) => {
            return data.supply;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    deletePendingSupply: (data) => {
        return APIs.post('/pendingSupply/deletePendingSupply', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },
}

export default SupplyService;