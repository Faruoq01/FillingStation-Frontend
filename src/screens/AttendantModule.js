import React, { Fragment, useState } from "react";
import AttendanceModuleLayout from "../components/attendant-module/AttendanceModuleLayout";
import AttendantSellModal from "../components/Modals/AttendantSellModal";

export default function AttendantModule() {
  const [modalStatus, setModalStatus] = useState(false);
  return (
    <Fragment>
      <AttendanceModuleLayout
        modalStatus={modalStatus}
        setModalStatus={setModalStatus}
      />
      <AttendantSellModal open={modalStatus} close={setModalStatus} />
    </Fragment>
  );
}
