import APIs from "../connections/api";

const QueryService = {
  createQuery: (data) => {
    return APIs.post("/hr/query/create", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  updateQuery: (data) => {
    return APIs.post("/hr/query/update", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  deleteQuery: (data) => {
    return APIs.post("/hr/query/delete", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  allQueryRecords: (data) => {
    return APIs.post("/hr/query/allRecords", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },
};

export default QueryService;
