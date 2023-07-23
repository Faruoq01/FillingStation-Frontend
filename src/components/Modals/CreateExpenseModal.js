import React, { Fragment, useState } from "react";
import Modal from "@mui/material/Modal";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ThreeDots } from "react-loader-spinner";
import "../../styles/estation/payment.scss";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";

const CreateExpenseModal = (props) => {
  const handleClose = () => props.close(false);
  const [accountName, setAccountName] = useState();
  const [amount, setAmount] = useState();
  const [paymentMethod, setPaymentMethod] = useState();
  const [tellerNo, setTellerNo] = useState();
  const [recieptImage, setRecieptImage] = useState();
  const mobile = useMediaQuery("(max-width:900px)");
  const handleOnChange = (setState) => (event) => {
    setState(event.target.value);
  };
  const handleSubmitForm = () => {
    const data = {
      accountName,
      amount,
      paymentMethod,
      tellerNo,
      recieptImage,
    };
    console.log(data);
  };
  // sales;
  // RTlitre;
  // pumpID;
  // openingMeter;
  // closingMeter;
  // productType;
  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", border: "none" }}
    >
      <div className="e-station-payment-modal">
        <div className="cancel-confirm">
          <label for="Confirm Payment" className="title-label-">
            Create Corporate Sales
          </label>
          <CloseIcon className="icon-m-close" onClick={handleClose} size={25} />
        </div>
        <div className="form-area-new-pay">
          <form>
            <CustomTextInput
              placeholder="expense name"
              title="Expense Name"
              onChange={handleOnChange(setAccountName)}
            />
            <CustomTextInput
              placeholder="description"
              title="Description"
              onChange={handleOnChange(setAmount)}
            />
            <CustomTextInput
              title="Amount"
              placeholder="amount"
              onChange={handleOnChange(setAmount)}
            />

            <label>Upload Attachment</label>
            <button className="upload-btn">
              <img
                src={require("../../assets/estation/upload-icon.svg").default}
              />
              Uplaod Image
            </button>

            <div
              style={{
                marginBottom: "1rem",
                marginTop: "2rem",
                padding: 0,
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                flexDirection: "column",
              }}
              className="footer-section-p"
            >
              <Button
                variant="contained"
                onClick={handleSubmitForm}
                style={{
                  width: 100,
                  background: "#06805B",
                  color: "white",
                }}
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

const customDropdown = ({ data }) => <div>{}</div>;
const data = {};

const CustomTextInput = (props) => (
  <Fragment>
    <label>{props.title}</label>
    <input type={props.type ?? "text"} {...props} />
  </Fragment>
);

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

export default CreateExpenseModal;
