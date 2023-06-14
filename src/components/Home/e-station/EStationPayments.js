import React, { Suspense, lazy } from "react";
import LazyLoaderScreen from "../../LazyLoaderScreen";
const WalletPaymentListIndex = lazy(() =>
  import("../../wallet-list/WalletPaymentListIndex")
);
export default function EStationPayments() {
  return (
    <Suspense fallback={<LazyLoaderScreen />}>
      <WalletPaymentListIndex />
    </Suspense>
  );
}
