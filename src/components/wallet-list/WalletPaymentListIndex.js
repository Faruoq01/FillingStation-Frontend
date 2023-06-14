import React, { Fragment } from "react";

import "../../styles/estation/individual_sale.scss";
import { useMediaQuery } from "@mui/material";
import WalletPaymentTable from "./WalletPaymentTable";

export default function WalletPaymentListIndex() {
  const mobile = useMediaQuery("(max-width:900px)");
  const tablet = useMediaQuery("(min-width:800px)");
  return (
    <div className="individual-sale-container-">
      <div className="wrap-btn-wrap">
        <input
          className="search-"
          type="text"
          id="fname"
          placeholder="Search"
          style={{ height: 30, border: "1.5px solid #C6C6C6" }}
        />
      </div>
      <WalletPaymentTable />
    </div>
  );
}
