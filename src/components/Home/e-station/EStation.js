import React, { Suspense, lazy } from "react";
const Wrapper = lazy(() => import("./e-component/wrapper/Wrapper"));
const TopWrapper = lazy(() => import("./e-component/top/TopWrapper"));

function EStation() {
  return (
    <div style={styles.container}>
      <Suspense fallback={<div style={styles.loader}>Loading ...</div>}>
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
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
  },
};

export default EStation;
