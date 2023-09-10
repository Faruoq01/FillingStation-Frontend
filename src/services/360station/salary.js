import APIs from '../connections/api';

const SalaryService = {

    createSalary: (data) => {
        return APIs.post('/hr/salary/create', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },

    updateSalary: (data) => {
        return APIs.post('/hr/salary/update', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },

    deleteSalary: (data) => {
        return APIs.post('/hr/salary/delete', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },

    allSalaryRecords: (data) => {
        return APIs.post('/hr/salary/allRecords', data)
        .then(({ data }) => {
            return data;
        })
         .catch(err => {
            console.log("Auth service err", err);
            throw err
        })
    },
}

export default SalaryService;