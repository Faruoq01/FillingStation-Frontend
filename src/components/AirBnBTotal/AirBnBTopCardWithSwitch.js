import React, { useState } from "react";
import "../../styles/estation/airbnb.scss";
import { Button, Switch } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import ApproximateDecimal from "../common/approx";

export default function AirBnBTopCardWithSwitch({ ...props }) {
  const [switchState, setSwitchState] = useState(false);
  const singleLPO = useSelector((state) => state.lpoReducer.singleLPO);

  const openCreditModal = () => {
    props.modal(true);
  };
  return (
    <div className="airbnb-card-top">
      <div className="airbnb-card-top-sub">
        <img src={props.icon} alt="walet" />
        <div className="txt-wrap">
          <span>
            {switchState
              ? `NGN ${ApproximateDecimal(singleLPO.currentBalance)}`
              : `NGN *******`}
          </span>
          <div className="switch-txt">
            <label>Account Balance</label>
            <Switch onChange={() => setSwitchState(!switchState)} />
          </div>
        </div>
      </div>
      <div className="airbnb-card-top-sub">
        <Button onClick={openCreditModal} sx={paymentButton}>
          <AddIcon sx={size} />
          <div>Register Payment</div>
        </Button>
      </div>
    </div>
  );
}

const size = {
  width: "20px",
  height: "20px",
  marginRight: "5px",
};

const paymentButton = {
  width: "150px",
  height: "35px",
  background: "#f7f7f7",
  textTransform: "capitalize",
  color: "#000",
  fontSize: "12px",
  marginTop: "10px",
  "&:hover": {
    background: "#f7f7f7",
  },
};
