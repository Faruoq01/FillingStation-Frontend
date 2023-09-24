/* eslint-disable no-unused-expressions */
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import close from "../../../assets/close.png";
import upload from "../../../assets/upload.png";
import photo from "../../../assets/photo.png";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import "../../../styles/lpo.scss";
import axios from "axios";
import "../../../styles/lpo.scss";
import config from "../../../constants";
import ReactCamera from "../ReactCamera";
import APIs from "../../../services/connections/api";
import { MenuItem, Select } from "@mui/material";
import ModalInputField from "../../controls/Modal/ModalInputField";

const PaymentsModal = (props) => {
  const attach = useRef();
  const [loading, setLoading] = useState(false);
  const [camLoader, setCamLoader] = useState(0);
  const [gallLoader, setGallLoader] = useState(0);
  const [productState, setProductState] = useState(1);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const currentDate = useSelector((state) => state.dashboard.dateRange);
  const salesShift = useSelector((state) => state.dailysales.salesShift);

  const [bankName, setBankName] = useState("");
  const [tellerNumber, setTellerNumber] = useState("");
  const [method, setMethod] = useState("bank");

  const [posName, setPosName] = useState("");
  const [terminalID, setTerminalID] = useState("");
  const [amountPaid, setAmountPaid] = useState("");

  const [open, setOpen] = useState(false);
  const [cam, setCam] = useState(null);
  const [gall, setGall] = useState(null);

  const handleClose = () => props.close(false);

  const submit = async () => {
    if (oneStationData === null)
      return swal("Warning!", "Please select a station", "info");
    if (cam === null && gall === null)
      return swal("Warning!", "Please select an image", "info");
    if (method === "bank") {
      if (bankName === "")
        return swal("Warning!", "Bank name cannot be empty", "info");
      if (tellerNumber === "")
        return swal("Warning!", "Teller field cannot be empty", "info");
    }
    if (method === "pos") {
      if (posName === "")
        return swal("Warning!", "POS name cannot be empty", "info");
      if (terminalID === "")
        return swal("Warning!", "Terminal ID cannot be empty", "info");
    }
    setLoading(true);

    const bankPayload = paymentPayload(
      currentDate[0],
      bankName,
      tellerNumber,
      amountPaid,
      oneStationData,
      cam,
      gall,
      salesShift
    );

    const posPayload = posPayloadData(
      currentDate[0],
      posName,
      terminalID,
      amountPaid,
      oneStationData,
      cam,
      gall,
      salesShift
    );

    try {
      if (method === "bank") {
        await APIs.post("/comprehensive/create-payments", bankPayload);
      } else {
        await APIs.post("/comprehensive/create-pos-payment", posPayload);
      }
      setLoading(false);
      props.update((prev) => !prev);
      swal("Success!", "Record saved successfully!", "success");
      handleClose();
    } catch (e) {
      console.log(e, "error");
    }
  };

  const selectedFile = (e) => {
    let file = e.target.files[0];
    setGallLoader(1);
    const formData = new FormData();
    formData.append("file", file);
    const httpConfig = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    const url = `${config.BASE_URL}/360-station/api/upload`;
    axios
      .post(url, formData, httpConfig)
      .then((data) => {
        setGall(data.data.path);
      })
      .then(() => {
        setGallLoader(2);
      });
  };

  const uploadProductOrders = () => {
    if (cam !== null)
      return swal("Error", "Picture already taken with cam", "error");
    attach.current.click();
  };

  const getPhotoFromCamera = () => {
    if (gall !== null)
      return swal("Error", "Picture already uploaded with gall", "error");
    setOpen(true);
    setCamLoader(2);
  };

  const selectPayment = (index) => {
    setProductState(index);
    if (index === 1) return setMethod("bank");
    if (index === 2) return setMethod("pos");
  };

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="modalContainer2">
        <ReactCamera open={open} close={setOpen} setDataUri={setCam} />
        <div className="inner">
          <div className="head">
            <div className="head-text">Register Payments</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={inner}>
            <div className="inputs">
              <div style={{ marginBottom: "5px" }} className="head-text2">
                Payment method
              </div>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={productState}
                sx={selectStyle2}>
                <MenuItem style={menu} value={0}>
                  Select Product
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    selectPayment(1);
                  }}
                  style={menu}
                  value={1}>
                  Bank
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    selectPayment(2);
                  }}
                  style={menu}
                  value={2}>
                  pos
                </MenuItem>
              </Select>
            </div>

            {method === "bank" && (
              <>
                <div className="inputs">
                  <div className="head-text2">Bank Name</div>
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
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>

                <div className="inputs">
                  <div className="head-text2">Teller Number</div>
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
                    value={tellerNumber}
                    onChange={(e) => setTellerNumber(e.target.value)}
                  />
                </div>
              </>
            )}

            {method === "pos" && (
              <>
                <div className="inputs">
                  <div className="head-text2">POS Name</div>
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
                    value={posName}
                    onChange={(e) => setPosName(e.target.value)}
                  />
                </div>

                <div className="inputs">
                  <div className="head-text2">Terminal ID</div>
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
                    value={terminalID}
                    onChange={(e) => setTerminalID(e.target.value)}
                  />
                </div>
              </>
            )}

            <ModalInputField
              value={amountPaid}
              setValue={setAmountPaid}
              type={"number"}
              label={`Amount Paid`}
              disabled={false}
            />

            <div className="inputs">
              <div className="head-text2">Payment Date</div>
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
                value={currentDate[0]}
                disabled
                type="date"
              />
            </div>

            <Button
              sx={{
                width: "100%",
                height: "35px",
                background: "#427BBE",
                borderRadius: "3px",
                fontSize: "10px",
                marginTop: "30px",
                "&:hover": {
                  backgroundColor: "#427BBE",
                },
              }}
              onClick={uploadProductOrders}
              variant="contained">
              <img
                style={{ width: "25px", height: "20px", marginRight: "10px" }}
                src={upload}
                alt={"icon"}
              />
              {gallLoader === 0 && <div>Attachment</div>}
              {gallLoader === 1 && (
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
              )}
              {gallLoader === 2 && (
                <div style={{ color: "#fff", fontSize: "12px" }}>Success</div>
              )}
            </Button>
            <Button
              sx={{
                width: "100%",
                height: "35px",
                background: "green",
                borderRadius: "3px",
                fontSize: "10px",
                marginTop: "30px",
                "&:hover": {
                  backgroundColor: "green",
                },
              }}
              onClick={getPhotoFromCamera}
              variant="contained">
              <img
                style={{ width: "25px", height: "20px", marginRight: "10px" }}
                src={photo}
                alt={"icon"}
              />
              {camLoader === 0 && <div>Take Photo</div>}
              {camLoader === 1 && (
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
              )}
              {camLoader === 2 && (
                <div style={{ color: "#fff", fontSize: "12px" }}>Success</div>
              )}
            </Button>
            <input
              onChange={selectedFile}
              ref={attach}
              type="file"
              style={{ visibility: "hidden" }}
            />
          </div>

          <div style={{ marginTop: "10px", height: "30px" }} className="butt">
            <Button
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

