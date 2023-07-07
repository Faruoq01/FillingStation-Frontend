import React from "react";
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
import BalanceCF from "../Comprehensive/BalanceCF";
import Dipping from "../Comprehensive/Dipping";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReturnToTank from "../Comprehensive/ReturnToTank";
import PaymentDetails from "../Comprehensive/PaymentDetails";
import {
  bulkReports,
  currentDateValue,
  overages,
  passCummulative,
  saveRemarks,
} from "../../store/actions/dailySales";
import DailySalesService from "../../services/DailySales";
import { Button, Stack } from "@mui/material";
import ReportConfirmation from "../Comprehensive/ReportConfirmation";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ButtonDatePicker from "../common/CustomDatePicker";
import { dateRange } from "../../store/actions/dashboard";
import TankLevels from "../Comprehensive/TankLevels";
import swal from "sweetalert";
import SalesService from "../../services/sales";
import APIs from "../../services/api";

const ComprehensiveReport = (props) => {
  const moment = require("moment-timezone");
  const date = new Date();
  const toString = date.toDateString();
  const [day, year, month] = toString.split(" ");
  const date2 = `${day} ${month} ${year}`;
  const [value, setValue] = React.useState(null);

  const [collapsible, setCollapsible] = useState(0);
  const oneStationData = useSelector(
    (state) => state.outletReducer.adminOutlet
  );
  const currentDate2 = useSelector(
    (state) => state.dailySalesReducer.currentDate
  );
  const user = useSelector((state) => state.authReducer.user);
  const history = useHistory();
  const dispatch = useDispatch();
  // const dipping = useSelector(state => state.dailySalesReducer.overages);
  const tankList = useSelector((state) => state.outletReducer.tankList);
  const [load, setLoad] = useState(false);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  useEffect(() => {
    setValue(currentDate2);

    if (oneStationData === null) {
      history.push("/home/daily-sales");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateDate = (newValue) => {
    // if(!getPerm('4')) return swal("Warning!", "Permission denied", "info");
    setValue(newValue);

    const getDate = newValue === "" ? date2 : newValue.format("YYYY-MM-DD");
    dispatch(currentDateValue(newValue));
    getAndAnalyzeDailySales(oneStationData, false, getDate);
    dispatch(dateRange([new Date(getDate), new Date(getDate)]));
  };

  const getAndAnalyzeDailySales = (data, status, value) => {
    setLoad(true);
    const salesPayload = {
      organisationID: resolveUserID().id,
      outletID: data._id,
      onLoad: status,
      selectedDate: value,
    };

    DailySalesService.getDailySalesDataAndAnalyze(salesPayload)
      .then((data) => {
        dispatch(bulkReports(data.dailyRecords));
        dispatch(overages(data.dailyRecords.dipping));
        return data.dailyRecords.dipping;
      })
      .then((data) => {
        setLoad(false);
        getProductTanks(data);
      });

    DailySalesService.getRemarks(salesPayload).then((data) => {
      dispatch(saveRemarks(data.remarks));
    });
  };

  const convertDate = (newValue) => {
    const getDate = newValue === "" ? date2 : newValue.format("MM/DD/YYYY");
    const date = new Date(getDate);
    const toString = date.toDateString();
    const [day, year, month] = toString.split(" ");
    const finalDate = `${day} ${month} ${year}`;

    return finalDate;
  };

  const getCummulativeVolumePerProduct = (pms, ago, dpk, dipping) => {
    let totalPMS = 0;
    let PMSTankCapacity = 0;
    let totalAGO = 0;
    let AGOTankCapacity = 0;
    let totalDPK = 0;
    let DPKTankCapacity = 0;

    const today = moment().format("YYYY-MM-DD HH:mm:ss").split(" ")[0];
    const getDate =
      currentDate2 === "" ? today : currentDate2.format("YYYY-MM-DD");

    if (today === getDate) {
      totalPMS = pms.reduce((accum, current) => {
        return Number(accum) + Number(current.currentLevel);
      }, 0);

      PMSTankCapacity = pms.reduce((accum, current) => {
        return Number(accum) + Number(current.tankCapacity);
      }, 0);

      totalAGO = ago.reduce((accum, current) => {
        return Number(accum) + Number(current.currentLevel);
      }, 0);

      AGOTankCapacity = ago.reduce((accum, current) => {
        return Number(accum) + Number(current.tankCapacity);
      }, 0);

      totalDPK = dpk.reduce((accum, current) => {
        return Number(accum) + Number(current.currentLevel);
      }, 0);

      DPKTankCapacity = dpk.reduce((accum, current) => {
        return Number(accum) + Number(current.tankCapacity);
      }, 0);
    } else {
      const pmsTanks = dipping.filter((data) => data.productType === "PMS");
      const agoTanks = dipping.filter((data) => data.productType === "AGO");
      const dpkTanks = dipping.filter((data) => data.productType === "DPK");

      totalPMS = pmsTanks.reduce((accum, current) => {
        return Number(accum) + Number(current.afterSales);
      }, 0);

      PMSTankCapacity = pmsTanks.reduce((accum, current) => {
        return Number(accum) + Number(current.tankCapacity);
      }, 0);

      totalAGO = agoTanks.reduce((accum, current) => {
        return Number(accum) + Number(current.afterSales);
      }, 0);

      AGOTankCapacity = agoTanks.reduce((accum, current) => {
        return Number(accum) + Number(current.tankCapacity);
      }, 0);

      totalDPK = dpkTanks.reduce((accum, current) => {
        return Number(accum) + Number(current.afterSales);
      }, 0);

      DPKTankCapacity = dpkTanks.reduce((accum, current) => {
        return Number(accum) + Number(current.tankCapacity);
      }, 0);
    }

    let PMSDeadStock = 0;
    let AGODeadStock = 0;
    let DPKDeadStock = 0;

    const payload = {
      totalPMS: totalPMS,
      PMSTankCapacity: PMSTankCapacity === 0 ? 33000 : PMSTankCapacity,
      PMSDeadStock: PMSDeadStock,
      totalAGO: totalAGO,
      AGOTankCapacity: AGOTankCapacity === 0 ? 33000 : AGOTankCapacity,
      AGODeadStock: AGODeadStock,
      totalDPK: totalDPK,
      DPKTankCapacity: DPKTankCapacity === 0 ? 33000 : DPKTankCapacity,
      DPKDeadStock: DPKDeadStock,
    };
    dispatch(passCummulative(payload));
  };

  const getProductTanks = (dipping) => {
    const PMSList = tankList.filter((tank) => tank.productType === "PMS");
    const AGOList = tankList.filter((tank) => tank.productType === "AGO");
    const DPKList = tankList.filter((tank) => tank.productType === "DPK");

    getCummulativeVolumePerProduct(PMSList, AGOList, DPKList, dipping);
  };

  const resetAllRecords = () => {
    swal({
      title: "Alert!",
      text: "Are you sure you want to delete all record?, this will erase all records on the current selected date only.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const getDate =
          currentDate2 === ""
            ? moment().format("YYYY-MM-DD").split()[0]
            : currentDate2.format("YYYY-MM-DD");

        const status = await APIs.post("/sales/delete/checkStatus", {
          org: resolveUserID().id,
          outletID: oneStationData._id,
          date: getDate,
        }).then((data) => {
          return data.data.data;
        });

        if (status) {
          swal(
            "Error!",
            "You can only delete from latest record as balance calculations depends on it!",
            "error"
          );
        } else {
          SalesService.deleteAllRecords({
            date: getDate,
            station: oneStationData,
          })
            .then((data) => {
              refresh();
            })
            .then(() => {
              setLoad(false);
              swal("Success", "Record deleted successfully", "success");
            });
        }
      }
    });
  };

  const refresh = () => {
    const salesPayload = {
      organisationID: resolveUserID().id,
      outletID: oneStationData._id,
      onLoad: currentDate2 === "" ? true : false,
      selectedDate: currentDate2.format("YYYY-MM-DD"),
    };

    DailySalesService.getDailySalesDataAndAnalyze(salesPayload).then((data) => {
      dispatch(bulkReports(data.dailyRecords));
    });
  };

  return (
    <div className="comprehensive_container">
      <div className="reportings">
        <div className="comp_result">
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}>
            <div>
              <div style={sales}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack spacing={1}>
                    <ButtonDatePicker
                      label={`${
                        value == null || "" ? date2 : convertDate(value)
                      }`}
                      value={value}
                      disabled={load}
                      onChange={(newValue) => updateDate(newValue)}
                    />
                  </Stack>
                </LocalizationProvider>
              </div>
            </div>
          </div>

          <Button
            variant="contained"
            sx={{
              width: "100px",
              height: "30px",
              background: "blue",
              fontSize: "12px",
              marginLeft: "10px",
              marginRight: "10px",
              borderRadius: "0px",
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "blue",
              },
            }}
            onClick={resetAllRecords}>
            Reset
          </Button>

          <Button
            variant="contained"
            sx={{
              width: "100px",
              height: "30px",
              background: "tomato",
              fontSize: "12px",
              marginRight: "20px",
              borderRadius: "0px",
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "tomato",
              },
            }}
            // onClick={()=>{openDailySales("report")}}
          >
            Print
          </Button>
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
            {collapsible === 1 && <ProductBalance type={"PMS"} />}
            {collapsible === 1 && <ProductBalance type={"AGO"} />}
            {collapsible === 1 && <ProductBalance type={"DPK"} />}
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

        <div className="first_layer">
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
        </div>

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
            <div className="topic_name">Tank Levels After Sale</div>
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
  );
};

const sales = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  position: "relative",
  alignItems: "flex-start",
};

export default ComprehensiveReport;
