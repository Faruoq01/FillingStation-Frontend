import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setSalesShift } from "../../storage/dailysales";
import { useEffect } from "react";
const { Select, MenuItem } = require("@mui/material");

const mobile = window.matchMedia("(max-width: 600px)");

const ShiftSelect = () => {
  const dispatch = useDispatch();
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updatedDate = useSelector((state) => state.dailysales.updatedDate);
  const [defaultSelect, setDefaultSelect] = useState(0);

  const getAllShifts = () => {
    const parsedDate = moment(updatedDate, "YYYY-MM-DD");
    const dayOfWeek = parsedDate.format("dddd").toLowerCase();
    const today = moment().format("dddd").toLowerCase();
    const targetDate = updatedDate === "" ? today : dayOfWeek;

    const station = JSON.parse(JSON.stringify(oneStationData));
    if (station) {
      if (station.shift) {
        const shifts = station.shift;
        if (targetDate in shifts) {
          const shiftList = shifts[targetDate];
          return Object.values(shiftList);
        } else {
          return [];
        }
      } else {
        return [];
      }
    } else {
      return [];
    }
  };

  useEffect(() => {
    if (oneStationData === null) {
      dispatch(setSalesShift("All shifts"));
      setDefaultSelect(1);
    } else {
      setDefaultSelect(0);
    }
  }, [dispatch, oneStationData]);

  const changeMenu = (item, index) => {
    setDefaultSelect(index);
    if (index === 1) {
      return dispatch(setSalesShift(item));
    }
    dispatch(setSalesShift(item.shiftname));
  };

  return (
    <Select value={defaultSelect} sx={selectStyle}>
      <MenuItem value={0} style={menu}>
        Select shift
      </MenuItem>
      <MenuItem
        onClick={() => {
          changeMenu("All shifts", 1);
        }}
        value={1}
        style={menu}>
        All shifts
      </MenuItem>
      {getAllShifts().map((item, index) => {
        return (
          <MenuItem
            onClick={() => {
              changeMenu(item, index + 2);
            }}
            key={index}
            style={menu}
            value={index + 2}>
            {item.shiftname}
          </MenuItem>
        );
      })}
    </Select>
  );
};

const selectStyle = {
  minWidth: "80px",
  height: "30px",
  border: "1px solid #ccc",
  fontSize: "12px",
  fontFamily: "Poppins",
  borderRadius: "20px",
  marginLeft: mobile.matches ? "0px" : "10px",
  marginTop: mobile.matches ? "10px" : "0px",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #ccc",
  },
};

const menu = {
  fontSize: "12px",
  fontFamily: "Poppins",
};

export default ShiftSelect;
