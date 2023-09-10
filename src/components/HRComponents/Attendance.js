import React, { useCallback, useEffect, useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import AttendanceModal from "../Modals/Attendance";
import AtendanceService from "../../services/360station/attendance";
import { useDispatch, useSelector } from "react-redux";
import { createAttendance } from "../../storage/attendance";
import OutletService from "../../services/360station/outletService";
import { adminOutlet, getAllStations } from "../../storage/outlet";
import { OutlinedInput } from "@mui/material";
import AdminUserService from "../../services/360station/adminUsers";
import { storeStaffUsers } from "../../storage/employee";
import ClockOutModal from "../Modals/AttendanceClockOut";
import PrintAttendanceRecords from "../Reports/Attendance";
import swal from "sweetalert";
import { ThreeDots } from "react-loader-spinner";

const mediaMatch = window.matchMedia("(max-width: 530px)");
const mobile = window.matchMedia("(max-width: 600px)");

const Attendance = () => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [defaultState, setDefault] = useState(0);
  const moment = require("moment-timezone");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const attendanceData = useSelector((state) => state.attendance.attendance);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [entries, setEntries] = useState(10);
  const [prints, setPrints] = useState(false);
  const [loading, setLoading] = useState(false);

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
    return user.permission?.hr[e];
  };

  const openModal = () => {
    if (!getPerm("15")) return swal("Warning!", "Permission denied", "info");

    if (oneStationData === null) {
      swal("Warning!", "Please select a station first", "info");
    } else {
      setOpen(true);
    }
  };

  const openModal2 = () => {
    if (user.userType === "superAdmin" || user.userType === "admin") {
      if (oneStationData === null) {
        swal("Warning!", "Please select a station first", "info");
      } else {
        setOpen2(true);
      }
    } else {
      swal("Warning!", "You do not have a permission", "info");
    }
  };

  const getAllAtendanceData = useCallback((getDataRange) => {
    if (oneStationData !== null) {
      if (getPerm("13") || getPerm("14") || user.userType === "superAdmin") {
        const findID = allOutlets.findIndex(
          (data) => data._id === oneStationData._id
        );
        setDefault(findID + 1);

        const payload = {
          skip: skip * limit,
          limit: limit,
          today: getDataRange.today,
          tomorrow: getDataRange.tomorrow,
          outletID: oneStationData._id,
          organisationID: resolveUserID().id,
        };
        AdminUserService.allStaffUserRecords(payload)
          .then((data) => {
            setLoading(false);
            dispatch(storeStaffUsers(data.staff.staff));
          })
          .then(() => {
            AtendanceService.allAttendanceRecords(payload).then((data) => {
              setTotal(data.attendance.count);
              dispatch(createAttendance(data.attendance.attendance));
            });
          });

        return;
      }
    }

    setLoading(true);
    const payload = {
      organisation: resolveUserID().id,
    };

    OutletService.getAllOutletStations(payload)
      .then((data) => {
        dispatch(getAllStations(data.station));
        if (
          (getPerm("13") || user.userType === "superAdmin") &&
          oneStationData === null
        ) {
          if (!getPerm("14")) setDefault(1);
          dispatch(adminOutlet(null));
          return "None";
        } else {
          OutletService.getOneOutletStation({ outletID: user.outletID }).then(
            (data) => {
              dispatch(adminOutlet(data.station));
            }
          );

          return user.outletID;
        }
      })
      .then((data) => {
        const payload = {
          skip: skip * limit,
          limit: limit,
          today: getDataRange.today,
          tomorrow: getDataRange.tomorrow,
          outletID: data,
          organisationID: resolveUserID().id,
        };
        AdminUserService.allStaffUserRecords(payload)
          .then((data) => {
            setLoading(false);
            dispatch(storeStaffUsers(data.staff.staff));
          })
          .then(() => {
            AtendanceService.allAttendanceRecords(payload).then((data) => {
              setTotal(data.attendance.count);
              dispatch(createAttendance(data.attendance.attendance));
            });
          });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTodayAndTomorrow = () => {
    const today = moment();
    const todayMoment = moment().format("YYYY-MM-DD HH:mm:ss").split(" ")[0];
    const tomorrowMoment = today.clone().add(1, "days");
    return {
      today: todayMoment,
      tomorrow: tomorrowMoment.format("YYYY-MM-DD HH:mm:ss").split(" ")[0],
    };
  };

  useEffect(() => {
    const getDataRange = getTodayAndTomorrow();
    getAllAtendanceData(getDataRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllAtendanceData]);

  const refresh = () => {
    setLoading(true);
    const range = getTodayAndTomorrow();
    const payload = {
      skip: skip * limit,
      limit: limit,
      today: range.today,
      tomorrow: range.tomorrow,
      outletID: oneStationData === null ? "None" : oneStationData?._id,
      organisationID: resolveUserID().id,
    };
    AdminUserService.allStaffUserRecords(payload)
      .then((data) => {
        dispatch(storeStaffUsers(data.staff.staff));
      })
      .then(() => {
        AtendanceService.allAttendanceRecords(payload).then((data) => {
          setLoading(false);
          setTotal(data.attendance.count);
          dispatch(createAttendance(data.attendance.attendance));
        });
      });
  };

  const changeMenu = (index, item) => {
    if (!getPerm("14") && item === null)
      return swal("Warning!", "Permission denied", "info");

    setLoading(true);
    setDefault(index);
    const range = getTodayAndTomorrow();
    dispatch(adminOutlet(item));

    const payload = {
      skip: skip * limit,
      limit: limit,
      today: range.today,
      tomorrow: range.tomorrow,
      outletID: item === null ? "None" : item?._id,
      organisationID: resolveUserID().id,
    };

    const menyPayload = {
      today: range.today,
      tomorrow: range.tomorrow,
      outletID: item === null ? "None" : item?._id,
      organisationID: resolveUserID().id,
    };

    AdminUserService.allStaffUserRecords(menyPayload)
      .then((data) => {
        dispatch(storeStaffUsers(data.staff.staff));
      })
      .then(() => {
        AtendanceService.allAttendanceRecords(payload).then((data) => {
          setLoading(false);
          setTotal(data.attendance.count);
          dispatch(createAttendance(data.attendance.attendance));
        });
      });
    AtendanceService.allAttendanceRecords(payload).then((data) => {
      setTotal(data.attendance.count);
      dispatch(createAttendance(data.attendance.attendance));
    });
  };

  const searchTable = (value, e) => {
    e.preventDefault();
    const today = moment(value);
    const todayMoment = moment(value)
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];
    const tomorrowMoment = today
      .clone()
      .add(1, "days")
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];

    const payload = {
      skip: skip * limit,
      limit: limit,
      today: todayMoment,
      tomorrow: tomorrowMoment,
      outletID: oneStationData === null ? "None" : oneStationData?._id,
      organisationID: resolveUserID().id,
    };
    AtendanceService.allAttendanceRecords(payload).then((data) => {
      setTotal(data.attendance.count);
      dispatch(createAttendance(data.attendance.attendance));
    });
  };

  const convertToMinutes = (time) => {
    const [hour, minutes] = time.split(":");
    if (hour[0] === "0")
      return Number(hour.split("")[1]) * 60 + Number(minutes);
    if (hour[0] !== "0") return Number(hour) * 60 + Number(minutes);
  };

  const computeTime = (timeIn, timeOut, workingHour) => {
    const diff = convertToMinutes(timeOut) - convertToMinutes(timeIn);
    if (diff > Number(workingHour * 60)) return true;
    if (diff < Number(workingHour * 60)) return false;
  };

  const nextPage = () => {
    setSkip((prev) => prev + 1);
    refresh(skip + 1);
  };

  const prevPage = () => {
    if (skip < 1) return;
    setSkip((prev) => prev - 1);
    refresh(skip - 1);
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    refresh(skip);
  };

  const printReport = () => {
    if (!getPerm("16")) return swal("Warning!", "Permission denied", "info");
    setPrints(true);
  };

  const goToHistory = () => {
  };

  return (
    <div data-aos="zoom-in-down" className="paymentsCaontainer">
      {
        <AttendanceModal
          currentOutlet={oneStationData}
          open={open}
          close={setOpen}
          refresh={refresh}
        />
      }
      {
        <ClockOutModal
          currentOutlet={oneStationData}
          open={open2}
          close={setOpen2}
          refresh={refresh}
        />
      }
      {prints && (
        <PrintAttendanceRecords
          allOutlets={attendanceData}
          open={prints}
          close={setPrints}
        />
      )}
      <div className="inner-pay">
        <div className="action">
          <div style={{ width: "150px" }} className="butt2">
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={10}
              sx={{
                ...selectStyle2,
                backgroundColor: "#06805B",
                color: "#fff",
              }}>
              <MenuItem style={menu} value={10}>
                Action
              </MenuItem>
              <MenuItem style={menu} onClick={openModal} value={20}>
                Post Attendance
              </MenuItem>
              <MenuItem style={menu} value={30}>
                History
              </MenuItem>
              <MenuItem onClick={printReport} style={menu} value={40}>
                Print
              </MenuItem>
            </Select>
          </div>
        </div>

        <div className="search">
          <div className="input-cont">
            <div className="second-select">
              {getPerm("13") && (
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={defaultState}
                  sx={selectStyle2}>
                  <MenuItem
                    onClick={() => {
                      changeMenu(0, null);
                    }}
                    style={menu}
                    value={0}>
                    All Stations
                  </MenuItem>
                  {allOutlets.map((item, index) => {
                    return (
                      <MenuItem
                        key={index}
                        style={menu}
                        onClick={() => {
                          changeMenu(index + 1, item);
                        }}
                        value={index + 1}>
                        {item.outletName + ", " + item.alias}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
              {getPerm("13") || (
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={0}
                  sx={selectStyle2}
                  disabled>
                  <MenuItem style={menu} value={0}>
                    {!getPerm("13")
                      ? oneStationData?.outletName +
                        ", " +
                        oneStationData?.alias
                      : "No station created"}
                  </MenuItem>
                </Select>
              )}
            </div>
            <div className="second-select">
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  background: "#054834",
                  fontSize: "12px",
                  color: "#fff",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                type="date"
                placeholder="Search"
                onChange={(e) => {
                  searchTable(e.target.value, e);
                }}
              />
            </div>
          </div>
          <div style={{ width: "140px" }} className="butt">
            {
              <Button
                sx={{
                  width: "100%",
                  height: "30px",
                  background: "#427BBE",
                  borderRadius: "0px",
                  fontSize: "10px",
                  "&:hover": {
                    backgroundColor: "#427BBE",
                  },
                }}
                onClick={openModal}
                variant="contained">
                {" "}
                Post Attendance
              </Button>
            }
          </div>
        </div>

        <div className="search2">
          <div className="butt2">
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={entries}
              sx={selectStyle2}>
              <MenuItem style={menu} value={10}>
                Show entries
              </MenuItem>
              <MenuItem
                onClick={() => {
                  entriesMenu(20, 15);
                }}
                style={menu}
                value={20}>
                15 entries
              </MenuItem>
              <MenuItem
                onClick={() => {
                  entriesMenu(30, 30);
                }}
                style={menu}
                value={30}>
                30 entries
              </MenuItem>
              <MenuItem
                onClick={() => {
                  entriesMenu(40, 100);
                }}
                style={menu}
                value={40}>
                100 entries
              </MenuItem>
            </Select>
          </div>
          <div
            style={{ width: mediaMatch.matches ? "100%" : "190px" }}
            className="input-cont2">
            <Button
              sx={{
                width: mediaMatch.matches ? "100%" : "100px",
                height: "30px",
                background: "#58A0DF",
                borderRadius: "0px",
                fontSize: "10px",
                display: mediaMatch.matches && "none",
                marginTop: mediaMatch.matches ? "10px" : "0px",
                "&:hover": {
                  backgroundColor: "#58A0DF",
                },
              }}
              onClick={goToHistory}
              variant="contained">
              {" "}
              History
            </Button>
            <Button
              sx={{
                width: mediaMatch.matches ? "100%" : "80px",
                height: "30px",
                background: "#F36A4C",
                borderRadius: "0px",
                fontSize: "10px",
                display: mediaMatch.matches && "none",
                marginTop: mediaMatch.matches ? "10px" : "0px",
                "&:hover": {
                  backgroundColor: "#F36A4C",
                },
              }}
              onClick={printReport}
              variant="contained">
              {" "}
              Print
            </Button>
          </div>
        </div>

        {mobile.matches ? (
          !loading ? (
            attendanceData.length === 0 ? (
              <div style={place}>No data</div>
            ) : (
              attendanceData.map((item, index) => {
                return (
                  <div key={index} className="mobile-table-container">
                    <div className="inner-container">
                      <div className="row">
                        <div className="left-text">
                          <div className="heads">{item.employeeName}</div>
                          <div className="foots">Employee Name</div>
                        </div>
                        <div className="right-text">
                          <div className="heads">Active</div>
                          <div className="foots">Status</div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="left-text">
                          <div className="heads">{item.timeOut}</div>
                          <div className="foots">Time Out</div>
                        </div>
                        <div className="right-text">
                          <div className="heads">{item.timeIn}</div>
                          <div className="foots">Time in</div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="left-text">
                          <div className="heads">{item.workingHour}</div>
                          <div className="foots">
                            {item.timeOut === "-- : --" ? (
                              <div
                                style={{ color: "green" }}
                                className="column">
                                Pending
                              </div>
                            ) : computeTime(
                                item.timeIn,
                                item.timeOut,
                                item.workingHour
                              ) ? (
                              <div className="column">Punctual</div>
                            ) : (
                              <div style={{ color: "red" }} className="column">
                                Unpunctual
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="right-text">
                          <div style={{ width: "95px" }} className="actions">
                            <Button
                              sx={{
                                width: "100%",
                                height: "30px",
                                background: "#427BBE",
                                borderRadius: "3px",
                                fontSize: "10px",
                                "&:hover": {
                                  backgroundColor: "#427BBE",
                                },
                              }}
                              disabled={
                                item.timeOut === "-- : --" ? false : true
                              }
                              onClick={openModal2}
                              variant="contained">
                              {" "}
                              Clock out
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            <div style={load}>
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
          )
        ) : (
          <div className="table-container">
            <div className="table-head">
              <div className="column">S/N</div>
              <div className="column">Staff Name</div>
              <div className="column">Clock in</div>
              <div className="column">Clock out</div>
              <div className="column">Working Hour</div>
              <div className="column">Status</div>
              <div className="column">Actions</div>
            </div>

            {!loading ? (
              attendanceData.length === 0 ? (
                <div style={place}>No data</div>
              ) : (
                attendanceData.map((item, index) => {
                  return (
                    <div
                      data-aos="fade-up"
                      key={index}
                      className="row-container">
                      <div className="table-head2">
                        <div className="column">{index + 1}</div>
                        <div className="column">{item.employeeName}</div>
                        <div style={{ color: "green" }} className="column">
                          {item.timeIn}
                        </div>
                        <div style={{ color: "red" }} className="column">
                          {item.timeOut}
                        </div>
                        <div className="column">{item.workingHour}</div>
                        {item.timeOut === "-- : --" ? (
                          <div style={{ color: "green" }} className="column">
                            Pending
                          </div>
                        ) : computeTime(
                            item.timeIn,
                            item.timeOut,
                            item.workingHour
                          ) ? (
                          <div className="column">Punctual</div>
                        ) : (
                          <div style={{ color: "red" }} className="column">
                            Unpunctual
                          </div>
                        )}
                        <div className="column">
                          <div style={{ width: "95px" }} className="actions">
                            <Button
                              sx={{
                                width: "100%",
                                height: "30px",
                                background: "#427BBE",
                                borderRadius: "3px",
                                fontSize: "10px",
                                "&:hover": {
                                  backgroundColor: "#427BBE",
                                },
                              }}
                              disabled={
                                item.timeOut === "-- : --" ? false : true
                              }
                              onClick={openModal2}
                              variant="contained">
                              {" "}
                              Clock out
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              <div style={load}>
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
            )}
          </div>
        )}

        <div className="footer">
          <div style={{ fontSize: "12px" }}>
            Showing {(skip + 1) * limit - (limit - 1)} to {(skip + 1) * limit}{" "}
            of {total} entries
          </div>
          <div className="nav">
            <button onClick={prevPage} className="but">
              Previous
            </button>
            <div className="num">{skip + 1}</div>
            <button onClick={nextPage} className="but2">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const selectStyle2 = {
  width: "100%",
  height: "35px",
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

const place = {
  width: "100%",
  textAlign: "center",
  fontSize: "12px",
  marginTop: "20px",
  color: "green",
};

const load = {
  width: "100%",
  height: "30px",
  display: "flex",
  justifyContent: "center",
};

export default Attendance;
