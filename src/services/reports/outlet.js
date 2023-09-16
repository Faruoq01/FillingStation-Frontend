import ReportsAPI from "../connections/reportsapi";
const OutletReport = {
  getStationPrints: async (param) => {
    const { data } = await ReportsAPI.post("/outlet/print", param);
    return data;
  },
};

export default OutletReport;
