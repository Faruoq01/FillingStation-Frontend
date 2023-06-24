import React from "react";
import "../../styles/attendant/attendance.scss";
export default function AttendantTopCard({ ...props }) {
  return (
    <div className="attendant-card-top">
      <div className="airbnb-card-top-sub">
        <img src={props.icon} alt="walet" />
        <div className="txt-wrap">
          <span>{props.amount ?? "$20,345"}</span>
          <label>{props.title ?? "Wallet Balance"}</label>
        </div>
      </div>
      <div className="airbnb-card-top-sub">
        {props.chip && (
          <div className="below_">
            {"+"}
            <label for="Register Payment">Register Payment</label>
          </div>
        )}
      </div>
    </div>
  );
}
