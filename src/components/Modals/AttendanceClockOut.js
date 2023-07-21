import React, { useState } from "react";
import { useSelector } from "react-redux";
import close from "../../assets/close.png";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import "../../styles/lpo.scss";
import AtendanceService from "../../services/attendance";
import { MenuItem, Select } from "@mui/material";

const ClockOutModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [defaultState, setDefault] = useState(0);
  const attendanceData = useSelector((state) => state.attendance.attendance);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [employeeName, setEmployeeName] = useState("");
  const [clockOut, setClockout] = useState("");

  const handleClose = () => props.close(false);

  const submit = () => {
    if (employeeName === "" || employeeName === "Select User")
      return swal("Warning!", "Employee name field cannot be empty", "info");
    if (clockOut === "")
      return swal("Warning!", "Clock in field cannot be empty", "info");
    if (oneStationData === null)
      return swal("Warning!", "Please create a station", "info");

    setLoading(true);

    const payload = {
      id: employeeName._id,
      employeeName: employeeName.employeeName,
      timeIn: employeeName.timeIn,
      workingHour: employeeName.workingHour,
      timeOut: clockOut,
      outletID: oneStationData?._id,
      organisationID: oneStationData?.organisation,
    };

    AtendanceService.updateAttendance(payload)
      .then((data) => {
        swal("Success", "Attendance updated successfully!", "success");
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
      <div style={{ height: "auto" }} className="modalContainer2">
        <div style={{ height: "280px", margin: "20px" }} className="inner">
          <div className="head">
            <div className="head-text">Clock out</div>
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
                  Select user
                </MenuItem>
                {attendanceData.map((item, index) => {
                  return (
                    <MenuItem
                      key={index}
                      style={menu}
                      onClick={() => {
                        changeMenu(index, item);
                      }}
                      value={index + 1}>
                      {item.employeeName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>

            <div className="inputs">
              <div className="head-text2">Time Out</div>
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
                onChange={(e) => setClockout(e.target.value)}
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
  height: "180px",
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

export default ClockOutModal;
