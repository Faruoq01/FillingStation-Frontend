import { useSelector } from "react-redux";
import SelectStation from "../common/selectstations";
import "../../styles/daterange.scss";
import ShiftSelect from "../common/shift";
import DateRangeLib from "../common/DatePickerLib";

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
      <DateRangeLib />
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
  width: "100%",
  margin: "0px",
  display: "flex",
  flexDirection: mobile.matches ? "column" : "row",
  marginTop: mobile.matches ? "5px" : "0px",
};

const filters = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  marginTop: mobile.matches ? "10px" : "0px",
};

export default Controls;
