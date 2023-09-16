import { useDispatch, useSelector } from "react-redux";
import { dateRange } from "../../storage/dashboard";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import { setDateValue } from "../../storage/dailysales";

const CustomDateRangePicker = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const moment = require("moment-timezone");
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

    if (formatOne === formatTwo) {
      dispatch(setDateValue(formatOne));
      dispatch(dateRange([formatOne, formatOne]));
    } else {
      dispatch(setDateValue(""));
      dispatch(dateRange([formatOne, formatTwo]));
    }
  };

  const formatDate = (inputDate) => {
    const formattedDate = moment(inputDate, "YYYY-MM-DD").format(
      "Do MMM, YYYY"
    );
    return formattedDate;
  };

  return (
    <div className="date-range-container">
      <label className="picker-label" for="picker">
        {`${formatDate(updatedDate[0])} - ${formatDate(updatedDate[1])}`}
      </label>
      <DateRangePicker
        id="picker"
        className="custom-styles"
        disabled={!getPerm("0")}
        onChange={onChangeRange}
        value={updatedDate}
      />
    </div>
  );
};

export default CustomDateRangePicker;
