import { MenuItem, Select } from "@mui/material";

const MobileMenuListing = ({ callback, preview, label }) => {
  return (
    <div style={{ marginTop: "10px" }} className="action">
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={10}
        sx={{
          ...selectStyle2,
          marginRight: "5px",
        }}>
        <MenuItem style={menu} value={10}>
          Action
        </MenuItem>
        <MenuItem
          style={menu}
          onClick={() => {
            callback(1);
          }}
          value={20}>
          Create new filling station
        </MenuItem>
        <MenuItem style={menu} onClick={preview} value={40}>
          Generate report
        </MenuItem>
      </Select>
    </div>
  );
};

const selectStyle2 = {
  maxWidth: "150px",
  width: "100%",
  height: "35px",
  borderRadius: "0px",
  background: "#F2F1F1B2",
  color: "#fff",
  fontSize: "12px",
  outline: "none",
  backgroundColor: "#06805B",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const menu = {
  fontSize: "12px",
  fontFamily: "Poppins",
};

export default MobileMenuListing;
