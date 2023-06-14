import React, { Suspense, lazy } from "react";
import LazyLoaderScreen from "../../LazyLoaderScreen";
const CorporateIncomingOrderIndex = lazy(() =>
  import("../../corporate-order/CorporateIncomningOrderindex")
);

export default function EStationCorporateIncomingOrder() {
  return (
    <Suspense fallback={<LazyLoaderScreen />}>
      <CorporateIncomingOrderIndex />
    </Suspense>
  );
}
