/* eslint-disable no-unused-expressions */
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import close from "../../assets/close.png";
import upload from "../../assets/upload.png";
import photo from "../../assets/photo.png";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import "../../styles/lpo.scss";
import axios from "axios";
import "../../styles/lpo.scss";
import config from "../../constants";
import ReactCamera from "./ReactCamera";
import { MenuItem, Select } from "@mui/material";
import APIs from "../../services/connections/api";

const AddPayModal = (props) => {
  const [loading, setLoading] = useState(false);
  const oneStationData = useSelector(
    (state) => state.outletReducer.adminOutlet
  );
  const attach = useRef();
  const [defaultState, setDefault] = useState(1);

  const [type, setType] = useState("bank");
  const [posName, setPosName] = useState("null");
  const [terminalID, setTerminalID] = useState("");
  const [bankName, setBankName] = useState("null");
  const [tellerNumber, setTellerNumber] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [date, setDate] = useState("");

  const [loading2, setLoading2] = useState(0);
  const [cam, setCam] = useState("null");
  const [gall, setGall] = useState("null");
  const [open, setOpen] = useState("");

  const handleClose = () => {
    props.close(false);
  };

  const changePay = (index, type) => {
    setDefault(index);
    if (type === "bank") {
      setType(type);
      setPosName("null");
      setTerminalID("");
      setGall("null");
      setCam("null");
      setAmountPaid("");
      setDate("");
      setBankName("null");
      setTellerNumber("null");
    } else {
      setType(type);
      setPosName("null");
      setTerminalID("");
      setGall("null");
      setCam("null");
      setAmountPaid("");
      setDate("");
      setBankName("null");
      setTellerNumber("null");
    }
  };

  const selectedFile = (e) => {
    let file = e.target.files[0];
    setLoading2(1);
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
        setLoading2(2);
      });
  };

  const openCamera = () => {
    setOpen(true);
  };

  const uploadProductOrders = () => {
    attach.current.click();
  };

  const submit = async () => {
    if (oneStationData === null)
      return swal("Warning!", "Please create a station", "info");
    if (bankName === "null" && posName === "null")
      return swal("Warning!", "Please fill payment details!", "info");
    if (tellerNumber === "null" && terminalID === "null")
      return swal(
        "Warning!",
        "Please fill teller or terminal details!",
        "info"
      );
    if (amountPaid === "")
      return swal("Warning!", "Please enter amount paid", "info");
    if (date === "")
      return swal("Warning!", "Please enter a payment date!", "info");
    if (cam === "null" && gall === "null")
      return swal("Warning!", "Please select a file to upload!", "info");
    setLoading(true);

    const payload = {
      currentDate: date,
      label: "payments",
      payments: [
        {
          bankName: bankName,
          tellerNumber: tellerNumber,
          posName: posName,
          terminalID: terminalID,
          amountPaid: amountPaid,
          paymentDate: date,
          outletID: oneStationData._id,
          camera: cam,
          gallery: gall,
          organizationID: oneStationData.organisation,
        },
      ],
    };

    console.log(payload);

    await APIs.post("/daily-sales/create", payload)
      .then(({ data }) => {
        if (data.code === 200) {
          props.refresh();
          swal("Success!", "Payment added successfully!", "success");
        }
      })
      .then(() => {
        setLoading(false);
        handleClose();
      })
      .catch((e) => {
        console.log(e);
      });
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
            <div className="head-text">Create a new payment</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={inner}>
            <div style={{ marginTop: "30px" }} className="inputs">
              <div className="head-text2">Select a payment method</div>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={defaultState}
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
                }}>
                <MenuItem
                  onClick={() => changePay(0, "None")}
                  style={menu}
                  value={0}>
                  Please select a payment method
                </MenuItem>
                <MenuItem
                  onClick={() => changePay(1, "bank")}
                  style={menu}
                  value={1}>
                  Bank
                </MenuItem>
                <MenuItem
                  onClick={() => changePay(2, "pos")}
                  style={menu}
                  value={2}>
                  Pos
                </MenuItem>
              </Select>
            </div>

            {type === "bank" && (
              <>
                <div className="inputs">
                  <div className="head-text2">Bank Name</div>
                  <OutlinedInput
                    sx={{
                      width: "100%",
                      height: "35px",
                      marginTop: "0px",
                      background: "#EEF2F1",
                      fontSize: "12px",
                      borderRadius: "0px",
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid #777777",
                      },
                    }}
                    placeholder=""
                    type="text"
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>

                <div className="inputs">
                  <div className="head-text2">Teller Number</div>
                  <OutlinedInput
                    sx={{
                      width: "100%",
                      height: "35px",
                      marginTop: "0px",
                      background: "#EEF2F1",
                      fontSize: "12px",
                      borderRadius: "0px",
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid #777777",
                      },
                    }}
                    placeholder=""
                    type="text"
                    onChange={(e) => setTellerNumber(e.target.value)}
                  />
                </div>
              </>
            )}

            {type === "pos" && (
              <>
                <div className="inputs">
                  <div className="head-text2">POS Name</div>
                  <OutlinedInput
                    sx={{
                      width: "100%",
                      height: "35px",
                      marginTop: "0px",
                      background: "#EEF2F1",
                      fontSize: "12px",
                      borderRadius: "0px",
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid #777777",
                      },
                    }}
                    placeholder=""
                    type="text"
                    onChange={(e) => setPosName(e.target.value)}
                  />
                </div>

                <div className="inputs">
                  <div className="head-text2">Terminal ID</div>
                  <OutlinedInput
                    sx={{
                      width: "100%",
                      height: "35px",
                      marginTop: "0px",
                      background: "#EEF2F1",
                      fontSize: "12px",
                      borderRadius: "0px",
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid #777777",
                      },
                    }}
                    placeholder=""
                    type="text"
                    onChange={(e) => setTerminalID(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="inputs">
              <div className="head-text2">Amount paid</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "0px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type="text"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Payment date</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "0px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <Button
              sx={{
                width: "98%",
                height: "35px",
                background: "green",
                borderRadius: "3px",
                fontSize: "10px",
                marginTop: "30px",
                "&:hover": {
                  backgroundColor: "green",
                },
              }}
              onClick={openCamera}
              variant="contained">
              <img
                style={{ width: "25px", height: "20px", marginRight: "10px" }}
                src={photo}
                alt={"icon"}
              />
              {cam === "null" && <div>Take Photo</div>}
              {cam !== "null" && (
                <div style={{ color: "#fff", fontSize: "12px" }}>Success</div>
              )}
            </Button>

            <Button
              sx={{
                width: "98%",
                height: "35px",
                background: "#427BBE",
                borderRadius: "3px",
                fontSize: "10px",
                marginTop: "20px",
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
              {loading2 === 0 && <div>Attachment</div>}
              {loading2 === 1 && (
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
              {loading2 === 2 && (
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

const inner = {
  width: "100%",
  height: "500px",
  overflowY: "scroll",
};

const menu = {
  fontSize: "12px",
};

export default AddPayModal;
