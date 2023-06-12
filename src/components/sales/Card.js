import * as React from "react";
import { useMediaQuery } from "@mui/material";
import "./sales.scss";
const Card = ({ title, subText, uri, style, ...props }) => {
  const mobile = useMediaQuery("(max-width:900px)");
  return (
    <div className="card" style={{ ...style }} {...props}>
      <div className="card-text-wrap">
        <img className="img" src={uri} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label className="title-text">{title}</label>
          <label>{subText}</label>
        </div>
      </div>
      <div className="image-wrap">
        <img style={{}} src={require("../img/Arrow.svg").default} />
      </div>
    </div>
  );
};
export default Card;
