import APIs from '../connections/api';
import swal from 'sweetalert';

const OutletService = {

    registerFillingStation: (data) => {
        return APIs.post('/station/create', data)
        .then(({data}) => {
            return data.outlet;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getAllOutletStations: (data) => {
        return APIs.post('/station/allRecords', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getOneOutletStation: (data) => {
        return APIs.post('/station/oneRecord', data)
        .then(({data}) => {
            return data
        })
        .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    deleteOutletStation: (data) => {
        return APIs.post('/station/delete', data)
        .then(({data}) => {
            return data
        })
        .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    updateStation: (data) => {
        return APIs.post('/station/update', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    registerTanks: (data) => {
        return APIs.post('/station/tank/create', data)
        .then(({ data }) => {
            return data;
        }).then(data => {
            if(data.status === "exist"){
                swal("Warning!", data.message, "info");

            }else{
                swal("Success!", "Tank created successfully!", "success");
            }
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getAllOutletTanks: (data) => {
        return APIs.post('/station/tank/allRecords', data)
        .then(({ data }) => {
            return data.stations;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },

    getAllOutletTanks2: (data) => {
        return APIs.post('/station/tank/allRecords2', data)
        .then(({ data }) => {
            return data.stations;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },

    activateTanks: (data) => {
        return APIs.post('/station/tank/activateTank', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },

    deleteTanks: (data) => {
        return APIs.post('/station/tank/delete', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },

    updateTank: (data) => {
        return APIs.post('/station/tank/update', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getOneTank: (data) => {
        return APIs.post('/station/tank/oneTank', data)
        .then(({ data }) => {
            return data;
        })
        .catch((err) => {
            console.log("Auth service err", err);
            throw err
        })
    },

    registerPumps: (data) => {
        return APIs.post('/station/pump/create', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },

    getAllStationPumps: (data) => {
        return APIs.post('/station/pump/allRecords', data)
        .then(({ data }) => {
            return data.pump;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },

    activatePumps: (data) => {
        return APIs.post('/station/pump/activatePump', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },

    deletePump: (data) => {
        return APIs.post('/station/pump/delete', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },

    pumpUpdate: (data) => {
        return APIs.post('/station/pump/update', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },
}

export default OutletService;