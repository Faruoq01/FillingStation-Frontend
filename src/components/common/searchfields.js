import { OutlinedInput } from "@mui/material";

const mobile = window.matchMedia("(max-width: 600px)");

export const SearchField = ({ ml, callback }) => {
  return (
    <div
      style={{ marginLeft: mobile.matches ? "0px" : ml }}
      className="second-select">
      <OutlinedInput
        placeholder={"Search"}
        sx={style}
        onChange={(e) => {
          callback(e.target.value);
        }}
      />
    </div>
  );
};

const style = {
  minWidth: mobile.matches ? "225px" : "120px",
  maxWidth: "300px",
  height: "30px",
  fontSize: "12px",
  background: "#F2F1F1",
  color: "#000",
  borderRadius: "0px",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};
