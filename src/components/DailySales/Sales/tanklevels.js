import React, { useCallback, useEffect } from "react";
import PMSTank from "../../Outlet/PMSTank";
import AGOTank from "../../Outlet/AGOTank";
import DPKTank from "../../Outlet/DPKTank";
import ApproximateDecimal from "../../common/approx";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import { useState } from "react";
import APIs from "../../../services/connections/api";
import { tankLevels } from "../../../storage/dailysales";
import { tankListType } from "../../../storage/outlet";
import { useNavigate } from "react-router-dom";

const mobile = window.matchMedia("(max-width: 600px)");

const TankLevels = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updatedDate = useSelector((state) => state.dashboard.dateRange);
  const tankLevelsData = useSelector((state) => state.dailysales.tankLevels);
  const salesShift = useSelector((state) => state.dailysales.salesShift);
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

  const tankLevelsUpdate = useCallback((date, station, salesShift) => {
    setLoad(true);

    const payload = {
      outletID: station === null ? "None" : station._id,
      organisationID: resolveUserID().id,
      start: date[0],
      end: date[0],
      shift: salesShift,
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
    tankLevelsUpdate(updatedDate, oneStationData, salesShift);
  }, [oneStationData, tankLevelsUpdate, updatedDate, salesShift]);

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
          <TankComponent
            product={tankLevelsData?.pms}
            goToTanks={goToTanks}
            Tank={PMSTank}
            label={"PMS"}
          />
          <TankComponent
            product={tankLevelsData?.ago}
            goToTanks={goToTanks}
            Tank={AGOTank}
            label={"AGO"}
          />
          <TankComponent
            product={tankLevelsData?.dpk}
            goToTanks={goToTanks}
            Tank={DPKTank}
            label={"DPK"}
          />
        </div>
      )}
    </React.Fragment>
  );
};

const TankComponent = ({ product, goToTanks, Tank, label }) => {
  return (
    <div style={mobile.matches ? tanks : {}} className="tanks">
      <div style={mobile.matches ? tankInner : {}}>
        <div className="tank-head">{label}</div>
        <div style={{ fontWeight: "500" }} className="level">
          Level: {ApproximateDecimal(product?.afterSales)} Ltr
        </div>
        <div style={{ fontWeight: "500" }} className="capacity">
          Capacity:{" "}
          {ApproximateDecimal(
            product?.tankCapacity !== 0 ? product?.tankCapacity : 33000
          )}{" "}
          Ltr
        </div>
        <div
          onClick={() => {
            goToTanks(label);
          }}
          className="canvas-container">
          <Tank />
        </div>
      </div>
    </div>
  );
};

const tanks = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#fff",
  paddingTop: "30px",
  paddingBottom: "30px",
};

const tankInner = {
  width: "250px",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "20px",
  paddingBottom: "20px",
  border: '1px solid #07956A',
  boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.25)'
}

export default TankLevels;
