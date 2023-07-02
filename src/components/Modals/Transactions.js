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
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const data = [
  {
    id: 1,
    credit: "20000",
    debit: "0",
    balance: "100000",
  },
  {
    id: 2,
    credit: "20000",
    debit: "0",
    balance: "100000",
  },
  {
    id: 3,
    credit: "20000",
    debit: "0",
    balance: "100000",
  },
  {
    id: 4,
    credit: "20000",
    debit: "0",
    balance: "100000",
  },
  {
    id: 5,
    credit: "20000",
    debit: "0",
    balance: "100000",
  },
  {
    id: 6,
    credit: "20000",
    debit: "0",
    balance: "100000",
  },
  {
    id: 7,
    credit: "20000",
    debit: "0",
    balance: "100000",
  },
  {
    id: 8,
    credit: "20000",
    debit: "0",
    balance: "100000",
  },
  {
    id: 9,
    credit: "20000",
    debit: "0",
    balance: "100000",
  },
  {
    id: 10,
    credit: "20000",
    debit: "0",
    balance: "100000",
  },
];

const Transactions = (props) => {
  const date = new Date();
  const toString = date.toDateString();
  const [day, year, month] = toString.split(" ");
  const date2 = `${day} ${month} ${year}`;
  const [value, setValue] = React.useState(null);

  const handleClose = () => props.close(false);

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
      <div
        style={{ height: "auto", background: "#f7f7f7" }}
        className="modalContainer2">
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

            <div className="table-credit">
              <div className="table-credit-head">
                <div>Date</div>
                <div>Credit</div>
                <div>Debit</div>
                <div>Balance</div>
              </div>

              {data.length === 0 ? (
                <div>No records</div>
              ) : (
                data.map((item, index) => {
                  return (
                    <div
                      style={{
                        background: index % 2 === 0 ? "#fff" : "#EAF8F8",
                      }}
                      className="table-credit-row">
                      <div>{index + 1}</div>
                      <div>{item.credit}</div>
                      <div>{item.debit}</div>
                      <div>{item.balance}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div style={{ marginTop: "10px" }} className="butt">
            <div className="nav__">
              <ChevronLeftIcon />
              <div>Prev</div>
            </div>
            <div className="nav__">
              <div>Next</div>
              <KeyboardArrowRightIcon />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const inner = {
  width: "100%",
  height: "500px",
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
