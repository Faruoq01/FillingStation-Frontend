import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import "../../styles/attendant/attendance.scss";
import CloseIcon from "@mui/icons-material/Close";
import { Button, FormControl, InputLabel } from "@mui/material";
import { Circle } from "@mui/icons-material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
// import Chart from "react-apexcharts";

const AttendantSellModal = (props) => {
  const [componentsState, setComponentState] = useState(1);
  const handleClose = () => {
    setComponentState(1);
    props.close(false);
  };

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
          <CloseIcon className="icon-m-close" onClick={handleClose} size={25} />
          <label for="Confirm Payment" className="title-label-">
            Sell Product
          </label>
        </div>
        <div className="body-wrap">
          <div className="body-content">
            <div className="text-image">
              <div className="progress-left">{/* PROGRESS BAR LEFT */}</div>
              <div className="text-area">
                {componentsState == 1 ? (
                  <>
                    <span>Receive Order</span>
                    <label>Receive Customers Order</label>
                  </>
                ) : componentsState == 2 ? (
                  <>
                    <span>Confirm Order</span>
                    <label>Confirm Customers Order</label>
                  </>
                ) : componentsState == 3 ? (
                  <>
                    <span>Dispense Order</span>
                    <label>Dispense Customers Order</label>
                  </>
                ) : (
                  <>
                    <span>Receive Order</span>
                    <label>Receive Customers Order</label>
                  </>
                )}
              </div>
            </div>
            {/* Component1 */}
            {componentsState === 1 && (
              <Component1
                setComponentState={setComponentState}
                handleClose={handleClose}
              />
            )}
            {/* Component1 */}

            {/* component2 */}
            {componentsState === 2 && (
              <Component2
                setComponentState={setComponentState}
                handleClose={handleClose}
              />
            )}
            {/* Compont2 close */}

            {/* component3 */}
            {componentsState === 3 && (
              <Component3 setComponentState={setComponentState} />
            )}
            {/* Component3 close */}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const Component3 = ({ handleClose, setComponentState, ...props }) => {
  const [radioState, setRadioState] = useState(true);
  return (
    <div className="component3">
      <div className="content-wrap">
        <span>
          Do you want to give the amount of liter the customer order for
        </span>
        <FormControl style={{ marginTop: "2rem", marginBottom: "2rem" }}>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
          >
            <FormControlLabel
              checked={radioState ?? false}
              onChange={() => {
                setRadioState(true);
              }}
              value="Yes"
              control={<Radio />}
              label="Yes"
            />
            <FormControlLabel
              checked={!radioState ?? true}
              onChange={() => {
                setRadioState(false);
              }}
              value="No"
              control={<Radio />}
              label="No"
            />
          </RadioGroup>
        </FormControl>

        <div style={{ marginBottom: "2rem" }}>
          {!radioState && (
            <CustomInput label="Given Litre" placeholder="50.66" />
          )}
          <span style={{ color: "#5E5E5E" }}>
            The Customer is to Pay the Sum Amount of{" "}
            <label style={{ color: "#1B6602", fontWeight: "bold" }}>
              NGN 35000.00
            </label>{" "}
            in{" "}
            <label style={{ color: "#1B6602", fontWeight: "bold" }}>Cash</label>
          </span>
        </div>

        <div
          style={{
            justifyContent: "flex-start",
            width: "100%",
            marginBottom: "5px",
          }}
          className="button-wraper"
        >
          <Button
            onClick={handleClose}
            style={{ border: "1px solid #1B6602", color: "#1B6602" }}
            variant="outlined"
          >
            Cancle
          </Button>
          <Button
            onClick={() => setComponentState(4)}
            style={{ background: "#1B6602", marginLeft: "1rem" }}
            variant="contained"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

const Component2 = ({ handleClose, setComponentState, ...props }) => {
  return (
    <div className="component2-wraper">
      <div className="profile-details-area">
        <div className="image-wrap">{/* IMAGE GOSE HERE */}</div>
        <div className="details-wrap">
          <span>Akinseye Oluwasegun</span>
          <label>oluwasegun@gmail.com</label>
        </div>
      </div>
      <div className="product-info-wrap">
        <div className="details-wrap-wrap">
          <span className="span-parent">
            Product:
            <label>
              <Circle style={{ color: "#399A19", fontSize: 10 }} />
              <label>PMS</label>
            </label>
          </span>
          {/* litre */}
          <span className="span-parent">
            Lter:
            <label>
              <label>50 LTR</label>
            </label>
          </span>
          {/* Price */}
          <span className="span-parent">
            Price:
            <label>
              <label>NGN 350,000</label>
            </label>
          </span>
          {/* Payment Status */}
          <span className="span-parent">
            Payment Status:
            <label>
              <label>Paid</label>
            </label>
          </span>
          {/* Payment Methos */}
          <span className="span-parent">
            Payment Method:
            <label>
              <label>Cash</label>
            </label>
          </span>
        </div>
      </div>
      <div
        style={{
          justifyContent: "flex-start",
          width: "100%",
          marginBottom: "5px",
        }}
        className="button-wraper"
      >
        <Button
          onClick={handleClose}
          style={{ border: "1px solid #1B6602", color: "#1B6602" }}
          variant="outlined"
        >
          Cancle
        </Button>
        <Button
          onClick={() => setComponentState(3)}
          style={{ background: "#1B6602", marginLeft: "1rem" }}
          variant="contained"
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

const Component1 = ({ handleClose, setComponentState, ...props }) => {
  return (
    <div className="input-wrapper">
      <CustomInput
        label="Vehicle Number"
        placeholder="Enter customer vehicle number"
      />
      <div className="or-wrap">
        <div className="line" /> <label>OR</label>
        <div className="line" />
      </div>
      <CustomInput
        label="Order Code "
        placeholder="Enter customer order code"
      />
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <img src={require("../../assets/attendance/scan-icon.svg").default} />
        <label style={{ color: "#034AFF", marginLeft: 5 }}>Scan code</label>
      </div>
      <div className="button-wraper">
        <Button
          onClick={handleClose}
          style={{ border: "1px solid #1B6602", color: "#1B6602" }}
          variant="outlined"
        >
          Cancle
        </Button>
        <Button
          onClick={() => setComponentState(2)}
          style={{ background: "#1B6602", marginLeft: "1rem" }}
          variant="contained"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export const CustomInput = ({ ...props }) => (
  <div
    style={{
      width: "100%",
      display: "flex",
      justifyItems: "flex-start",
      flexDirection: "column",
      marginBottom: 10,
    }}
  >
    <label style={{ textAlign: "left", marginBottom: "5px" }}>
      {props.label}
    </label>
    <input
      style={{
        padding: "5px",
        height: "30px",
        borderRadius: "4.42px",
        border: " 1.5px solid var(--input-field-stoke, #DDD)",
        background: "var(--inputfield-bg, #F3F3F3)",
      }}
      placeholder={props.placeholder}
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

export default AttendantSellModal;
