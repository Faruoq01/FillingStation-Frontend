import React from "react";
import "./attendance.scss";
import { Circle } from "@mui/icons-material";
import Dropdown from "./Dropdown";

export default function AttendanceTable() {
  return (
    <div
      style={{
        width: "100%",
        borderRadius: "4px",
        background: " #FFF",
        marginTop: "1rem",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.10)",
      }}
    >
      <div className="tool-section">
        <div
          className="att-table-wrap"
          style={{
            width: "98%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <span>Orders History</span>

          <div className="tool-item-left">
            <label style={{ marginRight: 5, color: " #737373", fontSize: 15 }}>
              Filter by:{" "}
            </label>
            <input
              style={{
                height: 40,
                borderRadius: 5,
                marginRight: 5,
                outline: "none",
                border: "1px solid var(--input-stroke, #BDBCBC)",
                background: " #E6E6E6",
              }}
              type="date"
            />
            <Dropdown />
          </div>
        </div>
      </div>
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
