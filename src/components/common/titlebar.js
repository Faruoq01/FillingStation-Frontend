import React from "react";
import "../../styles/common/titlebar.scss";
import CircleIcon from "@mui/icons-material/Circle";
import { useSelector } from "react-redux";

const TitleNavBar = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <React.Fragment>
      <div className="namebar-container">
        <div className="namebar-inner">
          <div className="name-style">
            {user.firstname.concat(" ", user.lastname)}
          </div>
          <div className="products-price-container">
            <div className="prod">
              <CircleIcon sx={{ ...dot, color: "#399A19" }} />{" "}
              <span>PMS: 600N/Ltr</span>
            </div>
            <div className="prod">
              <CircleIcon sx={{ ...dot, color: "#FFA010" }} />{" "}
              <span>AGO: 800N/Ltr</span>
            </div>
            <div className="prod">
              <CircleIcon sx={{ ...dot, color: "#35393E" }} />{" "}
              <span>DPK: 350N/Ltr</span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const dot = {
  width: "15px",
  height: "15px",
  marginRight: "5px",
};

export default TitleNavBar;
