import { Button } from "@mui/material";

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
      Print
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
  "&:hover": {
    backgroundColor: "#58A0DF",
  },
};

const print = {
  minWidth: "80px",
  height: "30px",
  background: "#F36A4C",
  borderRadius: "0px",
  fontSize: "10px",
  marginLeft: "10px",
  "&:hover": {
    backgroundColor: "#F36A4C",
  },
};
