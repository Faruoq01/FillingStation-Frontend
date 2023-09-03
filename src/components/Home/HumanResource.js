import React from "react";
import "../../styles/hr.scss";
import hr1 from "../../assets/hr1.png";
import hr11 from "../../assets/hr11.png";
import hr3 from "../../assets/hr3.png";
import hr5 from "../../assets/hr5.png";
import me6 from "../../assets/me6.png";
import { useNavigate } from "react-router-dom";

const HumanResource = (props) => {
  const navigate = useNavigate();

  const handleNavigation = (data) => {
    if (data.name === "Employee") {
      navigate("hremployees");
    } else if (data.name === "Salary structure") {
      navigate("salary");
    } else if (data.name === "Query") {
      navigate("query");
    } else if (data.name === "Attendance") {
      navigate("attendance");
    }
  };

  const DashboardImage = (props) => {
    return (
      <div
        data-aos="flip-left"
        onClick={() => {
          handleNavigation(props);
        }}
        className="first-image">
        <div style={{ marginRight: "10px" }} className="inner-first-image">
          <div className="top-first-image">
            <div className="top-icon">
              <img
                style={{ width: "60px", height: "50px" }}
                src={props.image}
                alt="icon"
              />
            </div>
            <div style={{ justifyContent: "flex-end" }} className="top-text">
              <div style={{ fontSize: "14px" }}>{props.name}</div>
            </div>
          </div>
          <div className="bottom-first-image">
            <img
              style={{ width: "30px", height: "10px" }}
              src={me6}
              alt="icon"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div data-aos="zoom-in-down" className="hrContainer">
      <div style={contain2}>
        <div className="imgContainer">
          <DashboardImage image={hr1} name={"Employee"} value={"41"} />
          <DashboardImage image={hr11} name={"Salary structure"} value={"41"} />
          <DashboardImage image={hr3} name={"Query"} value={"41"} />
          <DashboardImage image={hr5} name={"Attendance"} value={"41"} />
        </div>
      </div>
    </div>
  );
};

const contain2 = {
  width: "96%",
  marginLeft: "2%",
};

export default HumanResource;
