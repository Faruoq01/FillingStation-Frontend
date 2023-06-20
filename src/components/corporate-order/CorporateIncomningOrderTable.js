import React, { Fragment } from "react";
import "../../styles/estation/individual_sale.scss";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Note,
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { tableData_S } from "../Home/e-station/data";
import CircleIcon from "@mui/icons-material/Circle";

export default function CorporateIncomningOrderTable() {
  const mobile = useMediaQuery("(max-width:600px)");
  const tablet = useMediaQuery("(max-width:900px)");
  return (
    <Fragment>
      <div className="indiv-sale-table-wrapper">
        <table id="sales-table-">
          <thead>
            <tr>
              {!mobile && <th>S/N</th>}
              {!mobile && <th>Date</th>}
              {!mobile && <th>Time</th>}
              <th>Account Name</th>
              <th>Vehicle No</th>
              <th>Order No</th>
              <th>Product</th>
              <th>Litres</th>
              <th>Amount</th>
              {!mobile && <th>Station</th>}
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
                      justifyContent: "start",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "start",
                        // width: "50%",
                        alignItems: "center",
                      }}
                    >
                      <ProfileImg item={item} />
                      {!mobile && item.account_name}
                    </div>
                  </div>
                </td>
                <td>{item.vehicle_no}</td>
                {<td>2356</td>}
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

                <td>
                  <NoteIcon onClick={() => {}} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </Fragment>
  );
}

const NoteIcon = ({ onClick }) => (
  <img
    onClick={onClick}
    className="table-image"
    src={require("../../assets/estation/message-icon.svg").default}
  />
);

const ProfileImg = ({ onClick, item }) => (
  <img className="table-image" src={item.image} />
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
            boder: 0,
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
const Button = ({ data = "Total Amount", ...props }) => (
  <div className="total-btn" {...props}>
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
  icon: {},
  pagginator: {
    display: "flex",
    flexDirection: "row",
  },
});
