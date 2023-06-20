import React, { Suspense, lazy, Fragment } from "react";
import LazyLoaderScreen from "../../LazyLoaderScreen";
import { Switch, Route } from "react-router-dom";
import EStationPayments from "./EStationPayments";

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
      {props.activeRoute.split("/").length === 4 && (
        <Suspense fallback={<LazyLoaderScreen />}>
          <div style={styles.contain}>
            <Switch>
              <Route path="/home/estation/payments">
                <EStationPayments />
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
