import React, { useCallback, useEffect } from "react";
import PMSTank from "../../Outlet/PMSTank";
import AGOTank from "../../Outlet/AGOTank";
import DPKTank from "../../Outlet/DPKTank";
import ApproximateDecimal from "../../common/approx";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import { useState } from "react";
import moment from "moment";
import APIs from "../../../services/connections/api";
import { tankLevels } from "../../../storage/dailysales";
import { tankListType } from "../../../storage/outlet";
import { useNavigate } from "react-router-dom";

const TankLevels = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updatedDate = useSelector((state) => state.dailysales.updatedDate);
  const tankLevelsData = useSelector((state) => state.dailysales.tankLevels);
  const [load, setLoad] = useState(false);

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
    return user.permission?.dailySales[e];
  };

  const tankLevelsUpdate = useCallback((date, station) => {
    setLoad(true);
    const today = moment().format("YYYY-MM-DD").split(" ")[0];

    const payload = {
      outletID: station === null ? "None" : station._id,
      organisationID: resolveUserID().id,
      start: date === "" ? today : date,
      end: date === "" ? today : date,
    };

    APIs.post("/daily-sales/tanklevels", payload)
      .then(({ data }) => {
        dispatch(tankLevels(data.tankLevels));
      })
      .then(() => {
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    tankLevelsUpdate(updatedDate, oneStationData);
  }, [oneStationData, tankLevelsUpdate, updatedDate]);

  const goToTanks = (product) => {
    if (!getPerm("3")) return swal("Warning!", "Permission denied", "info");
    dispatch(tankListType(product));
    navigate("/home/dailysales/tanklist");
  };

  return (
    <React.Fragment>
      {load ? (
        <Skeleton
          sx={{ borderRadius: "5px", background: "#f7f7f7" }}
          animation="wave"
          variant="rectangular"
          width={"100%"}
          height={450}
        />
      ) : (
        <div className="tank-inner">
          <div className="tanks">
            <div className="tank-head">PMS</div>
            <div style={{ fontWeight: "500" }} className="level">
              Level: {ApproximateDecimal(tankLevelsData?.pms.afterSales)} Ltr
            </div>
            <div style={{ fontWeight: "500" }} className="capacity">
              Capacity:{" "}
              {ApproximateDecimal(
                tankLevelsData?.pms?.tankCapacity !== 0
                  ? tankLevelsData?.pms?.tankCapacity
                  : 33000
              )}{" "}
              Ltr
            </div>
            <div
              onClick={() => {
                goToTanks("PMS");
              }}
              className="canvas-container">
              <PMSTank />
            </div>
          </div>
          <div className="tanks">
            <div className="tank-head">AGO</div>
            <div style={{ fontWeight: "500" }} className="level">
              Level: {ApproximateDecimal(tankLevelsData?.ago?.afterSales)} Ltr
            </div>
            <div style={{ fontWeight: "500" }} className="capacity">
              Capacity:{" "}
              {ApproximateDecimal(
                tankLevelsData?.pms?.tankCapacity !== 0
                  ? tankLevelsData?.pms?.tankCapacity
                  : 33000
              )}{" "}
              Ltr
            </div>
            <div
              onClick={() => {
                goToTanks("AGO");
              }}
              className="canvas-container">
              <AGOTank />
            </div>
          </div>
          <div className="tanks">
            <div className="tank-head">DPK</div>
            <div style={{ fontWeight: "500" }} className="level">
              Level: {ApproximateDecimal(tankLevelsData?.dpk.afterSales)} Ltr
            </div>
            <div style={{ fontWeight: "500" }} className="capacity">
              Capacity:{" "}
              {ApproximateDecimal(
                tankLevelsData?.pms?.tankCapacity !== 0
                  ? tankLevelsData?.pms?.tankCapacity
                  : 33000
              )}{" "}
              Ltr
            </div>
            <div
              onClick={() => {
                goToTanks("DPK");
              }}
              className="canvas-container">
              <DPKTank />
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default TankLevels;
