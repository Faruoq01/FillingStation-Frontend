import React from "react";
import "../../styles/hr.scss";
import { Outlet } from "react-router-dom";

const HumanResource = (props) => {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};

export default HumanResource;
