import React, { Fragment } from "react";
import Button from "./Button";
import "../../styles/estation/individual_sale.scss";
import { useMediaQuery } from "@mui/material";
import SalesTable from "./SalesTable";

export default function CorporateSaleindex() {
  const mobile = useMediaQuery("(max-width:900px)");
  const tablet = useMediaQuery("(min-width:800px)");
  return (
    <div className="individual-sale-container-">
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
          style={{ border: "1.5px solid #C6C6C6", height: 30 }}
        ></input>
      </div>
      <SalesTable />
    </div>
  );
}

const styles = (mobile, tablet) => ({
  btn: {},
});
