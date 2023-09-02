import React, { useEffect, useState, useMemo } from "react";
import "../styles/home.scss";
import homeLogo from "../assets/homeLogo.png";
import active from "../assets/active.png";
import dashboard from "../assets/dashboard.png";
import dashboard2 from "../assets/dashboard2.png";
import dailySales from "../assets/dailySales.png";
import darkMode from "../assets/darkMode.png";
import goBack from "../assets/goBack.png";
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
import { Switch, Route, Link, withRouter } from "react-router-dom";
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
import { useHistory } from "react-router-dom";
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

const HomeScreen = () => {
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const singleLPO = useSelector((state) => state.lpoReducer.singleLPO);
  const online = useSelector((data) => data.auth.connection);
  const dispatch = useDispatch();
  const history = useHistory();

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

  // const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (!online) {
      history.push("/connection");
    }
  });

  useEffect(() => {
    // no-op if the socket is already connected
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

  const routes = useMemo(() => {
    return {
      "/home": "Dashboard",
      "/home/tank-list": "← Station Tanks",
      "/home/pump-list": "← Station Pumps",
      "/home/daily-sales": "Daily Sales",
      "/home/overage": "← Overage/Shortage",
      "/home/tankList": "← Tank List",
      "/home/history": "← History",
      "/home/daily-sales/report": "Daily Sales",
      "/home/daily-sales/pms": "Daily Sales",
      "/home/daily-sales/ago": "Daily Sales",
      "/home/daily-sales/dpk": "Daily Sales",
      "/home/analysis/payments": "Payments",
      "/home/analysis/expenses": "Expenses",
      "/home/outlets": "My Stations",
      "/home/outlets/tanks": "Outlet Tanks",
      "/home/outlets/pumps": "Outlet Pumps",
      "/home/outlets/sales": "Outlet Sales",
      "/home/outlets/list": "Tank Stock Levels",
      "/home/daily-record-sales": "Record Sales ",
      "/home/analysis": "Analysis",
      "/home/lpo": "Corporate Sales",
      "/home/estation": "E-station",
      "/home/estation/sales": "Sales",
      "/home/estation/sales/individual": "Individual Sales",
      "/home/estation/sales/corporate": "Corporate Sales",
      "/home/estation/individual/customer": "Individual Customer",
      "/home/estation/orders": "Incoming Order",
      "/home/estation/orders/incoming-individual": "Individual Incoming Order",
      "/home/estation/airbnb": "Corporate Customer",
      "/home/estation/orders/incoming-corporate": "Corporate Incoming Order",
      "/home/estation/payments": "Payments",
      "/home/dashEmp": "← Employee List",
      "/home/lpo/list": "LPO",
      "/home/lpo/company": "Corporate Company",
      "/home/transactions": "← Transaction History",
      "/home/product-orders": "Product Orders",
      "/home/inc-orders": "Incoming Orders",
      "/home/supply": "Supply",
      "/home/supply/create": "Create Supply",
      "/home/regulatory": "Regulatory Payment",
      "/home/tank": "Tank Update",
      "/home/hr": "Human Resources",
      "/home/hr/manager": "Admin Department",
      "/home/hr/employee": "Employees",
      "/home/hr/salary": "Salary Structures",
      "/home/hr/query": "Query",
      "/home/hr/recruitment": "Recruitment",
      "/home/hr/attendance": "Attendance",
    };
  }, []);

  const [activeRoute, setActiveRoute] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [openRight, setOpenRight] = useState(false);
  const [name, setName] = useState("");

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  history.listen((location) => {
    setActiveRoute(location.pathname);
    setName(routes[history.location.pathname]);
  });

  const setNames = (name) => {
    setName(name);
  };

  useEffect(() => {
    setActiveRoute(history.location.pathname);
    setName(routes[history.location.pathname]);
  }, [history.location.pathname, routes]);

  const goBackToPreviousPage = () => {
    history.goBack();
  };

  const SideItems = (props) => {
    return (
      <Link className="link" to={props.link}>
        <div
          onClick={() => {
            setNames(props.name);
          }}
          style={{ marginTop: props.marginT }}
          className="item-container">
          {activeRoute.split("/")[2] === props.link.split("/")[2] ? (
            <div className="side-item">
              <div className="side-focus">
                <div className="side-focus-image">
                  <img
                    style={{ width: "100%", height: "100%" }}
                    src={user.isDark === "0" ? active : darkMode}
                    alt="icon"
                  />
                </div>
                <div data-aos="zoom-out-right" className="side-focus-text">
                  <img
                    style={{
                      width: "18px",
                      height: "18px",
                      marginRight: "10px",
                    }}
                    src={user.isDark === "0" ? props.icon : props.icon2}
                    alt="icon"
                  />
                  <div
                    style={{ color: user.isDark === "0" ? "#054834" : "#fff" }}>
                    {props.name}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="side-item2">
              <img className="normal-image" src={props.icon2} alt="icon" />
              <div style={{ color: "#fff" }}>{props.name}</div>
            </div>
          )}
        </div>
      </Link>
    );
  };

  const switchDarkMode = () => {
    const payload = {
      id: user._id,
      isDark: user.isDark === "0" ? "1" : "0",
    };

    UserService.updateUserDarkMode(payload)
      .then((data) => {
        return data;
      })
      .then((data) => {
        UserService.getOneUser({ id: data.user._id }).then((data) => {
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch(updateUser(data.user));
        });
      });
  };

  const navigateBack = (name) => {
    if (
      name === "← Station Tanks" ||
      name === "← Station Pumps" ||
      name === "← Employee List" ||
      "← Overage/Shortage"
    ) {
      history.goBack();
    }
  };

  const getStationDetails = (name) => {
    if (name === "Corporate Customer") {
      return singleLPO?.companyName;
    }

    if (name === "Human Resources") {
      return name?.concat(" ");
    }

    if (oneStationData === null) {
      return name?.concat(" ");
    } else {
      if (typeof oneStationData?.outletName !== "undefined") {
        return (
          name?.concat(" ") +
          "(" +
          oneStationData?.outletName.concat(", ", oneStationData?.alias) +
          ")"
        );
      }
    }
  };

  const openTheRightDrawer = () => {
    setOpenRight(!openRight);
  };

  const goToEsales = () => {
    history.push("/home/estation");
  };

  return (
    <div className="home-container">
      <div style={{ background: user.sideBarMode }} className="side-bar">
        <div className="inner-side-bar">
          <img
            onClick={goToEsales}
            className="home-logo"
            src={homeLogo}
            alt="icon"
          />
          <SideItems
            marginT={"0px"}
            link={"/home"}
            name={"Dashboard"}
            icon={dashboard}
            icon2={dashboard2}
          />
          <SideItems
            marginT={"45px"}
            link={"/home/daily-sales"}
            name={"Daily Sales"}
            icon={dailySales2}
            icon2={dailySales}
          />
          <SideItems
            marginT={"90px"}
            link={"/home/outlets"}
            name={"My Stations"}
            icon={outlet2}
            icon2={outlet}
          />
          <SideItems
            marginT={"135px"}
            link={"/home/daily-record-sales"}
            name={"Record Sales"}
            icon={recordSales2}
            icon2={recordSales}
          />
          <SideItems
            marginT={"180px"}
            link={"/home/analysis"}
            name={"Analysis"}
            icon={analysis22}
            icon2={analysis}
          />
          <SideItems
            marginT={"225px"}
            link={"/home/lpo"}
            name={"Corporate Sales"}
            icon={lpo2}
            icon2={lpo}
          />
          <SideItems
            marginT={"270px"}
            link={"/home/product-orders"}
            name={"Product Orders"}
            icon={productOrders2}
            icon2={productOrders}
          />
          <SideItems
            marginT={"315px"}
            link={"/home/inc-orders"}
            name={"Incoming Orders"}
            icon={incOrders2}
            icon2={incOrders}
          />
          <SideItems
            marginT={"360px"}
            link={"/home/supply"}
            name={"Supply"}
            icon={expenses2}
            icon2={expenses}
          />
          <SideItems
            marginT={"405px"}
            link={"/home/regulatory"}
            name={"Regulatory Pay"}
            icon={regulatory2}
            icon2={regulatory}
          />
          <SideItems
            marginT={"450px"}
            link={"/home/tank"}
            name={"Tank Update"}
            icon={tank2}
            icon2={tank}
          />
          <SideItems
            marginT={"495px"}
            link={"/home/hr"}
            name={"Human Resources"}
            icon={hr2}
            icon2={hr}
          />
          <SideItems
            marginT={"540px"}
            link={"/home/settings"}
            name={"Settings"}
            icon={settings2}
            icon2={settings}
          />
        </div>
      </div>

      <Drawer open={isOpen} onClose={toggleDrawer} direction="left">
        <div
          style={{
            background: user.sideBarMode,
            display: "flex",
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
          className="side-bar">
          <div style={{ width: "90%" }} className="inner-side-bar">
            <img
              onClick={goToEsales}
              className="home-logo"
              src={homeLogo}
              alt="icon"
            />
            <SideItems
              marginT={"0px"}
              link={"/home"}
              name={"Dashboard"}
              icon={dashboard}
              icon2={dashboard2}
            />
            <SideItems
              marginT={"45px"}
              link={"/home/daily-sales"}
              name={"Daily Sales"}
              icon={dailySales2}
              icon2={dailySales}
            />
            <SideItems
              marginT={"90px"}
              link={"/home/outlets"}
              name={"My Stations"}
              icon={outlet2}
              icon2={outlet}
            />
            <SideItems
              marginT={"135px"}
              link={"/home/daily-record-sales"}
              name={"Record Sales"}
              icon={recordSales2}
              icon2={recordSales}
            />
            <SideItems
              marginT={"180px"}
              link={"/home/analysis"}
              name={"Analysis"}
              icon={analysis22}
              icon2={analysis}
            />
            <SideItems
              marginT={"225px"}
              link={"/home/lpo"}
              name={"Corporate Sales"}
              icon={lpo2}
              icon2={lpo}
            />
            <SideItems
              marginT={"270px"}
              link={"/home/product-orders"}
              name={"Product Orders"}
              icon={productOrders2}
              icon2={productOrders}
            />
            <SideItems
              marginT={"315px"}
              link={"/home/inc-orders"}
              name={"Incoming Orders"}
              icon={incOrders2}
              icon2={incOrders}
            />
            <SideItems
              marginT={"360px"}
              link={"/home/supply"}
              name={"Supply"}
              icon={expenses2}
              icon2={expenses}
            />
            <SideItems
              marginT={"405px"}
              link={"/home/regulatory"}
              name={"Regulatory Pay"}
              icon={regulatory2}
              icon2={regulatory}
            />
            <SideItems
              marginT={"450px"}
              link={"/home/tank"}
              name={"Tank Update"}
              icon={tank2}
              icon2={tank}
            />
            <SideItems
              marginT={"495px"}
              link={"/home/hr"}
              name={"Human Resources"}
              icon={hr2}
              icon2={hr}
            />
            <SideItems
              marginT={"540px"}
              link={"/home/settings"}
              name={"Settings"}
              icon={settings2}
              icon2={settings}
            />
          </div>
        </div>
      </Drawer>

      {openRight && <NotificationDrawer open={setOpenRight} />}

      <div
        style={{ background: user.isDark === "0" ? "#fff" : "#404040" }}
        className="main-content">
        <div className="mobile-bar">
          <AppBar
            sx={{ background: "#06805B", zIndex: "50" }}
            position="absolute">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
              <span style={roots}>{name}</span>
              <div className="side-app-bar">
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ marginRight: "0px" }}>
                  <img
                    style={{ width: "35px", height: "35px" }}
                    src={search}
                    alt="icon"
                  />
                </IconButton>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ marginRight: "0px" }}
                  onClick={openTheRightDrawer}>
                  {user.noteCount === "0" || (
                    <Badge badgeContent={user.noteCount} color="error">
                      <img
                        style={{ width: "35px", height: "35px" }}
                        src={note}
                        alt="icon"
                      />
                    </Badge>
                  )}
                  {user.noteCount === "0" && (
                    <img
                      style={{ width: "35px", height: "35px" }}
                      src={note}
                      alt="icon"
                    />
                  )}
                </IconButton>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ marginRight: "0px" }}
                  onClick={switchDarkMode}>
                  <img
                    style={{ width: "35px", height: "35px" }}
                    src={user.isDark ? dark : switchT}
                    alt="icon"
                  />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
        </div>
        <div className="top-bar-menu">
          <div
            style={{ color: user.isDark === "0" ? "#054834" : "#fff" }}
            className="left-lobe">
            {(activeRoute.split("/").length === 4 ||
              activeRoute.split("/").length >= 5) && (
              <img
                onClick={goBackToPreviousPage}
                style={{ width: "30px", height: "25px", marginRight: "10px" }}
                src={goBack}
                alt="icon"
              />
            )}
            <span
              onClick={() => {
                navigateBack(name);
              }}>
              {getStationDetails(name)}
            </span>
          </div>
          <div className="right-lobe">
            <div className="search-icon">
              <input
                className="search-content"
                type={"text"}
                placeholder="Search"
              />
              <img
                style={{ width: "35px", height: "35px", marginRight: "1px" }}
                src={search}
                alt="icon"
              />
            </div>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ marginRight: "0px" }}
              onClick={openTheRightDrawer}>
              {user.noteCount === "0" || (
                <Badge badgeContent={user.noteCount} color="error">
                  <img
                    style={{ width: "35px", height: "35px" }}
                    src={note}
                    alt="icon"
                  />
                </Badge>
              )}
              {user.noteCount === "0" && (
                <img
                  style={{ width: "35px", height: "35px" }}
                  src={note}
                  alt="icon"
                />
              )}
            </IconButton>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ marginRight: "0px" }}
              onClick={switchDarkMode}>
              <img
                style={{ width: "35px", height: "35px" }}
                src={user.isDark ? dark : switchT}
                alt="icon"
              />
            </IconButton>
          </div>
        </div>
        <div style={inner}>
          <Switch>
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
          </Switch>
        </div>
      </div>
    </div>
  );
};

const roots = {
  width: "100%",
  fontSize: "14px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
};

const inner = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export default withRouter(HomeScreen);
