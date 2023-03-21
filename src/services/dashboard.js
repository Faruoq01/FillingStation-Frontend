import APIs from './api';

const DashboardService = {

    allAttendanceRecords: (data) => {
        return APIs.post('/dashboard/dashboard-records', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },

    allSalesRecords: (data) => {
        return APIs.post('/dashboard/dashboard-rages', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },

    getWeeklyDataFromApi: (data) => {
        return APIs.post('/dashboard/dashboard-weekly', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },

    getMonthlyDataFromApi: (data) => {
        return APIs.post('/dashboard/dashboard-monthly', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },

    getAnnualDataFromApi: (data) => {
        return APIs.post('/dashboard/dashboard-annually', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },

    updateUserStatus: (data) => {
        return APIs.post('/dashboard/user-status', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },

    updateUserPermission: (data) => {
        return APIs.post('/dashboard/user-permission', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },
}

export default DashboardService;