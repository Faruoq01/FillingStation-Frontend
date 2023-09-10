import React, { useState } from "react";
import { useSelector } from "react-redux";
import close from "../../assets/close.png";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import "../../styles/lpo.scss";
import AtendanceService from "../../services/360station/attendance";
import { MenuItem, Select } from "@mui/material";

const AttendanceModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [defaultState, setDefault] = useState(0);
  const staffUsers = useSelector((state) => state.employee.staffUsers);
  const oneStation = useSelector((state) => state.outlet.adminOutlet);
  const [employeeName, setEmployeeName] = useState("");
  const [workingHour, setWorkingHour] = useState("");
  const [clockIn, setClockIn] = useState("");

  const handleClose = () => props.close(false);

  function removeSpecialCharacters(str) {
    return str.replace(/[^0-9.]/g, "");
  }

  const submit = () => {
    if (employeeName === "" || employeeName === "Select User")
      return swal("Warning!", "Employee name field cannot be empty", "info");
    if (workingHour === "")
      return swal("Warning!", "Working Hour field cannot be empty", "info");
    if (clockIn === "")
      return swal("Warning!", "Clock in field cannot be empty", "info");
    if (oneStation === null)
      return swal("Warning!", "Please create a station", "info");

    setLoading(true);

    const payload = {
      id: employeeName._id,
      employeeName: employeeName.staffName,
      timeIn: clockIn,
      workingHour: removeSpecialCharacters(workingHour),
      outletID: oneStation?._id,
      organisationID: oneStation?.organisation,
    };

    AtendanceService.createAttendance(payload)
      .then((data) => {
        if (data.message === "Attendance already recorded") {
          swal("Error", "Attendance already exist!", "error");
        } else {
          swal("Success", "Attendance created successfully!", "success");
        }
      })
      .then(() => {
        setLoading(false);
        props.refresh();
        handleClose();
      });
  };

  const changeMenu = (index, item) => {
    setEmployeeName(item);
    setDefault(index);
  };

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div
        data-aos="zoom-out-up"
        style={{ height: "auto" }}
        className="modalContainer2">
        <div style={{ height: "auto", margin: "20px" }} className="inner">
          <div className="head">
            <div className="head-text">Add Attendance</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={inner}>
            <div className="inputs">
              <div className="head-text2">Employee Name</div>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={defaultState}
                sx={selectStyle2}>
                <MenuItem style={menu} value={0}>
                  Select User
                </MenuItem>
                {staffUsers.map((item, index) => {
                  return (
                    <MenuItem
                      key={index}
                      style={menu}
                      onClick={() => {
                        changeMenu(index, item);
                      }}
                      value={index + 1}>
                      {item.staffName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>

            <div className="inputs">
              <div className="head-text2">Working Hour</div>
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
                type="text"
                onChange={(e) => setWorkingHour(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Time in</div>
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
                type="time"
                onChange={(e) => setClockIn(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: "10px" }} className="butt">
            <Button
              sx={{
                width: "100px",
                height: "30px",
                background: "#427BBE",
                borderRadius: "3px",
                fontSize: "10px",
                marginTop: "0px",
                "&:hover": {
                  backgroundColor: "#427BBE",
                },
              }}
              onClick={submit}
              variant="contained">
              {" "}
              Save
            </Button>

            {loading ? (
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
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const inner = {
  width: "100%",
  height: "270px",
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

const menu = {
  fontSize: "14px",
};

export default AttendanceModal;
