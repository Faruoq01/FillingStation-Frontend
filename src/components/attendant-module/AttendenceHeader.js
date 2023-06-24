import React, { useState } from "react";
import "./attendance.scss";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

export default function AttendenceHeader() {
  const [dropdownStatus, setDropdownStatus] = useState(false);

  return (
    <div className="att-header">
      <div className="row-item">
        <span>Welcome, Oluwasegun &#128075;</span>
        <label for="sub text">
          Lorem ipsum dolor sit amet consectetur. landit sit
        </label>
      </div>
      <div className="right-item ">
        <img
          style={{ marginRight: 3 }}
          src={require("../../assets/attendance/date.svg").default}
        />
        <img
          style={{ marginRight: 3 }}
          src={require("../../assets/attendance/notification.svg").default}
        />
        <span>Hi, Olayimika </span>
        <img
          src={require("../../assets/attendance/notification.svg").default}
        />
      </div>
      <div className="menu-icon-wrap">
        {!dropdownStatus ? (
          <MenuOpenIcon
            onClick={() => {
              setDropdownStatus(!dropdownStatus);
            }}
            className="icon-menu"
          />
        ) : (
          <MenuIcon
            onClick={() => {
              setDropdownStatus(!dropdownStatus);
            }}
            className="icon-menu"
          />
        )}
        <div className={`card-items- ${dropdownStatus && "dis-none"}`}>
          <div className="wrap-wrap-dropdown">
            <div className="row-item">
              <span>Welcome, Oluwasegun &#128075;</span>
              <label for="sub text">
                Lorem ipsum dolor sit amet consectetur. landit sit
              </label>
            </div>
            <div className="right-item ">
              <img
                style={{ marginRight: 5 }}
                src={require("../../assets/attendance/date.svg").default}
              />
              <img
                style={{ marginRight: 5 }}
                src={
                  require("../../assets/attendance/notification.svg").default
                }
              />
              <span>Hi, Olayimika </span>
              <img
                src={
                  require("../../assets/attendance/notification.svg").default
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
