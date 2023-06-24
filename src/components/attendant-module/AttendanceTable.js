import React from "react";
import "./attendance.scss";
import { Circle } from "@mui/icons-material";

export default function AttendanceTable() {
  return (
    <div style={{ width: "97%" }}>
      <div className="tool-section"></div>
      <div className="att-table-wrapper">
        <table id="att-table">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Date</th>
              <th>Time</th>
              <th>Vehicle Name</th>
              <th>Vehicle Number</th>
              <th>Account Name</th>
              <th>Products</th>
              <th>Price</th>
              <th>Station</th>
              <th>Code</th>
            </tr>
          </thead>
          <tbody>
            {Array(20)
              .fill(null)
              .map((_, index) => (
                <tr key={Math.random}>
                  <td>{index + 1 > 9 ? index + 1 : `0${index + 1}`}</td>
                  <td>12th Oct 2022</td>
                  <td>02:30 AM</td>
                  <td>Fire-truck</td>
                  <td>MLO-12345</td>
                  <td>Sule Ajana</td>
                  <td>
                    <Circle
                      style={{ color: "#1B6602", fontSize: 10, marginRight: 4 }}
                    />
                    <label>PMS</label>
                  </td>
                  <td>92,920.00</td>
                  <td>Ammasco Kugbo</td>
                  <td>AMA-12345</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
