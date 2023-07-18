import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import OutletService from "../../../services/outletService";
import { adminOutlet, getAllStations } from "../../../storage/outlet";
import swal from "sweetalert";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";

const Controls = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const moment = require("moment-timezone");
  const user = useSelector((state) => state.auth.user);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  // const currentDate2 = useSelector(
  //   (state) => state.dailySalesReducer.currentDate
  // );
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
    return user.permission?.dailySales[e];
  };

  const getAllProductData = useCallback(() => {
    if (oneStationData !== null) {
      if (getPerm("0") || getPerm("1") || user.userType === "superAdmin") {
        const findID = allOutlets.findIndex(
          (data) => data._id === oneStationData._id
        );
        setDefault(findID + 1);
        return;
      }
    }

    const payload = {
      organisation: resolveUserID().id,
    };

    OutletService.getAllOutletStations(payload).then((data) => {
      dispatch(getAllStations(data.station));
      if (
        (getPerm("1") || user.userType === "superAdmin") &&
        oneStationData === null
      ) {
        if (!getPerm("2")) setDefault(1);
        dispatch(adminOutlet(null));
        return "None";
      } else {
        OutletService.getOneOutletStation({ outletID: user.outletID }).then(
          (data) => {
            dispatch(adminOutlet(data.station));
          }
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllProductData();
  }, [getAllProductData]);

  const changeMenu = (index, item) => {
    if (!getPerm("1") && item === null)
      return swal("Warning!", "Permission denied", "info");
    setDefault(index);
    dispatch(adminOutlet(item));
  };

  const openDailySales = () => {
    if (load) return;
    if (oneStationData === null)
      return swal("Warning!", "Please select a station", "info");
    if (!getPerm("2")) return swal("Warning!", "Permission denied", "info");

    history.push("/home/daily-sales/report");
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div>
        {getPerm("0") && (
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
        {getPerm("0") || (
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={0}
            sx={selectStyle2}
            disabled>
            <MenuItem style={menu} value={0}>
              {!getPerm("0")
                ? oneStationData?.outletName + ", " + oneStationData?.alias
                : "No station created"}
            </MenuItem>
          </Select>
        )}
      </div>
      <Button
        variant="contained"
        sx={{
          width: "210px",
          height: "30px",
          background: "#06805B",
          fontSize: "12px",
          marginLeft: "10px",
          borderRadius: "0px",
          textTransform: "capitalize",
          "&:hover": {
            backgroundColor: "#06805B",
          },
        }}
        onClick={() => {
          openDailySales();
        }}>
        View comprehensive report
      </Button>
    </div>
  );
};

const menu = {
  fontSize: "12px",
};

const selectStyle2 = {
  width: "130px",
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

export default Controls;
