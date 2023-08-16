import React, { lazy, Suspense, Fragment } from "react";
import LazyLoaderScreen from "../LazyLoaderScreen";
import { Switch, Route } from "react-router-dom";
const AirBnBTotal = lazy(() => import("./AirBnBTotal"));
const CorporateCustomerindex = lazy(() =>
  import("../corporate-customer/CorporateCustomerindex")
);

export default function CorporateCustomer({ ...props }) {
  return (
    <Fragment>
      <Suspense fallback={<LazyLoaderScreen />}>
        <CorporateCustomerindex />
      </Suspense>
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
