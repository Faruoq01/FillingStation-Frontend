import { Button, MenuItem, Select, Skeleton } from "@mui/material";
import "../../styles/overage.scss";
import slideMenu from "../../assets/slideMenu.png";
import tank from "../../assets/comp/tank.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import ApproximateDecimal from "../common/approx";
import { useEffect } from "react";
import { useCallback } from "react";
import APIs from "../../services/api";
import { overage, overageType } from "../../storage/dailysales";
import React from "react";
import moment from "moment";

const OveragesAndShortages = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [defaultState, setDefault] = useState(10);
  const overageData = useSelector((state) => state.dailysales.overage);
  const overageTypeData = useSelector((state) => state.dailysales.overageType);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updatedDate = useSelector((state) => state.dailysales.updatedDate);
  const user = useSelector((state) => state.auth.user);
  const [load, setLoad] = useState();

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getOverages = useCallback((station, date) => {
    setLoad(true);
    const today = moment().format("YYYY-MM-DD").split(" ")[0];

    const payload = {
      outletID: station === null ? "None" : station._id,
      organisationID: resolveUserID().id,
      start: date === "" ? today : date,
      end: date === "" ? today : date,
    };

    APIs.post("/daily-sales/overages", payload)
      .then(({ data }) => {
        dispatch(overage(data.overage));
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
    getOverages(oneStationData, updatedDate);
  }, [getOverages, oneStationData, updatedDate]);

  const getDippingResult = () => {
    const product = overageData[overageTypeData.toLowerCase()];

    const currentCent = (product.currentLevel / product.capacity) * 100;
    const dippingCent = (product.dipping / product.capacity) * 100;

    const detail = {
      currentCent: isNaN(currentCent) ? 0 : currentCent,
      dippingCent: isNaN(dippingCent) ? 0 : dippingCent,
      currentLevel: product.currentLevel,
      dipping: product.dipping,
    };

    return detail;
  };

  const selectedType = (data) => {
    setDefault(data);
    if (data === 10) {
      dispatch(overageType("PMS"));
    } else if (data === 20) {
      dispatch(overageType("AGO"));
    } else {
      dispatch(overageType("DPK"));
    }
  };

  const loadOverageList = () => {
    navigate("dailysalesoverage");
  };

  const Selectors = () => {
    return (
      <div style={selc}>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          value={defaultState}
          style={selectMe}>
          <MenuItem
            onClick={() => {
              selectedType(10);
            }}
            style={menu}
            value={10}>
            PMS
          </MenuItem>
          <MenuItem
            onClick={() => {
              selectedType(20);
            }}
            style={menu}
            value={20}>
            AGO
          </MenuItem>
          <MenuItem
            onClick={() => {
              selectedType(30);
            }}
            style={menu}
            value={30}>
            DPK
          </MenuItem>
        </Select>
        <Button
          variant="contained"
          startIcon={
            <img
              style={{ width: "15px", height: "10px", marginRight: "15px" }}
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
          onClick={loadOverageList}>
          View in details
        </Button>
      </div>
    );
  };

  const status = () => {
    const total = getDippingResult().dipping - getDippingResult().currentLevel;
    if (total < 0) {
      return "Shortage";
    } else if (total === 0) {
      return "None";
    } else {
      return "Overage";
    }
  };

  return (
    <React.Fragment>
      {load ? (
        <Skeleton
          sx={{ borderRadius: "5px", background: "#f7f7f7", marginTop: "20px" }}
          animation="wave"
          variant="rectangular"
          width={"100%"}
          height={200}
        />
      ) : (
        <div className="overages">
          <div className="alisss">
            <div style={{ marginTop: "0px" }} className="tank-text">
              Overage/Shortage
            </div>
            <Selectors />
          </div>

          <div className="overageContainer">
            <div className="innerOverage">
              <div className="overlapOne"></div>
              <div className="overlapTwo">
                <div className="current-level">
                  <div
                    style={{ width: getDippingResult().currentCent + "%" }}
                    className="dippingBarLeft"></div>
                </div>
                <div className="dipping">
                  <div
                    style={{ width: getDippingResult().dippingCent + "%" }}
                    className="dippingBar"></div>
                </div>
              </div>
              <div className="overlapThree">
                <img
                  style={{ width: "32px", height: "25px" }}
                  src={tank}
                  alt="icon"
                />
              </div>
            </div>

            <div className="labelsOverage">
              <div>
                <div style={title}>
                  {ApproximateDecimal(getDippingResult().currentLevel)} Ltrs
                </div>
                <div style={label}>Current Level </div>
              </div>

              <div>
                <div style={title}>
                  {ApproximateDecimal(getDippingResult().dipping)} Ltrs
                </div>
                <div style={label}>Dipping Level </div>
              </div>
            </div>

            <div className="statusOverage">
              <div>
                <div style={title}>
                  {ApproximateDecimal(
                    getDippingResult().dipping - getDippingResult().currentLevel
                  )}{" "}
                  Ltrs
                </div>
                <div style={label}>Differences</div>
              </div>
              <div style={shortage}>{status()}</div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const menu = {
  fontSize: "12px",
};

const selectMe = {
  height: "30px",
  marginRight: "10px",
  borderRadius: "0px",
  background: "#F2F1F1B2",
  color: "#000",
  fontSize: "12px",
  outline: "none",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const selc = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
};

const title = {
  fontSize: "15px",
  fontWeight: "bold",
  fontFamily: "Poppins",
  color: "#000",
};

const label = {
  fontSize: "11px",
  fontWeight: "500",
  fontFamily: "Poppins",
  color: "#515151",
};

const shortage = {
  width: "90px",
  height: "32px",
  background: "#e4d8d4",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "10px",
  marginTop: "10px",
  fontSize: "14px",
  color: "#e03534",
  fontWeight: "bold",
};

export default OveragesAndShortages;
