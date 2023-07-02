import React, { useState } from "react";
import close from "../../assets/close.png";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import "../../styles/lpo.scss";
import ButtonDatePicker from "../common/CustomDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Stack } from "@mui/material";

const Transactions = (props) => {
  const date = new Date();
  const toString = date.toDateString();
  const [day, year, month] = toString.split(" ");
  const date2 = `${day} ${month} ${year}`;
  const [value, setValue] = React.useState(null);

  const [loading, setLoading] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [queryTitle, setQueryTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleClose = () => props.close(false);

  const submit = () => {};

  const convertDate = (newValue) => {
    const getDate = newValue === "" ? date2 : newValue.format("MM/DD/YYYY");
    const date = new Date(getDate);
    const toString = date.toDateString();
    const [day, year, month] = toString.split(" ");
    const finalDate = `${day} ${month} ${year}`;

    return finalDate;
  };

  const updateDate = (newValue) => {
    // if(!getPerm('4')) return swal("Warning!", "Permission denied", "info");
    setValue(newValue);
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
            <div className="head-text">All Transactions</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={inner}>
            <div className="printContainer">
              <Button sx={print}>Print</Button>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={1}>
                  <ButtonDatePicker
                    label={`${
                      value == null || "" ? date2 : convertDate(value)
                    }`}
                    value={value}
                    onChange={(newValue) => updateDate(newValue)}
                  />
                </Stack>
              </LocalizationProvider>
            </div>
          </div>

          <div style={{ marginTop: "10px" }} className="butt">
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
  height: "340px",
};

const print = {
  width: "60px",
  height: "30px",
  background: "tomato",
  color: "#fff",
  textTransform: "capitalize",
  marginRight: "10px",
  borderRadius: "0px",
  fontSize: "12px",
  "&:hover": {
    background: "tomato",
  },
};

export default Transactions;
