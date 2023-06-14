import React, { Suspense, lazy } from "react";
import LazyLoaderScreen from "../../LazyLoaderScreen";
const EStationSalesIndex = lazy(() =>
  import("../../e-component/EStationSalesIndex")
);

export default function EStationSales() {
  return (
    <Suspense fallback={<LazyLoaderScreen />}>
      <EStationSalesIndex />
    </Suspense>
  );
}
