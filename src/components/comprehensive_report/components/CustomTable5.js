import React from "react";

export default function CustomTable5({
  header = [],
  footer = [],
  data = [],
  title = "",
}) {
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
                  {item.value}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td style={{ ...Styles.th }}>{item.pms} </td>
                <td style={{ ...Styles.th }}>{item.opening} </td>
                <td style={{ ...Styles.th }}>{item.closing} </td>
                <td style={{ ...Styles.th }}>{item.difference} </td>
                <td style={{ ...Styles.th }}>{item.lop} </td>
                <td style={{ ...Styles.th }}>{item.rate} </td>
                <td style={{ ...Styles.th }}>{item.amount} </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              {footer.map((item, index) => (
                <td
                  key={Math.random()}
                  style={
                    index === 0 ||
                    index === 1 ||
                    index === 2 ||
                    index === 3 ||
                    index === 4
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
