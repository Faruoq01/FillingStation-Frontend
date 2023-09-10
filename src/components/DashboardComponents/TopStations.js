import { MenuItem, Select, Skeleton } from "@mui/material";
import approximateNumber from "approximate-number";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import APIs from "../../services/connections/api";
import { topStations } from "../../storage/dashboard";

import LinearProgress from "@mui/material/LinearProgress";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const pmsTheme = createTheme({
  components: {
    MuiLinearProgress: {
      styleOverrides: {
        barColorPrimary: {
          backgroundColor: "#399A19",
        },
      },
    },
  },
});

const agoTheme = createTheme({
  components: {
    MuiLinearProgress: {
      styleOverrides: {
        barColorPrimary: {
          backgroundColor: "#FFA010",
        },
      },
    },
  },
});

const dpkTheme = createTheme({
  components: {
    MuiLinearProgress: {
      styleOverrides: {
        barColorPrimary: {
          backgroundColor: "#35393E",
        },
      },
    },
  },
});

const ProgressBar = ({ type, completed }) => {
  const PMSProg = () => {
    return (
      <ThemeProvider theme={pmsTheme}>
        <LinearProgress
          variant="determinate"
          value={completed}
          sx={{ height: 6, borderRadius: 5 }}
        />
      </ThemeProvider>
    );
  };

  const AGOProg = () => {
    return (
      <ThemeProvider theme={agoTheme}>
        <LinearProgress
          variant="determinate"
          value={completed}
          sx={{ height: 6, borderRadius: 5 }}
        />
      </ThemeProvider>
    );
  };

  const DPKProg = () => {
    return (
      <ThemeProvider theme={dpkTheme}>
        <LinearProgress
          variant="determinate"
          value={completed}
          sx={{ height: 6, borderRadius: 5 }}
        />
      </ThemeProvider>
    );
  };

  return (
    <div>
      {type === "pms" && <PMSProg />}
      {type === "ago" && <AGOProg />}
      {type === "dpk" && <DPKProg />}
    </div>
  );
};

const TopStations = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  const [product, setProduct] = useState("PMS");
  const [productState, setProductState] = useState(0);
  const topStationData = useSelector((state) => state.dashboard.topStations);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updatedDate = useSelector((state) => state.dashboard.dateRange);
  console.log(topStationData, "stations");
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

  const topStationsService = useCallback((date, station) => {
    setLoad(true);

    const payload = {
      outletID: station === null ? "None" : station._id,
      organisationID: resolveUserID().id,
      start: date[0],
      end: date[1],
    };

    APIs.post("/dashboard/topstations", payload)
      .then(({ data }) => {
        dispatch(topStations(data.topStations));
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
    topStationsService(updatedDate, oneStationData);
  }, [topStationsService, oneStationData, updatedDate]);

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
    if (product === "PMS") return topStationData?.topPMS;
    if (product === "AGO") return topStationData?.topAGO;
    if (product === "DPK") return topStationData?.topDPK;
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
                            type={"pms"}
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
                            type={"ago"}
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
                            type={"dpk"}
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
