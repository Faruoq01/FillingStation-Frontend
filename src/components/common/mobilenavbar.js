import {
  AppBar,
  Badge,
  IconButton,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import search from "../../assets/search.png";
import note from "../../assets/note.png";
import switchT from "../../assets/switchT.png";
import dark from "../../assets/dark.png";
import UserService from "../../services/360station/user";
import { updateUser } from "../../storage/auth";
import { useEffect } from "react";
import { routeNames } from "../../modules/routenames";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useTheme } from "@mui/material/styles";

const MobileNavBar = ({ open, drawer }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const user = useSelector((state) => state.auth.user);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setName(routeNames[pathname]);
  }, [pathname]);

  const toggleDrawer = () => {
    navigate(-1);
  };

  const switchDarkMode = () => {
    const payload = {
      id: user._id,
      isDark: user.isDark === "0" ? "1" : "0",
    };

    UserService.updateUserDarkMode(payload)
      .then((data) => {
        return data;
      })
      .then((data) => {
        UserService.getOneUser({ id: data.user._id }).then((data) => {
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch(updateUser(data.user));
        });
      });
  };

  function capitalizeFirstLetter(str) {
    if (str.length === 0) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const getStationDetails = (name) => {
    if (name === "Comprehensive Report") {
      if (isSmallScreen) {
        return "Daily Reports";
      }
      return capitalizeFirstLetter(name);
    }

    return capitalizeFirstLetter(name);
  };

  return (
    <div className="mobile-bar">
      <AppBar sx={{ background: "#ccc", zIndex: "50" }} position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}>
            <KeyboardBackspaceIcon sx={{ color: "#000" }} />
          </IconButton>
          <span style={roots}>{getStationDetails(name)}</span>
          <div style={navbar} className="side-app-bar">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ marginRight: "0px" }}>
              <img
                style={{ width: "35px", height: "35px" }}
                src={search}
                alt="icon"
              />
            </IconButton>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ marginRight: "0px" }}
              onClick={open}>
              {user.noteCount === "0" || (
                <Badge badgeContent={user.noteCount} color="error">
                  <img
                    style={{ width: "35px", height: "35px" }}
                    src={note}
                    alt="icon"
                  />
                </Badge>
              )}
              {user.noteCount === "0" && (
                <img
                  style={{ width: "35px", height: "35px" }}
                  src={note}
                  alt="icon"
                />
              )}
            </IconButton>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ marginRight: "0px" }}
              onClick={switchDarkMode}>
              <img
                style={{ width: "35px", height: "35px" }}
                src={user.isDark ? dark : switchT}
                alt="icon"
              />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

const roots = {
  width: "100%",
  fontSize: "15px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  color: "#000",
  fontFamily: "Poppins",
};

const navbar = {
  display: "flex",
  flexDirection: "row",
};

export default MobileNavBar;
