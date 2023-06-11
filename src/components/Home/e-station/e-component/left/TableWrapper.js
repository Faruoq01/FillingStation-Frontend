import React from "react";
import "./left.scss";
import AppTable from "./AppTable";

export default function TableWrapper() {
  return (
    <div className="l-table-wrapper">
      <div className="table-tool">
        <div className="title-wrapper">
          <label>Recent Sales</label>
        </div>
        <div className="tool">
          <div className="button">Individual</div>
          <div className="button">Corporate</div>
        </div>
      </div>
      <AppTable />
    </div>
  );
}
