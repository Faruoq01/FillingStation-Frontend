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
              style={{ color: "#186B52", fontWeight: "bold", fontSize: 15 }}
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
