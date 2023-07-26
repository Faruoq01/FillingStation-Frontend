import React, { Fragment, useState } from "react";
import Modal from "@mui/material/Modal";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ThreeDots } from "react-loader-spinner";
import "../../styles/estation/payment.scss";
import close from "../../assets/close.png";
import {
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
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
  const [product, setProduct] = useState(1);
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
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <div className="modalContainer2">
        <div className="inner">
          <div className="head">
            <div className="head-text">Create Return To Tank</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div
            style={{
              width: "100%",
              height: "480px",
              paddingRight: "5px",
              overflowX: "hidden",
              overflowY: "scroll",
            }}
          >
            {product === 1 && (
              <CustomTextInput
                disabled
                title="PMS Price"
                // onChange={handleOnChange(setAccountName)}
              />
            )}
            {product === 3 && (
              <CustomTextInput
                disabled
                title="AGO Price"
                // onChange={handleOnChange(setAccountName)}
              />
            )}
            {product === 2 && (
              <CustomTextInput
                disabled
                title="DPK Price"
                // onChange={handleOnChange(setAccountName)}
              />
            )}

            <CustomDropdown
              value={product === 3 ? "AGO" : product === 2 ? "DPK" : "PMS"}
              onChange={handleOnChange(setProduct)}
              title={"Product Type"}
            />
          </div>

          <div style={{ height: "30px" }} className="butt">
            <Button
              // disabled={loadingSpinner}
              sx={{
                width: "100px",
                height: "30px",
                background: "#427BBE",
                borderRadius: "3px",
                fontSize: "10px",
                marginTop: "00px",
                "&:hover": {
                  backgroundColor: "#427BBE",
                },
              }}
              onClick={() => {}}
              variant="contained"
            >
              Save
            </Button>

            {/* {loadingSpinner ? (
              <ThreeDots
                height="60"
                width="50"
                radius="9"
                color="#076146"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
              />
            ) : null} */}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const CustomDropdown = ({ data, value, onChange, title, ...props }) => {
  return (
    <div style={{ marginTop: "15px" }} className="inputs">
      <div className="head-text2">{title}</div>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={value}
        sx={{
          width: "100%",
          height: "35px",
          marginTop: "5px",
          background: "#EEF2F1",
          fontSize: "12px",
          borderRadius: "0px",
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #777777",
          },
        }}
        onChange={onChange}
      >
        <MenuItem value={1}>PMS</MenuItem>
        <MenuItem value={2}>DPK</MenuItem>
        <MenuItem value={3}>AGO</MenuItem>
      </Select>
    </div>
  );
};
const data = {};

const CustomTextInput = (props) => (
  <div className="inputs">
    <div className="head-text2">{props.title}</div>
    <OutlinedInput
      sx={{
        width: "100%",
        height: "35px",
        marginTop: "5px",
        background: "#EEF2F1",
        fontSize: "12px",
        borderRadius: "0px",
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          border: "1px solid #777777",
        },
      }}
      placeholder={`${props.title.toLowerCase()}`}
      {...props}
    />
  </div>
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
