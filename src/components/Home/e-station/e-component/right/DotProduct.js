import React from "react";

import CircleIcon from "@mui/icons-material/Circle";
import "./right.scss";
export default function DotProduct({ product, ...props }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
      {...props}
    >
      <CircleIcon
        style={{
          color:
            product == "PMS"
              ? "#399A19"
              : product == "AGO"
              ? "#FFA010"
              : "#35393E",
          fontSize: 10,
        }}
      />
      <span className="product-label-doughnut">{product}</span>
    </div>
  );
}
