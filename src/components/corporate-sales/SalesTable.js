import React from "react";
import "./individual_sale.scss";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Note,
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { tableData_S } from "../data";
import CircleIcon from "@mui/icons-material/Circle";

export default function SalesTable() {
  const mobile = useMediaQuery("(max-width:600px)");
  const tablet = useMediaQuery("(max-width:900px)");
  return (
    <div>
      <div style={{ overflow: mobile && "scroll", width: "100%" }}>
        <table id="sales-table-">
          <thead>
            <tr>
              {!mobile && <th>S/N</th>}
              {!mobile && <th>Date</th>}
              {!mobile && <th>Time</th>}
              <th>Account Name</th>
              <th>Vehicle No</th>
              <th>Product</th>
              <th>Litres</th>
              <th>Amount</th>
              {!mobile && <th>Station</th>}
              {!mobile && <th>Attendant</th>}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData_S.map((item, index) => (
              <tr key={Math.random()}>
                {!mobile && <td>{index + 1}</td>}
                {!mobile && <td>{item.date}</td>}
                {!mobile && <td>{item.time}</td>}
                <td>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "start",
                    }}
                  >
                    <ProfileImg item={item} />
                    {!mobile && item.account_name}
                  </div>
                </td>
                <td>{item.vehicle_no}</td>
                <td>
                  <CircleIcon
                    style={{
                      fontSize: 8,
                      marginRight: 5,
                      color:
                        item.product == "DPK"
                          ? "#35393E"
                          : item.product == "PMS"
                          ? "#399A19"
                          : "#FFA010",
                    }}
                  />
                  {item.product}
                </td>
                <td>{item.liters}</td>
                <td>{item.price}</td>
                {!mobile && <td>{item.station}</td>}
                {!mobile && <td>{item.attendant}</td>}
                <td>
                  <NoteIcon onClick={() => {}} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}

const NoteIcon = ({ onClick }) => (
  <div onClick={onClick} style={styles().icon}>
    <Note style={{ color: "white", fontSize: 18 }} />
  </div>
);

const ProfileImg = ({ onClick, item }) => (
  <div onClick={onClick} style={{ ...styles().icon, marginRight: 3 }}>
    <img src={item.image} style={{ width: "100", height: "100%" }} />
  </div>
);

const Footer = ({}) => (
  <div className="footer-">
    <div className="inner-footer-">
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Button
          style={{
            border: "1px solid #06805B",
            background: "#06805B",
            color: "white",
          }}
        />
        <Button
          style={{
            background: "#EFFFFA",
            color: "#515151",
            border: "1px solid #515151",
          }}
          data="NGN 245000.00"
        />
      </div>
      <Pagginator
        onClickNext={() => {
          alert("prtrt");
        }}
        onClickPrevious={() => {}}
      />
    </div>
  </div>
);
const Button = ({ style, data = "Total Amount", ...props }) => (
  <div style={style} className="total-btn" {...props}>
    <label>{data}</label>
  </div>
);

const Pagginator = ({ onClickNext, onClickPrevious }) => (
  <div className="button-wrap">
    <div style={styles().pagginator}>
      <button
        onClick={onClickPrevious}
        style={{ marginRight: 2 }}
        className="button-sales-pagginator"
      >
        <KeyboardArrowLeft />
      </button>
      <button onClick={onClickNext} className="button-sales-pagginator">
        <KeyboardArrowRight />
      </button>
    </div>
  </div>
);

const styles = (mobile) => ({
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#07956A",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pagginator: {
    display: "flex",
    flexDirection: "row",
  },
});
