import { MenuItem, Select } from "@mui/material";

const mobile = window.matchMedia("(max-width: 600px)");

export const LimitSelect = ({ entries, entriesMenu }) => {
  return (
    <Select
      labelId="demo-select-small"
      id="demo-select-small"
      value={entries}
      sx={selectStyle2}>
      <MenuItem style={menu} value={10}>
        Show entries
      </MenuItem>
      <MenuItem
        onClick={() => {
          entriesMenu(20, 15);
        }}
        style={menu}
        value={20}>
        15 entries
      </MenuItem>
      <MenuItem
        onClick={() => {
          entriesMenu(30, 30);
        }}
        style={menu}
        value={30}>
        30 entries
      </MenuItem>
      <MenuItem
        onClick={() => {
          entriesMenu(40, 100);
        }}
        style={menu}
        value={40}>
        100 entries
      </MenuItem>
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
  marginTop: mobile.matches ? "10px" : "0px",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const menu = {
  fontSize: "12px",
  fontFamily: "Poppins",
};
