import React, { Suspense, lazy } from "react";
import LazyLoaderScreen from "../../LazyLoaderScreen";
const Wrapper = lazy(() => import("../../e-component/wrapper/Wrapper"));
const TopWrapper = lazy(() => import("../../e-component/top/TopWrapper"));

function EStation() {
  return (
    <div style={styles.container}>
      <Suspense fallback={<LazyLoaderScreen />}>
        <TopWrapper />
        <Wrapper />
      </Suspense>
    </div>
  );
}
const styles = {
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F4F4F4",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
};

export default EStation;
