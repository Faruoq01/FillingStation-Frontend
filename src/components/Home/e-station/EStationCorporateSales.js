import React, { Suspense, lazy } from "react";
import LazyLoaderScreen from "../../LazyLoaderScreen";
const CorporateSaleindex = lazy(() =>
  import("../../corporate-sales/CorporateSaleindex")
);

export default function EStationCorporateSales() {
  return (
    <Suspense fallback={<LazyLoaderScreen />}>
      <CorporateSaleindex />
    </Suspense>
  );
}
