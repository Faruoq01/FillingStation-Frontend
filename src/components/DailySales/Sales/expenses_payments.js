import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import BarChartGraph from "../../common/BarChartGraph";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Skeleton, Stack } from "@mui/material";
import { dateRange } from "../../../storage/dashboard";
import swal from "sweetalert";
import ApproximateDecimal from "../../common/approx";
import ButtonDatePicker from "../../common/CustomDatePicker";

const ExpensesAndPayments = () => {
  const moment = require("moment-timezone");
  const date2 = moment().format("YYYY-MM-DD").split(" ")[0];

  const [value, setValue] = React.useState(null);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const [load, setLoads] = useState(false);

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

  const convertDate = (newValue) => {
    const getDate = newValue === "" ? date2 : newValue.format("MM/DD/YYYY");
    const date = new Date(getDate);
    const toString = date.toDateString();
    const [day, year, month] = toString.split(" ");
    const finalDate = `${day} ${month} ${year}`;

    return finalDate;
  };

  const updateDate = (newValue) => {
    if (!getPerm("4")) return swal("Warning!", "Permission denied", "info");
    setValue(newValue);

    const getDate = newValue === "" ? date2 : newValue.format("YYYY-MM-DD");
    setLoads(true);
    // dispatch(currentDateValue(newValue));
    dispatch(dateRange([new Date(getDate), new Date(getDate)]));
  };

  const goToPagesInd = (data) => {
    if (data === "exp") return history.push("/home/analysis/expenses");
    if (data === "pay") return history.push("/home/analysis/payments");
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
                  label={`${value === null || "" ? date2 : convertDate(value)}`}
                  value={value}
                  disabled={load}
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
              <div>N {ApproximateDecimal(0)}</div>
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
              <div>N {ApproximateDecimal(0)}</div>
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
