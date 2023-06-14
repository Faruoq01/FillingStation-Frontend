import React, { Suspense, lazy } from "react";
import LazyLoaderScreen from "../../LazyLoaderScreen";
const EStationIncomingSalesIndex = lazy(() =>
  import("../../e-component/EStationIncomingSalesIndex")
);

export default function EStationIncomingSales() {
  return (
    <Suspense fallback={<LazyLoaderScreen />}>
      <EStationIncomingSalesIndex />
    </Suspense>
  );
}
