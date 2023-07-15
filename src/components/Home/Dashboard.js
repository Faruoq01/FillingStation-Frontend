import React from "react";
import "../../styles/dashboard.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import OutletService from "../../services/outletService";
import { adminOutlet, getAllStations } from "../../store/actions/outlet";
import { useState } from "react";
import DashboardService from "../../services/dashboard";
import {
  addDashboard,
  dashboardRecordMore,
  dashEmployees,
  dateRange,
  setSales,
} from "../../store/actions/dashboard";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import DashboardGraph from "../DashboardComponents/DashboardGraph";
import SalesDisplay from "../Modals/SalesDisplay";
import swal from "sweetalert";
import { overages, supplies } from "../../store/actions/dailySales";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import Sales from "../DashboardComponents/sales";
import OveragesAndShortages from "../DashboardComponents/overages";
import Assets from "../DashboardComponents/Assets";
import Supply from "../DashboardComponents/Supply";
import PaymentDetails from "../DashboardComponents/paymentDetails";
import Expenses from "../DashboardComponents/Expenses";
import TopStations from "../DashboardComponents/TopStations";
import IncomingOrder from "../DashboardComponents/IncomingOrder";
import Controls from "../DashboardComponents/Controls";

const Dashboard = (props) => {
  const dispatch = useDispatch();
  const moment = require("moment-timezone");
  const user = useSelector((state) => state.auth.user);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [defaultState, setDefault] = useState(0);
  const [load, setLoad] = useState(false);

  // const [value, setValue] = React.useState([new Date(), new Date()]);
  const updatedDate = useSelector((state) => state.dashboard.dateRange);
  const [prices, setPrices] = useState(false);

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
    return user.permission?.dashboard[e];
  };

  const collectAndAnalyseData = (data) => {
    let activeTank = data.station.tanks.filter(
      (data) => data.activeState === "1"
    );
    let inActiveTank = data.station.tanks.filter(
      (data) => data.activeState === "0"
    );
    let activePump = data.station.pumps.filter(
      (data) => data.activeState === "1"
    );
    let inActivePump = data.station.pumps.filter(
      (data) => data.activeState === "0"
    );

    const payload = {
      count: data.count,
      tanks: {
        activeTank: { count: activeTank.length, list: activeTank },
        inActiveTank: { count: inActiveTank.length, list: inActiveTank },
      },
      pumps: {
        activePumps: { count: activePump.length, list: activePump },
        inActivePumps: { count: inActivePump.length, list: inActivePump },
      },
    };
    dispatch(addDashboard(payload));
  };

  const getAllStationData = useCallback(() => {
    const payload = {
      organisation: resolveUserID().id,
    };

    const getAttendance = async (payload) => {
      const data = await DashboardService.allAttendanceRecords(payload);
      return data;
    };

    const getSalesRecord = async (payload) => {
      const data = await DashboardService.allSalesRecords(payload);
      return data;
    };

    if (oneStationData !== null) {
      if (getPerm("1") || getPerm("2") || user.userType === "superAdmin") {
        const findID = allOutlets.findIndex(
          (data) => data._id === oneStationData._id
        );
        setDefault(findID + 1);

        const formatOne = moment(new Date(updatedDate[0]))
          .format("YYYY-MM-DD HH:mm:ss")
          .split(" ")[0];
        const formatTwo = moment(new Date(updatedDate[1]))
          .format("YYYY-MM-DD HH:mm:ss")
          .split(" ")[0];

        const payload = {
          organisation: resolveUserID().id,
          outletID: oneStationData._id,
          today: formatOne,
          tomorrow: formatTwo,
        };

        const payload2 = {
          id: resolveUserID().id,
          outletID: oneStationData._id,
        };

        Promise.all([getAttendance(payload2), getSalesRecord(payload)]).then(
          (data) => {
            // attendance records
            // dispatch(dashEmployees(data[0].employees));
            // collectAndAnalyseData(data[0]);
            // dispatch(overages(data[1].dipping));
            // dispatch(setSales(data[1].sales));
            // dispatch(supplies(data[1].supply));
            // setTopStationsList(data[1].topStations);

            // sales record
            const evaluatedDashboard = collectAndEvaluateDashboard(data[1]);
            dispatch(dashboardRecordMore(evaluatedDashboard));
          }
        );
        return;
      }
    }

    setLoad(true);
    OutletService.getAllOutletStations(payload)
      .then((data) => {
        dispatch(getAllStations(data.station));
        if (
          (getPerm("1") || user.userType === "superAdmin") &&
          oneStationData === null
        ) {
          if (!getPerm("2")) setDefault(1);
          dispatch(adminOutlet(null));
          return "None";
        } else {
          OutletService.getOneOutletStation({ outletID: user.outletID }).then(
            (data) => {
              dispatch(adminOutlet(data.station));
            }
          );

          return user.outletID;
        }
      })
      .then((data) => {
        const formatOne = moment(new Date(updatedDate[0]))
          .format("YYYY-MM-DD HH:mm:ss")
          .split(" ")[0];
        const formatTwo = moment(new Date(updatedDate[1]))
          .format("YYYY-MM-DD HH:mm:ss")
          .split(" ")[0];

        const payload = {
          organisation: resolveUserID().id,
          outletID: data,
          today: formatOne,
          tomorrow: formatTwo,
        };

        const payload2 = {
          id: resolveUserID().id,
          outletID: data,
        };

        Promise.all([getAttendance(payload2), getSalesRecord(payload)]).then(
          (data) => {
            // attendance records
            // dispatch(dashEmployees(data[0].employees));
            // collectAndAnalyseData(data[0]);
            // dispatch(overages(data[1].dipping));
            // dispatch(setSales(data[1].sales));
            // dispatch(supplies(data[1].supply));
            // setTopStationsList(data[1].topStations);

            // sales record
            const evaluatedDashboard = collectAndEvaluateDashboard(data[1]);
            dispatch(dashboardRecordMore(evaluatedDashboard));
          }
        );
      })
      .then(() => {
        setLoad(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user._id, user.userType, user.outletID, dispatch]);

  useEffect(() => {
    getAllStationData();
  }, [getAllStationData]);

  const collectAndEvaluateDashboard = (data) => {
    /* ############################################################
            Analyze lpo sales
        ##############################################################*/
    let PMSLPO = data?.lpo?.filter((data) => data.productType === "PMS");
    let AGOLPO = data?.lpo?.filter((data) => data.productType === "AGO");
    let DPKLPO = data?.lpo?.filter((data) => data.productType === "DPK");

    const PMSTotalLpoSales = PMSLPO?.reduce((accum, current) => {
      return Number(accum) + Number(current.lpoLitre) * Number(current.PMSRate);
    }, 0);

    const AGOTotalLpoSales = AGOLPO?.reduce((accum, current) => {
      return Number(accum) + Number(current.lpoLitre) * Number(current.AGORate);
    }, 0);

    const DPKTotalLpoSales = DPKLPO?.reduce((accum, current) => {
      return Number(accum) + Number(current.lpoLitre) * Number(current.DPKRate);
    }, 0);

    /* ############################################################
            Analyze lpo Volume
        ##############################################################*/

    // const PMSTotalLpoLitre = PMSLPO.reduce((accum, current) => {
    //     return Number(accum) + Number(current.lpoLitre);
    // }, 0);

    // const AGOTotalLpoLitre = AGOLPO.reduce((accum, current) => {
    //     return Number(accum) + Number(current.lpoLitre);
    // }, 0);

    // const DPKTotalLpoLitre = DPKLPO.reduce((accum, current) => {
    //     return Number(accum) + Number(current.lpoLitre);
    // }, 0);

    // console.log(PMSTotalLpoLitre, "pms volume")
    // console.log(AGOTotalLpoLitre, "ago volume")
    // console.log(DPKTotalLpoLitre, "dpk volume")

    /* ############################################################
            Analyze total sales Volume
        ##############################################################*/
    let PMS = data.sales.filter((data) => data.productType === "PMS");
    let AGO = data.sales.filter((data) => data.productType === "AGO");
    let DPK = data.sales.filter((data) => data.productType === "DPK");

    const pmsTotalLitre = PMS.reduce((accum, current) => {
      return Number(accum) + Number(current.sales);
    }, 0);

    const agoTotalLitre = AGO.reduce((accum, current) => {
      return Number(accum) + Number(current.sales);
    }, 0);

    const dpkTotalLitre = DPK.reduce((accum, current) => {
      return Number(accum) + Number(current.sales);
    }, 0);

    /* ############################################################
            Analyze total sales
        ##############################################################*/

    const pmsTotalSales = PMS.reduce((accum, current) => {
      return (
        Number(accum) + Number(current.sales) * Number(current.PMSSellingPrice)
      );
    }, 0);

    const agoTotalSales = AGO.reduce((accum, current) => {
      return (
        Number(accum) + Number(current.sales) * Number(current.AGOSellingPrice)
      );
    }, 0);

    const dpkTotalSales = DPK.reduce((accum, current) => {
      return (
        Number(accum) + Number(current.sales) * Number(current.DPKSellingPrice)
      );
    }, 0);

    /* ############################################################
            Analyze total supply
        ##############################################################*/

    let PMSSupply = data.supply.filter((data) => data.productType === "PMS");
    let AGOSupply = data.supply.filter((data) => data.productType === "AGO");
    let DPKSupply = data.supply.filter((data) => data.productType === "DPK");

    const pmsSupply = PMSSupply.reduce((accum, current) => {
      return Number(accum) + Number(current.quantity);
    }, 0);

    const agoSupply = AGOSupply.reduce((accum, current) => {
      return Number(accum) + Number(current.quantity);
    }, 0);

    const dpkSupply = DPKSupply.reduce((accum, current) => {
      return Number(accum) + Number(current.quantity);
    }, 0);

    /* ############################################################
            Analyze total expenses
        ##############################################################*/

    const totalExpenses = data.expense.reduce((accum, current) => {
      return Number(accum) + Number(current.expenseAmount);
    }, 0);

    /* ############################################################
            Analyze total payments
        ##############################################################*/

    const totalPayments = data.payment.reduce((accum, current) => {
      return Number(accum) + Number(current.amountPaid);
    }, 0);

    const totalPosPayments = data.posPayment.reduce((accum, current) => {
      return Number(accum) + Number(current.amountPaid);
    }, 0);

    const netToBank =
      pmsTotalSales -
      PMSTotalLpoSales +
      (agoTotalSales - AGOTotalLpoSales) +
      (dpkTotalSales - DPKTotalLpoSales) -
      totalExpenses;
    // console.log(pmsTotalSales, "pms sales")
    // console.log(PMSTotalLpoSales, "pms lpo")

    // console.log(agoTotalSales, "pms sales")
    // console.log(AGOTotalLpoSales, "pms lpo")

    // console.log(dpkTotalSales, "pms sales")
    // console.log(DPKTotalLpoSales, "pms lpo")
    const details = {
      sales: {
        totalAmount: pmsTotalSales + agoTotalSales + dpkTotalSales,
        totalVolume: pmsTotalLitre + agoTotalLitre + dpkTotalLitre,
        pmsSales: pmsTotalSales,
        agoSales: agoTotalSales,
        dpkSales: dpkTotalSales,
        pmsVolume: pmsTotalLitre,
        agoVolume: agoTotalLitre,
        dpkVolume: dpkTotalLitre,
      },

      supply: {
        pmsSupply: pmsSupply,
        agoSupply: agoSupply,
        dpkSupply: dpkSupply,
      },
      totalExpenses: totalExpenses,
      incoming: data.incoming,
      payments: {
        totalPayments: totalPayments,
        totalPosPayments: totalPosPayments,
        netToBank: netToBank,
        outstanding: totalPayments + totalPosPayments - netToBank,
      },
      station: data?.station,
      salesList: data?.sales,
    };

    return details;
  };

  const closeModal = () => {
    setPrices(false);
  };

  return (
    <>
      <SalesDisplay open={prices} close={closeModal} />
      {props.activeRoute.split("/").length === 2 && (
        <div className="dashboardContainer">
          <div className="left-dash">
            <Controls />

            <Sales priceModal={setPrices} />
            <div
              style={{
                marginTop: "40px",
                fontWeight: "bold",
                fontSize: "15px",
                color: user.isDark === "0" ? "#000" : "#fff",
              }}>
              Total Sales
            </div>
            <DashboardGraph load={load} station={oneStationData} />
            <OveragesAndShortages path={"dash"} />
          </div>
          <div className="right-dash">
            <Assets />

            <div className="section">
              <Supply />

              <PaymentDetails />

              <Expenses />
            </div>

            <TopStations />

            <IncomingOrder />
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
