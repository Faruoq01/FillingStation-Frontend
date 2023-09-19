import React, { useEffect, useState, useCallback } from "react";
import "../styles/home.scss";
import { useNavigate, Outlet } from "react-router-dom";
import "react-modern-drawer/dist/index.css";
import { useDispatch, useSelector } from "react-redux";
import UserService from "../services/360station/user";
import { updateUser } from "../storage/auth";
import { socket } from "../services/connections/socket";
import OutletService from "../services/360station/outletService";
import NotificationDrawer from "../components/common/NotificationDrawer";
import { adminOutlet, getAllStations } from "../storage/outlet";
import TopNavBar from "../components/common/topnavbar";
import MobileNavBar from "../components/common/mobilenavbar";
import DesktopSideBar from "../components/common/desktopsidebar";
import MobileSideBar from "../components/common/mobilesidebar";
import TitleNavBar from "../components/common/titlebar";

const HomeScreen = () => {
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
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
    if (!isLoggedIn) {
      navigate("/login");
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
      {isOpen && <MobileSideBar isOpen={isOpen} toggleDrawer={toggleDrawer} />}
      {openRight && <NotificationDrawer open={setOpenRight} />}
      <div
        style={{ background: user.isDark === "0" ? "#fff" : "#404040" }}
        className="main-content">
        <TitleNavBar />
        <MobileNavBar open={setOpenRight} drawer={setIsOpen} />
        <TopNavBar open={setOpenRight} />
        <div style={inner}>
          <Outlet />
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
