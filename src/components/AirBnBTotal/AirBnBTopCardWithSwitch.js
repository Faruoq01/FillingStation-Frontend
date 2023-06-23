import React, { useState } from "react";
import "./airbnb.scss";
import { Switch } from "@mui/material";
export default function AirBnBTopCardWithSwitch({ ...props }) {
  const [switchState, setSwitchState] = useState(false);
  return (
    <div className="airbnb-card-top">
      <div className="airbnb-card-top-sub">
        <img src={props.icon} alt="walet" />
        <div className="txt-wrap">
          <span>{switchState ? props.amount : "NGN *******"}</span>
          <div className="switch-txt">
            <label>Wallet Balance</label>
            <Switch onChange={() => setSwitchState(!switchState)} />
          </div>
        </div>
      </div>
      <div className="airbnb-card-top-sub"></div>
    </div>
  );
}
