import React from "react";
import "../../styles/payments.scss";
import { Outlet } from "react-router-dom";

const LPO = (props) => {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};

export default LPO;