const paymentPayload = (
  date,
  bankName,
  tellerNumber,
  amountPaid,
  oneStationData,
  currentDate,
  cam,
  gall,
  salesShift
) => {
  const pic = () => {
    if (cam === null && gall === null) {
      return "null";
    } else if (cam !== null && gall === null) {
      return cam;
    } else if (cam === null && gall !== null) {
      return gall;
    }
  };
  return {
    bankName: bankName,
    tellerNumber: tellerNumber,
    amountPaid: amountPaid,
    paymentDate: date,
    confirmation: "null",
    attachApproval: pic(),
    outletID: oneStationData._id,
    organizationID: oneStationData.organisation,
    shift: salesShift,
    createdAt: currentDate,
    updatedAt: currentDate,
  };
};

const posPayloadData = (
  date,
  posName,
  terminalID,
  amountPaid,
  oneStationData,
  currentDate,
  cam,
  gall,
  salesShift
) => {
  const pic = () => {
    if (cam === null && gall === null) {
      return "null";
    } else if (cam !== null && gall === null) {
      return cam;
    } else if (cam === null && gall !== null) {
      return gall;
    }
  };
  return {
    posName: posName,
    terminalID: terminalID,
    amountPaid: amountPaid,
    paymentDate: date,
    confirmation: "null",
    attachApproval: pic(),
    outletID: oneStationData._id,
    organizationID: oneStationData.organisation,
    shift: salesShift,
    createdAt: currentDate,
    updatedAt: currentDate,
  };
};

const selectStyle2 = {
  width: "100%",
  height: "35px",
  borderRadius: "0px",
  background: "#EEF2F1",
  color: "#000",
  fontSize: "12px",
  outline: "none",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const menu = {
  fontSize: "12px",
};

const inner = {
  width: "100%",
  height: "500px",
  overflowY: "scroll",
};

export default PaymentsModal;
