import { Button } from "@mui/material";
const mobile = window.matchMedia("(max-width: 600px)");

export const CreateButton = ({ callback, label }) => {
  return (
    <Button
      sx={style}
      onClick={() => {
        callback(1);
      }}
      variant="contained">
      {label}
    </Button>
  );
};

export const HistoryButton = ({ callback }) => {
  return (
    <Button sx={history} onClick={callback} variant="contained">
      History
    </Button>
  );
};

export const PrintButton = ({ callback }) => {
  return (
    <Button sx={print} onClick={callback} variant="contained">
      Generate report
    </Button>
  );
};

const style = {
  minWidth: "120px",
  height: "30px",
  background: "#427BBE",
  borderRadius: "0px",
  fontSize: "12px",
  textTransform: "capitalize",
  display: mobile.matches ? "none" : "block",
  "&:hover": {
    backgroundColor: "#427BBE",
  },
};

const history = {
  minWidth: "120px",
  height: "30px",
  background: "#58A0DF",
  borderRadius: "0px",
  fontSize: "10px",
  marginLeft: "10px",
  display: mobile.matches ? "none" : "block",
  "&:hover": {
    backgroundColor: "#58A0DF",
  },
};

const print = {
  minWidth: "80px",
  height: "30px",
  background: "#F36A4C",
  borderRadius: "30px",
  fontSize: "11px",
  marginLeft: "10px",
  textTransform: "capitalize",
  display: mobile.matches ? "none" : "block",
  "&:hover": {
    backgroundColor: "#F36A4C",
  },
};
