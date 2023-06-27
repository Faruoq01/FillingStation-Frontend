import React from "react";
import "../../styles/estation/airbnb.scss";
import { Circle } from "@mui/icons-material";

export default function AirbnbTable() {
  return (
    <div className="tb-wraper">
      <table id="customers">
        <thead>
          <tr>
            <th>S/N</th>
            <th>Date</th>
            <th>Time</th>
            <th>Products</th>
            <th>Litres</th>
            <th>Price</th>
            <th>Price/Litre</th>
            <th>Station</th>
            <th>Attendants</th>
          </tr>
        </thead>
        <tbody>
          {Array(20)
            .fill(null)
            .map((_, index) => (
              <tr key={Math.random}>
                <td>{index + 1 > 9 ? index + 1 : `0${index + 1}`}</td>
                <td>12 Oct 2022</td>
                <td>02:30 AM</td>
                <td>
                  <Circle
                    style={{ color: "#1B6602", fontSize: 10, marginRight: 4 }}
                  />
                  <label>PMS</label>
                </td>
                <td>20.5</td>
                <td>12.00</td>
                <td>123.00</td>
                <td>Ammasco Uke</td>
                <td>Aina Ojo</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
