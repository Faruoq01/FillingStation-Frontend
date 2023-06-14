import React, { Fragment } from "react";

import "../../styles/estation/payment.scss";
import { useMediaQuery } from "@mui/material";
import WalletPaymentTable from "./WalletPaymentTable";
import Button from "./Button";

export default function WalletPaymentListIndex() {
  const mobile = useMediaQuery("(max-width:900px)");
  const tablet = useMediaQuery("(min-width:800px)");
  return (
    <div className="individual-sale-container-">
      <div className="wrap-btn-wrap">
        <div className="btn-wrap-">
          <Button>Individual</Button>
          <Button style={{ marginLeft: 5 }}>Corporate</Button>
        </div>
        <div className="input-wrapp-payment">
          <input
            className="search-"
            type="text"
            id="fname"
            placeholder="Search"
            style={{ height: 30, border: "1.5px solid #C6C6C6" }}
          />
          <Button
            styles={{
              marginLeft: 2,
              height: 30,
              backgroundColor: "#0F88F2",
              color: "white",
            }}
          >
            Register
          </Button>
        </div>
      </div>
      <WalletPaymentTable />
    </div>
  );
}
