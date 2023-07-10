// import React from "react";
// import TowRow from "../components/customTableOne/TwoRow";
// import FiveRow from "../components/customTableOne/FiveRow";

// const data1 = [
//   {
//     id: `${Math.random()}`,
//     name: "PMS",
//     price: "12,018",
//   },
//   {
//     id: `${Math.random()}`,
//     name: "AGRO",
//     price: "12,018",
//   },
//   {
//     id: `${Math.random()}`,
//     name: "DPK",
//     price: "12,018",
//   },
// ];
// const data2 = [
//   {
//     id: `${Math.random()}`,
//     name: "AGRO",
//     truck_number: "132KSA-ABJ",
//     transportation: "Sule Alanimi",
//     shortage: "Shortage",
//     price: "12,018",
//   },
//   {
//     id: `${Math.random()}`,
//     name: "AGRO",
//     truck_number: "132KSA-ABJ",
//     transportation: "Sule Alanimi",
//     shortage: "Shortage",
//     price: "12,018",
//   },
//   {
//     id: `${Math.random()}`,
//     name: "AGRO",
//     truck_number: "132KSA-ABJ",
//     transportation: "Sule Alanimi",
//     shortage: "Shortage",
//     price: "12,018",
//   },
// ];

// export default function CustomTable1() {
//   return (
//     <div style={{ marginTop: 10, marginBottom: 10 }}>
//       <span style={Styles.title}>Initial Balance</span>
//       <div style={Styles.body}>
//         <TowRow data={data1} header="Balance B/ Forward" />
//         <FiveRow data={data2} />
//         <TowRow data={data1} header="Available Balance" />
//       </div>
//     </div>
//   );
// }

// // const Styles = {
// //   title: {
// //     fontFamily: "'Nunito', sans-serif",
// //     fontStyle: "normal",
// //     fontWeight: 800,
// //     lineHeight: "34px",
// //     color: "#06805B",
// //     marginTop: "1rem",
// //     marginBottom: 5,
// //   },
// //   body: {
// //     display: "flex",
// //     flexDirection: "row",
// //   },
// // };

// const Styles = {
//   header: {
//     paddingLeft: 10,
//     fontFamily: "'Nunito', sans-serif",
//     fontStyle: "normal",
//     lineHeight: "22px",
//     textAlign: "start",
//     width: "130px",
//     color: "white",
//     height: "40px",
//     background: "linear-gradient(266.48deg, #171717 8.34%, #252525 52.9%)",
//     borderRadius: "4px",
//   },
//   title: {
//     fontFamily: "'Nunito', sans-serif",
//     fontStyle: "normal",
//     fontWeight: 800,
//     lineHeight: "34px",
//     color: "#06805B",
//     marginTop: "1rem",
//     marginBottom: 5,
//   },
//   th: {
//     height: "35px",
//     background: "#F3F3F3",
//     borderRadius: "4px",
//     padding: "5px",
//     // paddingRight: "auto",
//     fontFamily: "'Nunito', sans-serif",
//   },
// };

import React from "react";

const data = [
  {
    id: `${Math.random()}`,
    product1: "PMS ",
    product2: "PMS ",
    qty: "12,018",
    truck: "132KSA-ABJ ",
    qty2: "12,018 ",
    trans: "Sule Alanimi ",
    shortage: "22,018",
    product3: "PMS ",
    qty3: "22,018",
  },
  {
    id: `${Math.random()}`,
    product1: "PMS ",
    product2: "PMS ",
    qty: "12,018",
    truck: "132KSA-ABJ ",
    qty2: "12,018 ",
    trans: "Sule Alanimi ",
    shortage: "22,018",
    product3: "PMS ",
    qty3: "22,018",
  },
  {
    id: `${Math.random()}`,
    product1: "PMS ",
    product2: "PMS ",
    qty: "12,018",
    truck: "132KSA-ABJ ",
    qty2: "12,018 ",
    trans: "Sule Alanimi ",
    shortage: "22,018",
    product3: "PMS ",
    qty3: "22,018",
  },
  {
    id: `${Math.random()}`,
    product1: "PMS ",
    product2: "PMS ",
    qty: "12,018",
    truck: "132KSA-ABJ ",
    qty2: "12,018 ",
    trans: "Sule Alanimi ",
    shortage: "22,018",
    product3: "PMS ",
    qty3: "22,018",
  },
  {
    id: `${Math.random()}`,
    product1: "PMS ",
    product2: "PMS ",
    qty: "12,018",
    truck: "132KSA-ABJ ",
    qty2: "12,018 ",
    trans: "Sule Alanimi ",
    shortage: "22,018",
    product3: "PMS ",
    qty3: "22,018",
  },
];
const header = [
  {
    id: `${Math.random()}`,
    value: "Product ",
  },
  {
    id: `${Math.random()}`,
    value: "Qty (LTR)",
  },
  {
    id: `${Math.random()}`,
    value: "Product ",
  },
  {
    id: `${Math.random()}`,
    value: "Truck No ",
  },
  {
    id: `${Math.random()}`,
    value: "Qty (LTR)",
  },
  {
    id: `${Math.random()}`,
    value: "Transportation",
  },
  {
    id: `${Math.random()}`,
    value: "Shortage",
  },
  {
    id: `${Math.random()}`,
    value: "Product ",
  },
  {
    id: `${Math.random()}`,
    value: "Qty (LTR)",
  },
];

