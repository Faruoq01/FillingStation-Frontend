import React, { Fragment, Suspense, lazy } from "react";
import LazyLoaderScreen from "../LazyLoaderScreen";
import { Switch, Route } from "react-router-dom";
const AirBnBTotal = lazy(() => import("./e-station/AirBnBTotal"));
const IndividualCustomerindex = lazy(() =>
  import("../individual-customer/IndividualCustomerindex")
);

export default function IndividualCustomer({ ...props }) {
  return (
    <Fragment>
      {props.activeRoute.split("/").length === 5 && (
        <Suspense fallback={<LazyLoaderScreen />}>
          <IndividualCustomerindex />
        </Suspense>
      )}
      {props.activeRoute.split("/").length > 5 && (
        <Suspense fallback={<LazyLoaderScreen />}>
          <div style={styles.contain}>
            <Switch>
              <Route path="/home/estation/customer/individual-corporate/airbnb">
                <AirBnBTotal />
              </Route>
            </Switch>
          </div>
        </Suspense>
      )}
    </Fragment>
  );
}

const styles = {
  contain: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
};
