import { MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OutletService from "../../services/360station/outletService";
import { adminOutlet, getAllStations } from "../../storage/outlet";
import swal from "sweetalert";

const mobile = window.matchMedia("(max-width: 600px)");

const SelectStation = ({ ml, oneStation, allStation, callback = () => {}, recordCallback = () => {} }) => {
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [defaultState, setDefault] = useState(0);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getAllStationData = useCallback(() => {
    const payload = {
      organisation: resolveUserID().id,
    };

    if (oneStationData !== null) {
      if (oneStation || allStation || user.userType === "superAdmin") {
        const findID = allOutlets.findIndex(
          (data) => data._id === oneStationData._id
        );
        setDefault(findID + 1);
        callback(oneStationData._id);
        recordCallback(oneStationData);
        return;
      }
    }

    OutletService.getAllOutletStations(payload)
      .then((data) => {
        dispatch(getAllStations(data.station));
        if (
          (oneStation || user.userType === "superAdmin") &&
          oneStationData === null
        ) {
          if (!allStation) setDefault(1);
          dispatch(adminOutlet(null));
          return "None";
        } else {
          OutletService.getOneOutletStation({ outletID: user.outletID }).then(
            (data) => {
              dispatch(adminOutlet(data.station));
            }
          );

          return user;
        }
      })
      .then((data) => {
        const id = data === "None"? data: data.outletID;
        const item = data === "None"? null: data;
        callback(id);
        recordCallback(item);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllStationData();
  }, [getAllStationData]);

  const changeMenu = (index, item) => {
    if (!allStation && item === null)
      return swal("Warning!", "Permission denied", "info");
    setDefault(index);
    dispatch(adminOutlet(item));

    const id = item === null ? "None" : item._id;
    callback(id);
    recordCallback(item);
  };

  return (
    <div style={{ ...style, marginLeft: ml }}>
      {oneStation && (
        <Select MenuProps={menuProps} value={defaultState} sx={selectStyle2}>
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
                {item.outletName}
              </MenuItem>
            );
          })}
        </Select>
      )}
      {oneStation || (
        <Select value={0} sx={selectStyle2} MenuProps={menuProps} disabled>
          <MenuItem style={menu} value={0}>
            {!oneStation ? oneStationData?.outletName : "No station created"}
          </MenuItem>
        </Select>
      )}
    </div>
  );
};

const style = {
  marginLeft: mobile.matches ? "0px" : "10px",
  marginRight: "0px",
};

const selectStyle2 = {
  maxWidth: "300px",
  height: "30px",
  borderRadius: "20px",
  background: "#F2F1F1B2",
  color: "#000",
  fontSize: "12px",
  outline: "none",
  margin: "0px",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const menu = {
  fontSize: "12px",
};

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: "250px",
      maxWidth: "200px",
      width: "100%",
    },
  },
};

export default SelectStation;
