import React from "react";
import { useSelector } from "react-redux";
import Controls from "./Sales/controls";
import SalesCards from "./Sales/salescards";
import TankLevels from "./Sales/tanklevels";
import OveragesAndShortages from "./OveragesAndShortages";
import ExpensesAndPayments from "./Sales/expenses_payments";
import Supply from "./Sales/supply";
import NetToBank from "./Sales/net_to_bank";
import LPO from "./Sales/lpo";
import IncomingOrder from "./Sales/incoming";
import "../../styles/dailySales.scss";

const mobile = window.matchMedia("(max-width: 600px)");

const DailysalesHome = () => {
  return (
    <React.Fragment>
      <div
        style={{ marginTop: mobile.matches && "0px" }}
        className="daily-sales-container">
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

export default DailysalesHome;
