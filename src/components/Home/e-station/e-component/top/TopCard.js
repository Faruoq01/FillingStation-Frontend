import React from "react";
import PropTypes from "prop-types";
import "./top_.scss";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

function TopCard(props) {
  return (
    <div className="t-card" {...props}>
      <div className="t-card-top">
        <div className="icon-shade"></div>
        <div className="icon-wrapper">{props.icon}</div>
        <div className="title-wrap">
          <span className="tcard-amount">{props.amount}</span>
          <label className="tcard-title">{props.title}</label>
        </div>
      </div>
      <div className="t-card-bottom" style={{ ...props.arrowStyle }}>
        <img
          src={require("../../img/Arrow.svg").default}
          style={{ color: "#054834", marginBottom: 20 }}
        />
      </div>
    </div>
  );
}

TopCard.propTypes = {};

export default TopCard;
