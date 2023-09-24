import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import close from "../../assets/close.png";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import "../../styles/lpo.scss";
import ButtonDatePicker from "../common/CustomDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MenuItem, Select, Stack } from "@mui/material";
import {
  changeDate,
  changeStation,
  createLPO,
  setCurrentShift,
  tankList,
  updateRecords,
} from "../../storage/recordsales";
import { daySupply } from "../../storage/supply";
import swal from "sweetalert";
import moment from "moment";
import OutletService from "../../services/360station/outletService";
import LPOService from "../../services/360station/lpo";
import APIs from "../../services/connections/api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PendingSales = (props) => {
  const date = new Date();
  const toString = date.toDateString();
  const [month, day, year] = toString.split(" ");
  const date2 = `${day} ${month} ${year}`;
  const [value, setValue] = React.useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleClose = () => props.close(false);
  const [loading, setLoading] = useState(false);
  const [dateLoader, setDateLoader] = useState(false);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const tankListData = useSelector((state) => state.recordsales.tankList);
  const currentDate = useSelector((state) => state.recordsales.currentDate);
  const currentShift = useSelector((state) => state.recordsales.currentShift);
  const [defaultSelect, setDefaultSelect] = useState(0);

  useEffect(() => {
    dispatch(changeDate(""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isValidDateFormat = (dateString) => {
    const parsedDate = moment(dateString, "YYYY-MM-DD", true);
    return (
      parsedDate.isValid() && parsedDate.format("YYYY-MM-DD") === dateString
    );
  };

  const getAllShifts = () => {
    const parsedDate = moment(currentDate, "YYYY-MM-DD");
    const dayOfWeek = parsedDate.format("dddd").toLowerCase();
    const today = moment().format("dddd").toLowerCase();
    const targetDate = currentDate === "" ? today : dayOfWeek;
    const station = JSON.parse(JSON.stringify(oneStationData));

    if (station) {
      if (station.shift) {
        const shifts = station.shift;
        if (targetDate in shifts) {
          const shiftList = shifts[targetDate];
          return Object.values(shiftList);
        } else {
          return [];
        }
      } else {
        return [];
      }
    } else {
      return [];
    }
  };

  const submit = async () => {
    if (getAllShifts().length === 0 && currentShift !== "All shifts") {
      return swal(
        "Error",
        "Please contact admin to create shifts for this station",
        "error"
      );
    }

    if (currentShift === "") {
      return swal("Error", "Please select shift to proceed", "error");
    }
    const today = moment();
    const beyondTodaysDate = moment(currentDate) > today;

    if (beyondTodaysDate)
      return swal(
        "Error",
        "You cannot save a record greater than todays date",
        "error"
      );
    if (currentDate === "")
      return swal("Error", "Please select a valid date", "error");
    if (!isValidDateFormat(currentDate))
      return swal("Error", "Please select a valid date", "error");
    setLoading(true);

    const result = await APIs.post("/sales/validateSales", {
      date: currentDate,
      organizationID: oneStationData.organisation,
      outletID: oneStationData._id,
      shift: currentShift,
    }).then((data) => {
      setLoading(false);
      return data.data.data;
    });

    if (result) {
      swal("Error!", "Record has been saved for this day already!", "error");
    } else {
      handleClose();
    }
  };

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.recordSales[e];
  };

  const updateTanksWithSupplies = (tankListData, daySupply) => {
    if (daySupply.length === 0 || tankListData.length === 0) {
      dispatch(tankList(tankListData));
    } else {
      const copyTanks = JSON.parse(JSON.stringify(tankListData));
      for (const supply of daySupply) {
        const recipient = Object.values(supply.recipientTanks);
        for (const tank of recipient) {
          const findID = copyTanks.findIndex((data) => data._id === tank.id);
          if (findID !== -1) {
            const newLevel =
              Number(copyTanks[findID].currentLevel) + Number(tank.quantity);
            copyTanks[findID] = {
              ...copyTanks[findID],
              currentLevel: newLevel,
            };
          }
        }
      }
      dispatch(tankList(copyTanks));
    }
  };

  const updateDate = (newValue) => {
    if (oneStationData === null)
      return swal("Warning!", "Please select station first", "info");
    props.pages(1);

    if (tankListData.length === null)
      return swal(
        "Warning!",
        "Please check your network settings or reload",
        "info"
      );
    if (!getPerm("2")) return swal("Warning!", "Permission denied", "info");
    setValue(newValue);
    props.date(newValue);
    dispatch(changeStation());
    const today = moment().format("YYYY-MM-DD").split(" ")[0];
    const getDate = newValue === "" ? today : newValue.format("YYYY-MM-DD");
    if (!isValidDateFormat(getDate))
      return swal("Error", "Please select a valid date", "error");

    getAllRecordDetails(oneStationData, getDate);
    return getDate;
  };

  const getAllRecordDetails = (station, date) => {
    setDateLoader(true);

    const payload = {
      outletID: station._id,
      organisationID: station.organisation,
    };

    const stationPumps = OutletService.getAllStationPumps(payload);
    const stationTanks = OutletService.getAllOutletTanks(payload);
    const orgLpo = LPOService.getAllLPO(payload);
    const supply = APIs.post("/supply/dayRecord", {
      ...payload,
      createdAt: date,
    });

    Promise.all([stationPumps, stationTanks, orgLpo, supply]).then((data) => {
      const [pumps, tanks, lpo, supply] = data;

      ///////////////// station pumps //////////////////////
      const copyData = JSON.parse(JSON.stringify(pumps));
      const updated = copyData.map((data) => {
        let pumps = { ...data };
        return {
          ...pumps,
          identity: null,
          closingMeter: 0,
          newTotalizer: "Enter closing meter",
          RTlitre: 0,
          sales: 0,
        };
      });
      const PMS = updated.filter((data) => data.productType === "PMS");
      const AGO = updated.filter((data) => data.productType === "AGO");
      const DPK = updated.filter((data) => data.productType === "DPK");
      dispatch(updateRecords({ pms: PMS, ago: AGO, dpk: DPK }));

      ///////////////// station tanks //////////////////////
      const outletTanks = tanks.stations.map((data) => {
        const newData = {
          ...data,
          label: data.tankName,
          value: data._id,
          dippingValue: 0,
          sales: 0,
          outlet: null,
          pumps: [],
          beforeSales: data.currentLevel,
          afterSales: 0,
          RTlitre: 0,
        };
        return newData;
      });

      ///////////////// station lpo //////////////////////
      dispatch(createLPO(lpo.lpo.lpo));

      ///////////////// station supplies /////////////////
      dispatch(daySupply(supply.data.supply));
      updateTanksWithSupplies(outletTanks, supply.data.supply);
      dispatch(changeDate(date));
      setDateLoader(false);
    });
  };

  const convertDate = (newValue) => {
    const getDate = newValue === "" ? date2 : newValue.format("MM/DD/YYYY");
    const date = new Date(getDate);
    const toString = date.toDateString();
    const [day, year, month] = toString.split(" ");
    const finalDate = `${day} ${month} ${year}`;

    return finalDate;
  };

  const goToSales = () => {
    dispatch(changeDate(""));
    navigate("/home/dashboard/dashboardhome/0");
  };

  const changeMenu = (item, index) => {
    setDefaultSelect(index);
    if (index === 1) {
      return dispatch(setCurrentShift(item));
    }
    dispatch(setCurrentShift(item.shiftname));
  };

  return (
    <Modal
      open={props.open}
      //   onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div
        style={{ height: "auto", background: "#f7f7f7" }}
        className="modalContainer2">
        <div style={{ height: "auto", margin: "20px" }} className="inner">
          <div className="head">
            <div className="head-text">Please select sales date</div>
            <img
              onClick={goToSales}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={inner}>
            <div style={row}>
              <div style={left}>Station name</div>
              <div style={right}>{`${oneStationData?.alias}`}</div>
            </div>

            <div style={row}>
              <div style={left}>Current date set on </div>
              <div style={right}>
                {dateLoader ? (
                  <ThreeDots
                    height="30"
                    width="50"
                    radius="9"
                    color="#076146"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                ) : (
                  currentDate
                )}
              </div>
            </div>

            <p style={{ marginTop: "30px", fontWeight: "600" }}>
              Please input a valid date to save your record!
            </p>
            <div style={row2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={1}>
                  <ButtonDatePicker
                    label={`${
                      value == null || "" ? date2 : convertDate(value)
                    }`}
                    value={value}
                    onChange={(newValue) => updateDate(newValue)}
                  />
                </Stack>
              </LocalizationProvider>
            </div>

            <div style={row2}>
              <Select value={defaultSelect} sx={select}>
                <MenuItem style={menu} value={0}>
                  Please select shift
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    changeMenu("All shifts", 1);
                  }}
                  style={menu}
                  value={1}>
                  All day shifts
                </MenuItem>
                {getAllShifts().map((item, index) => {
                  return (
                    <MenuItem
                      onClick={() => {
                        changeMenu(item, index + 2);
                      }}
                      key={index}
                      style={menu}
                      value={index + 2}>
                      {item.shiftname}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>

            <div style={{ marginTop: "10px", height: "30px" }} className="butt">
              <div>
                {loading ? (
                  <ThreeDots
                    height="30"
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
              <Button
                disabled={dateLoader}
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
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const inner = {
  width: "100%",
  height: "auto",
};

const row = {
  width: "100%",
  height: "50px",
  background: "#fff",
  borderRadius: "5px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "10px",
  marginBottom: "10px",
};

const row2 = {
  width: "98%",
  height: "auto",
  minHeight: "50px",
  background: "#fff",
  borderRadius: "5px",
  marginTop: "10px",
  marginBottom: "30px",
  paddingLeft: "2%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const left = {
  fontSize: "16px",
  fontWeight: "bold",
  marginLeft: "15px",
};

const right = {
  fontSize: "15px",
  fontWeight: "bold",
  marginRight: "15px",
};

const select = {
  height: "35px",
  border: "none",
  fontSize: "12px",
  fontFamily: "Poppins",
  fontWeight: "bold",
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
};

const menu = {
  fontSize: "12px",
  fontFamily: "Poppins",
};

export default PendingSales;
