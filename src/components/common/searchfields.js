import { OutlinedInput } from "@mui/material";

export const SearchField = ({ placeholder, callback }) => {
  return (
    <div className="second-select">
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
  width: "100%",
  height: "35px",
  fontSize: "12px",
  background: "#F2F1F1",
  color: "#000",
  borderRadius: "0px",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};
