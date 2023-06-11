import React from "react";
import PropTypes from "prop-types";
import "./right.scss";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import useMediaQuery from "@mui/material/useMediaQuery";
import RCard from "./RCard";
import CircleIcon from "@mui/icons-material/Circle";
import DotProduct from "./DotProduct";
function RightWrapper(props) {
  ChartJS.register(ArcElement, Tooltip, Legend);
  ChartJS.overrides["doughnut"].plugins.legend.position = "bottom";
  ChartJS.overrides["doughnut"].plugins.legend.display = false;
  const data = {
    labels: ["PMS", "DPK", "AGO"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3],
        backgroundColor: ["#399A19", "#35393E", "#FFA010"],
        borderColor: ["#399A19", "#35393E", "#FFA010"],
        borderWidth: 0.5,
      },
    ],
  };
  const mobile = useMediaQuery("(max-width:900px)");
  const tablet = useMediaQuery("(min-width:700px)");
  return (
    <div className="r-wrapper">
      <RCard
        onClick={() => {}}
        arrowStyle={styles(mobile, tablet).arrowStyle2}
        style={{ width: "100%", backgroundColor: " #F6FFFF" }}
        icon={
          <img
            src={require("../../img/user.svg").default}
            style={{ color: "#fff" }}
          />
        }
        amount="201"
        title="Corporate Customers"
      />
      <RCard
        onClick={() => {}}
        arrowStyle={styles(mobile, tablet).arrowStyle2}
        style={{
          width: "100%",
          marginTop: "15px",
          backgroundColor: " #F6FFFF",
        }}
        icon={
          <img
            src={require("../../img/users.svg").default}
            style={{ color: "#fff" }}
          />
        }
        amount="254"
        title="Individual Customers"
      />

      <div style={styles(mobile, tablet).doughnutWrap}>
        <div className="donut-chart">
          <label className="dou-title">Product Dispensed</label>
          <div className="donut-chart-wrapper">
            <Doughnut data={data} />
          </div>
          <div style={styles(mobile, tablet).iconsWrapper}>
            <DotProduct product="PMS" />
            <DotProduct product="AGO" />
            <DotProduct product="DPK" />
          </div>
        </div>
        <RCard
          dot
          arrowStyle={styles(mobile, tablet).arrowStyle}
          type="PMS"
          onClick={() => {}}
          icon={
            <img
              src={require("../../img/pump (1).svg").default}
              style={{ color: "#fff" }}
            />
          }
          amount="23, 281.00 Liters"
          title="Total PMS Dispensed"
        />
        <RCard
          arrowStyle={styles(mobile, tablet).arrowStyle}
          dot
          type="DPK"
          style={{ margin: "1rem 0px 1rem 0px" }}
          onClick={() => {}}
          icon={
            <img
              src={require("../../img/pump (1).svg").default}
              style={{ color: "#fff" }}
            />
          }
          amount="23, 281.00 Liters"
          title="Total PMS Dispensed"
        />
        <RCard
          dot
          type="AGO"
          arrowStyle={styles(mobile, tablet).arrowStyle}
          onClick={() => {}}
          icon={
            <img
              src={require("../../img/pump (1).svg").default}
              style={{ color: "#fff" }}
            />
          }
          amount="23, 281.00 Liters"
          title="Total PMS Dispensed"
        />
      </div>
      <RCard
        onClick={() => {}}
        arrowStyle={styles(mobile, tablet).arrowStyle2}
        style={{
          width: "100%",
          marginTop: "15px",
          backgroundColor: "white",
        }}
        icon={
          <img
            src={require("../../img/asset.svg").default}
            style={{ color: "#fff" }}
          />
        }
        amount="NGN 40, 000"
        title="Incoming Orders"
      />
    </div>
  );
}

const styles = (mobile, tablet) => ({
  iconsWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowStyle: {
    left: !mobile ? "45px" : tablet ? "25rem" : "30px",
    marginBottom: 20,
  },
  doughnutWrap: {
    padding: !mobile ? 10 : 0,
    background: "white",
    marginTop: "1rem",
    borderRadius: 9,
  },
  arrowStyle2: { left: !mobile ? "70px" : tablet ? "25rem" : "45px" },
});
RightWrapper.propTypes = {};

export default RightWrapper;
