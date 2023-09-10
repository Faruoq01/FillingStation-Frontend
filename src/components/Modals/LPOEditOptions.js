import React, { useState } from "react";
import { useSelector } from "react-redux";
import close from "../../assets/close.png";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import "../../styles/lpo.scss";
import LPOService from "../../services/360station/lpo";
import { useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

const LPOEditOptions = ({ handleEditDetails, handleEditRate, ...props }) => {
  const mobile = useMediaQuery("(max-width:900px)");
  const handleClose = () => props.close(false);

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={style(mobile).inner}>
        <button
          onClick={handleEditRate}
          style={{
            ...style(mobile).button,
            marginBottom: 4,
          }}
        >
          Edit Product Rate
        </button>
        <button
          onClick={handleEditDetails}
          style={{
            ...style(mobile).button,
          }}
        >
          Edit Product Details
        </button>
      </div>
    </Modal>
  );
};

const style = (_mobile) => ({
  inner: {
    width: 200,
    backgroundColor: "white",
    borderRadius: 4,
    position: "absolute",
    padding: 5,
    right: 0,
    border: 0,
    marginTop: _mobile ? "20rem" : undefined,
    display: "flex",
    flexDirection: "column",
    marginRight: "4%",
  },
  button: {
    height: 40,
    width: "100%",
    cursor: "pointer",
    background: "cyan",
    border: "none",
    borderRadius: 5,
    backgroundColor: "#06805b",
    color: "white",
    justifyContent: "space-around",
  },
});

export default LPOEditOptions;
