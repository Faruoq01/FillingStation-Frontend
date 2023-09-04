import React from "react";
import "../../styles/payments.scss";
import { Outlet } from "react-router-dom";

const Outlets = () => {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};

export default Outlets;
