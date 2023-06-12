import React, { Fragment } from "react";
import TopWrapper from "../e-component/top/TopWrapper";
import Button from "./Button";
import "./individual_sale.scss";
import { useMediaQuery } from "@mui/material";
import SalesTable from "./SalesTable";

export default function IndividualSaleindex() {
  const mobile = useMediaQuery("(max-width:900px)");
  const tablet = useMediaQuery("(min-width:800px)");
  return (
    <div style={{ padding: "1rem" }}>
      <div className="wrap-btn-wrap">
        <div className="btn-wrap">
          <Button
            style={{ backgroundColor: "#06805B", color: "white", border: 0 }}
          >
            {mobile ? "All" : "All Products"}
          </Button>
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
  );
}

const styles = (mobile, tablet) => ({
  btn: {},
});
