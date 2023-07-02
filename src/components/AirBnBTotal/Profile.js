import React from "react";
import "../../styles/estation/airbnb.scss";
import { Avatar } from "@mui/material";
import { Button } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";

export default function Profile({ ...props }) {
  return (
    <div className="airbnb-card-top">
      <div className="airbnb-card-top-sub">
        <Avatar />
        <div className="txt-wrap">
          <span>{props.name}</span>
          <label>{props.position}</label>
        </div>
      </div>
      <div className="airbnb-card-top-sub">
        <Button sx={paymentButton}>
          <SortIcon sx={size} />
          <div>View Transactions</div>
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
