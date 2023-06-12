import React from "react";
import PropTypes from "prop-types";
import "../../../styles/estation/left.scss";
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
