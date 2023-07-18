import React from "react";
import "../../styles/dailySales.scss";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import PMSDailySales from "../DailySales/PMSDailySales";
import AGODailySales from "../DailySales/AGODailySales";
import DPKDailySales from "../DailySales/DPKDailySales";
import ComprehensiveReport from "../DailySales/ComprehensiveReport";
import ListAllTanks from "../Outlet/TankList";
import OveragesAndShortages from "../DailySales/OveragesAndShortages";
import Controls from "../DailySales/Sales/controls";
import SalesCards from "../DailySales/Sales/salescards";
import TankLevels from "../DailySales/Sales/tanklevels";
import ExpensesAndPayments from "../DailySales/Sales/expenses_payments";
import SupplyCard from "../DailySales/Sales/supply";
import NetToBank from "../DailySales/Sales/net_to_bank";
import LPO from "../DailySales/Sales/lpo";
import IncomingOrder from "../DailySales/Sales/incoming";
// const mediaMatch = window.matchMedia('(max-width: 450px)');

const DailySales = (props) => {
  return (
    <>
      {props.activeRoute.split("/").length === 3 && (
        <div className="daily-sales-container">
          <SalesLeftColumn />
          <SalesRightColumn />
        </div>
      )}
      {props.activeRoute.split("/").length === 4 && (
        <div style={contain}>
          <Switch>
            <Route path="/home/daily-sales/pms">
              <PMSDailySales />
            </Route>
            <Route path="/home/daily-sales/ago">
              <AGODailySales />
            </Route>
            <Route path="/home/daily-sales/dpk">
              <DPKDailySales />
            </Route>
            <Route path="/home/daily-sales/report">
              <ComprehensiveReport />
            </Route>
            <Route path="/home/outlets/list">
              <ListAllTanks />
            </Route>
          </Switch>
        </div>
      )}
    </>
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
      <SupplyCard />
      <NetToBank />
      <LPO />
      <IncomingOrder />
    </div>
  );
};

const contain = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "20px",
};

export default DailySales;
