import React from "react";
import "./airbnb.scss";
import CircleIcon from "@mui/icons-material/Circle";
export default function SmallCardLeft({ ...props }) {
  return (
    <div style={{ ...props.style }} className="left-card">
      <div className="left-card-inner">
        <div className="img-txt-wraper">
          <img src={props.icon} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              marginLeft: "10px",
              alignContent: "center",
              marginTop: 5,
            }}
          >
            <span>{props.amount}</span>
            <label>
              <CircleIcon color="green" fontSize="15" />
              {props?.title}
            </label>
          </div>
        </div>
        <img
          style={{
            width: 30,
            height: 30,
            alignSelf: "center",
          }}
          src={require("../../assets/estation/Arrow.svg").default}
        />
      </div>
    </div>
  );
}
