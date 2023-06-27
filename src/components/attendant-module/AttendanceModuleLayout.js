import React from "react";
import "../../styles/attendant/attendance.scss";
import AttendenceHeader from "./AttendenceHeader";
import AttendanceTable from "./AttendanceTable";
import AttendantTopCard from "./AttendantTopCard";
import AttendantTopSpecialCard from "./AttendantTopSpecialCard";

export default function AttendanceModuleLayout({ ...props }) {
  return (
    <div id="att-layout">
      <div className="layout-wrap">
        <AttendenceHeader />
        <div className="body-att">
          <div style={{ width: "100%", height: "100%" }}>
            <div className="card-section">
              <AttendantTopCard
                icon={require("../../assets/estation/wallet.svg").default}
              />
              <AttendantTopCard
                icon={require("../../assets/estation/pump (1).svg").default}
              />
              <AttendantTopSpecialCard
                onClickChip={() => {
                  props.setModalStatus(!props.modalStatus);
                }}
                chip
              />
            </div>
            <AttendanceTable />
          </div>
        </div>
      </div>
    </div>
  );
}
