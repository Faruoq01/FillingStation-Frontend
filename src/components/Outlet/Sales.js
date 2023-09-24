import React from "react";
import "../../styles/sales.scss";
import me4 from "../../assets/me4.png";
import me5 from "../../assets/me5.png";
import PMSTank from "./PMSTank";
import AGOTank from "./AGOTank";
import DPKTank from "./DPKTank";
import OutletService from "../../services/360station/outletService";
import {
  getAllOutletTanks,
  getAllPumps,
  tankListType,
} from "../../storage/outlet";
import { useCallback } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import ApproximateDecimal from "../common/approx";
import DashboardGraph from "../DashboardComponents/DashboardGraph";
import APIs from "../../services/connections/api";
import { tankLevels } from "../../storage/dailysales";
import { useNavigate } from "react-router-dom";

const Sales = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const tankList = useSelector((state) => state.outlet.tankList);
  const pumpList = useSelector((state) => state.outlet.pumpList);
  const oneStation = useSelector((state) => state.outlet.adminOutlet);
  const updatedDate = useSelector((state) => state.dashboard.dateRange);
  const [pumpAndTankMetric, setTankAndPumpMetrics] = useState({});
  const tankLevelsData = useSelector((state) => state.dailysales.tankLevels);
  const navigate = useNavigate();

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getAllStationTanks = useCallback(() => {
    const payload = {
      organisationID: oneStation?.organisation,
      outletID: oneStation?._id,
    };
    OutletService.getAllOutletTanks(payload).then((data) => {
      dispatch(getAllOutletTanks(data.stations));
    });

    OutletService.getAllStationPumps(payload).then((data) => {
      dispatch(getAllPumps(data));
    });
  }, [oneStation?._id, oneStation?.organisation, dispatch]);

  useEffect(() => {
    getAllStationTanks();
  }, [getAllStationTanks]);

  const getActiveTankAndPumps = useCallback(() => {
    const activePMSTank = tankList.filter(
      (tank) => tank.productType === "PMS" && tank.activeState === "1"
    );
    const inActivePMSTank = tankList.filter(
      (tank) => tank.productType === "PMS" && tank.activeState === "0"
    );

    const activeAGOTank = tankList.filter(
      (tank) => tank.productType === "AGO" && tank.activeState === "1"
    );
    const inActiveAGOTank = tankList.filter(
      (tank) => tank.productType === "AGO" && tank.activeState === "0"
    );

    const activeDPKTank = tankList.filter(
      (tank) => tank.productType === "DPK" && tank.activeState === "1"
    );
    const inActiveDPKTank = tankList.filter(
      (tank) => tank.productType === "DPK" && tank.activeState === "0"
    );

    const activePMSPump = pumpList.filter(
      (tank) => tank.productType === "PMS" && tank.activeState === "1"
    );
    const inActivePMSPump = pumpList.filter(
      (tank) => tank.productType === "PMS" && tank.activeState === "0"
    );

    const activeAGOPump = pumpList.filter(
      (tank) => tank.productType === "AGO" && tank.activeState === "1"
    );
    const inActiveAGOPump = pumpList.filter(
      (tank) => tank.productType === "AGO" && tank.activeState === "0"
    );

    const activeDPKPump = pumpList.filter(
      (tank) => tank.productType === "DPK" && tank.activeState === "1"
    );
    const inActiveDPKPump = pumpList.filter(
      (tank) => tank.productType === "DPK" && tank.activeState === "0"
    );

    const totalActiveTank =
      activePMSTank.length + activeAGOTank.length + activeDPKTank.length;
    const totalInactiveTank =
      inActiveAGOTank.length + inActiveAGOTank.length + inActiveDPKTank.length;

    const totalActivePump =
      activePMSPump.length + activeAGOPump.length + activeDPKPump.length;
    const totalInactivePump =
      inActiveAGOPump.length + inActiveAGOPump.length + inActiveDPKPump.length;

    const payload = {
      activePMSTank: activePMSTank,
      inActivePMSTank: inActivePMSTank,
      activeAGOTank: activeAGOTank,
      inActiveAGOTank: inActiveAGOTank,
      activeDPKTank: activeDPKTank,
      inActiveDPKTank: inActiveDPKTank,
      activePMSPump: activePMSPump,
      inActivePMSPump: inActivePMSPump,
      activeAGOPump: activeAGOPump,
      inActiveAGOPump: inActiveAGOPump,
      activeDPKPump: activeDPKPump,
      inActiveDPKPump: inActiveDPKPump,
      totalActiveTank: totalActiveTank,
      totalInactiveTank: totalInactiveTank,
      totalActivePump: totalActivePump,
      totalInactivePump: totalInactivePump,
    };

    setTankAndPumpMetrics(payload);
  }, [tankList, pumpList]);

  useEffect(() => {
    getActiveTankAndPumps();
  }, [getActiveTankAndPumps]);

  const goToTanks = (product) => {
    dispatch(tankListType(product));
    navigate("/home/dailysales/tanklist");
  };

  const tankLevelsUpdate = useCallback((date, station) => {
    const payload = {
      outletID: station === null ? "None" : station._id,
      organisationID: resolveUserID().id,
      start: date[0],
      end: date[1],
    };

    APIs.post("/daily-sales/tanklevels", payload)
      .then(({ data }) => {
        dispatch(tankLevels(data.tankLevels));
      })
      .catch((err) => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    tankLevelsUpdate(updatedDate, oneStation);
  }, [oneStation, tankLevelsUpdate, updatedDate]);

  return (
    <div className="sales-container">
      <div>
        <div className="first">
          <div className="first-left">
            <div className="tank-container">
              <div className="tank-inner">
                <div className="tanks">
                  <div
                    onClick={() => {
                      goToTanks("PMS");
                    }}
                    className="canvas-container">
                    <PMSTank />
                  </div>
                  <div
                    style={{ marginTop: "10px", color: "#399A19" }}
                    className="tank-head">
                    PMS
                  </div>
                  <div className="level">
                    Level: {ApproximateDecimal(tankLevelsData.pms.afterSales)}{" "}
                    Ltr
                  </div>
                  <div className="capacity">
                    Capacity:{" "}
                    {ApproximateDecimal(
                      tankLevelsData.pms.tankCapacity !== 0
                        ? tankLevelsData.pms.tankCapacity
                        : 33000
                    )}{" "}
                    Ltr
                  </div>
                </div>
                <div className="tanks">
                  <div
                    onClick={() => {
                      goToTanks("AGO");
                    }}
                    className="canvas-container">
                    <AGOTank />
                  </div>
                  <div
                    style={{ marginTop: "10px", color: "#FFA010" }}
                    className="tank-head">
                    AGO
                  </div>
                  <div className="level">
                    Level: {ApproximateDecimal(tankLevelsData.ago.afterSales)}{" "}
                    Ltr
                  </div>
                  <div className="capacity">
                    Capacity:{" "}
                    {ApproximateDecimal(
                      tankLevelsData.pms.tankCapacity !== 0
                        ? tankLevelsData.pms.tankCapacity
                        : 33000
                    )}{" "}
                    Ltr
                  </div>
                </div>
                <div className="tanks">
                  <div
                    onClick={() => {
                      goToTanks("DPK");
                    }}
                    className="canvas-container">
                    <DPKTank />
                  </div>
                  <div
                    style={{ marginTop: "10px", color: "#35393E" }}
                    className="tank-head">
                    DPK
                  </div>
                  <div className="level">
                    Level: {ApproximateDecimal(tankLevelsData.dpk.afterSales)}{" "}
                    Ltr
                  </div>
                  <div className="capacity">
                    Capacity:{" "}
                    {ApproximateDecimal(
                      tankLevelsData.pms.tankCapacity !== 0
                        ? tankLevelsData.pms.tankCapacity
                        : 33000
                    )}{" "}
                    Ltr
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="first-right">
            <div className="head2">
              <span style={{ marginLeft: "10px" }}>Outlet Information</span>
            </div>

            <div className="bod">
              <div className="row">
                <div className="name1">
                  <div className="label">Sealed</div>
                  <div className="value">
                    {oneStation?.activeState === 0 ? "Yes" : "No"}
                  </div>
                </div>
                <div className="name2"></div>
              </div>

              <div style={{ marginTop: "10px" }} className="row">
                <div className="name1">
                  <div className="label"> Name </div>
                  <div className="value">{oneStation?.outletName}</div>
                </div>
                <div className="name2"></div>
              </div>

              <div style={{ marginTop: "10px" }} className="row">
                <div className="name1">
                  <div className="label"> No of Tanks</div>
                  <div className="value">{oneStation?.noOfTanks}</div>
                </div>
                <div className="name2"></div>
              </div>

              <div style={{ marginTop: "10px" }} className="row">
                <div className="name1">
                  <div className="label"> No of Pumps</div>
                  <div className="value">{oneStation?.noOfPumps}</div>
                </div>
                <div className="name2"></div>
              </div>

              <div style={{ marginTop: "10px" }} className="row">
                <div className="name1">
                  <div className="label"> Alias </div>
                  <div className="value">{oneStation?.alias}</div>
                </div>
                <div className="name2"></div>
              </div>

              <div style={{ marginTop: "10px" }} className="row">
                <div className="name1">
                  <div className="label"> City/Town</div>
                  <div className="value">{oneStation?.city}</div>
                </div>
                <div className="name2"></div>
              </div>

              <div style={{ marginTop: "10px" }} className="row">
                <div className="name1">
                  <div className="label"> LGA </div>
                  <div className="value">{oneStation?.lga}</div>
                </div>
                <div className="name2"></div>
              </div>

              <div style={{ marginTop: "10px" }} className="row">
                <div className="name1">
                  <div className="label"> Street</div>
                  <div className="value">{oneStation?.alias}</div>
                </div>
                <div className="name2"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="top-level">
          <div className="left">
            <div className="title">Total Sales</div>
            <DashboardGraph load={false} station={oneStation} />
          </div>
          <div className="right">
            <div className="details">
              <div className="inner">
                <div className="head">
                  <span style={{ fontSize: "12px", marginLeft: "10px" }}>
                    Outlet Asset
                  </span>
                </div>

                <div className="card">
                  <div className="left-card">
                    <img
                      style={{ width: "80px", height: "60px" }}
                      src={me4}
                      alt="icon"
                    />
                    <div className="text">
                      <span className="active">Active Tank</span>
                      <span className="num">
                        {"totalActiveTank" in pumpAndTankMetric
                          ? pumpAndTankMetric.totalActiveTank
                          : 0}
                      </span>
                    </div>
                  </div>
                  <div className="right-card">
                    <div style={{ color: "#06805B" }} className="text">
                      <span className="active">PMS</span>
                      <span className="num">
                        {"activePMSTank" in pumpAndTankMetric
                          ? pumpAndTankMetric?.activePMSTank.length
                          : 0}
                      </span>
                    </div>
                    <div style={{ color: "#FFA010" }} className="text">
                      <span className="active">AGO</span>
                      <span className="num">
                        {"activeAGOTank" in pumpAndTankMetric
                          ? pumpAndTankMetric?.activeAGOTank.length
                          : 0}
                      </span>
                    </div>
                    <div style={{ color: "#525252" }} className="text">
                      <span className="active">DPK</span>
                      <span className="num">
                        {"activeDPKTank" in pumpAndTankMetric
                          ? pumpAndTankMetric?.activeDPKTank.length
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="left-card">
                    <img
                      style={{ width: "80px", height: "60px" }}
                      src={me4}
                      alt="icon"
                    />
                    <div className="text">
                      <span className="active">Inactive Tank</span>
                      <span className="num">
                        {"totalInactiveTank" in pumpAndTankMetric
                          ? pumpAndTankMetric.totalInactiveTank
                          : 0}
                      </span>
                    </div>
                  </div>
                  <div className="right-card">
                    <div style={{ color: "#06805B" }} className="text">
                      <span className="active">PMS</span>
                      <span className="num">
                        {"inActivePMSTank" in pumpAndTankMetric
                          ? pumpAndTankMetric?.inActivePMSTank.length
                          : 0}
                      </span>
                    </div>
                    <div style={{ color: "#FFA010" }} className="text">
                      <span className="active">AGO</span>
                      <span className="num">
                        {"inActiveAGOTank" in pumpAndTankMetric
                          ? pumpAndTankMetric?.inActiveAGOTank.length
                          : 0}
                      </span>
                    </div>
                    <div style={{ color: "#525252" }} className="text">
                      <span className="active">DPK</span>
                      <span className="num">
                        {"inActiveDPKTank" in pumpAndTankMetric
                          ? pumpAndTankMetric?.inActiveDPKTank.length
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="left-card">
                    <img
                      style={{ width: "80px", height: "60px" }}
                      src={me5}
                      alt="icon"
                    />
                    <div className="text">
                      <span className="active">Active Pump</span>
                      <span className="num">
                        {"totalActivePump" in pumpAndTankMetric
                          ? pumpAndTankMetric.totalActivePump
                          : 0}
                      </span>
                    </div>
                  </div>
                  <div className="right-card">
                    <div style={{ color: "#06805B" }} className="text">
                      <span className="active">PMS</span>
                      <span className="num">
                        {"activePMSPump" in pumpAndTankMetric
                          ? pumpAndTankMetric?.activePMSPump.length
                          : 0}
                      </span>
                    </div>
                    <div style={{ color: "#FFA010" }} className="text">
                      <span className="active">AGO</span>
                      <span className="num">
                        {"activeAGOPump" in pumpAndTankMetric
                          ? pumpAndTankMetric?.activeAGOPump.length
                          : 0}
                      </span>
                    </div>
                    <div style={{ color: "#525252" }} className="text">
                      <span className="active">DPK</span>
                      <span className="num">
                        {"activeDPKPump" in pumpAndTankMetric
                          ? pumpAndTankMetric?.activeDPKPump.length
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="left-card">
                    <img
                      style={{ width: "80px", height: "60px" }}
                      src={me5}
                      alt="icon"
                    />
                    <div className="text">
                      <span className="active">Inactive Pump</span>
                      <span className="num">
                        {"totalInactivePump" in pumpAndTankMetric
                          ? pumpAndTankMetric.totalInactivePump
                          : 0}
                      </span>
                    </div>
                  </div>
                  <div className="right-card">
                    <div style={{ color: "#06805B" }} className="text">
                      <span className="active">PMS</span>
                      <span className="num">
                        {"inActivePMSPump" in pumpAndTankMetric
                          ? pumpAndTankMetric?.inActivePMSPump.length
                          : 0}
                      </span>
                    </div>
                    <div style={{ color: "#FFA010" }} className="text">
                      <span className="active">AGO</span>
                      <span className="num">
                        {"inActiveAGOPump" in pumpAndTankMetric
                          ? pumpAndTankMetric?.inActiveAGOPump.length
                          : 0}
                      </span>
                    </div>
                    <div style={{ color: "#525252" }} className="text">
                      <span className="active">DPK</span>
                      <span className="num">
                        {"inActiveDPKPump" in pumpAndTankMetric
                          ? pumpAndTankMetric?.inActiveDPKPump.length
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
