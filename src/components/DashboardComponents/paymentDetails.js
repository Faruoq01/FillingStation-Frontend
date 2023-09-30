import { Skeleton } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ApproximateDecimal from "../common/approx";
import me6 from "../../assets/me6.png";
import APIs from "../../services/connections/api";
import { paymentsDetails } from "../../storage/dashboard";
import { useEffect } from "react";

const PaymentDetails = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updatedDate = useSelector((state) => state.dashboard.dateRange);
  const salesShift = useSelector((state) => state.dailysales.salesShift);
  const paymentsDetailData = useSelector(
    (state) => state.dashboard.paymentsDetails
  );
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getPaymentDetails = useCallback((date, station, salesShift) => {
    setLoad(true);

    const payload = {
      outletID: station === null ? "None" : station._id,
      organisation: resolveUserID().id,
      start: date[0],
      end: date[1],
      shift: salesShift,
    };

    APIs.post("/dashboard/payments", payload)
      .then(({ data }) => {
        dispatch(paymentsDetails(data.paymentsDetails));
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
    getPaymentDetails(updatedDate, oneStationData, salesShift);
  }, [getPaymentDetails, oneStationData, updatedDate, salesShift]);

  const goToPayments = () => {
    navigate("/home/dailysales/outstanding");
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
                  NGN {ApproximateDecimal(paymentsDetailData.netToBank)}
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
                  NGN {ApproximateDecimal(paymentsDetailData.bankPayments)}
                </div>
                <div
                  style={{
                    color: "red",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                  className="item-count">
                  NGN{" "}
                  {ApproximateDecimal(paymentsDetailData.outstandingBalance)}
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
                  NGN {ApproximateDecimal(paymentsDetailData.posPayments)}
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
