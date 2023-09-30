export const stationColumns = [
  "state",
  "outletName",
  "noOfTanks",
  "noOfPumps",
  "alias",
  "city",
];

export const lpoColumns = [
  "companyName",
  "address",
  "personOfContact",
  "currentBalance",
  "paymentStructure",
];

export const expenseColumns = [
  "createdAt",
  "dateCreated",
  "expenseName",
  "description",
  "expenseAmount",
];

export const bankColumns = [
  "bankName",
  "tellerNumber",
  "amountPaid",
  "paymentDate",
  "confirmation",
];

export const posColumns = [
  "posName",
  "terminalID",
  "amountPaid",
  "paymentDate",
  "confirmation",
];

export const overageColumns = ["createdAt", "afterSales", "dipping"];

export const creditColumns = [
  "createdAt",
  "credit",
  "debit",
  "balance",
  "description",
];

export const lposalesColumns = [
  "createdAt",
  "productType",
  "lpoLitre",
  "station",
  "truckNo",
];

export const productColumns = [
  "createdAt",
  "depot",
  "depotAddress",
  "productType",
  "quantity",
  "quantityLoaded",
  "currentBalance",
];

export const deliveredOrderColumns = [
  "createdAt",
  "depotStation",
  "destination",
  "product",
  "quantity",
  "truckNo",
  "deliveryStatus",
  "shortage",
  "overage",
];

export const incomingOrderColumns = [
  "createdAt",
  "depotStation",
  "destination",
  "product",
  "quantity",
  "truckNo",
  "deliveryStatus",
];

export const regulatoryColumns = [
  "createdAt",
  "organisationalName",
  "amount",
  "contactPerson",
  "description",
];

export const supplyColumns = [
  "date",
  "truckNo",
  "wayBillNo",
  "outletName",
  "productType",
  "quantity",
  "shortage",
  "overage",
];

export const employeeColumns = [
  "staffName",
  "sex",
  "email",
  "phone",
  "dateEmployed",
  "role",
];

export const salaryColumns = ["position", "level", "low_range", "high_range"];

export const queryColumns = [
  "createdAt",
  "employeeName",
  "queryTitle",
  "description",
];

export const attendanceColumns = [
  "createdAt",
  "employeeName",
  "timeIn",
  "timeOut",
];

export const outstandingColumns = [
  "createdAt",
  "bankPayments",
  "posPayments",
  "netToBank",
  "outstandingBalance",
];
