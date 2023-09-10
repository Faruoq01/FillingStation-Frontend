import APIs from "../connections/api";

const LPOService = {
  createLPO: (data) => {
    return APIs.post("/lpo/create", data)
      .then(({ data }) => {
        return data.lpo;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  updateLPO: (data) => {
    return APIs.post("/lpo/update", data)
      .then(({ data }) => {
        return data.lpo;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  getAllLPO: (data) => {
    return APIs.post("/lpo/allRecords", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  createLPOSales: (data) => {
    return APIs.post("/lpoSales/create", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  getAllLPOSales: (data) => {
    return APIs.post("/lpoSales/allRecords", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  dispensed: (data) => {
    return APIs.post("/lpoSales/dispensed", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  credit: (data) => {
    return APIs.post("/lpo/credit", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  updateCreditBalance: (data) => {
    return APIs.post("/lpo/updatecreditbalance", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },
};

export default LPOService;
