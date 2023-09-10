import APIs from "../connections/api";

const RecordPaymentService = {
  getBankPayments: (data) => {
    return APIs.post("/payment/allRecords", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  getPOSPayments: (data) => {
    return APIs.post("/pos-payment/allRecords", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },
};

export default RecordPaymentService;
