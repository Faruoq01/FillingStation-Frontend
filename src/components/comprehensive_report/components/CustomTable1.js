import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ApproximateDecimal from "../../common/approx";

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
    value: "Qty (LTR)",
  },
  {
    id: `${Math.random()}`,
    value: "Outage",
  },
  {
    id: `${Math.random()}`,
    value: "Shortage",
  },
  {
    id: `${Math.random()}`,
    value: "Details ",
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
  const [initialData, setInitialData] = useState([]);
  const { balances, supply, sales } = useSelector(
    (state) => state.comprehensive
  );

  const reFcatorData = () => {
    const array_ = new Array();
    let data = {
      id: `${Math.random()}`,
      product1: "DPK ",
      product2: "DPK ",
      qty: "12,018",
      Details: "View",
      qty2: "12,018 ",
      outage: "22,018",
      shortage: "22,018",
      product3: "DPK ",
      qty3: "22,018",
    };
    let g = {
      _id: "64a82b8cd2847135340900bf",
      balanceCF: "36482.23999999996",
      productType: "AGO",
      totalTankCapacity: "100000",
      outletID: "64a6bd1dbc2fa90b074cb6b6",
      organizationID: "64a2c3be7d6d9b50290aa100",
      createdAt: "2023-07-06",
      updatedAt: "2023-07-06",
      __v: 0,
    };
    // =================

    const arrayOfEntries = Object.entries(balances);
    for (const [key, value] of arrayOfEntries) {
      if (key) {
        const productValue = getInit({ type: value.productType });
        const data = {
          id: `${Math.random()}`,
          product1: `${key}`.toUpperCase(),
          product2: `${key}`.toUpperCase(),
          qty:
            !value === null
              ? "0"
              : ApproximateDecimal(Number(value?.balanceCF)),
          Details: "View",
          qty2:
            !value === null ? "0" : ApproximateDecimal(productValue.quantity),
          overage:
            !value === null ? "0" : ApproximateDecimal(productValue.overage),
          shortage:
            !value === null ? "0" : ApproximateDecimal(productValue.shortage),
          product3: `${key}`.toUpperCase(),
          qty3: !value
            ? "0"
            : ApproximateDecimal(
                Number(value?.balanceCF) +
                  Number(
                    getInit({ data: value, type: `${key}`.toUpperCase() })
                      .quantity
                  )
              ),
        };
        array_.push(data);
      }
      setInitialData([...array_]);
    }
  };
  useEffect(() => {
    reFcatorData();
  }, []);
  const getInit = (props) => {
    let initialBalance = 0;
    const current =
      props.type === "PMS"
        ? balances?.pms
        : props.type === "AGO"
        ? balances?.ago
        : balances?.dpk;
    const salesDayOne = sales.filter((data) => data.productType === props.type);

    const totalSales = salesDayOne.reduce((accum, current) => {
      return Number(accum) + Number(current.sales);
    }, 0);

    if (salesDayOne.length > 0) {
      initialBalance = Number(salesDayOne[0].balanceCF) + totalSales;
    }

    const quantity = supply
      .filter((data) => data.productType === props.type)
      .reduce((accum, current) => {
        return Number(accum) + Number(current.quantity);
      }, 0);

    const shortage = supply
      .filter((data) => data.productType === props.type)
      .reduce((accum, current) => {
        if (current.shortage === "None") {
          return 0;
        } else {
          return Number(accum) + Number(current.shortage);
        }
      }, 0);

    const overage = supply
      .filter((data) => data.productType === props.type)
      .reduce((accum, current) => {
        if (current.overage === "None") {
          return 0;
        } else {
          return Number(accum) + Number(current.overage);
        }
      }, 0);

    return {
      quantity: quantity,
      shortage: shortage,
      overage: overage,
      balance: current === 0 ? initialBalance : Number(current?.balanceCF),
    };
  };
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
            {initialData.map((item) => (
              <tr key={item.id}>
                <td style={{ ...Styles.th }}>{item.product1} </td>
                <td style={{ ...Styles.th }}>{item.qty} </td>
                <td style={{ ...Styles.th }}>{item.product2} </td>
                <td style={{ ...Styles.th }}>{item.qty2} </td>
                <td style={{ ...Styles.th }}>{item.overage} </td>
                <td style={{ ...Styles.th }}>{item.shortage} </td>
                <td style={{ ...Styles.th }}>{item.Details} </td>
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

let Balance_ = {
  pms: {
    _id: "64a82b8cd2847135340900be",
    balanceCF: "53037.30999999959",
    productType: "PMS",
    totalTankCapacity: "200000",
    outletID: "64a6bd1dbc2fa90b074cb6b6",
    organizationID: "64a2c3be7d6d9b50290aa100",
    createdAt: "2023-07-06",
    updatedAt: "2023-07-06",
    __v: 0,
  },
  ago: {
    _id: "64a82b8cd2847135340900bf",
    balanceCF: "36482.23999999996",
    productType: "AGO",
    totalTankCapacity: "100000",
    outletID: "64a6bd1dbc2fa90b074cb6b6",
    organizationID: "64a2c3be7d6d9b50290aa100",
    createdAt: "2023-07-06",
    updatedAt: "2023-07-06",
    __v: 0,
  },
  dpk: 0,
};
