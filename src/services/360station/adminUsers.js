import APIs from "../connections/api";

const AdminUserService = {
  createAdminUsers: (data) => {
    return APIs.post("/hr/adminUsers/create", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  allAdminUserRecords: (data) => {
    return APIs.post("/hr/adminUsers/allRecords", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  createStaffUsers: (data) => {
    return APIs.post("/hr/employee/create", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  allStaffUserRecords: (data) => {
    return APIs.post("/hr/employee/allRecords", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  filterRecords: (data) => {
    return APIs.post("/hr/employee/filterRecords", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },
};

export default AdminUserService;
