import React from "react";
import { Drawer } from "@mui/material";
import "../../styles/home.scss";
import DesktopSideBar from "./desktopsidebar";

const MobileSideBar = ({ isOpen, toggleDrawer }) => {
  return (
    <React.Fragment>
      <Drawer open={isOpen} onClose={toggleDrawer} direction="left">
        <div style={outer}>
          <DesktopSideBar />
        </div>
      </Drawer>
    </React.Fragment>
  );
};

const outer = {
  width: "auto",
  height: "auto",
};

export default MobileSideBar;
