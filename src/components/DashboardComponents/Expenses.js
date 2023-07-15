import { Skeleton } from "@mui/material";
import ApproximateDecimal from "../common/approx";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import expense from "../../assets/expense.png";
import swal from "sweetalert";

const Expenses = () => {
  const user = useSelector((state) => state.auth.user);
  const expenses = useSelector((state) => state.dashboard.expenses);
  const history = useHistory();
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

  const goToExpenses = () => {
    if (!getPerm("8")) return swal("Warning!", "Permission denied", "info");
    history.push("/home/analysis/expenses");
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
              NGN {ApproximateDecimal(expenses)}
            </span>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Expenses;
