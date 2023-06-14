import React, { Fragment } from "react";
import "../../styles/estation/payment.scss";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Note,
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { tableData_S } from "../Home/e-station/data";
import CircleIcon from "@mui/icons-material/Circle";

export default function WalletPaymentTable() {
  const mobile = useMediaQuery("(max-width:600px)");
  const tablet = useMediaQuery("(max-width:900px)");
  return (
    <Fragment>
      <div className="indiv-sale-table-wrapper">
        <table id="payment-table-">
          <thead>
            <tr>
              {<th>S/N</th>}
              {<th>Date</th>}
              {<th>Time</th>}
              <th>Amount</th>
              <th>Account Name</th>
              <th>Payment Method</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData_S.map((item, index) => (
              <tr key={Math.random()}>
                {<td>{index + 1}</td>}

                <td>{"3-20-2022"}</td>
                <td>{"5:28 am"}</td>
                <td>{"5,000.00"}</td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "start",
                      alignItems: "center",
                    }}
                  >
                    <ProfileImg item={item} />
                    {!mobile && item.account_name}
                  </div>
                </td>
                <td>{"Transfer"}</td>
                <td>
                  <NoteIcon red={index + 1 < 4} onClick={() => {}} />
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

const NoteIcon = ({ onClick, red }) => (
  <img
    onClick={onClick}
    className="table-image"
    src={
      require(red
        ? "../../assets/estation/view-list-icon-red.svg"
        : "../../assets/estation/view-list-icon-green.svg").default
    }
  />
);

const ProfileImg = ({ onClick, item }) => (
  <img className="table-image" src={item.image} />
);

const Footer = ({}) => (
  <div className="footer-">
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
