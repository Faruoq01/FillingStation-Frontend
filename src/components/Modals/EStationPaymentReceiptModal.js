import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ThreeDots } from "react-loader-spinner";
import "../../styles/estation/payment.scss";
import CloseIcon from "@mui/icons-material/Close";

const EStationPaymentReceiptModal = (props) => {
  const handleClose = () => props.close(false);
  const mobile = useMediaQuery("(max-width:900px)");

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", border: "none" }}
    >
      <div className="e-station-reciept-modal">
        <div className="cancel-confirm">
          <label for="Confirm Payment" className="title-label-">
            Confirm Payment
          </label>
          <CloseIcon className="icon-m-close" onClick={handleClose} size={25} />
        </div>
        <div className="reciept-img">
          <img
            src={require("../../assets/estation/reciept.svg").default}
            alt=""
          />
        </div>
        <div className="footer-section-p">
          <button className="footer-btn-p">Confirm</button>
          <button onClick={handleClose} className="footer-btn-p">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

const inner = {
  width: "100%",
  height: "500px",
  overflowY: "scroll",
};

const styles = (_mobile) => ({
  container: {
    height: _mobile ? 100 : 150,
    width: _mobile ? "80%" : "30%",
    backgroundColor: "white",

    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
  },
  buttonWrap: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: _mobile ? 10 : 20,
  },
  title: {
    textAlign: "center",
    margin: _mobile ? 10 : 20,
    fontFamily: "poppin",
    fontWeight: 600,
    fontSize: _mobile ? 18 : 21,
  },
  button: {
    width: "45%",
    height: 40,
    cursor: "pointer",
    border: "none",
    borderRadius: 20,
    fontFamily: "poppin",
    fontSize: 18,
    color: "#ffffff",
  },
  load: {
    width: "100%",
    height: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EStationPaymentReceiptModal;
