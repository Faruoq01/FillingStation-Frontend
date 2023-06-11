import React, { useId, useState } from "react";
import "./select_.scss";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
export default function AppSelect({ data = [] }) {
  const mobile = useMediaQuery("(max-width:900px)");
  const [open, setOpen] = useState(false);
  const id = useId();
  const _handleopen = (setData) => (e) => {
    setData(!open);
  };
  const [selected, setSelected] = useState("Select station");

  const data_ = [
    { id, name: "Ammasco Jabi" },
    { id, name: "Ammasco Okene" },
    { id, name: "Ammasco Jabi" },
    { id, name: "Ammasco Jabi" },
    { id, name: "Ammasco Kubuwa" },
    { id, name: "Ammasco Jabi" },
    { id, name: "Ammasco Lokoja" },
    { id, name: "Ammasco Jabi" },
  ];
  return (
    <div className="wrap-wrap-select_">
      <div onClick={_handleopen(setOpen)} className="select-wrapper">
        <div className="selected">{stripeText(selected, 10)}</div>
        <div className="select-icon-wrap">
          {open ? <ArrowDropDown /> : <ArrowDropUp />}
        </div>
      </div>
      <div
        style={{
          display: open ? "block" : "none",
        }}
        className="s-dropdown-card"
      >
        {data_.map((item, index) => (
          <div
            onClick={() => {
              setSelected(item.name);
              setOpen(!open);
            }}
            key={index + item.id}
            className="card-inner"
          >
            <label>{stripeText(`${item.name}`, 20)}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

const stripeText = (data = "", len = 12) => {
  if (data.length == 0) {
    return data;
  } else {
    if (data.length > len) {
      const da = data.slice(0, len) + "...";
      return da;
    } else if (data.length == len || data.length < len) {
      return data;
    }
  }
};
