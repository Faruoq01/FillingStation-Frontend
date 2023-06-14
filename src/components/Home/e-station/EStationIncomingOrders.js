import React, { Suspense, lazy } from "react";
import LazyLoaderScreen from "../../LazyLoaderScreen";
const EStationIncomingOrdersIndex = lazy(() =>
  import("../../e-component/EStationIncomingOrdersIndex")
);

export default function EStationIncomingOrders() {
  return (
    <Suspense fallback={<LazyLoaderScreen />}>
      <EStationIncomingOrdersIndex />
    </Suspense>
  );
}
