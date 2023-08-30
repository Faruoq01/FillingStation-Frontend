import React from "react";
import close from "../../../assets/close.png";
import PMSCost from "../../../assets/PMSCost.png";
import AGOCost from "../../../assets/AGOCost.png";
import DPKCost from "../../../assets/DPKCost.png";
import Modal from "@mui/material/Modal";
import "../../../styles/cost.scss";

const AddCostPrice = (props) => {
  const handleClose = () => props.close(false);

  const openModal = (type) => {
    props.open2(true);
    props.setMode(type);
    handleClose();
  };

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div
        style={{ background: "#fff", padding: "10px" }}
        className="modalContainer">
        <div style={{ height: "85%" }} className="inner">
          <div className="head">
            <div className="head-text"></div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>
          <div className="cont">
            <div
              onClick={() => {
                openModal("pms");
              }}
              className="card">
              <img className="image" src={PMSCost} alt="icon" />
            </div>
            <div
              onClick={() => {
                openModal("ago");
              }}
              className="card">
              <img className="image" src={AGOCost} alt="icon" />
            </div>
            <div
              onClick={() => {
                openModal("dpk");
              }}
              className="card">
              <img className="image" src={DPKCost} alt="icon" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddCostPrice;
