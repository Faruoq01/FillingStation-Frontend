import React, { Suspense, lazy } from "react";
import LazyLoaderScreen from "../../LazyLoaderScreen";
const IndividualOrderindex = lazy(() =>
  import("../../indevidual-order/IndividualOrderindex")
);

export default function EStationIndividualIncomingOrder() {
  return (
    <Suspense fallback={<LazyLoaderScreen />}>
      <IndividualOrderindex />
    </Suspense>
  );
}
