import APIs from "../connections/api";

const HistoryService = {
  allRecords: (data) => {
    return APIs.post("/history/allRecords", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  allRecords2: (data) => {
    return APIs.post("/history/allRecords2", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },
};

export default HistoryService;
