import React from "react";
import "../../styles/dashboard.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import OutletService from "../../services/outletService";
import { adminOutlet, getAllStations } from "../../storage/outlet";
import { useState } from "react";
import DashboardGraph from "../DashboardComponents/DashboardGraph";
import SalesDisplay from "../Modals/SalesDisplay";
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
  const user = useSelector((state) => state.auth.user);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [defaultState, setDefault] = useState(0);
  const [load, setLoad] = useState(false);
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

  const getAllStationData = useCallback(() => {
    const payload = {
      organisation: resolveUserID().id,
    };

    if (oneStationData !== null) {
      if (getPerm("1") || getPerm("2") || user.userType === "superAdmin") {
        const findID = allOutlets.findIndex(
          (data) => data._id === oneStationData._id
        );
        setDefault(findID + 1);
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
        }
      })
      .then(() => {
        setLoad(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user._id, user.userType, user.outletID, dispatch]);

  useEffect(() => {
    getAllStationData();
  }, [getAllStationData]);

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
