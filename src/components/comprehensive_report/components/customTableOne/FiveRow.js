import React from "react";

export default function ({ data = [] }) {
  return (
    <div>
      <header style={Styles.header}>Supply</header>
      <table style={{ width: "auto", margin: 0 }}>
        <tr>
          <th style={{ ...Styles.th, fontWeight: 700 }}>Product</th>
          <th style={{ ...Styles.th, fontWeight: 700 }}>Truck No</th>
          <th style={{ ...Styles.th, fontWeight: 700 }}>Qty (LTR)</th>
          <th style={{ ...Styles.th, fontWeight: 700 }}>Transportation</th>
          <th style={{ ...Styles.th, fontWeight: 700 }}>Shortage</th>
        </tr>
        {data.map((item, index) => (
          <tr key={item.id + index}>
            <td style={{ ...Styles.th }}>{item.name} </td>
            <td style={{ ...Styles.th }}>{item.truck_number}</td>
            <td style={{ ...Styles.th }}>{item.price}</td>
            <td style={{ ...Styles.th }}>{item.transportation} </td>
            <td style={{ ...Styles.th }}>{item.shortage}</td>
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
    paddingLeft: 15,
    color: "white",
    height: "46px",
    background: "linear-gradient(266.48deg, #171717 8.34%, #252525 52.9%)",
    borderRadius: "4px",
  },
  th: {
    height: "35px",
    background: "#F3F3F3",
    borderRadius: "4px",
    // paddingLeft: "5px",
    // paddingRight: "auto",
    fontFamily: "'Nunito', sans-serif",
    padding: 5,
  },
};
