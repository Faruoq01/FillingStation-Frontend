import React from "react";

export default function LazyLoaderScreen() {
  return <div style={styles.loader}>Loading ...</div>;
}

const styles = {
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    height: "100vh",
  },
};
