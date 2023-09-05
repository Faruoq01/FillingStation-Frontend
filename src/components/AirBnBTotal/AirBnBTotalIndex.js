import React, { useEffect, useState } from "react";
import "../../styles/estation/airbnb.scss";
import AirBnBTopCard from "./AirBnBTopCard";
import { Doughnut } from "react-chartjs-2";
import AirBnBTopCardWithSwitch from "./AirBnBTopCardWithSwitch";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import SmallCardLeft from "./SmallCardLeft";
import AirbnbTable from "./AirbnbTable";
import Profile from "./Profile";
import CreditBalance from "../Modals/CreditLPO";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import LPOService from "../../services/lpo";
import { createLPOSales } from "../../storage/lpo";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import moment from "moment";
import { dateRange } from "../../storage/dashboard";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.overrides["doughnut"].plugins.legend.position = "bottom";
ChartJS.overrides.doughnut.plugins.legend.labels.usePointStyle = true;
ChartJS.overrides.doughnut.plugins.legend.labels.pointStyle = "circle";

export default function AirBnBTotalIndex() {
  const [credit, setCredit] = useState(false);
  const singleLPO = useSelector((state) => state.lpo.singleLPO);
  const lpos = useSelector((state) => state.lpo.lpoSales);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const updatedDate = useSelector((state) => state.dashboard.dateRange);

  const getAllLPOData = useCallback(() => {
    const formatOne = moment(new Date(updatedDate[0]))
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];
    const formatTwo = moment(new Date(updatedDate[1]))
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];

    const payload = {
      skip: 0,
      limit: 30,
      lpoID: singleLPO?._id,
      organisationID: singleLPO?.organizationID,
      startDate: formatOne,
      endDate: formatTwo,
    };

    LPOService.getAllLPOSales(payload).then((data) => {
      dispatch(createLPOSales(data.lpo.lpo));
    });
  }, [updatedDate, singleLPO?._id, singleLPO?.organizationID, dispatch]);

  useEffect(() => {
    getAllLPOData();
    return () => {
      if (typeof singleLPO._id === "undefined") {
        navigate("lposales");
      }
    };
  }, [getAllLPOData, navigate, singleLPO._id]);

  const onChangeRange = (date) => {
    const formatOne = moment(new Date(date[0]))
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];
    const formatTwo = moment(new Date(date[1]))
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];
    dispatch(dateRange([new Date(formatOne), new Date(formatTwo)]));

    const payload = {
      skip: 0,
      limit: 30,
      lpoID: singleLPO?._id,
      organisationID: singleLPO?.organizationID,
      startDate: formatOne,
      endDate: formatTwo,
    };

    LPOService.getAllLPOSales(payload).then((data) => {
      dispatch(createLPOSales(data.lpo.lpo));
    });
  };

  const PieChartData = () => {
    const pms = lpos.filter((data) => data.productType === "PMS");
    const ago = lpos.filter((data) => data.productType === "AGO");
    const dpk = lpos.filter((data) => data.productType === "DPK");

    const pmsSales = pms.reduce((accum, current) => {
      return Number(accum) + Number(current.lpoLitre);
    }, 0);

    const agoSales = ago.reduce((accum, current) => {
      return Number(accum) + Number(current.lpoLitre);
    }, 0);

    const dpkSales = dpk.reduce((accum, current) => {
      return Number(accum) + Number(current.lpoLitre);
    }, 0);

    return {
      labels: ["PMS", "AGO", "DPK"],
      datasets: [
        {
          // label: "# of Votes",
          data: [pmsSales, agoSales, dpkSales],
          backgroundColor: ["#399A19", "#FFA010", "#35393E"],
          borderColor: ["#399A19", "#FFA010", "#35393E"],
          borderWidth: 0.5,
        },
      ],
    };
  };

  return (
    <div style={styles.contain}>
      {credit && <CreditBalance open={credit} close={setCredit} />}
      <div style={styles.inner}>
        <div className="range-picker-date">
          <DateRangePicker onChange={onChangeRange} value={updatedDate} />
        </div>
        <div className="airbnb-top-wrapper">
          <Profile
            name={"Chijoke Peter"}
            position={"Station Manager"}
            icon={require("../../assets/estation/enable.svg").default}
            modal={setCredit}
          />
          <AirBnBTopCard
            amount={"20,000"}
            title={"Total Expenses"}
            icon={require("../../assets/estation/pump (1).svg").default}
          />
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
                  data={PieChartData()}
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
    marginTop: "10px",
  },
  inner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
  },
};
