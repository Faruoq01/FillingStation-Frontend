import { AppBar, Badge, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import search from "../../assets/search.png";
import note from "../../assets/note.png";
import switchT from "../../assets/switchT.png";
import dark from "../../assets/dark.png";
import UserService from "../../services/360station/user";
import { updateUser } from "../../storage/auth";
import { useEffect } from "react";
import { routeNames } from "../../modules/routenames";

const MobileNavBar = ({ open, drawer }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const singleLPO = useSelector((state) => state.lpoReducer.singleLPO);
  const [name, setName] = useState("");

  useEffect(() => {
    setName(routeNames[pathname]);
  }, [pathname]);

  const toggleDrawer = () => {
    drawer((prevState) => !prevState);
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
    return capitalizeFirstLetter(name);
  };

  return (
    <div className="mobile-bar">
      <AppBar sx={{ background: "#06805B", zIndex: "50" }} position="absolute">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <span style={roots}>{getStationDetails(name)}</span>
          <div className="side-app-bar">
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
  fontSize: "14px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
};

export default MobileNavBar;
