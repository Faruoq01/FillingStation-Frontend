import React, { Fragment, Suspense, lazy } from "react";
import LazyLoaderScreen from "../../LazyLoaderScreen";
import { Switch, Route } from "react-router-dom";
const EStationIndividualIncomingOrder = lazy(() =>
  import("./EStationIndividualIncomingOrder")
);
const EStationCorporateIncomingOrder = lazy(() =>
  import("./EStationCorporateIncomingOrder")
);
const EStationIncomingOrdersIndex = lazy(() =>
  import("../../e-component/EStationIncomingOrdersIndex")
);

export default function EStationIncomingOrders({ ...props }) {
  return (
    <Fragment>
      {props.activeRoute.split("/").length === 4 && (
        <Suspense fallback={<LazyLoaderScreen />}>
          <EStationIncomingOrdersIndex activeRoute={props.activeRoute} />
        </Suspense>
      )}
      {props.activeRoute.split("/").length > 4 && (
        <Suspense fallback={<LazyLoaderScreen />}>
          <div style={styles.contain}>
            <Switch>
              <Route path="/home/estation/orders/incoming-individual">
                <EStationIndividualIncomingOrder
                  activeRoute={props.activeRoute}
                />
              </Route>
              <Route path="/home/estation/orders/incoming-corporate">
                <EStationCorporateIncomingOrder
                  activeRoute={props.activeRoute}
                />
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
