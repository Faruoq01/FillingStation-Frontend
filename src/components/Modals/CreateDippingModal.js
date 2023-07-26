import React, { Fragment, useState } from "react";
import Modal from "@mui/material/Modal";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ThreeDots } from "react-loader-spinner";
import "../../styles/estation/payment.scss";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";

const CreateDippingModal = (props) => {
  const handleClose = () => props.close(false);
  const [currentLevel, setCurrentLevel] = useState();

  const [product, setProduct] = useState();
  const handleOnChange = (setState) => (event) => {
    setState(event.target.value);
  };
  const handleSubmitForm = () => {
    console.log(data);
  };
  // let f = {
  //   productType: dipping.productType,
  //   currentLevel: dipping.currentLevel,
  //   tankCapacity: dipping.tankCapacity,
  //   dipping: dipping.dippingValue,
  //   afterSales: dipping.afterSales,
  //   tankName: dipping.tankName,
  // };
  return (
    // <Modal
    //   open={props.open}
    //   onClose={handleClose}
    //   aria-labelledby="modal-modal-title"
    //   aria-describedby="modal-modal-description"
    //   sx={{ display: "flex", justifyContent: "center", border: "none" }}
    // >
    //   <div className="e-station-payment-modal">
    //     <div className="cancel-confirm">
    //       <label for="Confirm Payment" className="title-label-">
    //         Create Dipping
    //       </label>
    //       <CloseIcon className="icon-m-close" onClick={handleClose} size={25} />
    //     </div>
    //     <div className="form-area-new-pay">
    //       <form>
    //         <CustomTextInput
    //           placeholder="Tank Name"
    //           title="Tank Name"
    //           onChange={handleOnChange(setCurrentLevel)}
    //         />

    //         <label for=""> Product Type</label>
    //         <FormControl
    //           sx={{
    //             marginBottom: 1,
    //           }}
    //           fullWidth
    //         >
    //           <Select
    //             sx={{ height: 35 }}
    //             labelId="demo-simple-select-label"
    //             id="demo-simple-select"
    //             value={product}
    //             label="Product Type"
    //             onChange={handleOnChange(setProduct)}
    //           >
    //             <MenuItem value={1}>PMS</MenuItem>
    //             <MenuItem value={2}>DPK</MenuItem>
    //             <MenuItem value={3}>AGO</MenuItem>
    //           </Select>
    //         </FormControl>
    //         <CustomTextInput
    //           placeholder="Current Level"
    //           title="Current Level"
    //           onChange={handleOnChange(setCurrentLevel)}
    //         />
    //         <CustomTextInput
    //           placeholder="tank capacity"
    //           title="Tank Capacity"
    //           onChange={handleOnChange(setCurrentLevel)}
    //         />
    //         <CustomTextInput
    //           type="number"
    //           placeholder="dipping value"
    //           title="Dipping Value"
    //           onChange={handleOnChange(setCurrentLevel)}
    //         />
    //         <CustomTextInput
    //           placeholder="after sales"
    //           title="After Sales"
    //           onChange={handleOnChange(setCurrentLevel)}
    //         />

    //         <div
    //           style={{
    //             marginBottom: "1rem",
    //             marginTop: "2rem",
    //             padding: 0,
    //             display: "flex",
    //             justifyContent: "flex-start",
    //             alignItems: "flex-start",
    //             flexDirection: "column",
    //           }}
    //           className="footer-section-p"
    //         >
    //           <Button
    //             variant="contained"
    //             onClick={handleSubmitForm}
    //             style={{
    //               width: 100,
    //               background: "#06805B",
    //               color: "white",
    //             }}
    //           >
    //             Save
    //           </Button>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // </Modal>

    <Modal
      open={open === 1}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <div className="modalContainer2">
        <div className="inner">
          <div className="head">
            <div className="head-text">Create Filling Station</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div style={{ height: "30px" }} className="butt">
            <Button
              disabled={loadingSpinner}
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
              onClick={handleTankModal}
              variant="contained"
            >
              {" "}
              Save
            </Button>

            {loadingSpinner ? (
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
            ) : null}
          </div>
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

export default CreateDippingModal;
