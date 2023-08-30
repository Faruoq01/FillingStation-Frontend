import { useSelector } from "react-redux";
import swal from "sweetalert";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import SelectStation from "../../common/selectstations";

const mobile = window.matchMedia("(max-width: 600px)");

const Controls = () => {
  const history = useHistory();
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

    history.push("/home/daily-sales/report");
  };

  return (
    <div style={style}>
      <SelectStation
        ml={"0px"}
        oneStation={getPerm("0")}
        allStation={getPerm("1")}
        callback={() => {}}
      />
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
