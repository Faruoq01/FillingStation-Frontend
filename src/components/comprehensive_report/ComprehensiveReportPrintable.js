import React, { useEffect, useState } from "react";
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
import { useSelector } from "react-redux";

export default function ComprehensiveReportPrintable() {
  const report = useSelector((state) => state.dailySalesReducer.bulkReports);
  const [pms, setPms] = useState([]);
  const [ago, setAgo] = useState([]);
  const [dpk, setDpk] = useState([]);
  const structureData = () => {
    let f = {
      id: `${Math.random()}`,
      amount: "122,293.00",
      pms: "01",
      opening: "122,293 ",
      difference: "122,293 ",
      lop: "283,922 ",
      rate: "283,922",
      total: "283,922",
      closing: "122,293 ",
    };
    const product = sales.filter((data) => data.productType === "PMS");
    const AGO = sales.filter((data) => data.productType === "AGO");
    const DPK = sales.filter((data) => data.productType === "DPK");
    // console.log("==================PMS==============");
    // console.log(product);
    setPms([...product]);
    // console.log("==================PMS==============");

    // console.log("==================AGO==============");
    // console.log(AGO);
    setAgo([...AGO]);
    // console.log("==================AGO==============");
    console.log("==================DPK==============");
    console.log(DPK);
    setDpk([...DPK]);
    // console.log("==================dpk==============");
  };
  const { sales } = useSelector((state) => state.dailySalesReducer.bulkReports);

  useEffect(() => {
    structureData();
  }, []);
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
          type="PMS"
          title="Product Dispense"
          data={pms}
          footerData={footer}
          header={header}
        />
        <CustomTable3
          type="AGO"
          data={ago}
          footerData={footer}
          header={header}
        />
        <CustomTable4
          type="DPK"
          data={dpk}
          footerData={footer}
          header={header}
        />
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

const datae = {
  sales: [],
  lpo: [],
  expenses: [],
  payments: [],
  pospayment: [],
  supply: [],
  incoming: [],
  tanks: [
    {
      _id: "64a2c50b7d6d9b50290aa140",
      tankName: "Tank 1",
      tankHeight: "",
      productType: "PMS",
      tankCapacity: "35000",
      deadStockLevel: "200",
      dipping: "0.00",
      calibrationDate: "2023-07-27",
      organisationID: "64a2c3be7d6d9b50290aa100",
      outletID: "64a2c4787d6d9b50290aa130",
      dateUpdated: "07/03/2023",
      station: "Hajj Camp",
      previousLevel: "0",
      quantityAdded: "0",
      currentLevel: "5350",
      activeState: "1",
      createdAt: "2023-07-03",
      updatedAt: "2023-07-03",
      __v: 0,
    },
    {
      _id: "64a2c5217d6d9b50290aa14d",
      tankName: "Tank 2",
      tankHeight: "",
      productType: "PMS",
      tankCapacity: "35000",
      deadStockLevel: "200",
      dipping: "0.00",
      calibrationDate: "2023-07-27",
      organisationID: "64a2c3be7d6d9b50290aa100",
      outletID: "64a2c4787d6d9b50290aa130",
      dateUpdated: "07/03/2023",
      station: "Hajj Camp",
      previousLevel: "0",
      quantityAdded: "0",
      currentLevel: "7350",
      activeState: "1",
      createdAt: "2023-07-03",
      updatedAt: "2023-07-03",
      __v: 0,
    },
    {
      _id: "64a2c53d7d6d9b50290aa15a",
      tankName: "Tank 1",
      tankHeight: "",
      productType: "AGO",
      tankCapacity: "35000",
      deadStockLevel: "200",
      dipping: "0.00",
      calibrationDate: "2023-07-27",
      organisationID: "64a2c3be7d6d9b50290aa100",
      outletID: "64a2c4787d6d9b50290aa130",
      dateUpdated: "07/03/2023",
      station: "Hajj Camp",
      previousLevel: "0",
      quantityAdded: "0",
      currentLevel: "15300",
      activeState: "1",
      createdAt: "2023-07-03",
      updatedAt: "2023-07-03",
      __v: 0,
    },
    {
      _id: "64a2c5537d6d9b50290aa167",
      tankName: "Tank 2",
      tankHeight: "",
      productType: "AGO",
      tankCapacity: "35000",
      deadStockLevel: "200",
      dipping: "0.00",
      calibrationDate: "2023-07-27",
      organisationID: "64a2c3be7d6d9b50290aa100",
      outletID: "64a2c4787d6d9b50290aa130",
      dateUpdated: "07/03/2023",
      station: "Hajj Camp",
      previousLevel: "0",
      quantityAdded: "0",
      currentLevel: "30000",
      activeState: "1",
      createdAt: "2023-07-03",
      updatedAt: "2023-07-03",
      __v: 0,
    },
  ],
  rtVolumes: [],
  dipping: [],
  tankLevels: [],
  balances: { pms: 0, ago: 0, dpk: 0 },
  balanceCF: { pms: 0, ago: 0, dpk: 0 },
};
