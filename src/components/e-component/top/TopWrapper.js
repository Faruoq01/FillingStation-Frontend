import React from "react";
import PropTypes from "prop-types";
import "../../../styles/estation/top_.scss";
import AppSelect from "./AppSelect";
import AppDate from "./AppDate";
import TopCard from "./TopCard";
import { useHistory } from "react-router-dom";
import {
  AccountBalanceWallet,
  Description,
  Receipt,
  Note,
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";

function TopWrapper({ disableCard, ...props }) {
  const navigation = useHistory();

  const mobile = useMediaQuery("(max-width:900px)");
  const tablet = useMediaQuery("(min-width:700px)");
  const goToSales = () => {
    navigation.push("/home/estation-sales");
  };
  const goToPayments = () => {
    navigation.push("/home/estation/payments");
  };

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div className="e-top-wrapper">
        {/* <div className="date-select">
          <AppSelect data={data} />
          <AppDate />
        </div> */}
        <div
          style={{ display: disableCard ? "none" : null }}
          className="card-wrapper"
        >
          <TopCard
            onClick={goToPayments}
            arrowStyle={{ left: !mobile ? "0px" : tablet ? "25rem" : "45px" }}
            icon={
              <img
                src={require("../../../assets/estation/wallet.svg").default}
                style={{ color: "#fff", width: "100%", height: "100%" }}
              />
            }
            amount="NGN 530,000"
            title="Wallet Balance"
          />
          <TopCard
            arrowStyle={{ left: !mobile ? "0px" : tablet ? "25rem" : "45px" }}
            amount="NGN 220,000"
            title="Assets"
            icon={
              <img
                src={require("../../../assets/estation/assets.svg").default}
                style={{ color: "#fff", width: "100%", height: "100%" }}
              />
            }
          />
          <TopCard
            arrowStyle={{ left: !mobile ? "0px" : tablet ? "25rem" : "45px" }}
            amount="NGN 230,000"
            title="Liability"
            icon={
              <img
                src={require("../../../assets/estation/liab.svg").default}
                style={{ color: "#fff", width: "100%", height: "100%" }}
              />
            }
          />
          <TopCard
            onClick={goToSales}
            arrowStyle={{ left: !mobile ? "0px" : tablet ? "25rem" : "45px" }}
            amount="NGN 350,000"
            title="Sales"
            icon={
              <img
                src={require("../../../assets/estation/saless.svg").default}
                style={{ color: "#fff", width: "100%", height: "100%" }}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}

TopWrapper.propTypes = {};

export default TopWrapper;
