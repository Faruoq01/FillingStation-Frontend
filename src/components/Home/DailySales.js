import React from "react";
import "../../styles/dailySales.scss";
import { useSelector } from "react-redux";
import OveragesAndShortages from "../DailySales/OveragesAndShortages";
import Controls from "../DailySales/Sales/controls";
import SalesCards from "../DailySales/Sales/salescards";
import TankLevels from "../DailySales/Sales/tanklevels";
import ExpensesAndPayments from "../DailySales/Sales/expenses_payments";
import NetToBank from "../DailySales/Sales/net_to_bank";
import LPO from "../DailySales/Sales/lpo";
import IncomingOrder from "../DailySales/Sales/incoming";
import Supply from "../DailySales/Sales/supply";

const DailySales = (props) => {
  return (
    <React.Fragment>
      <div className="daily-sales-container">
        <SalesLeftColumn />
        <SalesRightColumn />
      </div>
    </React.Fragment>
  );
};

const SalesLeftColumn = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="daily-left">
      <Controls />
      <SalesCards />
      <div
        style={{ color: user.isDark === "0" ? "#000" : "#fff" }}
        className="tank-text">
        Tank Stock Levels
      </div>
      <div className="tank-container">
        <TankLevels />
      </div>
      <OveragesAndShortages path={"sales"} />
    </div>
  );
};

const SalesRightColumn = () => {
  return (
    <div className="daily-right">
      <ExpensesAndPayments />
      <Supply />
      <NetToBank />
      <LPO />
      <IncomingOrder />
    </div>
  );
};

export default DailySales;
