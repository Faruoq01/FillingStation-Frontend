import React, { Fragment, Suspense, lazy } from "react";
import LazyLoaderScreen from "../LazyLoaderScreen";
import { Switch, Route } from "react-router-dom";
const AirBnBTotal = lazy(() => import("./AirBnBTotal"));
const IndividualCustomerindex = lazy(() =>
  import("../individual-customer/IndividualCustomerindex")
);

export default function IndividualCustomer({ ...props }) {
  return (
    <Suspense fallback={<LazyLoaderScreen />}>
      <IndividualCustomerindex />
    </Suspense>
  );
}
