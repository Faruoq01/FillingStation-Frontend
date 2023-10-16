import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import SanitizerIcon from "@mui/icons-material/Sanitizer";
import PropaneTankIcon from "@mui/icons-material/PropaneTank";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";
import PaidIcon from "@mui/icons-material/Paid";
import AddCardIcon from "@mui/icons-material/AddCard";
import "../../styles/newSales.scss";
import { Button, IconButton, MenuItem, Select } from "@mui/material";
import PumpUpdateComponent from "../DailyRecordSales/PumpUpdateComponent";
import LPOComponent from "../DailyRecordSales/LPOComponent";
import ExpenseComponents from "../DailyRecordSales/ExpenseComponents";
import PaymentsComponents from "../DailyRecordSales/PaymentComponents";
import ReturnToTankComponent from "../DailyRecordSales/ReturnToTankComponent";
import DippingComponents from "../DailyRecordSales/DippingComponents";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  bankPayload,
  creditPayload,
  creditPayloadObject,
  dippingPayload,
  expensesPayload,
  lpoPayload,
  posPayload,
  rtPayload,
  salesPayload,
  tankList,
  tanksPayload,
  updateRecords,
  updateSelectedPumps,
  updateSelectedTanks,
} from "../../storage/recordsales";
import { useSelector } from "react-redux";
import OutletService from "../../services/360station/outletService";
import { adminOutlet, getAllPumps, getAllStations } from "../../storage/outlet";
import LPOService from "../../services/360station/lpo";
import { createLPO } from "../../storage/recordsales";
import Backdrop from "@mui/material/Backdrop";
import { BallTriangle } from "react-loader-spinner";
import { useState } from "react";
import SummaryRecord from "../Modals/SummaryRecord";
import { changeDate, changeStation } from "../../storage/recordsales";
import swal from "sweetalert";
import ButtonDatePicker from "../common/CustomDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import PendingSales from "../Modals/PendingSales";
import moment from "moment";
import APIs from "../../services/connections/api";
import { daySupply } from "../../storage/supply";
import { useCallback } from "react";

const mediaMatch = window.matchMedia("(max-width: 450px)");

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 40,
  height: 40,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  fontSize: "11px",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <SanitizerIcon />,
    2: <AssignmentReturnedIcon />,
    3: <CreditScoreIcon />,
    4: <PaidIcon />,
    5: <AddCardIcon />,
    6: <PropaneTankIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const steps = [
  "Pump Update",
  "Return to Tank",
  "LPO",
  "Expenses",
  "Payments",
  "Dipping",
];

