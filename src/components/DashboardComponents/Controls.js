import { useSelector } from "react-redux";
import SelectStation from "../common/selectstations";
import "../../styles/daterange.scss";
import ShiftSelect from "../common/shift";
import CustomDateRangePicker from "../common/customdaterangepicker";

const mobile = window.matchMedia("(max-width: 600px)");

const Controls = () => {
  const user = useSelector((state) => state.auth.user);

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.dashboard[e];
  };

  return (
    <div style={style}>
      <CustomDateRangePicker />
      <SelectStation
        ml={"10px"}
        oneStation={getPerm("0")}
        allStation={getPerm("1")}
        callback={() => {}}
      />
      <ShiftSelect />
    </div>
  );
};

const style = {
  margin: "0px",
  display: "flex",
  flexDirection: mobile.matches ? "column" : "row",
};

export default Controls;
