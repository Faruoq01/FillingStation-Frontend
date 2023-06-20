import React, { Fragment, Suspense, lazy } from "react";
import LazyLoaderScreen from "../../LazyLoaderScreen";
import { Switch, Route } from "react-router-dom";
import EStationIndividualIncomingOrder from "./EStationIndividualIncomingOrder";
const EStationIncomingOrdersIndex = lazy(() =>
  import("../../e-component/EStationIncomingOrdersIndex")
);

export default function EStationIncomingOrders({ ...props }) {
  return (
    <Fragment>
      {props.activeRoute.split("/").length === 5 && (
        <Suspense fallback={<LazyLoaderScreen />}>
          <EStationIncomingOrdersIndex />
        </Suspense>
      )}
      {props.activeRoute.split("/").length > 5 && (
        <Suspense fallback={<LazyLoaderScreen />}>
          <div style={styles.contain}>
            <Switch>
              <Route path="/home/estation/orders/incoming/individual">
                <EStationIndividualIncomingOrder />
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
