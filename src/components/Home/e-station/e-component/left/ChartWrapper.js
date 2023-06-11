import React from "react";
import "./left.scss";

export default function ChartWrapper() {
  return (
    <div className="chart-wrapper">
      <img
        re
        src={require("../../img/chart1.svg").default}
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
