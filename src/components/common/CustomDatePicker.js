import { Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React from "react";

const mobile = window.matchMedia("(max-width: 600px)");

function ButtonField(props) {
  const {
    setOpen,
    label,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { "aria-label": ariaLabel } = {},
  } = props;

  return (
    <Button
      id={id}
      sx={{
        width: "110px",
        height: "30px",
        fontSize: "12px",
        borderRadius: "0px",
        background: "#06805B",
        color: "#fff",
        textTransform: "capitalize",
        "&:hover": {
          backgroundColor: "#06805B",
        },
      }}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      onClick={() => setOpen?.((prev) => !prev)}>
      {label ?? "Pick a date"}
    </Button>
  );
}

function ButtonDatePicker(props) {
  const [open, setOpen] = React.useState(false);

  return (
    <DatePicker
      slots={{ field: ButtonField, ...props.slots }}
      slotProps={{ field: { setOpen } }}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    />
  );
}

export default ButtonDatePicker;
