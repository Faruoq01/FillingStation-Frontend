import { useMediaQuery } from "@mui/material";
import React from "react";
import Card from "../../../components/sales/Card";
import "../../../styles/estation/sales.scss";
import { useHistory } from "react-router-dom";

export default function EStationSales() {
  const navigation = useHistory();
  const goToIndividualSales = () => {
    navigation.push("/home/estation-individual-sales");
  };
  const goToCorporateSales = () => {
    navigation.push("/home/estation-corporate-sales");
  };
  return (
    <div className="e-station-sales">
      <div className="card-wrap-sales">
        <Card
          onClick={goToIndividualSales}
          uri={require("../../../assets/estation/cop.svg").default}
          style={{ marginRight: 10 }}
          title="NGN 220, 000"
          subText="Total Individual Sales"
        />
        <Card
          onClick={goToCorporateSales}
          uri={require("../../../assets/estation/ind.svg").default}
          title="NGN 130, 000"
          subText="Total Corporate Sales"
        />
      </div>
    </div>
  );
}
