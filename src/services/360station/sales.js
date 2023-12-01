import APIs from "../connections/api";

const SalesService = {
  pumpUpdate: (data) => {
    return APIs.post("/sales/pumpUpdate", data);
  },

  returnToTank: (data) => {
    return APIs.post("/sales/rt", data);
  },

  lpo: (data) => {
    return APIs.post("/sales/lpo", data);
  },

  creditBalance: (data) => {
    return APIs.post("/sales/creditBalance", data);
  },

  expenses: (data) => {
    return APIs.post("/sales/expenses", data);
  },

  payments: (data) => {
    return APIs.post("/sales/payments", data);
  },

  dipping: (data) => {
    return APIs.post("/sales/dipping", data);
  },

  tankLevels: (data) => {
    return APIs.post("/sales/tankLevels", data);
  },

  deleteAllRecords: (data) => {
    return APIs.post("/sales/delete/deleteAll", data);
  },
  supply: (data) => {
    return APIs.post("/sales/supply", data);
  },
};

export default SalesService;
