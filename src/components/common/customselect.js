import { MenuItem, Select } from "@mui/material";

export const LimitSelect = () => {
  return (
    <Select
      labelId="demo-select-small"
      id="demo-select-small"
      value={10}
      sx={{ ...style, borderRadius: "0px" }}>
      <MenuItem style={menu} value={10}>
        Show entries
      </MenuItem>
      <MenuItem style={menu} value={20}>
        Twenty
      </MenuItem>
      <MenuItem style={menu} value={30}>
        Thirty
      </MenuItem>
    </Select>
  );
};

const style = {
  width: "120px",
  height: "35px",
  borderRadius: "5px",
  background: "#F2F1F1B2",
  color: "#000",
  fontSize: "12px",
  outline: "none",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #F2F1F1B2",
  },
};

const menu = {
  fontSize: "12px",
  fontFamily: "Poppins",
};
