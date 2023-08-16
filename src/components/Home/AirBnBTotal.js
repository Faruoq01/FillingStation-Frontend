import React, { Suspense, lazy } from "react";
import LazyLoaderScreen from "../LazyLoaderScreen";

const AirBnBTotalIndex = lazy(() => import("../AirBnBTotal/AirBnBTotalIndex"));

export default function AirBnBTotal() {
  return (
    <Suspense fallback={<LazyLoaderScreen />}>
      <AirBnBTotalIndex />
    </Suspense>
  );
}
