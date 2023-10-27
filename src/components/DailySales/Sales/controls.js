import { useSelector } from "react-redux";
import swal from "sweetalert";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SelectStation from "../../common/selectstations";
import ShiftSelect from "../../common/shift";

const mobile = window.matchMedia("(max-width: 600px)");

const Controls = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.dailySales[e];
  };

  const openDailySales = () => {
    if (oneStationData === null)
      return swal("Warning!", "Please select a station", "info");
    if (!getPerm("2")) return swal("Warning!", "Permission denied", "info");

    navigate("/home/dailysales/comprehensive");
  };

  return (
    <div style={style}>
      <Button
        variant="contained"
        sx={button}
        onClick={() => {
          openDailySales();
        }}>
        Comprehensive report
      </Button>
      <div style={filters}>
        <SelectStation
          ml={mobile.matches ? "0px" : "10px"}
          oneStation={getPerm("0")}
          allStation={getPerm("1")}
          callback={() => {}}
        />
        <ShiftSelect />
      </div>
    </div>
  );
};

const style = {
  margin: "0px",
  display: "flex",
  flexDirection: mobile.matches ? "column" : "row",
};

const filters = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  marginTop: mobile.matches ? "5px" : "0px",
};

const button = {
  maxWidth: "300px",
  height: "30px",
  background: "#06805B",
  fontSize: "12px",
  marginLeft: mobile.matches ? "0px" : "0px",
  borderRadius: "0px",
  textTransform: "capitalize",
  "&:hover": {
    backgroundColor: "#06805B",
  },
};

export default Controls;
