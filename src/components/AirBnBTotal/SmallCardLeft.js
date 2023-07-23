import React from "react";
import "../../styles/estation/airbnb.scss";
import IconCircle from "@mui/icons-material/Circle";
import { useSelector } from "react-redux";
import ApproximateDecimal from "../common/approx";

export default function SmallCardLeft({ dotColor, ...props }) {
  const lpos = useSelector((state) => state.lpo.lpoSales);

  const getTotalSales = () => {
    const pms = lpos.filter((data) => data.productType === props.type);

    const totalSales = pms.reduce((accum, current) => {
      return Number(accum) + Number(current.lpoLitre);
    }, 0);

    return totalSales;
  };

  return (
    <div style={{ ...props.style }} className="left-card">
      <div className="left-card-inner">
        <div className="img-txt-wraper">
          <img src={props.icon} alt="icon" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              marginLeft: "10px",
              alignContent: "center",
              marginTop: 5,
            }}>
            <span>{ApproximateDecimal(getTotalSales())}</span>
            <label>
              <IconCircle
                style={{
                  color: dotColor ?? "pink",
                  marginTop: 2,
                }}
                fontSize="15"
              />
              <label style={{ marginLeft: 2 }}> {props?.title}</label>
            </label>
          </div>
        </div>
        <img
          alt="icon"
          style={{
            width: 30,
            height: 30,
            alignSelf: "center",
          }}
          src={require("../../assets/estation/Arrow.svg").default}
        />
      </div>
    </div>
  );
}
