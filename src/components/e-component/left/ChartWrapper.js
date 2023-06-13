import React from "react";
import "../../../styles/estation/left.scss";

export default function ChartWrapper() {
  return (
    <div className="chart-wrapper">
      <img
        re
        src={require("../../../assets/estation/chart1.svg").default}
        style={{
          color: "#fff",
          width: "100%",
          height: "100%",
          objectFit: "fill",
        }}
      />
    </div>
  );
}
