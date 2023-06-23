import React from "react";
import "./airbnb.scss";
import AirBnBTopCard from "./AirBnBTopCard";
import { Doughnut } from "react-chartjs-2";
import AirBnBTopCardWithSwitch from "./AirBnBTopCardWithSwitch";
import DotProduct from "../e-component/right/DotProduct";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import SmallCardLeft from "./SmallCardLeft";
import { Button } from "@mui/material";
import AirbnbTable from "./AirbnbTable";
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
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.overrides["doughnut"].plugins.legend.position = "bottom";
ChartJS.overrides.doughnut.plugins.legend.labels.usePointStyle = true;
ChartJS.overrides.doughnut.plugins.legend.labels.pointStyle = "circle";

export default function AirBnBTotalIndex() {
  return (
    <div style={styles.contain}>
      <div style={styles.inner}>
        <div className="airbnb-top-wrapper">
          {Array(2)
            .fill(0)
            .map((_, index) => (
              <AirBnBTopCard
                amount={index == 1 ? "NGN 12,450.00" : "NGN 20,000.00"}
                title={index == 1 ? "Total Expenses" : "Account Balance"}
                icon={
                  index == 0
                    ? require("../../assets/estation/wallet.svg").default
                    : require("../../assets/estation/pump (1).svg").default
                }
                chip={index == 0 ?? false}
              />
            ))}
          <AirBnBTopCardWithSwitch
            amount="NGN 12, 500.00"
            Enable
            Credit
            Facility
            icon={require("../../assets/estation/enable.svg").default}
          />
        </div>
        {/* =====================body section============= */}

        <div className="airbnb-body-wrapper">
          <div className="body-card">
            <div className="wraper">
              <label>Product Dispensed</label>
              <div className="chart-wrap">
                <Doughnut
                  data={data}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                  }}
                />
              </div>

              <SmallCardLeft
                dotColor="#399A19"
                type="PMS"
                title="Total PMS Dispensed"
                amount="23,281.00 Liters"
                icon={require("../../assets/estation/pump (1).svg").default}
              />
              <SmallCardLeft
                dotColor="#35393E"
                type="DPK"
                style={{ marginTop: "10px", marginBottom: "10px" }}
                title="Total DPK Dispensed"
                amount="23,281.00 Liters"
                icon={require("../../assets/estation/pump (1).svg").default}
              />
              <SmallCardLeft
                dotColor="#FFA010"
                title="Total AGO Dispensed"
                amount="23,281.00 Liters"
                type="AGO"
                icon={require("../../assets/estation/pump (1).svg").default}
              />
            </div>
          </div>
          <div className="body-card">
            <div className="wraper-right">
              <div className="top-">
                <label>Expenses</label>
                <Button
                  style={{ height: "35px", background: "#EDFFFA" }}
                  variant="contained"
                >
                  <img
                    style={{ width: 20, height: 20 }}
                    src={require("../../assets/estation/menu.svg").default}
                  />
                  <label style={{ fontSize: 15, marginLeft: 5 }}>View</label>
                </Button>
              </div>
              <AirbnbTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  contain: {
    // height: "100vh",
    width: "100%",
    display: "flex",
    paddingTop: "10px",
    flexDirection: "row",
    justifyContent: "center",
    background: " #F0F9F7",
    paddingBottom: "1rem",
  },
  inner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
};
