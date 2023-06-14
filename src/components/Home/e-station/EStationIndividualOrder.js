import React, { Suspense, lazy } from "react";
import LazyLoaderScreen from "../../LazyLoaderScreen";
const IndividualOrderindex = lazy(() =>
  import("../../indevidual-order/IndividualOrderindex")
);

export default function EStationIndividualOrder() {
  return (
    <Suspense fallback={<LazyLoaderScreen />}>
      <IndividualOrderindex />
    </Suspense>
  );
}
