import React, { useCallback, useEffect, useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import AttendanceModal from "../Modals/Attendance";
import AtendanceService from "../../services/360station/attendance";
import { useDispatch, useSelector } from "react-redux";
import { createAttendance } from "../../storage/attendance";
import ClockOutModal from "../Modals/AttendanceClockOut";
import swal from "sweetalert";
import { ThreeDots } from "react-loader-spinner";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import { LimitSelect } from "../common/customselect";
import DateRangeLib from "../common/DatePickerLib";
import { CreateButton, PrintButton } from "../common/buttons";
import { SearchField } from "../common/searchfields";
import SelectStation from "../common/selectstations";
import GenerateReports from "../Modals/reports";
import APIs from "../../services/connections/api";
import { setEmployeeList } from "../../storage/dashboard";

const mobile = window.matchMedia("(max-width: 600px)");

const Attendance = () => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const attendanceData = useSelector((state) => state.attendance.attendance);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updateDate = useSelector((state) => state.dashboard.dateRange);
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

  const getAllAtendanceData = useCallback((id, updateDate, skip) => {
    refresh(id, updateDate, skip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = oneStationData === null ? "None" : oneStationData._id;
    getAllAtendanceData(id, updateDate, skip);
  }, [getAllAtendanceData, oneStationData, skip, updateDate]);

  const refresh = (id, date, skip, limit = 15) => {
    setLoading(true);
    const payload = {
      skip: skip * limit,
      limit: limit,
      today: date[0],
      tomorrow: date[1],
      outletID: id,
      organisationID: resolveUserID().id,
    };

    APIs.post("/dashboard/employee", payload)
      .then(({ data }) => {
        dispatch(setEmployeeList(data.employee));
      })
      .then(() => {
        AtendanceService.allAttendanceRecords(payload).then((data) => {
          setTotal(data.attendance.count);
          dispatch(createAttendance(data.attendance.attendance));
        });
      })
      .then(() => {
        setLoading(false);
      });
  };

  const searchTable = (value, e) => {
    e.preventDefault();
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
    const id = oneStationData === null ? "None" : oneStationData._id;
    refresh(id, updateDate, skip, limit);
  };

  const printReport = () => {
    if (!getPerm("16")) return swal("Warning!", "Permission denied", "info");
    setPrints(true);
  };

  const stationHelper = (id) => {
    refresh(id, updateDate, skip);
  };

  return (
    <div data-aos="zoom-in-down" className="paymentsCaontainer">
      {
        <AttendanceModal
          currentOutlet={oneStationData}
          open={open}
          close={setOpen}
          refresh={refresh}
          skip={skip}
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
        <GenerateReports
          open={prints}
          close={setPrints}
          section={"attendance"}
          data={attendanceData}
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

        <TableControls mt={"10px"}>
          <LeftControls>
            <SelectStation
              ml={"0px"}
              oneStation={getPerm("0")}
              allStation={getPerm("1")}
              callback={stationHelper}
            />
          </LeftControls>
          <RightControls>
            <CreateButton callback={openModal} label={"Post Attendance"} />
          </RightControls>
        </TableControls>

        <TableControls mt={"10px"}>
          <LeftControls>
            <LimitSelect entries={entries} entriesMenu={entriesMenu} />
            <SearchField ml={"10px"} callback={searchTable} />
          </LeftControls>
          <RightControls>
            <DateRangeLib mt={mobile.matches ? "10px" : "0px"} />
            <PrintButton callback={printReport} />
          </RightControls>
        </TableControls>

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
