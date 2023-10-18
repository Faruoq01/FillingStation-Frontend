import React from "react";
import { Box, Drawer } from "@mui/material";
import DesktopSideBar from "./desktopsidebar";

const MobileSideBar = ({ isOpen, toggleDrawer }) => {
  return (
    <React.Fragment>
      <Drawer open={isOpen} onClose={toggleDrawer} direction="left">
        <Box sx={sidebar}>
          <DesktopSideBar />
        </Box>
      </Drawer>
    </React.Fragment>
  );
};

const sidebar = {
  width: "200px",
  height: "100vh",
};

export default MobileSideBar;
