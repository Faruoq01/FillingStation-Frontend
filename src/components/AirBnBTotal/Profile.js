import React, { useState } from "react";
import "../../styles/estation/airbnb.scss";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import EditCreditBalance from "../Modals/lpo/editcreditbalance";
import ApproximateDecimal from "../common/approx";

export default function Profile({ ...props }) {
  const singleLPO = useSelector((state) => state.lpo.singleLPO);
  const openCreditModal = () => {
    props.modal(true);
  };
  const [open, setOpen] = useState(false);

  const openEdit = () => {
    setOpen(true);
  };

  return (
    <div className="airbnb-card-top">
      {open && <EditCreditBalance open={open} close={setOpen} />}
      <div className="airbnb-card-top-sub">
        <img src={props.icon} alt="walet" />
        <div className="txt-wrap">
          <span style={iconContainer}>
            {`NGN ${ApproximateDecimal(singleLPO.creditBalance)}`}{" "}
            <DriveFileRenameOutlineIcon onClick={openEdit} sx={icon} />
          </span>
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

const icon = {
  marginLeft: "10px",
};

const iconContainer = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
};

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
