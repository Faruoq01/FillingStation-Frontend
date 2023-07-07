import React from "react";
import "../../styles/estation/airbnb.scss";
import { useSelector } from "react-redux";
import ApproximateDecimal from "../common/approx";

export default function AirBnBTopCard({ ...props }) {
  const lpos = useSelector((state) => state.lpoReducer.lpoSales);

  const getTotalSales = () => {
    const pms = lpos.filter((data) => data.productType === "PMS");
    const ago = lpos.filter((data) => data.productType === "AGO");
    const dpk = lpos.filter((data) => data.productType === "DPK");

    const pmsSales = pms.reduce((accum, current) => {
      return Number(accum) + Number(current.lpoLitre) * Number(current.PMSRate);
    }, 0);

    const agoSales = ago.reduce((accum, current) => {
      return Number(accum) + Number(current.lpoLitre) * Number(current.AGORate);
    }, 0);

    const dpkSales = dpk.reduce((accum, current) => {
      return Number(accum) + Number(current.lpoLitre) * Number(current.DPKRate);
    }, 0);

    return pmsSales + agoSales + dpkSales;
  };

  return (
    <div className="airbnb-card-top">
      <div className="airbnb-card-top-sub">
        <img src={props.icon} alt="walet" />
        <div className="txt-wrap">
          <span>{`NGN ${ApproximateDecimal(getTotalSales())}`}</span>
          <label>{props.title}</label>
        </div>
      </div>
      <div className="airbnb-card-top-sub"></div>
    </div>
  );
}