export default function CustomTable1() {
  return (
    <div style={{ marginTop: 10, marginBottom: 10 }}>
      <span style={Styles.title}>Initial Balance</span>
      <div style={{ marginRight: 2, marginLeft: 2 }}>
        {/* 
       ==================================
       
       */}
        <table
          style={{
            width: "100%",
            borderSpacing: 5,
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "green" }}>
              <td
                style={{
                  ...Styles.header,
                  width: "7.5%",
                  color: "white",
                  background:
                    "linear-gradient(266.48deg, #171717 8.34%, #252525 52.9%)",
                }}
              >
                Balance B/ Forward
              </td>
              <td
                style={{
                  ...Styles.header,
                  width: "21%",
                  color: "white",
                  background:
                    "linear-gradient(266.48deg, #171717 8.34%, #252525 52.9%)",
                }}
              >
                Supply
              </td>
              <td
                style={{
                  ...Styles.header,
                  width: "7%",
                  color: "white",
                  background:
                    "linear-gradient(266.48deg, #171717 8.34%, #252525 52.9%)",
                }}
              >
                Available Balance
              </td>
            </tr>
          </thead>
        </table>

        {/* ============================ */}
        <table
          style={{
            padding: 0,
            width: "100%",
            borderSpacing: 5,
          }}
        >
          <thead>
            <tr style={{}}>
              {header.map((item, index) => (
                <th
                  key={Math.random()}
                  style={
                    item.value === "PMS"
                      ? {
                          ...Styles.header,
                          width: "",
                          padding: 0,
                          paddingLeft: 5,
                          paddingRight: 5,
                        }
                      : Styles.header
                  }
                >
                  {item.value}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td style={{ ...Styles.th }}>{item.product1} </td>
                <td style={{ ...Styles.th }}>{item.qty} </td>
                <td style={{ ...Styles.th }}>{item.product2} </td>
                <td style={{ ...Styles.th }}>{item.truck} </td>
                <td style={{ ...Styles.th }}>{item.qty2} </td>
                <td style={{ ...Styles.th }}>{item.trans} </td>
                <td style={{ ...Styles.th }}>{item.shortage} </td>
                <td style={{ ...Styles.th }}>{item.product3} </td>
                <td style={{ ...Styles.th }}>{item.qty3} </td>
              </tr>
            ))}
          </tbody>
          {/* <tfoot>
            <tr>
              {footer.map((item, index) => (
                <td
                  key={Math.random()}
                  style={{
                    ...Styles.th,
                    textAlign: item.value == "Total" && "end",
                  }}
                >
                  {item.value}
                </td>
              ))}
            </tr>
          </tfoot> */}
        </table>
      </div>
    </div>
  );
}
const Styles = {
  customHeader: {},
  header: {
    paddingLeft: 10,
    fontFamily: "'Nunito', sans-serif",
    fontStyle: "normal",
    lineHeight: "22px",
    textAlign: "start",

    color: "black",
    fontSize: 14,
    height: "40px",
    background: "#F3F3F3",
    borderRadius: "4px",
  },
  title: {
    fontFamily: "'Nunito', sans-serif",
    fontStyle: "normal",
    fontWeight: 800,
    lineHeight: "34px",
    marginLeft: 8,
    color: "#06805B",
    marginTop: "1rem",
    marginBottom: 5,
  },
  th: {
    height: "35px",
    background: "#F3F3F3",
    borderRadius: "4px",
    padding: "5px",
    fontSize: 14,
    // paddingRight: "auto",
    fontFamily: "'Nunito', sans-serif",
  },
};
