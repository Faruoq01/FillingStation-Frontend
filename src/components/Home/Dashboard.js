import React from "react";
import "../../styles/dashboard.scss";
import { Outlet } from "react-router-dom";

const Dashboard = (props) => {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};

export default Dashboard;
