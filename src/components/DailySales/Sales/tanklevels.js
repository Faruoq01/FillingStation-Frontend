import React from "react";
import PMSTank from "../../Outlet/PMSTank";
import AGOTank from "../../Outlet/AGOTank";
import DPKTank from "../../Outlet/DPKTank";
import ApproximateDecimal from "../../common/approx";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import { useState } from "react";

const TankLevels = () => {
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);
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

  const goToTanks = (product) => {
    if (!getPerm("3")) return swal("Warning!", "Permission denied", "info");
    // dispatch(tankListType(product));
    history.push("/home/outlets/list");
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
              Level: {ApproximateDecimal(0)} Ltr
            </div>
            <div style={{ fontWeight: "500" }} className="capacity">
              Capacity: {ApproximateDecimal(33000)} Ltr
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
              Level: {ApproximateDecimal(0)} Ltr
            </div>
            <div style={{ fontWeight: "500" }} className="capacity">
              Capacity: {ApproximateDecimal(33000)} Ltr
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
              Level: {ApproximateDecimal(0)} Ltr
            </div>
            <div style={{ fontWeight: "500" }} className="capacity">
              Capacity: {ApproximateDecimal(33000)} Ltr
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
