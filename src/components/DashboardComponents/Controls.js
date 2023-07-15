import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardService from "../../services/dashboard";
import { adminOutlet } from "../../store/actions/outlet";
import swal from "sweetalert";
import { MenuItem, Select } from "@mui/material";
import { dateRange } from "../../storage/dashboard";

const mobile = window.matchMedia("(max-width: 600px)");

const Controls = () => {
  const dispatch = useDispatch();
  const moment = require("moment-timezone");
  const user = useSelector((state) => state.auth.user);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updatedDate = useSelector((state) => state.dashboard.dateRange);
  const [defaultState, setDefault] = useState(0);
  const [load, setLoad] = useState(false);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.dashboard[e];
  };

  const onChangeRange = (date) => {
    setLoad(true);

    const formatOne = moment(new Date(date[0]))
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];
    const formatTwo = moment(new Date(date[1]))
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];
    dispatch(dateRange([new Date(formatOne), new Date(formatTwo)]));
  };

  const changeMenu = (index, item) => {
    if (!getPerm("2") && item === null)
      return swal("Warning!", "Permission denied", "info");
    setDefault(index);
    dispatch(adminOutlet(item));
    setLoad(true);

    const formatOne = moment(new Date(updatedDate[0]))
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];
    const formatTwo = moment(new Date(updatedDate[1]))
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];
  };

  return (
    <div style={{ width: "auto" }} className="selectItem">
      <div style={{ marginRight: "10px" }} className="first-select">
        <DateRangePicker
          disabled={!getPerm("0")}
          onChange={onChangeRange}
          value={updatedDate}
        />
      </div>
      <div
        style={{ width: mobile.matches ? "230px" : "150px" }}
        className="second-select">
        {getPerm("1") && (
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={defaultState}
            sx={selectStyle2}>
            <MenuItem
              onClick={() => {
                changeMenu(0, null);
              }}
              style={menu}
              value={0}>
              All Stations
            </MenuItem>
            {allOutlets.map((item, index) => {
              return (
                <MenuItem
                  key={index}
                  style={menu}
                  onClick={() => {
                    changeMenu(index + 1, item);
                  }}
                  value={index + 1}>
                  {item.outletName + ", " + item.alias}
                </MenuItem>
              );
            })}
          </Select>
        )}
        {getPerm("1") || (
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={0}
            sx={selectStyle2}
            disabled>
            <MenuItem style={menu} value={0}>
              {!getPerm("1")
                ? oneStationData?.outletName + ", " + oneStationData?.alias
                : "No station created"}
            </MenuItem>
          </Select>
        )}
      </div>
    </div>
  );
};

const selectStyle2 = {
  width: "100%",
  height: "30px",
  borderRadius: "0px",
  background: "#F2F1F1B2",
  color: "#000",
  fontSize: "12px",
  outline: "none",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const menu = {
  fontSize: "12px",
};

export default Controls;
