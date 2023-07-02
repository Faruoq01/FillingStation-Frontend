import React from "react";
import "../../styles/estation/airbnb.scss";

export default function AirBnBTopCard({ ...props }) {
  return (
    <div className="airbnb-card-top">
      <div className="airbnb-card-top-sub">
        <img src={props.icon} alt="walet" />
        <div className="txt-wrap">
          <span>{props.amount}</span>
          <label>{props.title}</label>
        </div>
      </div>
      <div className="airbnb-card-top-sub"></div>
    </div>
  );
}
