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

export default function SalesTable() {
  const mobile = useMediaQuery("(max-width:600px)");
  const tablet = useMediaQuery("(max-width:900px)");
  return (
    <Fragment>
      <div className="indiv-sale-table-wrapper">
        <table id="sales-table-">
          <thead>
            <tr>
              {!mobile && <th>S/N</th>}
              {!mobile && <th>image</th>}
              {!mobile && <th>Customer Name</th>}
              <th>Email</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>State</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData_S.map((item, index) => (
              <tr key={Math.random()}>
                {!mobile && <td>{index + 1}</td>}
                <td>
                  <ProfileImg item={item} />
                </td>
                <td> {!mobile && item.account_name}</td>
                <td>{"peter@gmail.com"}</td>
                <td>{"Ajah Lagos state"}</td>
                <td>{"07048737699"}</td>
                <td>{"Lagos"}</td>
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
    src={require("../../assets/estation/ind-edit-icon.svg").default}
  />
);

const ProfileImg = ({ onClick, item }) => (
  <img className="table-image" src={item.image} />
);

const Footer = ({}) => (
  <div className="footer-">
    <div className="inner-footer-">
      {/* <div style={{ display: "flex", flexDirection: "row" }}>
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
      </div> */}
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
  icon: {},
  pagginator: {
    display: "flex",
    flexDirection: "row",
  },
});
