import { useMediaQuery } from "@mui/material";
import React from "react";
import Card from "../e-station/sales/Card";

export default function Sales() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#F4F4F4",
        padding: "1rem",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Card
          uri={require("./img/cop.svg").default}
          style={{ marginRight: 10 }}
          title="NGN 220, 000"
          subText="Total Individual Sales"
        />
        <Card
          uri={require("./img/ind.svg").default}
          title="NGN 130, 000"
          subText="Total Corporate Sales"
        />
      </div>
    </div>
  );
}
