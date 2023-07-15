import { MenuItem, Select, Skeleton } from "@mui/material";
import approximateNumber from "approximate-number";
import { useState } from "react";
import { ProgressBar } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const TopStations = () => {
  const user = useSelector((state) => state.auth.user);
  const history = useHistory();
  const [load, setLoad] = useState(false);
  const [product, setProduct] = useState("PMS");
  const [topStationsList, setTopStationsList] = useState({
    topPMS: [],
    topAGO: [],
    topDPK: [],
  });
  const [productState, setProductState] = useState(0);
  const topStations = useSelector((state) => state.dashboard.topStations);

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

  const getProgress = (item, type) => {
    if (type === "PMS") {
      if (item.pmsSum === 0) {
        return 0;
      } else {
        return (item.pmsSum / (item.pmsLevel + item.pmsSum)) * 100;
      }
    }

    if (type === "AGO") {
      if (item.agoSum === 0) {
        return 0;
      } else {
        return (item.agoSum / (item.agoLevel + item.agoSum)) * 100;
      }
    }

    if (type === "DPK") {
      if (item.dpkSum === 0) {
        return 0;
      } else {
        return (item.dpkSum / (item.dpkLevel + item.dpkSum)) * 100;
      }
    }
  };

  const updateTopStations = (data, index) => {
    setProduct(data);
    setProductState(index);
    getTopStations();
  };

  const getTopStations = () => {
    if (product === "PMS") return topStations.topPMS;
    if (product === "AGO") return topStations.topAGO;
    if (product === "DPK") return topStations.topDPK;
  };

  return (
    <div style={{ marginTop: "30px" }} className="station">
      <div
        style={{
          color: user.isDark === "0" ? "#000" : "#fff",
          fontSize: "15px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        className="bank">
        <span>Station</span>
        <Select
          disabled={!getPerm("10")}
          labelId="demo-select-small"
          id="demo-select-small"
          value={productState}
          sx={{
            ...selectStyle2,
            width: "100px",
            background: "#06805B",
            color: "#fff",
            fontSize: "12px",
          }}>
          <MenuItem
            onClick={() => {
              updateTopStations("PMS", 0);
            }}
            style={menu}
            value={0}>
            PMS
          </MenuItem>
          <MenuItem
            onClick={() => {
              updateTopStations("AGO", 1);
            }}
            style={menu}
            value={1}>
            AGO
          </MenuItem>
          <MenuItem
            onClick={() => {
              updateTopStations("DPK", 2);
            }}
            style={menu}
            value={2}>
            DPK
          </MenuItem>
        </Select>
      </div>
      <div className="station-container">
        {load ? (
          <Skeleton
            sx={{ borderRadius: "5px", background: "#f7f7f7" }}
            animation="wave"
            variant="rectangular"
            width={"100%"}
            height={300}
          />
        ) : (
          <>
            {getTopStations().map((item, index) => {
              return (
                <div key={index} className="station-content">
                  <div className="inner-stat">
                    <div className="inner-header">{item.name}</div>
                    <div className="station-slider">
                      <div className="slideName">
                        <div className="pms">PMS</div>
                        <div style={{ width: "100%" }}>
                          <ProgressBar
                            bgColor={"#399A19"}
                            isLabelVisible={false}
                            height={"8px"}
                            className="wrapper"
                            completed={getProgress(item, "PMS")}
                          />
                        </div>
                      </div>
                      <div className="slideQty">
                        {approximateNumber(item.pmsSum)} Ltr
                      </div>
                    </div>
                    <div className="station-slider">
                      <div className="slideName">
                        <div className="pms">AGO</div>
                        <div style={{ width: "100%" }}>
                          <ProgressBar
                            bgColor={"#FFA010"}
                            isLabelVisible={false}
                            height={"8px"}
                            className="wrapper"
                            completed={getProgress(item, "AGO")}
                          />
                        </div>
                      </div>
                      <div className="slideQty">
                        {approximateNumber(item.agoSum)} Ltr
                      </div>
                    </div>
                    <div className="station-slider">
                      <div className="slideName">
                        <div className="pms">DPK</div>
                        <div style={{ width: "100%" }}>
                          <ProgressBar
                            bgColor={"#35393E"}
                            isLabelVisible={false}
                            height={"8px"}
                            className="wrapper"
                            completed={getProgress(item, "DPK")}
                          />
                        </div>
                      </div>
                      <div className="slideQty">
                        {approximateNumber(item.dpkSum)} Ltr
                      </div>
                    </div>
                    <div className="butom">
                      <div className="pump-cont">
                        <div style={{ fontSize: "12px" }}>No of Pump</div>
                        <div className="amount">{0}</div>
                      </div>
                      <div style={{ marginLeft: "20px" }} className="pump-cont">
                        <div style={{ fontSize: "12px" }}>No of Pump</div>
                        <div className="amount">{0}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

const selectStyle2 = {
  width: "100%",
  height: "30px",
  borderRadius: "0px",
  background: "#F2F1F1B2",
  color: "#000",
  fontSize: "12px",
  outline: "none",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const menu = {
  fontSize: "12px",
};

export default TopStations;
