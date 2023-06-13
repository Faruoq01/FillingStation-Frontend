import { useMediaQuery } from "@mui/material";
import React from "react";
import Card from "../../../components/sales/Card";
import "../../../styles/estation/sales.scss";

export default function EStationSales() {
  return (
    <div className="e-station-sales">
      <div className="card-wrap-sales">
        <Card
          uri={require("../../../assets/estation/cop.svg").default}
          style={{ marginRight: 10 }}
          title="NGN 220, 000"
          subText="Total Individual Sales"
        />
        <Card
          uri={require("../../../assets/estation/ind.svg").default}
          title="NGN 130, 000"
          subText="Total Corporate Sales"
        />
      </div>
    </div>
  );
}
