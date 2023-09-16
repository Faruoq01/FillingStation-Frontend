import { Skeleton } from "@mui/material";
import ApproximateDecimal from "../common/approx";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import expense from "../../assets/expense.png";
import swal from "sweetalert";
import { useCallback } from "react";
import APIs from "../../services/connections/api";
import { useEffect } from "react";
import { expenses } from "../../storage/dashboard";

const Expenses = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const expenseData = useSelector((state) => state.dashboard.expenses);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updatedDate = useSelector((state) => state.dashboard.dateRange);
  const salesShift = useSelector((state) => state.dailysales.salesShift);
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
    return user.permission?.dashboard[e];
  };

  const getExpenses = useCallback((date, station, salesShift) => {
    setLoad(true);

    const payload = {
      outletID: station === null ? "None" : station._id,
      organisation: resolveUserID().id,
      start: date[0],
      end: date[1],
      shift: salesShift,
    };

    APIs.post("/dashboard/expenses", payload)
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
    getExpenses(updatedDate, oneStationData, salesShift);
  }, [getExpenses, oneStationData, updatedDate, salesShift]);

  const goToExpenses = () => {
    if (!getPerm("8")) return swal("Warning!", "Permission denied", "info");
    navigate("/home/analysis/expenses");
  };

  return (
    <React.Fragment>
      <div
        style={{
          marginTop: "30px",
          color: user.isDark === "0" ? "#000" : "#fff",
        }}
        className="bank">
        Expenses
      </div>
      <div
        onClick={goToExpenses}
        style={{ height: "110px" }}
        className="inner-section">
        {load ? (
          <Skeleton
            sx={{ borderRadius: "5px", background: "#f7f7f7" }}
            animation="wave"
            variant="rectangular"
            width={"100%"}
            height={90}
          />
        ) : (
          <div
            style={{
              backgroundImage: `url(${expense})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
            className="inner-content">
            <span
              style={{
                marginRight: "30px",
                fontSize: "12px",
                fontWeight: "900",
              }}>
              NGN {ApproximateDecimal(expenseData)}
            </span>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Expenses;
