import React, { Fragment } from "react";
import "../../styles/estation/individual_sale.scss";
import { Button, useMediaQuery } from "@mui/material";
import CorporateIncomningOrderTable from "./CorporateIncomningOrderTable";

export default function CorporateIncomningOrderindex() {
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
            <div>
              <Button variant="outlined" style={{ width: "150px" }}>
                {"All Products"}
              </Button>
              <Button
                variant="outlined"
                style={{ marginRight: 5, marginLeft: 5, width: "120px" }}
              >
                PMS
              </Button>
              <Button
                variant="outlined"
                style={{ marginRight: 5, width: "120px" }}
              >
                AGO
              </Button>
              <Button variant="outlined" style={{ width: "120px" }}>
                DPK
              </Button>
            </div>
            <input
              className="search-"
              type="text"
              id="fname"
              style={{ height: 35 }}
              placeholder="Search"
            ></input>
          </div>
          <CorporateIncomningOrderTable />
        </div>
      </div>
    </div>
  );
}

const styles = (mobile, tablet) => ({
  btn: {},
});
