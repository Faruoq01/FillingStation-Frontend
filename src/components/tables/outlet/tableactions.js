import { useDispatch, useSelector } from "react-redux";
import { adminOutlet } from "../../../storage/outlet";
import tan from "../../../assets/tan.png";
import eye from "../../../assets/eye.png";
import filling from "../../../assets/filling.png";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

export const Action = ({ item }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.myStation[e];
  };

  const goToSales = (item) => {
    dispatch(adminOutlet(item));
    navigate("/home/mystation/sales");
  };

  const goToTanks = (item) => {
    if (!getPerm("1")) return swal("Warning!", "Permission denied", "info");
    dispatch(adminOutlet(item));
    navigate("/home/mystation/tanks");
  };

  const goToPumps = (item) => {
    if (!getPerm("4")) return swal("Warning!", "Permission denied", "info");
    dispatch(adminOutlet(item));
    navigate("/home/mystation/pumps");
  };

  return (
    <div className="actions">
      <img
        onClick={() => {
          goToSales(item);
        }}
        style={icon}
        src={eye}
        alt="icon"
      />
      <img
        onClick={() => {
          goToPumps(item);
        }}
        style={icon}
        src={filling}
        alt="icon"
      />
      <img
        onClick={() => {
          goToTanks(item);
        }}
        style={icon}
        src={tan}
        alt="icon"
      />
    </div>
  );
};

const icon = { width: "27px", height: "27px", marginLeft: "5px" };
