import { Button, MenuItem, OutlinedInput, Select, Switch } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import me5 from "../../assets/me5.png";
import "../../styles/stationTanks.scss";
import { useCallback } from "react";
import APIs from "../../services/api";
import { assetData } from "../../storage/dashboard";
import { ThreeDots } from "react-loader-spinner";

const StationPumps = () => {
  const dispatch = useDispatch();
  const [tabs, setTabs] = useState(0);
  const [load, setLoad] = useState(false);
  const [defaultState] = useState(0);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const asset = useSelector((state) => state.dashboard.asset);
  const user = useSelector((state) => state.auth.user);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getCurrentAssetData = useCallback((asset, status) => {
    setLoad(true);
    const payload = {
      organisationID: resolveUserID().id,
      outletID: oneStationData === null ? "None" : oneStationData._id,
      status: status,
      asset: asset,
    };

    APIs.post("/dashboard/asset", payload)
      .then(({ data }) => {
        dispatch(assetData(data.asset));
      })
      .then((data) => {
        setLoad(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    switch (asset) {
      case "activeTank": {
        getCurrentAssetData("tank", "1");
        break;
      }
      case "inActiveTank": {
        getCurrentAssetData("tank", "0");
        break;
      }
      case "activePump": {
        getCurrentAssetData("pump", "1");
        break;
      }
      case "inActivePump": {
        getCurrentAssetData("pump", "0");
        break;
      }
      default: {
      }
    }

    return () => {
      dispatch(assetData([]));
    };
  }, [asset, dispatch, getCurrentAssetData]);

  const CardItem = (props) => {
    return (
      <div className="item">
        <div className="inner">
          <div className="top">
            <div className="left">
              <img
                style={{ width: "40px", height: "40px" }}
                src={me5}
                alt="icon"
              />
              <div>
                {props.data.pumpName} ({props.data.productType})
              </div>
            </div>
            <div className="right">
              <div>
                {props.data.activeState === "0" ? "Inactive" : "Active"}
              </div>
              <IOSSwitch
                sx={{ m: 1 }}
                defaultChecked={props.data.activeState === "0" ? false : true}
              />
            </div>
          </div>

          <div className="out">
            <div style={{ width: "40%", textAlign: "left" }}>Pump ID</div>
            <OutlinedInput
              placeholder=""
              sx={{
                width: "60%",
                height: "35px",
                fontSize: "12px",
                background: "#F2F1F1",
                color: "#000",
              }}
              value={props.data._id}
            />
          </div>

          <div className="out">
            <div style={{ width: "40%", textAlign: "left" }}>
              Tank Connecting to pump
            </div>
            <OutlinedInput
              placeholder=""
              sx={{
                width: "60%",
                height: "35px",
                fontSize: "12px",
                background: "#F2F1F1",
                color: "#000",
              }}
              value={props.data.hostTankName}
            />
          </div>

          <div className="out">
            <div style={{ width: "40%", textAlign: "left" }}>Total Reading</div>
            <OutlinedInput
              placeholder=""
              sx={{
                width: "60%",
                height: "35px",
                fontSize: "12px",
                background: "#F2F1F1",
                color: "#000",
              }}
              value={props.data.totalizerReading}
            />
          </div>

          <div className="delete">
            <Button
              sx={{
                width: "120px",
                height: "30px",
                background: "#06805B",
                borderRadius: "3px",
                fontSize: "10px",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#06805B",
                },
              }}
              disabled
              variant="contained">
              {" "}
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const AllTabs = () => {
    const assetsList = useSelector((state) => state.dashboard.assetsList);
    return (
      <div className="space">
        {assetsList.length === 0 ? (
          load ? (
            <ThreeDots
              height="60"
              width="50"
              radius="9"
              color="#06805B"
              ariaLabel="three-dots-loading"
              wrapperStyle={{ marginLeft: "20px" }}
              wrapperClassName=""
              visible={true}
            />
          ) : (
            <div style={place}>No records of pumps</div>
          )
        ) : (
          assetsList.map((item, index) => {
            return <CardItem key={index} data={item} />;
          })
        )}
      </div>
    );
  };

  const PMSTabs = () => {
    const assetsList = useSelector((state) => state.dashboard.assetsList);
    const pmsAsset = assetsList.filter((data) => data.productType === "PMS");
    return (
      <div className="space">
        {pmsAsset.length === 0 ? (
          load ? (
            <ThreeDots
              height="60"
              width="50"
              radius="9"
              color="#06805B"
              ariaLabel="three-dots-loading"
              wrapperStyle={{ marginLeft: "20px" }}
              wrapperClassName=""
              visible={true}
            />
          ) : (
            <div style={place}>No records of pumps</div>
          )
        ) : (
          pmsAsset.map((item, index) => {
            return <CardItem key={index} data={item} />;
          })
        )}
      </div>
    );
  };

  const AGOTabs = () => {
    const assetsList = useSelector((state) => state.dashboard.assetsList);
    const agoAsset = assetsList.filter((data) => data.productType === "AGO");
    return (
      <div className="space">
        {agoAsset.length === 0 ? (
          load ? (
            <ThreeDots
              height="60"
              width="50"
              radius="9"
              color="#06805B"
              ariaLabel="three-dots-loading"
              wrapperStyle={{ marginLeft: "20px" }}
              wrapperClassName=""
              visible={true}
            />
          ) : (
            <div style={place}>No records of pumps</div>
          )
        ) : (
          agoAsset.map((item, index) => {
            return <CardItem key={index} data={item} />;
          })
        )}
      </div>
    );
  };

  const DPKTabs = () => {
    const assetsList = useSelector((state) => state.dashboard.assetsList);
    const dpkAsset = assetsList.filter((data) => data.productType === "DPK");
    return (
      <div className="space">
        {dpkAsset.length === 0 ? (
          load ? (
            <ThreeDots
              height="60"
              width="50"
              radius="9"
              color="#06805B"
              ariaLabel="three-dots-loading"
              wrapperStyle={{ marginLeft: "20px" }}
              wrapperClassName=""
              visible={true}
            />
          ) : (
            <div style={place}>No records of pumps</div>
          )
        ) : (
          dpkAsset.map((item, index) => {
            return <CardItem key={index} data={item} />;
          })
        )}
      </div>
    );
  };

  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));

  return (
    <div className="stationTanksContainer">
      {oneStationData === null || (
        <div style={{ marginRight: "10px" }} className="left-form">
          <div className="inner-tanks">
            <div className="inpt" style={{ width: "100%" }}>
              <div style={{ width: "100%", textAlign: "left" }}>State</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                disabled
                // value={utils?.station?.state}
              />
            </div>

            <div className="inpt" style={{ width: "100%" }}>
              <div style={{ width: "100%", textAlign: "left" }}>
                Station Name
              </div>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={defaultState}
                sx={selectStyle2}
                disabled>
                <MenuItem style={menu} value={0}>
                  {/* {utils?.station?.outletName + ", " + utils?.station?.city} */}
                </MenuItem>
              </Select>
            </div>

            <div className="inpt" style={{ width: "100%" }}>
              <div style={{ width: "100%", textAlign: "left" }}>City/Town</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                disabled
                // value={utils?.station?.city}
              />
            </div>

            <div className="inpt" style={{ width: "100%" }}>
              <div style={{ width: "100%", textAlign: "left" }}>Tank ID</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                disabled
                // value={utils?.station?._id}
              />
            </div>

            <div className="inpt" style={{ width: "100%" }}>
              <div style={{ width: "100%", textAlign: "left" }}>LGA</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                disabled
                // value={utils?.station?.lga}
              />
            </div>

            <div className="inpt" style={{ width: "100%" }}>
              <div style={{ width: "100%", textAlign: "left" }}>Street</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                disabled
                // value={utils?.station?.area}
              />
            </div>
          </div>
        </div>
      )}
      <div
        style={{ width: oneStationData === null && "100%" }}
        className="pump-container">
        <div className="head">
          <div className="tabs">
            <div
              onClick={() => {
                setTabs(0);
              }}
              style={tabs === 0 ? tab1 : tab2}>
              All
            </div>
            <div
              onClick={() => {
                setTabs(1);
              }}
              style={tabs === 1 ? tab1 : tab2}>
              PMS
            </div>
            <div
              onClick={() => {
                setTabs(2);
              }}
              style={tabs === 2 ? tab1 : tab2}>
              AGO
            </div>
            <div
              onClick={() => {
                setTabs(3);
              }}
              style={tabs === 3 ? tab1 : tab2}>
              DPK
            </div>
          </div>
        </div>
        <div className="cont">
          {tabs === 0 && <AllTabs />}
          {tabs === 1 && <PMSTabs />}
          {tabs === 2 && <AGOTabs />}
          {tabs === 3 && <DPKTabs />}
        </div>
      </div>
    </div>
  );
};

const menu = {
  fontSize: "14px",
};

const selectStyle2 = {
  width: "100%",
  height: "35px",
  borderRadius: "5px",
  background: "#F2F1F1B2",
  color: "#000",
  fontSize: "14px",
  outline: "none",
};

const tab1 = {
  width: "100%",
  height: "100%",
  background: "#E6F5F1",
  borderRadius: "5.20093px 5.20093px 0px 0px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const tab2 = {
  width: "100%",
  height: "100%",
  borderRadius: "5.20093px 5.20093px 0px 0px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
};

const place = {
  width: "100%",
  textAlign: "center",
  fontSize: "16px",
  marginTop: "20px",
  color: "green",
};

export default StationPumps;
