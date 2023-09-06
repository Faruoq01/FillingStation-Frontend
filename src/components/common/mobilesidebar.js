import React from "react";
import { Drawer } from "@mui/material";
import DesktopSideBar from "./desktopsidebar";

const MobileSideBar = ({ isOpen, toggleDrawer }) => {
  return (
    <React.Fragment>
      <Drawer open={isOpen} onClose={toggleDrawer} direction="left">
        <DesktopSideBar />
      </Drawer>
    </React.Fragment>
  );
};

export default MobileSideBar;
