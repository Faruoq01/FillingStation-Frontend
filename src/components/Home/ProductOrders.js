import React from "react";
import { Outlet } from "react-router-dom";

const ProductOrders = () => {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};

export default ProductOrders;
