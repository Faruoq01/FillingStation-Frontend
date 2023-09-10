import APIs from "../connections/api";

const AtendanceService = {
  createAttendance: (data) => {
    return APIs.post("/hr/attendance/create", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  updateAttendance: (data) => {
    return APIs.post("/hr/attendance/update", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  allAttendanceRecords: (data) => {
    return APIs.post("/hr/attendance/allRecords", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },
};

export default AtendanceService;
