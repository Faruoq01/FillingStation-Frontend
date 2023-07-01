import React, { Fragment } from "react";

import "../../styles/estation/individual_sale.scss";
import { Button, useMediaQuery } from "@mui/material";
import SalesTable from "./IndividualOrderTable";

export default function IndividualOrderindex() {
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
            <div className="btn-wrap">
              <Button style={{}}>{"All Products"}</Button>
              <Button style={{ marginRight: 5, marginLeft: 5 }}>PMS</Button>
              <Button style={{ marginRight: 5 }}>AGO</Button>
              <Button>DPK</Button>
            </div>
            <input
              className="search-"
              type="text"
              id="fname"
              placeholder="Search"
            ></input>
          </div>
          <SalesTable />
        </div>
      </div>
    </div>
  );
}

const styles = (mobile, tablet) => ({
  btn: {},
});
