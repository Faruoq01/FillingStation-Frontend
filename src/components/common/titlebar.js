import React from "react";
import "../../styles/common/titlebar.scss";
import CircleIcon from "@mui/icons-material/Circle";
import { useSelector } from "react-redux";

const TitleNavBar = () => {
  const user = useSelector((state) => state.auth.user);
  const station = useSelector((state) => state.outlet.adminOutlet);

  const Prices = ({ data }) => {
    return (
      <div className="products-price-container">
        <div className="prod">
          <CircleIcon sx={{ ...dot, color: "#399A19" }} />{" "}
          <span>PMS: {data.PMSPrice}N/Ltr</span>
        </div>
        <div className="prod">
          <CircleIcon sx={{ ...dot, color: "#FFA010" }} />{" "}
          <span>AGO: {data.AGOPrice}N/Ltr</span>
        </div>
        <div className="prod">
          <CircleIcon sx={{ ...dot, color: "#35393E" }} />{" "}
          <span>DPK: {data.DPKPrice}N/Ltr</span>
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className="namebar-container">
        <div className="namebar-inner">
          <div className="name-style">{user.organisation}</div>
          {station === null ? <span></span> : <Prices data={station} />}
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
