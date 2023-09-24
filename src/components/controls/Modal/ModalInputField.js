import { OutlinedInput } from "@mui/material";
import ApproximateDecimal from "../../common/approx";

const ModalInputField = ({
  value,
  setValue,
  type,
  label,
  disabled = false,
  mt = "20px",
  data = null,
}) => {
  const handleInput = (e) => {
    const removeFormat = e.target.value.replace(/^0|[^.\w\s]/gi, "");
    if (type !== "number" || type === "time") return setValue(e.target.value);

    if (type === "number") {
      if (data !== null) {
        return setValue(removeFormat, data);
      }
      return setValue(removeFormat);
    }
  };

  const getInputType = () => {
    if (type === "date") return "date";
    if (type === "time") return "time";
    return "text";
  };

  const getDefaultInputValue = () => {
    if (type === "date" || type === "text" || type === "time") return value;
    return ApproximateDecimal(value);
  };

  return (
    <div style={{ marginTop: mt }} className="inputs">
      <div className="head-text2">{label}</div>
      <OutlinedInput
        disabled={disabled}
        sx={style}
        type={getInputType()}
        placeholder=""
        value={getDefaultInputValue()}
        onChange={handleInput}
      />
    </div>
  );
};

const style = {
  width: "100%",
  height: "35px",
  background: "#EEF2F1",
  fontSize: "12px",
  borderRadius: "0px",
  marginTop: "5px",
  uerSelected: "none",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

export default ModalInputField;
