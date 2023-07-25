import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ApproximateDecimal from "../../common/approx";
export default function CustomTable3({
  header = [],
  footerData = [],

  title = "",
  ...props
}) {
  const [footer, setFooter] = useState([]);
  const sales = useSelector((state) => state.comprehensive.sales);
  const data = sales[props.type.toLowerCase()];
  const formatFooter = () => {
    setFooter([
      ...footerData({
        total: ApproximateDecimal(sumOfTotals()),
        difference: ApproximateDecimal(sumOfDifference()),
      }),
    ]);
  };
  const sumOfTotals = () => {
    const totalSum = data.reduce((accum, current) => {
      return Number(accum) + amount(current, current.productType);
    }, 0);

    return totalSum;
  };

  useEffect(() => {
    formatFooter();
  }, [data]);
  const rate = (row, type) => {
    if (type === "PMS") return row.PMSSellingPrice;
    if (type === "AGO") return row.AGOSellingPrice;
    if (type === "DPK") return row.DPKSellingPrice;
  };

  const amount = (row, type) => {
    const diff = Number(row.closingMeter) - Number(row.openingMeter);

    if (type === "PMS") return row.PMSSellingPrice * diff;
    if (type === "AGO") return row.AGOSellingPrice * diff;
    if (type === "DPK") return row.DPKSellingPrice * diff;
  };

  const sumOfDifference = () => {
    const totalDifference = data.reduce((accum, current) => {
      return (
        Number(accum) +
        (Number(current.closingMeter) - Number(current.openingMeter))
      );
    }, 0);
    return totalDifference;
    footer();
  };
  return (
    <div style={{ marginTop: 10, marginBottom: 10 }}>
      <span style={Styles.title}>{title}</span>
      <div style={{ marginRight: 2, marginLeft: 2 }}>
        <table
          style={{
            width: "100%",
            padding: 0,
            borderSpacing: 5,
          }}
        >
          <thead>
            <tr style={{}}>
              {header.map((item, index) => (
                <th
                  key={Math.random()}
                  style={
                    index === 0
                      ? {
                          ...Styles.header,
                          width: "",
                          paddingLeft: 10,
                        }
                      : Styles.header
                  }
                >
                  {index === 0 ? "AGO" : item.value}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={Math.random()}>
                <td style={{ ...Styles.th }}>{index + 1} </td>
                <td style={{ ...Styles.th }}>
                  {ApproximateDecimal(item.openingMeter)}
                </td>
                <td style={{ ...Styles.th }}>
                  {ApproximateDecimal(item.closingMeter)}
                </td>
                <td style={{ ...Styles.th }}>{rate(item, props.type)}</td>
                {/* <td style={{ ...Styles.th }}>{item.lpo} </td> */}
                <td style={{ ...Styles.th }}>{rate(item, props.type)} </td>
                <td style={{ ...Styles.th }}>
                  {ApproximateDecimal(amount(item, props.type))}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              {Array.isArray(footer) &&
                footer.length &&
                footer.map((item, index) => (
                  <td
                    key={Math.random()}
                    style={
                      index === 0 || index === 1
                        ? {
                            ...Styles.th,
                            backgroundColor: "white",
                            textAlign: item.value === "Total" && "end",
                          }
                        : {
                            ...Styles.th,
                            textAlign: item.value === "Total" && "end",
                          }
                    }
                  >
                    {item.value}
                  </td>
                ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
const Styles = {
  header: {
    paddingLeft: 10,
    fontFamily: "'Nunito', sans-serif",
    fontStyle: "normal",
    lineHeight: "22px",
    textAlign: "start",
    // width: "128px",
    color: "white",
    height: "40px",
    fontSize: 14,
    background: "linear-gradient(266.48deg, #171717 8.34%, #252525 52.9%)",
    borderRadius: "4px",
  },
  title: {
    fontFamily: "'Nunito', sans-serif",
    fontStyle: "normal",
    fontWeight: 800,
    lineHeight: "34px",
    color: "#06805B",
    marginLeft: 8,
    marginTop: "1rem",
    marginBottom: 5,
  },
  th: {
    height: "35px",
    background: "#F3F3F3",
    borderRadius: "4px",
    fontSize: 14,
    padding: "5px",
    // paddingRight: "auto",
    fontFamily: "'Nunito', sans-serif",
  },
};
