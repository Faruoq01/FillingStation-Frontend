import React from "react";
import "../../styles/dailySales.scss";
import ProductBalance from "../Comprehensive/ProductBalance";
// import { useSelector } from 'react-redux';

const mobile = window.matchMedia("(max-width: 950px)");

const DPKDailySales = (props) => {
  // const dailySales = useSelector(state => state.dailysales.dailySales);

  return (
    <div
      style={{
        width: props.rep === false ? "100%" : "96%",
        overflowX: mobile.matches && "scroll",
      }}>
      <div style={sales}>
        <div style={top}>
          <div style={tex}>Total Amount Of Sales (DPK)</div>
          <div></div>
        </div>

        <ProductBalance sales={false} type={"DPK"} />
      </div>
    </div>
  );
};

const sales = {
  minWidth: "950px",
  width: "100%",
  height: "auto",
  marginTop: "10px",
};

const top = {
  width: "100%",
  height: "35px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};

const tex = {
  width: "100%",
  textAlign: "left",
  marginBottom: "10px",
  color: "#06805B",
  fontSize: "12px",
  fontWeight: "900",
};

const mainSales = {
  width: "100%",
  height: "auto",
  background: "rgba(230, 245, 241, 0.6)",
  borderRadius: "5px",
  marginTop: "10px",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
};

const inner = {
  width: "98%",
  height: "auto",
  marginTop: "10px",
  marginBottom: "10px",
};

const tableHeads = {
  width: "100%",
  height: "30px",
  display: "flex",
  flexDirection: "row",
};

const col = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(266.48deg, #525252 8.34%, #525252 52.9%)",
  borderRadius: "4px",
  color: "#fff",
  marginRight: "5px",
  fontSize: "12px",
};

const tableHeads2 = {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "row",
};

const cols = {
  width: "100%",
  height: "30px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#EDEDEDB2",
  borderRadius: "4px",
  color: "#000",
  marginRight: "5px",
  fontSize: "12px",
  marginTop: "5px",
};

const dats = {
  marginTop: "20px",
  fontSize: "14px",
  fontWeight: "bold",
};

export default DPKDailySales;
