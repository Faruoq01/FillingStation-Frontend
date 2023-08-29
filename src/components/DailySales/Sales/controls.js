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
import SelectStation from "../../common/selectstations";

const mobile = window.matchMedia("(max-width: 600px)");

const Controls = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [defaultState, setDefault] = useState(0);

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
    if (oneStationData === null)
      return swal("Warning!", "Please select a station", "info");
    if (!getPerm("2")) return swal("Warning!", "Permission denied", "info");

    history.push("/home/daily-sales/report");
  };

  return (
    <div style={style}>
      <SelectStation oneStation={getPerm("0")} allStation={getPerm("1")} />
      <Button
        variant="contained"
        sx={button}
        onClick={() => {
          openDailySales();
        }}>
        View comprehensive report
      </Button>
    </div>
  );
};

const style = {
  margin: "0px",
  display: "flex",
  flexDirection: mobile.matches ? "column" : "row",
};

const button = {
  minWidth: mobile.matches ? "225px" : "120px",
  maxWidth: "300px",
  height: "30px",
  background: "#06805B",
  fontSize: "12px",
  marginLeft: mobile.matches ? "0px" : "10px",
  borderRadius: "0px",
  textTransform: "capitalize",
  "&:hover": {
    backgroundColor: "#06805B",
  },
};

export default Controls;
