import { Skeleton } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ApproximateDecimal from "../common/approx";
import me6 from "../../assets/me6.png";

const PaymentDetails = () => {
  const user = useSelector((state) => state.auth.user);
  const paymentsDetails = useSelector(
    (state) => state.dashboard.paymentsDetails
  );
  const history = useHistory();
  const [load, setLoad] = useState(false);

  const goToPayments = () => {
    history.push("/home/analysis/payments");
  };

  return (
    <React.Fragment>
      <div
        style={{
          marginTop: "40px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          color: user.isDark === "0" ? "#000" : "#fff",
          fontSize: "15px",
        }}
        className="bank">
        <span>Net to Bank</span>
        <span>Payments</span>
        <span>Outstanding</span>
      </div>
      <div
        onClick={goToPayments}
        style={{ height: "110px", marginTop: "0px" }}
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
          <div className="inner-content">
            <div className="conts">
              <div className="row-count">
                <div
                  style={{
                    color: "green",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                  className="item-count">
                  NGN {ApproximateDecimal(paymentsDetails.netToBank)}
                </div>
                <div
                  style={{
                    color: "#0872D4",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                  className="item-count">
                  Teller
                </div>
                <div
                  style={{
                    color: "#0872D4",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                  className="item-count">
                  NGN {ApproximateDecimal(paymentsDetails.bankPayments)}
                </div>
                <div
                  style={{
                    color: "red",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                  className="item-count">
                  NGN {ApproximateDecimal(paymentsDetails.outstandingBalance)}
                </div>
              </div>
              <div className="row-count">
                <div
                  style={{
                    color: "green",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                  className="item-count"></div>
                <div
                  style={{
                    color: "#000",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                  className="item-count">
                  POS
                </div>
                <div
                  style={{
                    color: "#000",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                  className="item-count">
                  NGN {ApproximateDecimal(paymentsDetails.posPayments)}
                </div>
                <div
                  style={{
                    color: "red",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                  className="item-count"></div>
              </div>
              <div style={{ marginTop: "10px" }} className="arrows">
                <div className="image">
                  <img
                    style={{
                      width: "20px",
                      height: "8px",
                      marginRight: "30px",
                    }}
                    src={me6}
                    alt="icon"
                  />
                </div>
                <div className="image">
                  <img
                    style={{
                      width: "20px",
                      height: "8px",
                      marginRight: "30px",
                    }}
                    src={me6}
                    alt="icon"
                  />
                </div>
                <div className="image">
                  <img
                    style={{
                      width: "20px",
                      height: "8px",
                      marginRight: "30px",
                    }}
                    src={me6}
                    alt="icon"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default PaymentDetails;
