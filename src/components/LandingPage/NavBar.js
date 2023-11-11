import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import stationLogo from "../../assets/landing/stationLogo.jpeg";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = ({ page, setPage }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigatePages = (data) => {
    setPage(data);
    handleClose();
  };

  return (
    <React.Fragment>
      <NavBarBackground
        page={page}
        setPage={setPage}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        open={open}>
        <span
          onClick={() => {
            navigatePages(0);
          }}
          style={{ color: page === 0 ? "green" : "#000" }}
          className="items">
          HOME
        </span>
        <span
          onClick={() => {
            navigatePages(1);
          }}
          style={{ color: page === 1 ? "green" : "#000" }}
          className="items">
          HOW IT WORKS
        </span>
        <span
          onClick={() => {
            navigatePages(2);
          }}
          style={{ color: page === 2 ? "green" : "#000" }}
          className="items">
          FEATURE
        </span>
        <span
          onClick={() => {
            navigatePages(3);
          }}
          style={{ color: page === 3 ? "green" : "#000" }}
          className="items">
          PRICING
        </span>
        <span
          onClick={() => {
            navigatePages(4);
          }}
          style={{ color: page === 4 ? "green" : "#000" }}
          className="items">
          ABOUT Us
        </span>
        <div className="items">
          <Button
            onClick={() => {
              navigatePages(5);
            }}
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
            variant="contained">
            CONTACT US
          </Button>
        </div>
      </NavBarBackground>
    </React.Fragment>
  );
};

const NavBarBackground = ({
  children,
  setPage,
  anchorEl,
  setAnchorEl,
  open,
}) => {
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className="navigation-menu">
      <div className="inner-nav">
        <img
          src={stationLogo}
          style={{ width: "110px", height: "40px" }}
          alt="icon"
        />
        <div className="menu-icons">{children}</div>
        <div className="menu">
          <IconButton onClick={handleClick}>
            <MenuIcon />
          </IconButton>
        </div>
      </div>
      <MobileMenu
        setPage={setPage}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        open={open}
      />
    </div>
  );
};

const MobileMenu = ({ setPage, anchorEl, setAnchorEl, open }) => {
  const navigatePages = (data) => {
    setPage(data);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}>
      <MenuItem
        onClick={() => {
          navigatePages(0);
        }}>
        HOME
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigatePages(1);
        }}>
        HOW IT WORKS
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigatePages(2);
        }}>
        FEATURE
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigatePages(3);
        }}>
        PRICING
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigatePages(4);
        }}>
        ABOUT US
      </MenuItem>
      <MenuItem onClick={handleClose}>Contact Us</MenuItem>
    </Menu>
  );
};

export default Navbar;
