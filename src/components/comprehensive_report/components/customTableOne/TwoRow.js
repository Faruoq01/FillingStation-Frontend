import React from "react";

export default function TwoRow({ header, data = [] }) {
  return (
    <div style={{ marginRight: 2, marginLeft: 2 }}>
      <div style={Styles.header}>{header}</div>
      <table
        style={{
          width: "auto",
        }}
      >
        <tr style={{}}>
          <th style={{ ...Styles.th, fontWeight: 700 }}>Product</th>
          <th style={{ ...Styles.th, fontWeight: 700 }}>Qty (LTR)</th>
        </tr>
        {data.map((item, index) => (
          <tr key={item.id}>
            <td style={{ ...Styles.th }}>{item.name} </td>
            <td style={{ ...Styles.th }}>{item.price}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}

const Styles = {
  header: {
    padding: "5px",
    fontFamily: "'Nunito', sans-serif",
    fontStyle: "normal",
    lineHeight: "22px",
    display: "flex",
    alignItems: "center",
    color: "white",
    height: "46px",
    background: "linear-gradient(266.48deg, #171717 8.34%, #252525 52.9%)",
    borderRadius: "4px",
  },
  th: {
    height: "35px",
    background: "#F3F3F3",
    borderRadius: "4px",
    padding: "5px",
    // paddingRight: "auto",
    fontFamily: "'Nunito', sans-serif",
  },
};
