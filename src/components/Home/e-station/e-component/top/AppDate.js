import React, { useState } from "react";
import "./top_.scss";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
export default function AppDate() {
  const [date, setDate] = useState(new Date().getDate());
  const handleSetDate = (setState) => (e) => {
    setState(e.target.value);
  };
  return (
    <div className="date-wrapper">
      <input
        className="date-top"
        style={{ flexGrow: 1, border: "none" }}
        type="date"
        onChange={handleSetDate(setDate)}
        name=""
        value={`${date}`}
      />
    </div>
  );
}
