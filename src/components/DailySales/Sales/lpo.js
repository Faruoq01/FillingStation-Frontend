import { Button, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import slideMenu from "../../../assets/slideMenu.png";
import swal from "sweetalert";
import ApproximateDecimal from "../../common/approx";
import { useCallback, useEffect, useState } from "react";
import APIs from "../../../services/api";
import { lpo } from "../../../storage/dailysales";
import React from "react";
import { useNavigate } from "react-router-dom";

const LPO = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updatedDate = useSelector((state) => state.dailysales.updatedDate);
  const lpoData = useSelector((state) => state.dailysales.lpo);
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

  const getLPOSales = useCallback((date, station) => {
    setLoad(true);

    const payload = {
      outletID: station === null ? "None" : station._id,
      organisationID: resolveUserID().id,
      start: date,
      end: date,
    };

    APIs.post("/daily-sales/lpo", payload)
      .then(({ data }) => {
        dispatch(lpo(data.lpo));
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
    getLPOSales(updatedDate, oneStationData);
  }, [getLPOSales, oneStationData, updatedDate]);

  const goToLPO = () => {
    if (!getPerm("7")) return swal("Warning!", "Permission denied", "info");
    navigate("/home/lposales/corporatecustomer");
  };

  return (
    <React.Fragment>
      {load ? (
        <Skeleton
          sx={{ borderRadius: "5px", background: "#f7f7f7" }}
          animation="wave"
          variant="rectangular"
          width={130}
          height={35}
        />
      ) : (
        <div style={{ marginTop: "30px" }} className="section">
          <div className="alisss">
            <div
              style={{ color: user.isDark === "0" ? "#000" : "#fff" }}
              className="tank-text">
              LPO
            </div>
            <Button
              variant="contained"
              startIcon={
                <img
                  style={{
                    width: "15px",
                    height: "10px",
                    marginRight: "15px",
                  }}
                  src={slideMenu}
                  alt="icon"
                />
              }
              sx={{
                width: "150px",
                height: "30px",
                background: "#06805B",
                fontSize: "11px",
                borderRadius: "0px",
                fontFamily: "Poppins",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#06805B",
                },
              }}
              onClick={goToLPO}>
              View in details
            </Button>
          </div>
          <div className="inner-section">
            <div
              style={{ height: "auto", paddingBottom: "10px" }}
              className="inner-content">
              <div style={container} className="conts">
                <div className="row-count">
                  <div
                    style={{ ...row, fontSize: "13px", fontWeight: "bold" }}
                    className="item-count">
                    LPO (Ltrs)
                  </div>
                  <div
                    style={{ ...row, fontSize: "13px", fontWeight: "bold" }}
                    className="item-count">
                    Amount
                  </div>
                </div>
                <div className="row-count">
                  <div style={row} className="item-count">
                    PMS: {ApproximateDecimal(lpoData.pms.sales)}
                  </div>
                  <div style={row} className="item-count">
                    NGN {ApproximateDecimal(lpoData.pms.quantity)}
                  </div>
                </div>

                <div className="row-count">
                  <div style={row} className="item-count">
                    AGO: {ApproximateDecimal(lpoData.ago.sales)}
                  </div>
                  <div style={row} className="item-count">
                    NGN {ApproximateDecimal(lpoData.ago.quantity)}
                  </div>
                </div>

                <div className="row-count">
                  <div style={row} className="item-count">
                    DPK: {ApproximateDecimal(lpoData.dpk.sales)}
                  </div>
                  <div style={row} className="item-count">
                    NGN {ApproximateDecimal(lpoData.dpk.quantity)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const container = {
  height: "110px",
  marginTop: "10px",
  padding: "0px 0px 0px 0px",
  margin: "0px 0px 0px 0px",
};

const row = {
  width: "auto",
};

export default LPO;
