import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import stationLogo from "../../assets/landing/stationLogo.jpeg";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = ({ page, setPage }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigatePages = (data) => {
    setPage(data);
    handleClose();
  };

  return (
    <React.Fragment>
      <div className="navigation-menu">
        <div className="inner-nav">
          <img
            src={stationLogo}
            style={{ width: "110px", height: "40px" }}
            alt="icon"
          />
          <div className="menu-icons">
            <span
              onClick={() => {
                navigatePages(0);
              }}
              style={{ color: page === 0 ? "green" : "#000" }}
              className="items"
            >
              Home
            </span>
            <span
              onClick={() => {
                navigatePages(1);
              }}
              style={{ color: page === 1 ? "green" : "#000" }}
              className="items"
            >
              How it works
            </span>
            <span
              onClick={() => {
                navigatePages(2);
              }}
              style={{ color: page === 2 ? "green" : "#000" }}
              className="items"
            >
              Feature
            </span>
            <span
              onClick={() => {
                navigatePages(3);
              }}
              style={{ color: page === 3 ? "green" : "#000" }}
              className="items"
            >
              Pricing
            </span>
            <div className="items">
              <Button
                sx={{
                  width: "100%",
                  height: "40px",
                  background: "#266910",
                  borderRadius: "3px",
                  fontStyle: "normal",
                  fontWeight: "700",
                  fontSize: "10px",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#266910",
                  },
                }}
                variant="contained"
              >
                CONTACT US
              </Button>
            </div>
          </div>

          <div className="menu">
            <IconButton onClick={handleClick}>
              <MenuIcon />
            </IconButton>
          </div>
        </div>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => {
              navigatePages(0);
            }}
          >
            Home
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigatePages(1);
            }}
          >
            How it works
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigatePages(2);
            }}
          >
            Feature
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigatePages(3);
            }}
          >
            Pricing
          </MenuItem>
          <MenuItem onClick={handleClose}>Contact Us</MenuItem>
        </Menu>
      </div>
    </React.Fragment>
  );
};

export default Navbar;
