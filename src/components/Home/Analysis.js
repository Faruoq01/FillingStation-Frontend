import React, { useState } from "react";
import "../../styles/payments.scss";
import analysis2 from "../../assets/analysis2.png";
import folder from "../../assets/folder.png";
import folder2 from "../../assets/folder2.png";
import hand from "../../assets/hand.png";
import naira from "../../assets/naira.png";
import me6 from "../../assets/me6.png";
import { useDispatch, useSelector } from "react-redux";
import AddCostPrice from "../Modals/analysis/addcostprice";
import CostPriceModal from "../Modals/analysis/costpricemodal";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import { setAnalysisData } from "../../storage/analysis";
import swal from "sweetalert";
import ApproximateDecimal from "../common/approx";
import { Skeleton } from "@mui/material";
import SalesDisplay from "../Modals/analysis/salesdisplay";
import Varience from "../Modals/Varience";
import { dateRange } from "../../storage/analysis";
import APIs from "../../services/api";
import SelectStation from "../common/selectstations";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import { useNavigate } from "react-router-dom";
import TablePageBackground from "../controls/PageLayout/TablePageBackground";

const Analysis = (props) => {
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const { expenses, payments, profit, totalSales, totalVarience } = useSelector(
    (state) => state.analysis.analysisData
  );
  const updatedDate = useSelector((state) => state.analysis.dateRange);
  const moment = require("moment-timezone");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [type, setType] = useState(false);
  const [mode, setMode] = useState("");
  const [load, setLoad] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openDetails2, setOpenDetails2] = useState(false);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.analysis[e];
  };

  const analysisDataHandler = (outletID) => {
    const [start, end] = updatedDate;
    setLoad(true);
    const payload = {
      organisation: resolveUserID().id,
      outletID: outletID,
      start: start,
      end: end,
    };

    APIs.post("/analysis/analysisData", payload)
      .then(({ data }) => {
        dispatch(setAnalysisData(data.analysisData));
      })
      .then(() => {
        setLoad(false);
      });
  };

  const DashboardImage = (props) => {
    return (
      <>
        {load && (
          <Skeleton
            sx={{ borderRadius: "5px", background: "#f7f7f7" }}
            animation="wave"
            variant="rectangular"
            width={"100%"}
            height={110}
          />
        )}
        {load || (
          <div
            style={{ margin: "0px" }}
            onClick={() => {
              openCostPrice(props.type);
            }}
            className="first-image">
            <div style={{ marginRight: "10px" }} className="inner-first-image">
              <div className="top-first-image">
                <div className="top-icon">
                  <img
                    style={{ width: "50px", height: "40px" }}
                    src={props.image}
                    alt="icon"
                  />
                </div>
                <div
                  style={{
                    alignItems: "flex-end",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                  className="top-text">
                  <div style={{ fontSize: "14px", color: "#06805B" }}>
                    {props.name}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      marginTop: "5px",
                    }}>
                    {props.value}
                  </div>
                </div>
              </div>
              <div className="bottom-first-image">
                <img
                  style={{ width: "30px", height: "10px" }}
                  src={me6}
                  alt="icon"
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const openCostPrice = (type) => {
    if (type === "cost" || type === "selling") {
      if (!getPerm("2") || !getPerm("3"))
        return swal("Warning!", "Permission denied", "info");

      setOpen(true);
      setType(type);
    } else if (type === "payments") {
      if (!getPerm("4")) return swal("Warning!", "Permission denied", "info");

      navigate("payments");
    } else if (type === "expenses") {
      if (!getPerm("5")) return swal("Warning!", "Permission denied", "info");

      navigate("expenses");
    } else if (type === "sales") {
      setOpenDetails(true);
    } else if (type === "varience") {
      setOpenDetails2(true);
    }
  };

  const getDateFromRange = (data) => {
    setLoad(true);
    if (!getPerm("6")) return swal("Warning!", "Permission denied", "info");

    const formatOne = moment(new Date(data[0]))
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];
    const formatTwo = moment(new Date(data[1]))
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];

    dispatch(dateRange([formatOne, formatTwo]));
    const id = oneStationData === null ? "None" : oneStationData._id;
    analysisDataHandler(id, formatOne, formatTwo);
  };

  return (
    <TablePageBackground bg={"#fff"}>
      <div style={{ width: "100%", marginTop: "0px" }} className="inner-pay">
        <TableControls>
          <LeftControls>
            <SelectStation
              ml={"0px"}
              oneStation={getPerm("0")}
              allStation={getPerm("1")}
              callback={analysisDataHandler}
            />
          </LeftControls>
          <RightControls>
            <DateRangePicker onChange={getDateFromRange} value={updatedDate} />
          </RightControls>
        </TableControls>

        <div style={contain2}>
          <div className="imgContainer">
            <DashboardImage
              type={"cost"}
              right={"10px"}
              left={"0px"}
              image={naira}
              name={"Cost Price"}
              value={`NGN ${oneStationData ? oneStationData?.PMSCost : "0"}`}
            />
            <DashboardImage
              type={"selling"}
              right={"10px"}
              left={"0px"}
              image={hand}
              name={"Selling Price"}
              value={`NGN ${oneStationData ? oneStationData?.PMSPrice : "0"}`}
            />
            <DashboardImage
              type={"expenses"}
              right={"10px"}
              left={"0px"}
              image={folder}
              name={"Expenses"}
              value={`NGN ${ApproximateDecimal(expenses)}`}
            />
            <DashboardImage
              type={"payments"}
              right={"10px"}
              left={"0px"}
              image={folder2}
              name={"Payments"}
              value={`NGN ${ApproximateDecimal(payments)}`}
            />
            <DashboardImage
              type={"none"}
              right={"10px"}
              left={"0px"}
              image={analysis2}
              name={"Profits"}
              value={`NGN ${ApproximateDecimal(profit)}`}
            />
            <DashboardImage
              type={"sales"}
              right={"10px"}
              left={"0px"}
              image={folder}
              name={"Total Sales"}
              value={`NGN ${ApproximateDecimal(totalSales)}`}
            />
            <DashboardImage
              type={"varience"}
              right={"10px"}
              left={"0px"}
              image={folder2}
              name={"Varience"}
              value={`NGN ${ApproximateDecimal(totalVarience)}`}
            />
          </div>
        </div>
      </div>

      {open && (
        <AddCostPrice
          type={type}
          open={open}
          close={setOpen}
          open2={setOpen2}
          setMode={setMode}
        />
      )}
      {open2 && (
        <CostPriceModal type={type} open={open2} close={setOpen2} mode={mode} />
      )}
      {openDetails && (
        <SalesDisplay open={openDetails} close={setOpenDetails} />
      )}
      {openDetails2 && <Varience open={openDetails2} close={setOpenDetails2} />}
    </TablePageBackground>
  );
};

const contain2 = {
  width: "100%",
  marginTop: "20px",
};

export default Analysis;
