import React, { useEffect, useState, useMemo } from "react";
import "../styles/home.scss";
import homeLogo from "../assets/homeLogo.png";
import active from "../assets/active.png";
import dashboard from "../assets/dashboard.png";
import dashboard2 from "../assets/dashboard2.png";
import dailySales from "../assets/dailySales.png";
import darkMode from "../assets/darkMode.png";
import dark from "../assets/dark.png";
import expenses from "../assets/expenses.png";
import hr from "../assets/hr.png";
import incOrders from "../assets/incOrders.png";
import outlet from "../assets/outlet.png";
import analysis from "../assets/analysis.png";
import lpo from "../assets/lpo.png";
import productOrders from "../assets/productOrders.png";
import analysis22 from "../assets/analysis22.png";
import lpo2 from "../assets/lpo2.png";
import recordSales from "../assets/recordSales.png";
import regulatory from "../assets/regulatory.png";
import settings from "../assets/settings.png";
import tank from "../assets/tank.png";
import dailySales2 from "../assets/dailySales2.png";
import expenses2 from "../assets/expenses2.png";
import hr2 from "../assets/hr2.png";
import incOrders2 from "../assets/incOrders2.png";
import outlet2 from "../assets/outlet2.png";
import productOrders2 from "../assets/productOrders2.png";
import recordSales2 from "../assets/recordSales2.png";
import regulatory2 from "../assets/regulatory2.png";
import settings2 from "../assets/settings2.png";
import tank2 from "../assets/tank2.png";
import note from "../assets/note.png";
import search from "../assets/search.png";
import switchT from "../assets/switchT.png";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import Dashboard from "../components/Home/Dashboard";
import DailySales from "../components/Home/DailySales";
import HumanResources from "../components/Home/HumanResource";
import IncomingOrders from "../components/Home/IncomingOrders";
import Outlets from "../components/Home/Outlets";
import ProductOrders from "../components/Home/ProductOrders";
import Regulatory from "../components/Home/Regulatory";
import Settings from "../components/Home/Settings";
import TankUpdate from "../components/Home/TankUpdate";
import Analysis from "../components/Home/Analysis";
import LPO from "../components/Home/LPO";
import Supply from "../components/Home/Supply";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { useDispatch, useSelector } from "react-redux";
import UserService from "../services/user";
import { updateUser } from "../storage/auth";
import StationTanks from "../components/Home/StationTanks";
import StationPumps from "../components/Home/StationPumps";
import HistoryPage from "../components/Home/History";
import DailyRecordSales from "../components/Home/DailyRecordSales";
import DashboardEmployee from "../components/DashboardComponents/DashboardEmp";
import { socket } from "../services/socket";
import { useCallback } from "react";
import OutletService from "../services/outletService";
import OverageList from "../components/DailySales/OverageList";
import { Badge } from "@mui/material";
import NotificationDrawer from "../components/common/NotificationDrawer";
import AirBnBTotal from "../components/Home/AirBnBTotal";
import Transactions from "../components/Home/Transactions";
import ListAllTanks from "../components/Outlet/TankList";
import { adminOutlet, getAllStations } from "../storage/outlet";
import TopNavBar from "../components/common/topnavbar";
import MobileNavBar from "../components/common/mobilenavbar";
import DesktopSideBar from "../components/common/desktopsidebar";
import MobileSideBar from "../components/common/mobilesidebar";

