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
import { adminOutlet, getAllPumps } from "../../storage/outlet";
import { useState } from "react";
import { changeDate, changeStation } from "../../storage/recordsales";
import swal from "sweetalert";
import ButtonDatePicker from "../common/CustomDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import PendingSales from "../Modals/PendingSales";
import moment from "moment";
import { daySupply } from "../../storage/supply";
import { useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import StepperComponent from "../../components/DailyRecordSales/stepper";
import APIs from "../../services/connections/api";

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
  const tankListData = useSelector((state) => state.recordsales.tankList);
  const [defaultState, setDefault] = useState(0);
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.recordSales[e];
  };

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
    dispatch(updateRecords({ pms: [], ago: [], dpk: [] }));
  }, [dispatch]);

  useEffect(() => {
    resetAllVariables();
    return () => {
      resetAllVariables();
      dispatch(changeDate(""));
    }
  }, [dispatch, oneStationData, resetAllVariables]);

  const changeMenu = async (index, item) => {
    if (!getPerm("1") && item === null)
      return swal("Warning!", "Permission denied", "info");
    navigate('/home/recordsales/pumpupdate/0');
    setDefault(index);
    dispatch(changeStation());
    dispatch(adminOutlet(item));
    setPending(true);
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

  const convertDate = (newValue) => {
    const getDate = newValue === "" ? date2 : newValue.format("MM/DD/YYYY");
    const date = new Date(getDate);
    const toString = date.toDateString();
    const [day, year, month] = toString.split(" ");
    const finalDate = `${day} ${month} ${year}`;

    return finalDate;
  };

  useEffect(()=>{
    if(oneStationData !== null){
      setPending(true);
    }else{
      navigate("/home/recordsales/pumpupdate/0");
    }
  }, [])

  return (
    <div className="salesRecordStyle">
      {pending && (
        <PendingSales
          date={setValue}
          open={pending}
          close={setPending}
        />
      )}
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
