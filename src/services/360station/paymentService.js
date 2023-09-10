import APIs from "../connections/api";

const PaymentService = {
  createPayment: (data) => {
    return APIs.post("/register-payment/create", data)
      .then(({ data }) => {
        return data.pay;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },

  getAllPayment: (data) => {
    return APIs.post("/register-payment/allRecords", data)
      .then(({ data }) => {
        return data.pay;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },
};

export default PaymentService;
