import React, { useState } from "react";
import { useSelector } from "react-redux";
import close from "../../assets/close.png";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import "../../styles/lpo.scss";
import { MenuItem, Select } from "@mui/material";
import LPOService from "../../services/lpo";

const CreditBalance = (props) => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.authReducer.user);
  const singleLPO = useSelector((state) => state.lpoReducer.singleLPO);

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("bank");
  const [paymentType, setPaymentType] = useState(0);

  const handleClose = () => props.close(false);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const submit = () => {
    if (amount === "")
      swal("Warning!", "Amount field cannot be empty!", "info");
    if (type === "")
      swal("Warning!", "Payment type field cannot be empty", "info");

    setLoading(true);

    const payload = {
      lpoID: singleLPO._id,
      credit: amount,
      method: type,
      organizationID: resolveUserID().id,
    };

    LPOService.credit(payload)
      .then((data) => {
        swal("Success!", "Account has been credited successfully!", "success");
      })
      .then(() => {
        handleClose();
        setLoading(false);
      });
  };

  const setOptions = (data) => {
    setPaymentType(data);
    if (data === 0) return setType("Bank");
    if (data === 1) return setType("POS");
  };

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ height: "auto" }} className="modalContainer2">
        <div style={{ height: "auto", margin: "20px" }} className="inner">
          <div className="head">
            <div className="head-text">Credit Account Balance</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={inner}>
            <div className="inputs">
              <div className="head-text2">Amount</div>
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
                placeholder=""
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Payment Method</div>
              <Select defaultValue={paymentType} sx={selection}>
                <MenuItem
                  value={0}
                  sx={menu}
                  onClick={() => {
                    setOptions(0);
                  }}>
                  Bank
                </MenuItem>
                <MenuItem
                  value={1}
                  sx={menu}
                  onClick={() => {
                    setOptions(1);
                  }}>
                  POS
                </MenuItem>
              </Select>
            </div>
          </div>

          <div style={{ marginTop: "10px", height: "30px" }} className="butt">
            <Button
              disabled={loading}
              sx={{
                width: "100px",
                height: "30px",
                background: "#427BBE",
                borderRadius: "3px",
                fontSize: "10px",
                marginTop: "0px",
                "&:hover": {
                  backgroundColor: "#427BBE",
                },
              }}
              onClick={submit}
              variant="contained">
              {" "}
              Save
            </Button>

            {loading ? (
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

const inner = {
  width: "100%",
  height: "180px",
};

const menu = {
  fontSize: "12px",
};

const selection = {
  width: "100%",
  height: "35px",
  borderRadius: "0px",
  background: "#EEF2F1",
  fontSize: "12px",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

export default CreditBalance;
