import React, { lazy, Suspense, Fragment } from "react";
import LazyLoaderScreen from "../LazyLoaderScreen";
import { Switch, Route } from "react-router-dom";
const AirBnBTotal = lazy(() => import("./e-station/AirBnBTotal"));
const CorporateCustomerindex = lazy(() =>
  import("../corporate-customer/CorporateCustomerindex")
);

export default function CorporateCustomer({ ...props }) {
  return (
    <Fragment>
      {props.activeRoute.split("/").length === 5 && (
        <Suspense fallback={<LazyLoaderScreen />}>
          <CorporateCustomerindex />
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
