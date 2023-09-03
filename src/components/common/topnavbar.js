import { Badge, IconButton } from "@mui/material";
import goBack from "../../assets/goBack.png";
import search from "../../assets/search.png";
import note from "../../assets/note.png";
import switchT from "../../assets/switchT.png";
import dark from "../../assets/dark.png";
import { useDispatch, useSelector } from "react-redux";
import UserService from "../../services/user";
import { updateUser } from "../../storage/auth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { routeNames } from "../../modules/routenames";

const TopNavBar = ({ open }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const singleLPO = useSelector((state) => state.lpoReducer.singleLPO);
  const [name, setName] = useState("");
  const { index } = useParams();

  useEffect(() => {
    const route = pathname.split("/")[2];
    setName(routeNames[route]);
  }, [pathname]);

  function capitalizeFirstLetter(str) {
    if (str.length === 0) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const getStationDetails = (name) => {
    if (name === "Corporate Customer") {
      return singleLPO?.companyName;
    }

    if (name === "Human Resources") {
      return capitalizeFirstLetter(name)?.concat(" ");
    }

    if (oneStationData === null) {
      return capitalizeFirstLetter(name)?.concat(" ");
    } else {
      if (typeof oneStationData?.outletName !== "undefined") {
        return (
          capitalizeFirstLetter(name)?.concat(" ") +
          "(" +
          oneStationData?.outletName.concat(", ", oneStationData?.alias) +
          ")"
        );
      }
    }
  };

  const previousPage = () => {
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

  return (
    <div className="top-bar-menu">
      <div
        style={{ color: user.isDark === "0" ? "#054834" : "#fff" }}
        className="left-lobe">
        {index !== "0" && (
          <img
            onClick={previousPage}
            style={{ width: "30px", height: "25px", marginRight: "10px" }}
            src={goBack}
            alt="icon"
          />
        )}
        <span onClick={previousPage}>{getStationDetails(name)}</span>
      </div>
      <div className="right-lobe">
        <div className="search-icon">
          <input
            className="search-content"
            type={"text"}
            placeholder="Search"
          />
          <img
            style={{ width: "35px", height: "35px", marginRight: "1px" }}
            src={search}
            alt="icon"
          />
        </div>
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
    </div>
  );
};

export default TopNavBar;
