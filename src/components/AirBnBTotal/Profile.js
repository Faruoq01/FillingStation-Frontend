import React from "react";
import "../../styles/estation/airbnb.scss";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";

export default function Profile({ ...props }) {
  const singleLPO = useSelector((state) => state.lpoReducer.singleLPO);
  const openCreditModal = () => {
    props.modal(true);
  };

  return (
    <div className="airbnb-card-top">
      <div className="airbnb-card-top-sub">
        <img src={props.icon} alt="walet" />
        <div className="txt-wrap">
          <span>{`NGN ${singleLPO.creditBalance}`}</span>
          <label>Credit Balance</label>
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
  marginTop: "30px",
  "&:hover": {
    background: "#f7f7f7",
  },
};
