import React, { Suspense, lazy, Fragment } from "react";
import LazyLoaderScreen from "../../LazyLoaderScreen";
import { Switch, Route } from "react-router-dom";
import EStationPayments from "./EStationPayments";
import CorporateCustomer from "../CorporateCustomer";
import IndividualCustomer from "../IndividualCustomer";
import EStationSales from "./EStationSales";

const Wrapper = lazy(() => import("../../e-component/wrapper/Wrapper"));
const TopWrapper = lazy(() => import("../../e-component/top/TopWrapper"));

function EStation({ ...props }) {
  return (
    <Fragment>
      {props.activeRoute.split("/").length === 3 && (
        <Suspense fallback={<LazyLoaderScreen />}>
          <div style={styles.container}>
            <TopWrapper />
            <Wrapper />
          </div>
        </Suspense>
      )}
      {props.activeRoute.split("/").length > 3 && (
        <Suspense fallback={<LazyLoaderScreen />}>
          <div style={styles.contain}>
            <Switch>
              <Route path="/home/estation/payments">
                <EStationPayments />
              </Route>
              <Route path="/home/estation/corporate/customer">
                <CorporateCustomer />
              </Route>
              <Route path="/home/estation/individual/customer">
                <IndividualCustomer />
              </Route>
              <Route path="/home/estation/sales">
                <EStationSales />
              </Route>
            </Switch>
          </div>
        </Suspense>
      )}
    </Fragment>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F4F4F4",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  contain: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
};

export default EStation;
