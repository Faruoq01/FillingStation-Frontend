import { Switch } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OutletService from "../../services/360station/outletService";
import { getAllStations } from "../../storage/outlet";
import "../../styles/listTanks.scss";
import PMSTank from "./TankSingleList/PMSTank.js";
import AGOTank from "./TankSingleList/AGOTank.js";
import DPKTank from "./TankSingleList/DPKTank.js";
import { styled } from "@mui/material/styles";
import swal from "sweetalert";
import Button from "@mui/material/Button";
import { ThreeDots } from "react-loader-spinner";
import ApproximateDecimal from "../common/approx";
import { setTankLevelList } from "../../storage/dailysales";
import APIs from "../../services/connections/api";
import DateRangeLib from "../common/DatePickerLib";
import SelectStation from "../common/selectstations";

const mobile = window.matchMedia("(max-width: 600px)");

const ListAllTanks = () => {
  const updatedDate = useSelector((state) => state.dashboard.dateRange);
  const tankLevelList = useSelector((state) => state.dailysales.tankLevelList);
  const salesShift = useSelector((state) => state.dailysales.salesShift);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const [defaultState, setDefault] = useState(0);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const tankListType = useSelector((state) => state.outlet.tankListType);
  const [loader, setLoader] = useState(false);

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

  const getTanksLists = useCallback((outlet, updatedDate, salesShift) => {
    refresh(outlet, updatedDate, "None", salesShift);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const outlet = oneStationData === null ? "None" : oneStationData._id;
    getTanksLists(outlet, updatedDate, salesShift);
  }, [getTanksLists, oneStationData, salesShift, updatedDate]);

  const refresh = (outlet, updatedDate, ship, shift) => {
    setLoader(true);
    const payload = {
      organisationID: resolveUserID().id,
      outletID: outlet,
      productType: tankListType,
      date: updatedDate[0],
      shift: shift,
    };

    APIs.post("/daily-sales/tankLevelsList", payload)
      .then(({ data }) => {
        dispatch(setTankLevelList(data.tanks));
      })
      .then(() => {
        setLoader(false);
      });
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

  const activateTank = (e, data) => {
    return swal(
      "Warning!",
      "Can not activate this record from here, go to comprehensive report!",
      "error"
    );
  };

  const deleteTank = (data) => {
    return swal(
      "Warning!",
      "Can not delete this record from here, go to comprehensive report!",
      "error"
    );
  };

  const stationHelper = (id) => {
    refresh(id, updatedDate, "None", salesShift);
  };

  return (
    <React.Fragment>
      <div style={{ width: "96%" }} className="listContainer">
        <div
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          className="stat">
          <SelectStation
            ml={"10px"}
            oneStation={getPerm("0")}
            allStation={getPerm("1")}
            callback={stationHelper}
          />
          <div>
            <DateRangeLib sales={true} mt={mobile.matches ? "10px" : "0px"} />
          </div>
        </div>

        <div className="mains">
          {loader ? (
            <div style={tankss}>
              <ThreeDots
                height="60"
                width="50"
                radius="9"
                color="#076146"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
              />
            </div>
          ) : (
            <div className="inner-main">
              {tankLevelList.length === 0 ? (
                <div style={cover}>No Tank Record</div>
              ) : (
                tankLevelList.map((item, index) => {
                  return (
                    <div key={index} className="item">
                      <div className="tank-cont">
                        <div className="top">
                          <div className="left">
                            <div>{item.tankName}</div>
                          </div>
                          <div className="right">
                            <div>
                              {item.activeState === "0" ? "Inactive" : "Active"}
                            </div>
                            <IOSSwitch
                              onClick={(e) => {
                                activateTank(e, item);
                              }}
                              sx={{ m: 1 }}
                              defaultChecked={
                                item.activeState === "0" ? false : true
                              }
                            />
                          </div>
                        </div>
                        {tankListType === "PMS" && (
                          <PMSTank
                            margin={"80px"}
                            data={{
                              PMSTankCapacity: Number(item.tankCapacity),
                              totalPMS: Number(item.afterSales),
                              PMSDeadStock: 200,
                            }}
                          />
                        )}
                        {tankListType === "AGO" && (
                          <AGOTank
                            margin={"80px"}
                            data={{
                              AGOTankCapacity: Number(item.tankCapacity),
                              totalAGO: Number(item.afterSales),
                              AGODeadStock: 200,
                            }}
                          />
                        )}
                        {tankListType === "DPK" && (
                          <DPKTank
                            margin={"80px"}
                            data={{
                              DPKTankCapacity: Number(item.tankCapacity),
                              totalDPK: Number(item.afterSales),
                              DPKDeadStock: 200,
                            }}
                          />
                        )}
                        <div className="foot">
                          <div className="tex">
                            <div>
                              <span style={{ color: "#07956A" }}>Level: </span>{" "}
                              {ApproximateDecimal(item.afterSales)} litres
                            </div>
                            <div>
                              <span style={{ color: "#07956A" }}>
                                Capacity:{" "}
                              </span>{" "}
                              {ApproximateDecimal(item.tankCapacity)} litres
                            </div>
                          </div>
                          <Button
                            sx={{
                              width: "70px",
                              height: "30px",
                              background: "#D53620",
                              borderRadius: "3.11063px",
                              fontSize: "10px",
                              color: "#fff",
                              "&:hover": {
                                backgroundColor: "#D53620",
                              },
                            }}
                            onClick={() => {
                              deleteTank(item);
                            }}
                            variant="contained">
                            {" "}
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

const tankss = {
  width: "100%",
  height: "500px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "16px",
  color: "green",
  fontWeight: "200",
};

const menu = {
  fontSize: "12px",
};

const selectStyle2 = {
  width: "200px",
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

const cover = {
  width: "100px",
  height: "20px",
  fontSize: "12px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "5px",
  color: "green",
  fontWeight: "700",
};

export default ListAllTanks;
