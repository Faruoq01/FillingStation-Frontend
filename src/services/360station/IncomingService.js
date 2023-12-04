import APIs from "../connections/api";

const IncomingService = {
  createIncoming: async(data) => {
    return APIs.post("/incoming-order/create", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  updateIncoming: async (data) => {
    return APIs.post("/incoming-order/update", data).then(({ data }) => {
      return data;
    });
  },

  deleteIncoming: async (data) => {
    return APIs.post("/incoming-order/delete", data).then(({ data }) => {
      return data;
    });
  },

  createUnallocated: async(data) => {
    return APIs.post("/unallocated-order/create", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  updateUnallocated: async(data) => {
    return APIs.post("/unallocated-order/update", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  getUnallocated: async(data) => {
    return APIs.post("/unallocated-order/allRecords", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  getAllIncoming: (data) => {
    return APIs.post("/incoming-order/allRecords", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  getAllIncoming2: (data) => {
    return APIs.post("/incoming-order/allRecords2", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  getAllIncoming3: (data) => {
    return APIs.post("/incoming-order/allRecords3", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  getAllIncoming4: (data) => {
    return APIs.post("/incoming-order/allRecords4", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  getOneIncoming: (data) => {
    return APIs.post("/incoming-order/oneIncoming", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },
};

export default IncomingService;
