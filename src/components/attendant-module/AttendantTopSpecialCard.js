import React from "react";
import "./attendance.scss";
export default function AttendantTopSpecialCard({ ...props }) {
  return (
    <div className="attendant-card-top">
      <div className="airbnb-card-top-sub">
        {/* <img src={props.icon} alt="walet" /> */}
        <div className="txt-wrap">
          <span style={{ color: " #404141", fontSize: 15, fontWeight: "bold" }}>
            Sell a product
            <label
              style={{
                color: "#186B52",
                fontWeight: "bold",
                fontSize: 15,
                marginLeft: 3,
              }}
            >
              order
            </label>
          </span>
          <label
            style={{ color: " #404141", fontSize: 15, fontWeight: "bold" }}
          >
            for our customers
          </label>
        </div>
        <div
          style={{ width: 120, height: 120, position: "absolute", right: 0 }}
        >
          <img
            style={{ width: "100%", height: "100%" }}
            src={require("../../assets/attendance/pump-nuzz.png")}
          />
        </div>
      </div>
      <div className="airbnb-card-top-sub">
        {props.chip && (
          <div className="below_">
            <label for="Register Payment">{"-"}Sell Product</label>
          </div>
        )}
      </div>
    </div>
  );
}
