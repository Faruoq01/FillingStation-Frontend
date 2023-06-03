import APIs from './api';

const DailySalesService = {

    createSales: (data) => {
        return APIs.post('/daily-sales/create', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    updateSales: (data) => {
        return APIs.post('/daily-sales/update', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    deleteSales: (data) => {
        return APIs.post('/daily-sales/delete', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getDailySalesDataAndAnalyze: (data) => {
        return APIs.post('/daily-sales/getDailySalesDataAndAnalyze', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getAllSales: (data) => {
        return APIs.post('/daily-sales/allRecords', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getAllLPOSales: (data) => {
        return APIs.post('/daily-sales/allLPOSalesRecords', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getAllDailyExpenses: (data) => {
        return APIs.post('/daily-sales/allExpensesRecords', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getAllDailyPayments: (data) => {
        return APIs.post('/daily-sales/allPaymentsRecords', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getAllDailyPOSPayments: (data) => {
        return APIs.post('/daily-sales/allPOSPaymentsRecords', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getAllDailyIncomingOrder: (data) => {
        return APIs.post('/daily-sales/allIncomingOrderRecords', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getAllDailySupply: (data) => {
        return APIs.post('/daily-sales/allSupplyRecords', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getAllMonthlyReports: (data) => {
        return APIs.post('/daily-sales/allMonthlyPaymentRange', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getYesterdayRecords: (data) => {
        return APIs.post('/daily-sales/getYesterdayRecords', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    createRT: (data) => {
        return APIs.post('/return-to-tank/create', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getAllRT: (data) => {
        return APIs.post('/return-to-tank/allRecords', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    createDipping: (data) => {
        return APIs.post('/dipping/create', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    createRemark: (data) => {
        return APIs.post('/daily-sales/remark', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getRemarks: (data) => {
        return APIs.post('/daily-sales/remark-records', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    getDippingList: (data) => {
        return APIs.post('/daily-sales/dipping-list', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },

    validateSales: (data) => {
        return APIs.post('/daily-sales/validate-sales', data)
        .then(({data}) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        });
    },
}

export default DailySalesService;