import React from "react";
import { useSelector } from "react-redux";
import Assets from "./Assets";
import Controls from "./Controls";
import DashboardGraph from "./DashboardGraph";
import Expenses from "./Expenses";
import IncomingOrder from "./IncomingOrder";
import Supply from "./Supply";
import TopStations from "./TopStations";
import OveragesAndShortages from "./overages";
import PaymentDetails from "./paymentDetails";
import Sales from "./sales";
import { useState } from "react";
import DashboardSales from "../Modals/DashboardSales";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";

const DashboardHome = () => {
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [prices, setPrices] = useState(false);

  const closeModal = () => {
    setPrices(false);
  };

  return (
    <React.Fragment>
      <div style={{ marginTop: "0px" }} className="dashboardContainer">
        <div className="left-dash">
          <Controls />
          <Sales priceModal={setPrices} />
          <div
            style={{
              marginTop: "40px",
              fontWeight: "bold",
              fontSize: "15px",
              color: user.isDark === "0" ? "#000" : "#fff",
            }}>
            Total Sales
          </div>

          <DashboardGraph station={oneStationData} />
          <OveragesAndShortages path={"dash"} />
        </div>
        <div className="right-dash">
          <Assets />

          <div className="section">
            <Supply />
            <PaymentDetails />
            <Expenses />
          </div>

          <TopStations />
          <IncomingOrder />
        </div>
      </div>
      {prices && <DashboardSales open={prices} close={closeModal} />}
    </React.Fragment>
  );
};

export default DashboardHome;
