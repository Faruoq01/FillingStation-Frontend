import React, { useState } from "react";
import "../../../styles/lpo.scss";
import ModalBackground from "../../controls/Modal/ModalBackground";
import ModalInputField from "../../controls/Modal/ModalInputField";
import { MenuItem, Select } from "@mui/material";
import { useSelector } from "react-redux";

const list = ["PMS", "AGO", "DPK"];

const PriceChangeModal = ({ open, closeup }) => {
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [sales, setSales] = useState("");
  const [product, setProuct] = useState("");
  const [station, setStation] = useState("");

  const submit = async () => {
    const payload = {
      date: date,
      sales: sales,
      product: product,
      station: station,
    };

    console.log(payload, "payload");
  };

  return (
    <ModalBackground
      openModal={open}
      closeModal={closeup}
      submit={submit}
      loading={loading}
      label={"Change selling price of recorded sales"}
      ht={"330px"}>
      <ModalInputField
        value={date}
        setValue={setDate}
        type={"date"}
        label={"Date"}
      />
      <ModalInputField
        value={sales}
        setValue={setSales}
        type={"text"}
        label={"Selling price"}
      />

      <SelectModal
        name={"Select product type"}
        list={list}
        setData={setProuct}
      />

      <SelectStation
        name={"Select station"}
        list={allOutlets}
        setData={setStation}
      />
    </ModalBackground>
  );
};

const SelectModal = ({ name, list, setData }) => {
  const [selected, setSelected] = useState(0);

  const getSelectedItem = (data, index) => {
    setSelected(index);
    setData(data);
  };
  return (
    <React.Fragment>
      <div style={label}>{name}</div>
      <Select MenuProps={menuProps} value={selected} sx={style}>
        {list.map((data, index) => {
          return (
            <MenuItem
              onClick={() => {
                getSelectedItem(data, index + 1);
              }}
              value={index + 1}
              key={index}
              sx={menu}>
              {data}
            </MenuItem>
          );
        })}
      </Select>
    </React.Fragment>
  );
};

const SelectStation = ({ name, list, setData }) => {
  const [selected, setSelected] = useState(0);

  const getSelectedItem = (data, index) => {
    setSelected(index);
    setData(data._id);
  };
  return (
    <React.Fragment>
      <div style={label}>{name}</div>
      <Select MenuProps={menuProps} value={selected} sx={style}>
        <MenuItem
          onClick={() => {
            getSelectedItem("All stations", null);
          }}
          value={0}
          sx={menu}>
          All stations
        </MenuItem>
        {list.map((data, index) => {
          return (
            <MenuItem
              onClick={() => {
                getSelectedItem(data, index + 1);
              }}
              value={index + 1}
              key={index}
              sx={menu}>
              {data.outletName}
            </MenuItem>
          );
        })}
      </Select>
    </React.Fragment>
  );
};

const style = {
  width: "100%",
  height: "35px",
  background: "#EEF2F1",
  color: "#000",
  fontSize: "12px",
  outline: "none",
  marginTop: "5px",
  borderRadius: "0px",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const label = {
  fontSize: "12px",
  fontFamily: "Poppins",
  marginTop: "20px",
  fontWeight: "500",
};

const menu = {
  fontSize: "12px",
  fontFamily: "Poppins",
  fontWeight: "500",
};

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: "300px",
    },
  },
};

export default PriceChangeModal;
