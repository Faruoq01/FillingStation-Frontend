import React, { useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import BarChartGraph from "../../common/BarChartGraph";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useHistory, useNavigate } from "react-router-dom";
import { Skeleton, Stack } from "@mui/material";
import { dateRange } from "../../../storage/dashboard";
import swal from "sweetalert";
import ApproximateDecimal from "../../common/approx";
import ButtonDatePicker from "../../common/CustomDatePicker";
import {
  setDateValue,
  expenses,
  setLocaleDate,
} from "../../../storage/dailysales";
import { useCallback } from "react";
import APIs from "../../../services/connections/api";

const ExpensesAndPayments = () => {
  const moment = require("moment-timezone");
  const date2 = moment().format("Do MMM YYYY");
  const [initial, setInitial] = useState("");

  const [value, setValue] = React.useState(null);
  const user = useSelector((state) => state.auth.user);
  const updatedDate = useSelector((state) => state.dailysales.updatedDate);
  const localeDate = useSelector((state) => state.dailysales.localeDate);
  const expenseData = useSelector((state) => state.dailysales.expenses);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);

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

  useEffect(() => {
    if (updatedDate === "" || localeDate === "") {
      setInitial(date2);
    } else {
      const formatedDate = moment(updatedDate).format("Do MMM YYYY");
      setInitial(formatedDate);
      setValue(localeDate);
    }
  }, [date2, localeDate, moment, updatedDate]);

  const getExpenses = useCallback((station, date) => {
    setLoad(true);
    const today = moment().format("YYYY-MM-DD").split(" ")[0];

    const payload = {
      outletID: station === null ? "None" : station._id,
      organisationID: resolveUserID().id,
      start: date === "" ? today : date,
      end: date === "" ? today : date,
    };

    APIs.post("/daily-sales/expenses-payments", payload)
      .then(({ data }) => {
        dispatch(expenses(data.expenses));
      })
      .then(() => {
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getExpenses(oneStationData, updatedDate);
  }, [getExpenses, oneStationData, updatedDate]);

  const convertDate = (newValue) => {
    const getDate = newValue === "" ? initial : newValue.format("Do MMM YYYY");
    return getDate;
  };

  const updateDate = (newValue) => {
    if (!getPerm("3")) return swal("Warning!", "Permission denied", "info");
    setValue(newValue);

    const getDate = newValue === "" ? initial : newValue.format("YYYY-MM-DD");
    dispatch(setDateValue(getDate));
    dispatch(setLocaleDate(newValue));
    dispatch(dateRange([getDate, getDate]));
  };

  const goToPagesInd = (data) => {
    if (data === "exp") return navigate("/home/analysis/expenses");
    if (data === "pay") return navigate("/home/analysis/payments");
  };

  return (
    <React.Fragment>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}>
        <div>
          <div style={sales}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={1}>
                <ButtonDatePicker
                  label={`${
                    value === null || "" ? initial : convertDate(value)
                  }`}
                  value={value}
                  onChange={(newValue) => updateDate(newValue)}
                />
              </Stack>
            </LocalizationProvider>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "10px" }} className="expen">
        <div
          onClick={() => {
            goToPagesInd("exp");
          }}
          style={{ background: "#108CFF" }}
          className="child">
          {load ? (
            <Skeleton
              sx={{ borderRadius: "5px", background: "#f7f7f7" }}
              animation="wave"
              variant="rectangular"
              width={"100%"}
              height={105}
            />
          ) : (
            <div className="ins">
              <div>Expenses</div>
              <div>N {ApproximateDecimal(expenseData.expenses)}</div>
            </div>
          )}
        </div>
        <div
          onClick={() => {
            goToPagesInd("pay");
          }}
          style={{ background: "#06805B" }}
          className="child">
          {load ? (
            <Skeleton
              sx={{ borderRadius: "5px", background: "#f7f7f7" }}
              animation="wave"
              variant="rectangular"
              width={"100%"}
              height={105}
            />
          ) : (
            <div className="ins">
              <div>Payments</div>
              <div>N {ApproximateDecimal(expenseData.payments)}</div>
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          color: user.isDark === "0" ? "#000" : "#fff",
          marginTop: "30px",
        }}
        className="tank-text">
        Expenses And Payments
      </div>
      <BarChartGraph />
    </React.Fragment>
  );
};

const sales = {
  width: "100%",
  height: "35px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  position: "relative",
  alignItems: "flex-start",
};

export default ExpensesAndPayments;
