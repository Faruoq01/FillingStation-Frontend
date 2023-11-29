import * as React from "react";
import Stack from "@mui/material/Stack";
import "../../styles/newSales.scss";
import { MenuItem, Select } from "@mui/material";
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
import Navigation from "../DailyRecordSales/navigation";
import { Outlet, useNavigate } from "react-router-dom";
import StepperComponent from "../../components/DailyRecordSales/stepper";

const mediaMatch = window.matchMedia("(max-width: 450px)");

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
  const currentShift = useSelector((state) => state.recordsales.currentShift);
  const [defaultState, setDefault] = useState(0);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [pages, setPages] = useState(1);
  const navigate = useNavigate();

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

  const changeMenu = async (index, item) => {
    if (!getPerm("1") && item === null)
      return swal("Warning!", "Permission denied", "info");
    navigate('/home/recordsales/pumpupdate/0');
    setDefault(index);
    dispatch(changeStation());
    dispatch(adminOutlet(item));
    setPending(true);
    getAllRecordDetails(item, currentDate);
  };

  const updateDate = (newValue) => {
    if (oneStationData === null)
      return swal("Warning!", "Please select station first", "info");
    navigate('/home/recordsales/pumpupdate/0');

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

    const salesPayload = {
      outletID: station._id,
      organizationID: station.organisation,
      date: getDate,
      shift: currentShift
    }

    const stationPumps = OutletService.getAllStationPumps(payload);
    const stationTanks = APIs.post("/daily-sales/all-tanks", payload);
    const currentSales = APIs.post("/sales/current-sales", salesPayload);
    const orgLpo = LPOService.getAllLPO(payload);

    Promise.all([stationPumps, stationTanks, orgLpo, currentSales]).then((data) => {
      const [pumps, tanks, lpo, currentSales] = data;
      const salesData = currentSales.data.data;

      ///////////////// station pumps //////////////////////
      const copyData = JSON.parse(JSON.stringify(pumps));
      const updated = copyData.map((data) => {
        let pumps = { ...data };
        const pumpSales = salesData.find(sale => {
          const copy = JSON.parse(JSON.stringify(sale));
          return copy.pumpID === data._id
        });

        return {
          ...pumps,
          identity: null,
          closingMeter: 0,
          newTotalizer: "Enter closing meter",
          RTlitre: 0,
          sales: 0,
          pumpSales: pumpSales? pumpSales: null,
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
          dipping: 0,
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

      <StepperComponent />
      <Outlet />
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

const sales = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  position: "relative",
  alignItems: "flex-start",
};

export default DailyRecordSales;
