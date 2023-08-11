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
import APIs from "../../../services/api";

const ExpensesModal = (props) => {
  const attach = useRef();
  const [loading, setLoading] = useState(false);
  const [camLoader, setCamLoader] = useState(0);
  const [gallLoader, setGallLoader] = useState(0);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const currentDate = useSelector((state) => state.dailysales.updatedDate);

  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [cam, setCam] = useState(null);
  const [gall, setGall] = useState(null);

  const handleClose = () => props.close(false);

  const submit = async () => {
    if (oneStationData === null)
      return swal("Warning!", "Please select a station", "info");
    if (expenseAmount === "")
      return swal("Warning!", "Amount field cannot be empty", "info");
    if (expenseName === "")
      return swal("Warning!", "Description field cannot be empty", "info");
    if (description === "")
      return swal("Warning!", "Contact field cannot be empty", "info");
    setLoading(true);

    const payload = lpoPayload(
      currentDate,
      expenseName,
      expenseAmount,
      description,
      oneStationData,
      currentDate,
      cam,
      gall
    );

    try {
      await APIs.post("/comprehensive/create-expenses", payload);
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
            <div className="head-text">Register Expenses</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={inner}>
            <div className="inputs">
              <div className="head-text2">Expense Name</div>
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
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Expense Amount</div>
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
                value={expenseAmount}
                type="number"
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Description</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  padding: "10px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                multiline
                rows={5}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Expense Date</div>
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
                value={currentDate}
                disabled
                type="date"
                // onChange={(e) => setDate(e.target.value)}
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

const lpoPayload = (
  date,
  expenseName,
  expenseAmount,
  description,
  oneStationData,
  currentDate,
  cam,
  gall
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
    dateCreated: date,
    expenseName: expenseName,
    description: description,
    expenseAmount: expenseAmount,
    attachApproval: pic(),
    outletID: oneStationData._id,
    organizationID: oneStationData.organisation,
    createdAt: currentDate,
    updatedAt: currentDate,
  };
};

const inner = {
  width: "100%",
  height: "500px",
  overflowY: "scroll",
};

export default ExpensesModal;
