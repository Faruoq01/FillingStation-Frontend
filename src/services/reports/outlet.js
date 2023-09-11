const { default: ReportsAPI } = require("../connections/reportsapi");

const OutletReport = {
  getStationPrints: async (param) => {
    const { data } = await ReportsAPI.post("/outlet/print", param);
    return data;
  },
};

module.exports = OutletReport;
