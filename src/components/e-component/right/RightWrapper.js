import React from "react";
import PropTypes from "prop-types";
import "../../../styles/estation/right.scss";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import useMediaQuery from "@mui/material/useMediaQuery";
import RCard from "./RCard";
import DotProduct from "./DotProduct";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
function RightWrapper(props) {
  ChartJS.register(ArcElement, Tooltip, Legend);
  ChartJS.overrides["doughnut"].plugins.legend.position = "bottom";
  ChartJS.overrides["doughnut"].plugins.legend.display = false;
  const navigation = useHistory();
  const data = {
    labels: ["PMS", "DPK", "AGO"],
    datasets: [
      {
        // label: "# of Votes",
        data: [12, 19, 3],
        backgroundColor: ["#399A19", "#35393E", "#FFA010"],
        borderColor: ["#399A19", "#35393E", "#FFA010"],
        borderWidth: 0.5,
      },
    ],
  };
  const mobile = useMediaQuery("(max-width:900px)");
  const tablet = useMediaQuery("(mx-width:1000px)");
  const goToCorporateCustomerPage = () => {
    navigation.push("/home/estation-corporate-customer");
  };
  const goToIndividualCustomerPage = () => {
    navigation.push("/home/estation-individual-customer");
  };
  return (
    <div className="r-wrapper">
      <RCard
        onClick={goToCorporateCustomerPage}
        arrowStyle={styles(mobile, tablet).arrowStyle2}
        style={{ width: "100%", backgroundColor: " #F6FFFF" }}
        icon={
          <img
            src={require("../../../assets/estation/user.svg").default}
            style={{ color: "#fff", width: "100%", height: "100%" }}
          />
        }
        amount="201"
        title="Corporate Customers"
      />
      <RCard
        onClick={goToIndividualCustomerPage}
        arrowStyle={styles(mobile, tablet).arrowStyle2}
        style={{
          width: "100%",
          marginTop: "15px",
          backgroundColor: " #F6FFFF",
        }}
        icon={
          <img
            src={require("../../../assets/estation/users.svg").default}
            style={{ color: "#fff", width: "100%", height: "100%" }}
          />
        }
        amount="254"
        title="Individual Customers"
      />

      <div style={styles(mobile, tablet).doughnutWrap}>
        <div className="donut-chart">
          <label className="dou-title">Product Dispensed</label>
          <div className="donut-chart-wrapper">
            <Doughnut
              data={data}
              options={{
                responsive: true,
                maintainAspectRatio: true,
              }}
            />
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
              src={require("../../../assets/estation/pump (1).svg").default}
              style={{ color: "#fff", width: "100%", height: "100%" }}
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
              src={require("../../../assets/estation/pump (1).svg").default}
              style={{
                justifySelf: "center",
                color: "#fff",
                width: "100%",
                height: "100%",
              }}
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
              src={require("../../../assets/estation/pump (1).svg").default}
              style={{ color: "#fff", width: "100%", height: "100%" }}
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
          marginTop: "10px",
          backgroundColor: "#fff",
        }}
        icon={
          <img
            src={require("../../../assets/estation/assets.svg").default}
            style={{ color: "#fff", width: "100%", height: "100%" }}
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
    margin: "1rem",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowStyle: {
    left: !mobile ? "10px" : tablet ? "20" : "30px",
    marginBottom: 20,
  },
  lastCardWrap: {
    // padding: 10,
    background: "white",
    marginTop: "1rem",
    borderRadius: 9,
  },
  doughnutWrap: {
    padding: 10,
    background: "white",
    marginTop: "1rem",
    borderRadius: 9,
  },
  arrowStyle2: { left: !mobile ? "40px" : tablet ? "25rem" : "45px" },
});
RightWrapper.propTypes = {};

export default RightWrapper;
