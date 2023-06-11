import React from "react";
import PropTypes from "prop-types";
import "./rCard.scss";
import { Circle } from "@mui/icons-material";

function RCard(props) {
  return (
    <div className="r-card" {...props}>
      <div className="r-card-top">
        <div className="r-icon-shade"></div>
        <div className="r-icon-wrapper">{props.icon}</div>
        <div className="r-title-wrap">
          <span className="r-card-amount">{props.amount}</span>
          <label className="r-card-title">
            {props.dot && (
              <Circle
                style={{
                  fontSize: 8,
                  marginRight: "10px",
                  color:
                    props.type == "PMS"
                      ? "#399A19"
                      : props.type == "AGO"
                      ? "#FFA010"
                      : "#35393E",
                }}
              />
            )}
            {props.title}
          </label>
        </div>
      </div>
      <div className="r-card-bottom" style={{ ...props.arrowStyle }}>
        <img
          src={require("../../img/Arrow.svg").default}
          style={{ color: "#054834", marginBottom: 20 }}
        />
      </div>
    </div>
  );
}

RCard.propTypes = {};

export default RCard;
