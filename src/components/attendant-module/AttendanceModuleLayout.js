import React from "react";
import "./attendance.scss";
import AttendenceHeader from "./AttendenceHeader";
import AttendanceTable from "./AttendanceTable";

export default function AttendanceModuleLayout({ ...props }) {
  return (
    <div id="att-layout">
      <div className="layout-wrap">
        <AttendenceHeader />
        <div className="body-att">
          <AttendanceTable />
        </div>
      </div>
    </div>
  );
}
