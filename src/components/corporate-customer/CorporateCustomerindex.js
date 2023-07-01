import React, { Fragment } from "react";

import "../../styles/estation/individual_sale.scss";
import { useMediaQuery } from "@mui/material";
import SalesTable from "./SalesTable";

export default function CorporateCustomerindex() {
  const mobile = useMediaQuery("(max-width:900px)");
  const tablet = useMediaQuery("(min-width:800px)");
  return (
    <div className="individual-sale-container-">
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "95%", height: "100%" }}>
          <div className="wrap-btn-wrap">
            <input
              className="search-"
              type="text"
              id="fname"
              placeholder="Search"
              style={{ height: 30, border: "1.5px solid #C6C6C6" }}
            />
          </div>
          <SalesTable />
        </div>
      </div>
    </div>
  );
}