const DailyRecordSales = () => {
  const date = new Date();
  const toString = date.toDateString();
  const [month, day, year] = toString.split(" ");
  const date2 = `${day} ${month} ${year}`;
  const [value, setValue] = React.useState(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const currentDate = useSelector((state) => state.recordsales.currentDate);
  const tankListData = useSelector((state) => state.recordsales.tankList);
  const [defaultState, setDefault] = useState(0);
  const [open, setOpen] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);
  const [pending, setPending] = useState(false);
  const [pages, setPages] = useState(1);

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
    return user.permission?.recordSales[e];
  };

  const getAllInitialRecords = React.useCallback(
    () => {
      const payload = {
        organisation: resolveUserID().id,
      };

      OutletService.getAllOutletStations(payload).then((data) => {
        dispatch(getAllStations(data.station));
        if (
          (getPerm("0") || user.userType === "superAdmin") &&
          oneStationData === null
        ) {
          if (!getPerm("1")) setDefault(1);
          dispatch(adminOutlet(null));
          dispatch(getAllPumps([]));
          dispatch(changeStation());
          return "None";
        } else {
          if (user.userType === "staff") {
            OutletService.getOneOutletStation({ outletID: user.outletID }).then(
              (data) => {
                dispatch(adminOutlet(data.station));
                dispatch(changeStation());
                changeMenu(0, data.station);
              }
            );
            return user.outletID;
          }
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const resetAllVariables = useCallback(() => {
    dispatch(updateSelectedPumps([]));
    dispatch(updateSelectedTanks([]));
    dispatch(
      salesPayload({
        sales: [],
        tanks: [],
        pumps: [],
      })
    );
    dispatch(rtPayload([]));
    dispatch(lpoPayload([]));
    dispatch(creditPayload([]));
    dispatch(creditPayloadObject({}));
    dispatch(expensesPayload([]));
    dispatch(bankPayload([]));
    dispatch(posPayload([]));
    dispatch(dippingPayload([]));
    dispatch(tanksPayload([]));
    dispatch(tankList([]));
    dispatch(daySupply([]));
    dispatch(getAllPumps([]));
    dispatch(changeStation());
  }, [dispatch]);

  useEffect(() => {
    resetAllVariables();
    return () => dispatch(changeDate(""));
  }, [dispatch, oneStationData, resetAllVariables]);

  useEffect(() => {
    getAllInitialRecords();
  }, [dispatch, getAllInitialRecords]);

  const nextQuestion = () => {
    if (pages <= 6) {
      if (oneStationData === null)
        return swal("Warning!", "Please select a station first", "info");
      if (!getPerm("3") && pages === 1)
        return swal("Warning!", "Permission denied", "info");
      if (!getPerm("4") && pages === 2)
        return swal("Warning!", "Permission denied", "info");
      if (!getPerm("5") && pages === 3)
        return swal("Warning!", "Permission denied", "info");
      if (!getPerm("6") && pages === 4)
        return swal("Warning!", "Permission denied", "info");
      if (!getPerm("7") && pages === 5)
        return swal("Warning!", "Permission denied", "info");

      setPages((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (pages >= 1) {
      setPages((prev) => prev - 1);
    }
  };

  const finishAndSubmit = () => {
    if (!getPerm("8") && pages === 6)
      return swal("Warning!", "Permission denied", "info");

    setOpenSummary(true);
  };

  const changeMenu = async (index, item) => {
    if (!getPerm("1") && item === null)
      return swal("Warning!", "Permission denied", "info");
    setPages(1);
    setDefault(index);
    dispatch(changeStation());
    dispatch(adminOutlet(item));
    setPending(true);
    getAllRecordDetails(item, currentDate);
  };

  // const updateTanksWithSupplies = (tankListData, daySupply) => {
  //   if (daySupply.length === 0 || tankListData.length === 0) {
  //     dispatch(tankList(tankListData));
  //   } else {
  //     const copyTanks = JSON.parse(JSON.stringify(tankListData));
  //     for (const supply of daySupply) {
  //       const recipient = Object.values(supply.recipientTanks);
  //       for (const tank of recipient) {
  //         const findID = copyTanks.findIndex((data) => data._id === tank.id);
  //         if (findID !== -1) {
  //           const newLevel =
  //             Number(copyTanks[findID].currentLevel) + Number(tank.quantity);
  //           copyTanks[findID] = {
  //             ...copyTanks[findID],
  //             currentLevel: newLevel,
  //           };
  //         }
  //       }
  //     }
  //     dispatch(tankList(copyTanks));
  //   }
  // };

  const updateDate = (newValue) => {
    if (oneStationData === null)
      return swal("Warning!", "Please select station first", "info");
    setPages(1);

    if (tankListData.length === null)
      return swal(
        "Warning!",
        "Please check your network settings or reload",
        "info"
      );
    if (!getPerm("2")) return swal("Warning!", "Permission denied", "info");
    setValue(newValue);
    setPending(true);
    dispatch(changeStation());
    const today = moment().format("YYYY-MM-DD").split(" ")[0];
    const getDate = newValue === "" ? today : newValue.format("YYYY-MM-DD");
    return getDate;
  };

  const getAllRecordDetails = (station, date) => {
    const today = moment().format("YYYY-MM-DD").split(" ")[0];
    const getDate = date === "" ? today : date;

    const payload = {
      outletID: station._id,
      organisationID: station.organisation,
    };

    const stationPumps = OutletService.getAllStationPumps(payload);
    // const stationTanks = OutletService.getAllOutletTanks(payload);
    const stationTanks = APIs.post("/daily-sales/all-tanks", payload);

    const orgLpo = LPOService.getAllLPO(payload);
    const supply = APIs.post("/supply/dayRecord", {
      ...payload,
      createdAt: getDate,
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
          beforeSales: data.afterSales,
          previousLevel: data.beforeSales,
          currentLevel: data.afterSales,
          afterSales: 0,
          RTlitre: 0,
        };
        return newData;
      });

      ///////////////// station lpo //////////////////////
      dispatch(createLPO(lpo.lpo.lpo));

      ///////////////// station supplies /////////////////
      dispatch(daySupply(supply.data.supply));
      dispatch(tankList(outletTanks));
      dispatch(changeDate(date));
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

  return (
    <div className="salesRecordStyle">
      {openSummary && (
        <SummaryRecord
          setPages={setPages}
          refresh={getAllInitialRecords}
          clops={setOpen}
          open={openSummary}
          close={setOpenSummary}
        />
      )}
      {pending && (
        <PendingSales
          date={setValue}
          pages={setPages}
          open={pending}
          close={setPending}
        />
      )}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        // onClick={handleClose}
      >
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#fff"
          ariaLabel="ball-triangle-loading"
          wrapperClass={{}}
          wrapperStyle=""
          visible={true}
        />
      </Backdrop>
      <div
        style={{
          width: "90%",
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}>
        <div>
          {getPerm("0") && (
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={defaultState}
              sx={selectStyle2}>
              <MenuItem style={menu} value={0}>
                Select Station
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
          {getPerm("0") || (
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={0}
              sx={selectStyle2}
              disabled>
              <MenuItem style={menu} value={0}>
                {!getPerm("0")
                  ? oneStationData?.outletName + ", " + oneStationData?.alias
                  : "No station created"}
              </MenuItem>
            </Select>
          )}
        </div>
        <div>
          <div style={sales}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={1}>
                <ButtonDatePicker
                  label={`${value == null || "" ? date2 : convertDate(value)}`}
                  value={value}
                  onChange={(newValue) => updateDate(newValue)}
                />
              </Stack>
            </LocalizationProvider>
          </div>
        </div>
      </div>

      <div className="steps">
        <Stack sx={{ width: "100%", marginTop: "20px" }} spacing={4}>
          <Stepper
            alternativeLabel
            activeStep={pages - 1}
            connector={<ColorlibConnector />}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Stack>
      </div>

      <div className="ttx" style={text}>
        {steps[pages - 1]}
      </div>

      <div className="mob">
        <IconButton>
          {/* <ArrowCircleLeftIcon sx={{width:'50px', height:'50px', marginLeft:'2%'}} /> */}
        </IconButton>

        <div className="icons">
          <div
            className="cont"
            style={{
              backgroundImage:
                pages >= 1
                  ? "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)"
                  : "linear-gradient( 136deg, #ccc 0%, #ccc 50%, #ccc 100%)",
            }}>
            <SanitizerIcon sx={{ color: "#fff" }} />
          </div>

          <div
            className="cont"
            style={{
              backgroundImage:
                pages >= 2
                  ? "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)"
                  : "linear-gradient( 136deg, #ccc 0%, #ccc 50%, #ccc 100%)",
            }}>
            <AssignmentReturnedIcon sx={{ color: "#fff" }} />
          </div>

          <div
            className="cont"
            style={{
              backgroundImage:
                pages >= 3
                  ? "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)"
                  : "linear-gradient( 136deg, #ccc 0%, #ccc 50%, #ccc 100%)",
            }}>
            <CreditScoreIcon sx={{ color: "#fff" }} />
          </div>

          <div
            className="cont"
            style={{
              backgroundImage:
                pages >= 4
                  ? "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)"
                  : "linear-gradient( 136deg, #ccc 0%, #ccc 50%, #ccc 100%)",
            }}>
            <PaidIcon sx={{ color: "#fff" }} />
          </div>

          <div
            className="cont"
            style={{
              backgroundImage:
                pages >= 5
                  ? "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)"
                  : "linear-gradient( 136deg, #ccc 0%, #ccc 50%, #ccc 100%)",
            }}>
            <AddCardIcon sx={{ color: "#fff" }} />
          </div>

          <div
            className="cont"
            style={{
              backgroundImage:
                pages === 6
                  ? "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)"
                  : "linear-gradient( 136deg, #ccc 0%, #ccc 50%, #ccc 100%)",
            }}>
            <PropaneTankIcon sx={{ color: "#fff" }} />
          </div>
        </div>

        <IconButton>
          {/* <ArrowCircleRightIcon sx={{width:'50px', height:'50px', marginRight:'2%'}} /> */}
        </IconButton>
      </div>

      <div className="form-body">
        {pages === 1 && <PumpUpdateComponent />}
        {pages === 2 && <ReturnToTankComponent />}
        {pages === 3 && <LPOComponent />}
        {pages === 4 && <ExpenseComponents />}
        {pages === 5 && <PaymentsComponents />}
        {pages === 6 && <DippingComponents />}
      </div>

      <div className="navs">
        <div>
          {pages > 1 && (
            <Button
              variant="contained"
              sx={{
                width: "100px",
                height: "30px",
                background: "#054834",
                fontSize: "13px",
                borderRadius: "5px",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#054834",
                },
              }}
              onClick={prevQuestion}>
              Previous
            </Button>
          )}
        </div>

        {pages < 6 && (
          <Button
            variant="contained"
            sx={{
              width: "140px",
              height: "30px",
              background: "#054834",
              fontSize: "13px",
              borderRadius: "5px",
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#054834",
              },
            }}
            onClick={nextQuestion}>
            Save & Proceed
          </Button>
        )}

        {pages === 6 && (
          <Button
            variant="contained"
            sx={{
              width: "140px",
              height: "30px",
              background: "#054834",
              fontSize: "13px",
              borderRadius: "5px",
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: "#054834",
              },
            }}
            onClick={finishAndSubmit}>
            Finish
          </Button>
        )}
      </div>
    </div>
  );
};

const menu = {
  fontSize: "12px",
};

const selectStyle2 = {
  width: mediaMatch.matches ? "170px" : "200px",
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

const text = {
  width: "96%",
  textAlign: "left",
  fontSize: "12px",
  marginTop: "30px",
  marginLeft: "4%",
  fontWeight: "bold",
};

const sales = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  position: "relative",
  alignItems: "flex-start",
};

export default DailyRecordSales;
