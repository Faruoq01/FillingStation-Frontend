import React from "react";
import "../../styles/dashboard.scss";
import { useSelector } from "react-redux";
import { useState } from "react";
import DashboardGraph from "../DashboardComponents/DashboardGraph";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import Sales from "../DashboardComponents/sales";
import OveragesAndShortages from "../DashboardComponents/overages";
import Assets from "../DashboardComponents/Assets";
import Supply from "../DashboardComponents/Supply";
import PaymentDetails from "../DashboardComponents/paymentDetails";
import Expenses from "../DashboardComponents/Expenses";
import TopStations from "../DashboardComponents/TopStations";
import IncomingOrder from "../DashboardComponents/IncomingOrder";
import Controls from "../DashboardComponents/Controls";
import DashboardSales from "../Modals/DashboardSales";

const Dashboard = (props) => {
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [prices, setPrices] = useState(false);

  const closeModal = () => {
    setPrices(false);
  };

  return (
    <React.Fragment>
      <div className="dashboardContainer">
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

export default Dashboard;
