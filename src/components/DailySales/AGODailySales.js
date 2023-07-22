import React from "react";
import "../../styles/dailySales.scss";
// import { useSelector } from 'react-redux';

const mobile = window.matchMedia("(max-width: 950px)");

const AGODailySales = (props) => {
  // const dailySales = useSelector(state => state.dailysales.dailySales);

  return (
    <div
      style={{
        width: props.rep === false ? "100%" : "96%",
        overflowX: mobile.matches && "scroll",
      }}>
      <div style={sales}>
        <div style={top}>
          <div style={tex}>Total Amount Of Sales (AGO)</div>
          <div></div>
        </div>

        <div style={mainSales}>
          <div style={inner}>
            <div style={tableHeads}>
              <div style={col}>Pump Name</div>
              <div style={col}>Opening</div>
              <div style={col}>Closing</div>
              <div style={col}>Difference</div>
              <div style={col}>LPO</div>
              <div style={col}>Rate</div>
              <div style={col}>R/T</div>
              <div style={{ ...col, marginRight: "0px" }}>Amount</div>
            </div>

            {[].length === 0 ? (
              <div style={dats}> No Data </div>
            ) : (
              [].map((data, index) => {
                return (
                  <div key={index} style={tableHeads2}>
                    <div style={cols}>{data.pumpName}</div>
                    <div style={cols}>{data.openingMeter}</div>
                    <div style={cols}>{data.closingMeter}</div>
                    <div style={cols}>{data.difference}</div>
                    <div style={cols}>{data.lpoLitre}</div>
                    <div style={cols}>{data.PMSRate}</div>
                    <div style={cols}>{data.rtLitre}</div>
                    <div style={{ ...cols, marginRight: "0px" }}>
                      {data.amount}
                    </div>
                  </div>
                );
              })
            )}

            {[].length === 0 || (
              <div style={tableHeads2}>
                <div style={{ ...cols, background: "transparent" }}></div>
                <div style={{ ...cols, background: "transparent" }}></div>
                <div style={cols}>Total</div>
                <div style={cols}>{0}</div>
                <div style={cols}>{0}</div>
                <div style={cols}></div>
                <div style={cols}>{0}</div>
                <div style={{ ...cols, marginRight: "0px" }}>{0}</div>
              </div>
            )}
          </div>
        </div>
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

export default AGODailySales;
