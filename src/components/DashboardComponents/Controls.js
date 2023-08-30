import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import { useDispatch, useSelector } from "react-redux";
import { dateRange } from "../../storage/dashboard";
import SelectStation from "../common/selectstations";

const mobile = window.matchMedia("(max-width: 600px)");

const Controls = () => {
  const dispatch = useDispatch();
  const moment = require("moment-timezone");
  const user = useSelector((state) => state.auth.user);

  const updatedDate = useSelector((state) => state.dashboard.dateRange);

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.dashboard[e];
  };

  const onChangeRange = (date) => {
    const formatOne = moment(new Date(date[0]))
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];
    const formatTwo = moment(new Date(date[1]))
      .format("YYYY-MM-DD HH:mm:ss")
      .split(" ")[0];
    dispatch(dateRange([formatOne, formatTwo]));
  };

  return (
    <div style={style}>
      <DateRangePicker
        disabled={!getPerm("0")}
        onChange={onChangeRange}
        value={updatedDate}
      />
      <SelectStation
        ml={"10px"}
        oneStation={getPerm("0")}
        allStation={getPerm("1")}
        callback={() => {}}
      />
    </div>
  );
};

const style = {
  margin: "0px",
  display: "flex",
  flexDirection: mobile.matches ? "column" : "row",
};

export default Controls;
