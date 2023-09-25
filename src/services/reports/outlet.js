import ReportsAPI from "../connections/reportsapi";
const OutletReport = {
  getStationPrints: async (param) => {
    const { data } = await ReportsAPI.post("/outlet", param);
    return data;
  },
  getLPOPrints: async (param) => {
    const { data } = await ReportsAPI.post("/lpo", param);
    return data;
  },
};

export default OutletReport;
