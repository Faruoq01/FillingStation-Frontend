import React, { Fragment, useState } from "react";
import "../../styles/estation/payment.scss";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Note,
} from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { tableData_S } from "../Home/e-station/data";
import CircleIcon from "@mui/icons-material/Circle";

export default function WalletPaymentTable({ handleViewReciept }) {
  const mobile = useMediaQuery("(max-width:1000px)");
  const tablet = useMediaQuery("(max-width:900px)");
  const [mobileCardColor, setMobileCardColor] = useState(false);
  return (
    <Fragment>
      {/* {mobile ? ( */}
      {/* <div className="mobile-table-wrapper">
        {Array(8)
          .fill(0)
          .map((item, index) => (
            <CardMain key={Math.random()} mobileCardColor={mobileCardColor} />
          ))}
      </div> */}
      {/* ) : ( */}
      <div className="indiv-sale-table-wrapper">
        <table id="payment-table-">
          <thead>
            <tr>
              {<th>S/N</th>}
              {<th>Date</th>}
              {!mobile && <th>Time</th>}
              <th>Amount</th>
              <th>Account Name</th>
              <th>Payment Method</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData_S.map((item, index) => (
              <tr key={Math.random()}>
                {
                  <td>
                    {index + 1 < 10 && "0"}
                    {index + 1}
                  </td>
                }

                <td>{!mobile ? "3-20-2022" : "Jun 20th, 23"}</td>
                {!mobile && <td>{"5:28 am"}</td>}
                <td>{"5,000.00"}</td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "50%",
                        justifyContent: "start",
                        alignItems: "center",
                      }}
                    >
                      <ProfileImg item={item} />
                      {!mobile && item.account_name}
                    </div>
                  </div>
                </td>
                <td>{"Transfer"}</td>
                <td>
                  <NoteIcon
                    red={index + 1 < 4}
                    onClick={() => handleViewReciept(item)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* )} */}
      <Footer />
    </Fragment>
  );
}

const CardMain = ({ ...props }) => {
  const [showTwo, setShowTwo] = useState(false);
  const handleShowMore = () => setShowTwo(!showTwo);
  return (
    <div
      onClick={handleShowMore}
      style={{
        backgroundColor: showTwo ? "#E7F2EF" : "#F4F4F4",
      }}
      className="card-wrap"
    >
      {Array(8)
        .fill(6)
        .map((item, index) => {
          if (!showTwo) {
            if (index === 0 || index === 1)
              return <InnerCardItems key={Math.random()} item={item} />;
          } else {
            return <InnerCardItems key={Math.random()} item={item} />;
          }
        })}
    </div>
  );
};

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
    <Pagginator
      onClickNext={() => {
        // alert("prtrt");
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
  <div className="button-wrap-">
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
const InnerCardItems = ({ ...props }) => (
  <div className="row-item-">
    <div className="item-">
      <label>Amasco Karu</label>
      <label>Staion Name</label>
    </div>

    <div className="item-">
      <label>Amasco Karu</label>
      <label>Staion Name</label>
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