const HomeScreen = () => {
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const online = useSelector((data) => data.auth.connection);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getAllStationData = useCallback(() => {
    const payload = {
      organisation: resolveUserID().id,
    };

    OutletService.getAllOutletStations(payload).then((data) => {
      dispatch(getAllStations(data.station));
    });

    UserService.getOneUser({ id: user._id }).then((data) => {
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch(updateUser(data.user));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user._id, user.userType, user.outletID, dispatch]);

  useEffect(() => {
    getAllStationData();
  }, [getAllStationData]);

  useEffect(() => {
    if (!online) {
      navigate("/connection");
    }
  });

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    function onConnect() {
      // setIsConnected(true);
    }

    function onDisconnect() {
      // setIsConnected(false);
    }

    function updatePermission(data) {
      const findID = data.findIndex((item) => item._id === user._id);
      if (findID !== -1) {
        const userData = data[findID];
        if (resolveUserID().id === userData.organisationID) {
          dispatch(updateUser(userData));
          localStorage.setItem("user", JSON.stringify(userData));

          const outletID = allOutlets.findIndex(
            (item) => item._id === userData.outletID
          );
          if (outletID !== -1) dispatch(adminOutlet(allOutlets[outletID]));
        }
      }
    }

    function updateHistory(data) {
      if (resolveUserID().id === data.orgID) {
        if (user.outletID === "Admin Office") {
          const copyUser = { ...user };
          copyUser.noteCount = Number(copyUser.noteCount) + 1;
          dispatch(updateUser(copyUser));
          localStorage.setItem("user", JSON.stringify(copyUser));
          return;
        } else {
          if (user.outletID === data.to) {
            const copyUser = { ...user };
            copyUser.noteCount = Number(copyUser.noteCount) + 1;
            dispatch(updateUser(copyUser));
            localStorage.setItem("user", JSON.stringify(copyUser));
            return;
          }
        }
      }
    }

    function clearCount(data) {
      if (resolveUserID().id === data.orgID) {
        if (user._id === data.id) {
          const copyUser = JSON.parse(JSON.stringify(user));
          copyUser.noteCount = "0";
          dispatch(updateUser(copyUser));
          localStorage.setItem("user", JSON.stringify(copyUser));
          return;
        }
      }
    }

    function updatePrices(data) {
      if (resolveUserID().id === data.stations[0].organisation) {
        const status = data.stations.findIndex(
          (item) => item._id === oneStationData._id
        );
        if (status !== -1) {
          const stationCopy = { ...oneStationData };
          stationCopy["PMSCost"] =
            "PMSCost" in data ? data.PMSCost : stationCopy["PMSCost"];
          stationCopy["PMSPrice"] =
            "PMSPrice" in data ? data.PMSPrice : stationCopy["PMSPrice"];
          stationCopy["AGOCost"] =
            "AGOCost" in data ? data.AGOCost : stationCopy["AGOCost"];
          stationCopy["AGOPrice"] =
            "AGOPrice" in data ? data.AGOPrice : stationCopy["AGOPrice"];
          stationCopy["DPKCost"] =
            "DPKCost" in data ? data.DPKCost : stationCopy["DPKCost"];
          stationCopy["DPKPrice"] =
            "DPKPrice" in data ? data.DPKPrice : stationCopy["DPKPrice"];

          dispatch(adminOutlet(stationCopy));
        }
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("permission", updatePermission);
    socket.on("history", updateHistory);
    socket.on("clearCount", clearCount);
    socket.on("prices", updatePrices);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("permission", updatePermission);
      socket.off("history", updateHistory);
      socket.off("clearCount", clearCount);
      socket.off("prices", updatePrices);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user]);

  const [isOpen, setIsOpen] = useState(false);
  const [openRight, setOpenRight] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className="home-container">
      <DesktopSideBar />
      <MobileSideBar isOpen={isOpen} toggleDrawer={toggleDrawer} />

      {openRight && <NotificationDrawer open={setOpenRight} />}

      <div
        style={{ background: user.isDark === "0" ? "#fff" : "#404040" }}
        className="main-content">
        <MobileNavBar open={setOpenRight} />
        <TopNavBar open={setOpenRight} drawer={setIsOpen} />
        <div style={inner}>
          <Outlet />
          {/* <Switch>
            <Route exact path="/home">
              <Dashboard activeRoute={activeRoute} />
            </Route>
            <Route path="/home/daily-sales">
              <DailySales activeRoute={activeRoute} history={history} />
            </Route>
            <Route path="/home/hr">
              <HumanResources history={history} activeRoute={activeRoute} />
            </Route>
            <Route path="/home/dashEmp">
              <DashboardEmployee history={history} activeRoute={activeRoute} />
            </Route>
            <Route path="/home/inc-orders">
              <IncomingOrders />
            </Route>
            <Route path="/home/estation/airbnb">
              <AirBnBTotal history={history} activeRoute={activeRoute} />
            </Route>
            <Route path="/home/outlets">
              <Outlets history={history} activeRoute={activeRoute} />
            </Route>
            <Route path="/home/product-orders">
              <ProductOrders />
            </Route>
            <Route path="/home/analysis">
              <Analysis activeRoute={activeRoute} />
            </Route>
            <Route path="/home/lpo">
              <LPO history={history} activeRoute={activeRoute} />
            </Route>

            <Route path="/home/supply">
              <Supply activeRoute={activeRoute} />
            </Route>
            <Route path="/home/daily-record-sales">
              <DailyRecordSales history={history} />
            </Route>

            <Route path="/home/regulatory">
              <Regulatory />
            </Route>
            <Route path="/home/tank">
              <TankUpdate />
            </Route>
            <Route path="/home/settings">
              <Settings history={history} />
            </Route>
            <Route path="/home/tank-list">
              <StationTanks />
            </Route>
            <Route path="/home/pump-list">
              <StationPumps />
            </Route>

            <Route path="/home/overage">
              <OverageList />
            </Route>
            <Route path="/home/history">
              <HistoryPage />
            </Route>
            <Route path="/home/transactions">
              <Transactions />
            </Route>
            <Route path="/home/tankList">
              <ListAllTanks refresh={getAllStationData} />
            </Route>
          </Switch> */}
        </div>
      </div>
    </div>
  );
};

const inner = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export default HomeScreen;
