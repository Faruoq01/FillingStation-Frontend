import React, { Fragment, useState } from "react";
import Modal from "@mui/material/Modal";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ThreeDots } from "react-loader-spinner";
import "../../styles/estation/payment.scss";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const CreateReturnToTankModal = (props) => {
  const handleClose = () => props.close(false);
  const [accountName, setAccountName] = useState();
  const [amount, setAmount] = useState();
  const [paymentMethod, setPaymentMethod] = useState();
  const [tellerNo, setTellerNo] = useState();
  const [recieptImage, setRecieptImage] = useState();
  const [product, setProduct] = useState();
  const mobile = useMediaQuery("(max-width:900px)");
  const handleOnChange = (setState) => (event) => {
    setState(event.target.value);
  };
  const handleSubmitForm = (e) => {
    e.preventDefault();
    const data = {
      accountName,
      amount,
      paymentMethod,
      tellerNo,
      recieptImage,
    };
    console.log(data);
  };

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
            Create Return To Tank
          </label>
          <CloseIcon className="icon-m-close" onClick={handleClose} size={25} />
        </div>
        <div className="form-area-new-pay">
          <form>
            <CustomTextInput
              placeholder="return to tank litre"
              title="Return To Tank Litre"
              onChange={handleOnChange(setAccountName)}
            />

            {product === 1 && (
              <CustomTextInput
                disabled
                placeholder="pms price"
                title="PMS Price"
                // onChange={handleOnChange(setAccountName)}
              />
            )}
            {product === 3 && (
              <CustomTextInput
                disabled
                placeholder="ago price"
                title="AGO Price"
                // onChange={handleOnChange(setAccountName)}
              />
            )}
            {product === 2 && (
              <CustomTextInput
                disabled
                placeholder="dpk price"
                title="DPK Price"
                // onChange={handleOnChange(setAccountName)}
              />
            )}
            <div>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Product Type
                </InputLabel>
                <Select
                  sx={{ height: 35 }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={product}
                  label="Product Type"
                  onChange={handleOnChange(setProduct)}
                >
                  <MenuItem value={1}>PMS</MenuItem>
                  <MenuItem value={2}>DPK</MenuItem>
                  <MenuItem value={3}>AGO</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div
              style={{
                // marginBottom: "3rem",
                marginTop: "1rem",
                // backgroundColor: "red",
                padding: 0,
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
              className="footer-section-p"
            >
              <Button
                variant="contained"
                onClick={handleSubmitForm}
                style={{
                  // width: 100,
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
    <input {...props} />
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

export default CreateReturnToTankModal;
