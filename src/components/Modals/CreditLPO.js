import React, { useState } from "react";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import "../../styles/lpo.scss";
import { MenuItem, Select } from "@mui/material";
import LPOService from "../../services/lpo";
import ModalBackground from "../controls/Modal/ModalBackground";
import ModalInputField from "../controls/Modal/ModalInputField";
import UploadPhoto from "../common/uploadphoto";
import ReactCamera from "./ReactCamera";

const CreditBalance = (props) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState("");
  const [cam, setCam] = useState("null");
  const [gall, setGall] = useState("null");
  const user = useSelector((state) => state.auth.user);
  const singleLPO = useSelector((state) => state.lpo.singleLPO);

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("bank");
  const [paymentType, setPaymentType] = useState(0);
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [tellerNo, setTellerNo] = useState("");
  const [posName, setPosName] = useState("");
  const [terminalID, setTerminalID] = useState("");
  const [date, setDate] = useState("");
  const [paidBy, setPaidBy] = useState("");

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
      .then(() => {
        swal("Success!", "Account has been credited successfully!", "success");
      })
      .then(() => {
        handleClose();
        setLoading(false);
      });
  };

  const setOptions = (data) => {
    setPaymentType(data);
    if (data === 0) return setType("bank");
    if (data === 1) return setType("pos");
  };

  return (
    <ModalBackground
      openModal={props.open}
      closeModal={handleClose}
      submit={submit}
      loading={loading}
      label={"Credit Account Balance"}>
      <ReactCamera open={open} close={setOpen} setDataUri={setCam} />
      <ModalInputField
        value={amount}
        setValue={setAmount}
        type={"number"}
        label={"Amount"}
      />

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

      {type === "bank" && (
        <ModalInputField
          value={bankName}
          setValue={setBankName}
          type={"text"}
          label={"Bank Name"}
        />
      )}

      {type === "bank" && (
        <ModalInputField
          value={accountName}
          setValue={setAccountName}
          type={"text"}
          label={"Account Number"}
        />
      )}

      {type === "bank" && (
        <ModalInputField
          value={tellerNo}
          setValue={setTellerNo}
          type={"text"}
          label={"Teller Number"}
        />
      )}

      {type === "pos" && (
        <ModalInputField
          value={posName}
          setValue={setPosName}
          type={"text"}
          label={"POS name"}
        />
      )}

      {type === "pos" && (
        <ModalInputField
          value={terminalID}
          setValue={setTerminalID}
          type={"text"}
          label={"Terminal ID"}
        />
      )}

      <ModalInputField
        value={date}
        setValue={setDate}
        type={"date"}
        label={"Date updated"}
      />

      <ModalInputField
        value={paidBy}
        setValue={setPaidBy}
        type={"text"}
        label={"Paid By"}
      />

      <UploadPhoto setOpen={setOpen} setGall={setGall} cam={cam} />
    </ModalBackground>
  );
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
  marginTop: "5px",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

export default CreditBalance;
