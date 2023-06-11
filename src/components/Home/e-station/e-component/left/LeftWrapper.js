import React from "react";
import PropTypes from "prop-types";
import "./left.scss";
import ChartWrapper from "./ChartWrapper";
import TableWrapper from "./TableWrapper";

function LeftWrapper(props) {
  return (
    <div className="l-wrapper">
      <ChartWrapper />
      <TableWrapper />
    </div>
  );
}

LeftWrapper.propTypes = {};

export default LeftWrapper;
