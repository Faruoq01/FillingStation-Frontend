import { OutlinedInput } from "@mui/material";
import ApproximateDecimal from "../common/approx";

const ModalNumberInput = ({ value, setValue }) => {
  const handleInput = (e) => {
    const removeFormat = e.target.value.replace(/^0|[^.\w\s]/gi, "");
    setValue(removeFormat);
  };

  return (
    <div className="inputs">
      <div className="head-text2">Quantity</div>
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
        value={ApproximateDecimal(value)}
        onChange={handleInput}
      />
    </div>
  );
};

export default ModalNumberInput;
