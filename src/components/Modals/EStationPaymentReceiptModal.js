import React from "react";
import Modal from "@mui/material/Modal";
import useMediaQuery from "@mui/material/useMediaQuery";
import "../../styles/estation/payment.scss";
import CloseIcon from "@mui/icons-material/Close";

const EStationPaymentReceiptModal = (props) => {
  const handleClose = () => props.close(false);

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", border: "none" }}
    >
      <div className="e-station-reciept-modal-">
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

export default EStationPaymentReceiptModal;
