import APIs from "../connections/api";

const AnalysisService = {
  allRecords: (data) => {
    return APIs.post("/analysis/allRecords", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  getAnalysisData: (data) => {
    return APIs.post("/analysis/analysisData", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },
};

export default AnalysisService;
