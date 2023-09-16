import React, { Fragment } from "react";
import "../../styles/comprehensive.scss";
import pump from "../../assets/comp/pump.png";
import expenses from "../../assets/comp/expenses.png";
import lpo from "../../assets/comp/lpo.png";
import cal from "../../assets/comp/cal.png";
import tank from "../../assets/comp/tank.png";
import bals from "../../assets/comp/bals.png";
import returnTo from "../../assets/comp/returnTo.png";
import InitialBalance from "../Comprehensive/BalanceBF";
import { useEffect, useState } from "react";
import ProductBalance from "../Comprehensive/ProductBalance";
import LPOReport from "../Comprehensive/LPOReport";
import Expenses from "../Comprehensive/Expenses";
import Dipping from "../Comprehensive/Dipping";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReturnToTank from "../Comprehensive/ReturnToTank";
import PaymentDetails from "../Comprehensive/PaymentDetails";
import { setDateValue, setLocaleDate } from "../../storage/dailysales";
import { Button, Stack } from "@mui/material";
import ReportConfirmation from "../Comprehensive/ReportConfirmation";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ButtonDatePicker from "../common/CustomDatePicker";
import { dateRange } from "../../storage/dashboard";
import TankLevels from "../Comprehensive/TankLevels";
import swal from "sweetalert";
import SalesService from "../../services/360station/sales";
import APIs from "../../services/connections/api";
import ComprehensiveReportModal from "../Reports/ComprehensiveReportModal";
import ShiftSelect from "../common/shift";

const mobile = window.matchMedia("(max-width: 600px)");

