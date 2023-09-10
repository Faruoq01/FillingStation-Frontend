import { useSelector } from "react-redux";
import ModalBackground from "../controls/Modal/ModalBackground";
import { useEffect } from "react";
import { useState } from "react";
import { MenuItem, Select } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const mobile = window.matchMedia("(max-width: 600px)");

const GenerateReports = ({ open, close }) => {
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const [headers, setHeaders] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);

  useEffect(() => {
    const oneStation = allOutlets ? allOutlets[0] : [];
    const keys = Object.keys(oneStation);
    setHeaders(keys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToList = (field) => {
    setSelectedFields([...selectedFields, field]);
    setHeaders((prev) => prev.filter((data) => data !== field));
  };

  const removeFromList = (field) => {
    setSelectedFields((prev) => prev.filter((data) => data !== field));
    setHeaders([...headers, field]);
  };

  return (
    <ModalBackground
      openModal={open}
      closeModal={close}
      ht={"400px"}
      report={true}
      //   loading={loading}
      label={"Generate Reports Settings"}>
      <SelectList callback={addToList} menus={headers} />
      <div style={selectedFields.length === 0 ? container2 : container}>
        {selectedFields.map((data, index) => {
          return (
            <div style={keyStyle} key={index}>
              {data}
              <HighlightOffIcon
                onClick={() => {
                  removeFromList(data);
                }}
                sx={cancelStyle}
              />
            </div>
          );
        })}
        {selectedFields.length === 0 && (
          <span>Select Field to be reported</span>
        )}
      </div>
    </ModalBackground>
  );
};

const SelectList = ({ callback, menus }) => {
  const setData = (item) => {
    callback(item);
  };
  return (
    <Select
      labelId="demo-select-small"
      id="demo-select-small"
      MenuProps={menuProps}
      value={0}
      sx={selectStyle2}>
      <MenuItem style={menu} value={0}>
        Select all fields that apply
      </MenuItem>
      {menus?.map((item, index) => {
        return (
          <MenuItem
            onClick={() => {
              setData(item);
            }}
            key={index}
            style={menu}
            value={index + 1}>
            {item}
          </MenuItem>
        );
      })}
    </Select>
  );
};

const selectStyle2 = {
  minWidth: mobile.matches ? "100%" : "120px",
  maxWidth: "300px",
  height: "30px",
  borderRadius: "0px",
  background: "#F2F1F1B2",
  color: "grey",
  fontSize: "12px",
  outline: "none",
  fontFamily: "Poppins",
  marginTop: "15px",
  position: "fixed",
  opacity: 1,
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const menu = {
  fontSize: "12px",
  fontFamily: "Poppins",
  "& .MuiPaper-root": {
    maxHeight: "200px",
  },
};

const container = {
  marginTop: "50px",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  minHeight: "350px",
};

const container2 = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Poppins",
  fontSize: "12px",
  minHeight: "400px",
};

const keyStyle = {
  marginTop: "10px",
  minWidth: "10px",
  height: "30px",
  border: "1px solid #ccc",
  color: "#000",
  paddingLeft: "10px",
  paddingRight: "5px",
  borderRadius: "20px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
};

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: "200px",
    },
  },
};

const cancelStyle = {
  marginLeft: "10px",
  color: "grey",
};

export default GenerateReports;
