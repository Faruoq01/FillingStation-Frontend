import React, { lazy, Suspense, Fragment } from "react";
import LazyLoaderScreen from "../LazyLoaderScreen";
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
