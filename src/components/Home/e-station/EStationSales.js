import React, { Fragment, Suspense, lazy } from "react";
import LazyLoaderScreen from "../../LazyLoaderScreen";
import { Route, Switch } from "react-router-dom";
import EstationIndividualSales from "./EstationIndividualSales";
const EStationCorporateSales = lazy(() => import("./EStationCorporateSales"));
const EStationSalesIndex = lazy(() =>
  import("../../e-component/EStationSalesIndex")
);

export default function EStationSales({ ...props }) {
  return (
    <Fragment>
      {props.activeRoute.split("/").length === 4 && (
        <Suspense fallback={<LazyLoaderScreen />}>
          <EStationSalesIndex />
        </Suspense>
      )}

      {props.activeRoute.split("/").length > 4 && (
        <Suspense fallback={<LazyLoaderScreen />}>
          <div style={styles.contain}>
            <Switch>
              <Route path="/home/estation/sales/individual">
                <EstationIndividualSales />
              </Route>
              <Route path="/home/estation/sales/corporate">
                <EStationCorporateSales />
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
