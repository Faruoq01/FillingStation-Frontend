import APIs from "../connections/api";

const ExpenseService = {
  getAllExpenses: (data) => {
    return APIs.post("/expenses/allRecords", data)
      .then(({ data }) => {
        return data;
      })
      .catch((err) => {
        console.log("Auth service err", err);
        throw err;
      });
  },
};

export default ExpenseService;
