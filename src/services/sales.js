import APIs from "./api";

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

  bankPayment: (data) => {
    return APIs.post("/sales/bankPayment", data);
  },

  posPayment: (data) => {
    return APIs.post("/sales/posPayment", data);
  },

  dipping: (data) => {
    return APIs.post("/sales/dipping", data);
  },

  balanceCF: (data) => {
    return APIs.post("/sales/balanceCF", data);
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