const ComprehensiveReport = (props) => {
  const [printReportStatus, setPrintReportStatus] = useState(false);
  const moment = require("moment-timezone");
  const date2 = moment().format("Do MMM YYYY");
  const [initial, setInitial] = useState("");
  const [value, setValue] = React.useState(null);

  const [collapsible, setCollapsible] = useState(0);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updatedDate = useSelector((state) => state.dailysales.updatedDate);
  const localeDate = useSelector((state) => state.dailysales.localeDate);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  useEffect(() => {
    if (updatedDate === "" || localeDate === "") {
      setInitial(date2);
    } else {
      const formatedDate = moment(updatedDate).format("Do MMM YYYY");
      setInitial(formatedDate);
      setValue(localeDate);
    }

    if (oneStationData === null) {
      navigate("dailysales");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateDate = (newValue) => {
    // if(!getPerm('4')) return swal("Warning!", "Permission denied", "info");
    setValue(newValue);

    const getDate = newValue === "" ? date2 : newValue.format("YYYY-MM-DD");
    dispatch(setDateValue(getDate));
    dispatch(setLocaleDate(newValue));
    dispatch(dateRange([new Date(getDate), new Date(getDate)]));
  };

  const convertDate = (newValue) => {
    const getDate = newValue === "" ? initial : newValue.format("Do MMM YYYY");
    return getDate;
  };

  const resetAllRecords = () => {
    swal({
      title: "Alert!",
      text: "Are you sure you want to delete all record?, this will erase all records on the current selected date only.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const getDate =
          updatedDate === ""
            ? moment().format("YYYY-MM-DD").split()[0]
            : updatedDate;

        const payload = {
          org: resolveUserID().id,
          outletID: oneStationData._id,
          date: getDate,
        };

        APIs.post("/sales/delete/checkStatus", payload).then((data) => {
          if (data.data.data) {
            swal(
              "Error!",
              "You can only delete from latest record as balance calculations depends on it!",
              "error"
            );
          } else {
            const load = {
              date: getDate,
              station: oneStationData,
            };
            SalesService.deleteAllRecords(load).then(({ data }) => {
              if (data.status !== "empty") {
                APIs.post("/sales/delete/supply", load).then(() => {
                  setCollapsible(0);
                  swal("Success", "Record deleted successfully", "success");
                });
              } else {
                setCollapsible(0);
                swal("Success", "Record deleted successfully", "success");
              }
            });
          }
        });
      }
    });
  };

  const openPrintModal = () => {
    setPrintReportStatus(true);
    APIs.get("/test").then(({ data }) => {
      console.log(data.response, "lookups");
    });
  };

  return (
    <Fragment>
      <div className="comprehensive_container">
        <div className="reportings">
          <div style={buttonGroup} className="comp_result">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={1}>
                <ButtonDatePicker
                  label={`${
                    value === null || "" ? initial : convertDate(value)
                  }`}
                  value={value}
                  onChange={(newValue) => updateDate(newValue)}
                />
              </Stack>
            </LocalizationProvider>

            <div className="resetAll">
              <Button
                variant="contained"
                sx={resetBut}
                onClick={resetAllRecords}>
                Reset All
              </Button>
            </div>

            <Button
              variant="contained"
              sx={{
                width: "100px",
                height: "30px",
                background: "#2196F3",
                fontSize: "12px",
                borderRadius: "0px",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "tomato",
                },
              }}
              onClick={openPrintModal}>
              Print
            </Button>
          </div>
          <div style={shifts}>
            <ShiftSelect />
          </div>

          <div className="first_layer">
            <div className="first_top_layer">
              <div className="back_layer">
                <div onClick={() => setCollapsible(0)} className="back_icon">
                  <img
                    style={{ width: "15px", height: "17px" }}
                    src={bals}
                    alt="icon"
                  />
                </div>
              </div>
              <div className="topic_name">Initial Balance</div>
            </div>

            <div className="first_mid_layer">
              {collapsible === 0 && <InitialBalance />}
            </div>
          </div>

          <div className="first_layer">
            <div className="first_top_layer">
              <div className="back_layer">
                <div onClick={() => setCollapsible(1)} className="back_icon">
                  <img
                    style={{ width: "17px", height: "17px" }}
                    src={pump}
                    alt="icon"
                  />
                </div>
              </div>
              <div className="topic_name">Product Dispensed</div>
            </div>

            <div className="first_mid_layer">
              {collapsible === 1 && (
                <ProductBalance type={"PMS"} sales={true} />
              )}
              {collapsible === 1 && (
                <ProductBalance type={"AGO"} sales={true} />
              )}
              {collapsible === 1 && (
                <ProductBalance type={"DPK"} sales={true} />
              )}
            </div>
          </div>

          <div className="first_layer">
            <div className="first_top_layer">
              <div className="back_layer">
                <div onClick={() => setCollapsible(2)} className="back_icon">
                  <img
                    style={{ width: "20px", height: "17px" }}
                    src={returnTo}
                    alt="icon"
                  />
                </div>
              </div>
              <div className="topic_name">Return to Tank</div>
            </div>

            <div className="first_mid_layer">
              {collapsible === 2 && <ReturnToTank />}
            </div>
          </div>

          <div className="first_layer">
            <div className="first_top_layer">
              <div className="back_layer">
                <div onClick={() => setCollapsible(3)} className="back_icon">
                  <img
                    style={{ width: "20px", height: "16px" }}
                    src={lpo}
                    alt="icon"
                  />
                </div>
              </div>
              <div className="topic_name">LPO</div>
            </div>

            <div className="first_mid_layer">
              {collapsible === 3 && <LPOReport />}
            </div>
          </div>

          <div className="first_layer">
            <div className="first_top_layer">
              <div className="back_layer">
                <div onClick={() => setCollapsible(4)} className="back_icon">
                  <img
                    style={{ width: "20px", height: "15px" }}
                    src={expenses}
                    alt="icon"
                  />
                </div>
              </div>
              <div className="topic_name">Expenses</div>
            </div>

            <div className="first_mid_layer">
              {collapsible === 4 && <Expenses />}
            </div>
          </div>

          <div className="first_layer">
            <div className="first_top_layer">
              <div className="back_layer">
                <div onClick={() => setCollapsible(5)} className="back_icon">
                  <img
                    style={{ width: "13px", height: "17px" }}
                    src={cal}
                    alt="icon"
                  />
                </div>
              </div>
              <div className="topic_name">Payments & Net to bank</div>
            </div>

            <div className="first_mid_layer">
              {collapsible === 5 && <PaymentDetails />}
            </div>
          </div>

          {/* <div className="first_layer">
            <div className="first_top_layer">
              <div className="back_layer">
                <div onClick={() => setCollapsible(6)} className="back_icon">
                  <img
                    style={{ width: "16px", height: "16px" }}
                    src={pump}
                    alt="icon"
                  />
                </div>
              </div>
              <div className="topic_name">Product Balance Carried Forward</div>
            </div>

            <div className="first_mid_layer">
              {collapsible === 6 && <BalanceCF />}
            </div>
          </div> */}

          <div className="first_layer">
            <div className="first_top_layer">
              <div className="back_layer">
                <div onClick={() => setCollapsible(7)} className="back_icon">
                  <img
                    style={{ width: "20px", height: "16px" }}
                    src={tank}
                    alt="icon"
                  />
                </div>
              </div>
              <div className="topic_name">Dipping</div>
            </div>

            <div className="first_mid_layer">
              {collapsible === 7 && <Dipping />}
            </div>
          </div>

          <div className="first_layer">
            <div className="first_top_layer">
              <div className="back_layer">
                <div onClick={() => setCollapsible(8)} className="back_icon">
                  <img
                    style={{ width: "20px", height: "16px" }}
                    src={tank}
                    alt="icon"
                  />
                </div>
              </div>
              <div className="topic_name">
                Tank Levels (Balance Carried Forward)
              </div>
            </div>

            <div className="first_mid_layer">
              {collapsible === 8 && <TankLevels />}
            </div>
          </div>

          <div className="first_layer">
            <div className="first_top_layer">
              <div className="back_layer">
                <div onClick={() => setCollapsible(9)} className="back_icon">
                  <AssessmentIcon
                    sx={{ width: "25px", height: "20px", color: "#fff" }}
                  />
                </div>
              </div>
              <div className="topic_name">Daily report confirmation</div>
            </div>

            <div style={{ borderLeft: "none" }} className="first_mid_layer">
              {collapsible === 9 && <ReportConfirmation />}
            </div>
          </div>
        </div>
      </div>
      {printReportStatus && (
        <ComprehensiveReportModal
          open={printReportStatus}
          close={setPrintReportStatus}
        />
      )}
    </Fragment>
  );
};

const resetBut = {
  width: "100%",
  height: "30px",
  background: "#E91E63",
  fontSize: "12px",
  marginLeft: "10px",
  marginRight: "10px",
  borderRadius: "0px",
  textTransform: "capitalize",
  "&:hover": {
    backgroundColor: "#FF9800",
  },
};

const buttonGroup = {
  width: mobile.matches ? "100%" : "98%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
  marginBottom: "0px",
};

const shifts = {
  width: mobile.matches ? "100%" : "98%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-end",
  marginTop: "10px",
  marginBottom: "10px",
};

export default ComprehensiveReport;
