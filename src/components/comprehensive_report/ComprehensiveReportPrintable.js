import React from "react";
import CustomTable1 from "./components/CustomTable1";
import CustomTable5 from "./components/CustomTable5";
import CustomTable3 from "./components/CustomTable3";
import CustomTable4 from "./components/CustomTable4";
import CustomTable2 from "./components/CustomeTable2";
import {
  data,
  data2,
  dataT2,
  dataT6,
  dataT8,
  dataT9,
  footer,
  footerT6,
  header,
  header2,
  header3,
  headerT6,
  headerT8,
  headerT9,
  lpoData,
  lpoFooter,
  lpoHeader,
} from "./data";
import CustomTable6 from "./components/CustomTable6";
import CustomTable8 from "./components/CustomTable8";
import CustomTable9 from "./components/CustomTable9";
import CustomTable7 from "./components/CustomTable7";

export default function ComprehensiveReportPrintable() {
  return (
    <div style={Styles.wrapper}>
      <div style={Styles.tp}>
        <div style={Styles.ft}>
          <span style={Styles.span}>
            <label for="title" style={{ color: "#06805B" }}>
              Comprehensive Result
            </label>
            - 20 May, 2023
          </span>
        </div>
        <CustomTable1 />
        <CustomTable2
          title="Product Dispense"
          data={dataT2}
          footer={footer}
          header={header}
        />

        <CustomTable3 data={data2} footer={footer} header={header2} />
        <CustomTable4 data={data} footer={footer} header={header3} />
        <CustomTable5
          title="LPO"
          data={lpoData}
          footer={lpoFooter}
          header={lpoHeader}
        />
        <CustomTable6
          title="Expenses"
          data={dataT6}
          footer={footerT6}
          header={headerT6}
        />
        <CustomTable7 />
        <CustomTable8
          title="Product Balance Carried Forward"
          data={dataT8}
          header={headerT8}
        />
        <CustomTable9
          title="Dipping"
          // footer={footerT6}
          data={dataT9}
          header={headerT9}
        />
      </div>
    </div>
  );
}

const Styles = {
  wrapper: {
    backgroundColor: "#f1f1f1",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  span: {
    fontstyle: "normal",
    fontWeight: 800,
    fontSize: "32px",
    lineHeight: "44px",
    fontFamily: "'Nunito', sans-serif",
  },
  tp: {
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#fff",
  },
  ft: { marginTop: 20, marginBottom: "1rem" },
};
