import APIs from "../connections/api";

const RecordSalesService = {
  saveRecordSales: (data) => {
    return APIs.post("/daily-sales/create", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },
};

export default RecordSalesService;
