import { Skeleton } from "@mui/material";
import me6 from "../../assets/me6.png";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { asset } from "../../storage/dashboard";
import { useNavigate } from "react-router-dom";

const DashboardImage = (props) => {
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.dashboard[e];
  };

  const goToNextScreen = () => {
    switch (props.screen) {
      case "employee": {
        if (!getPerm("3")) return swal("Warning!", "Permission denied", "info");
        if (!getPerm("4" && oneStationData === null))
          return swal("Warning!", "Permission denied", "info");
        navigate("/home/dashboard/dashboardemployee");
        break;
      }

      case "activeTank": {
        if (!getPerm("6")) return swal("Warning!", "Permission denied", "info");
        dispatch(asset("activeTank"));
        navigate("/home/dashboard/stationtanks");
        break;
      }

      case "inactiveTank": {
        if (!getPerm("6")) return swal("Warning!", "Permission denied", "info");
        dispatch(asset("inActiveTank"));
        navigate("/home/dashboard/stationtanks");
        break;
      }
      case "activePump": {
        if (!getPerm("6")) return swal("Warning!", "Permission denied", "info");
        dispatch(asset("activePump"));
        navigate("/home/dashboard/stationpumps");
        break;
      }

      case "inactivePump": {
        if (!getPerm("6")) return swal("Warning!", "Permission denied", "info");
        dispatch(asset("inActivePump"));
        navigate("/home/dashboard/stationpumps");
        break;
      }

      default: {
      }
    }
  };

  return (
    <div className="first-image">
      {props.load ? (
        <Skeleton
          sx={{ borderRadius: "5px", background: "#f7f7f7" }}
          animation="wave"
          variant="rectangular"
          width={"100%"}
          height={110}
        />
      ) : (
        <div
          onClick={() => {
            goToNextScreen();
          }}
          className="inner-first-image">
          <div className="top-first-image">
            <div className="top-icon">
              <img className="img" src={props.image} alt="icon" />
            </div>
            <div className="top-text">
              <div className="name">{props.name}</div>
              <div className="value">{props.value}</div>
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
      )}
    </div>
  );
};

export default DashboardImage;
