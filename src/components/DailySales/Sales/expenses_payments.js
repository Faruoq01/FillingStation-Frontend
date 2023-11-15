import React, { useEffect } from "react";
import BarChartGraph from "../../common/BarChartGraph";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import ApproximateDecimal from "../../common/approx";
import { expenses } from "../../../storage/dailysales";
import { useCallback } from "react";
import APIs from "../../../services/connections/api";
import DateRangeLib from "../../common/DatePickerLib";

const mobile = window.matchMedia("(max-width: 1150px)");

const ExpensesAndPayments = () => {
  const user = useSelector((state) => state.auth.user);
  const updatedDate = useSelector((state) => state.dashboard.dateRange);
  const expenseData = useSelector((state) => state.dailysales.expenses);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const salesShift = useSelector((state) => state.dailysales.salesShift);
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

  const getExpenses = useCallback((station, date, salesShift) => {
    setLoad(true);

    const payload = {
      outletID: station === null ? "None" : station._id,
      organisationID: resolveUserID().id,
      start: date[0],
      end: date[1],
      shift: salesShift,
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
    getExpenses(oneStationData, updatedDate, salesShift);
  }, [getExpenses, oneStationData, updatedDate, salesShift]);

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
          {mobile.matches || (
            <div style={sales}>
              <DateRangeLib sales={true} mt={mobile.matches ? "10px" : "0px"} />
            </div>
          )}
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
