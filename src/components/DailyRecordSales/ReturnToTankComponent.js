import { Button, Radio } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import pump1 from "../../assets/pump1.png";
import cross from "../../assets/cross.png";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import Navigation from "./navigation";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import APIs from "../../services/connections/api";
import RTDetails from "../Modals/recordsales/rtdetails";
import UpdateReturnToTank from "../Modals/DailySales/returnToTank";

const mediaMatch = window.matchMedia("(max-width: 450px)");

const ReturnToTank = (props) => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate()
  const [productType, setProductType] = useState("PMS");
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const currentDate = useSelector((state) => state.recordsales.currentDate);
  const currentShift = useSelector((state) => state.recordsales.currentShift);
  const [rtPayload, setRTpayload] = useState({
    sales: [],
    rt: []
  });
  const [openRt, setOpenRt] = useState(false);
  const[refreshIt, setRefresh] = useState(false);
  const [editRT, setEditRt] = useState(false);
  const [oneRecord, setOneRecord] = useState({});

  ////////////////////////////////////////////////////////////
  const [salesList, setSalesList] = useState([]);

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.recordSales[e];
  };

  const getSalesData = useCallback(async (station, date) => {
    const today = moment().format("YYYY-MM-DD").split(" ")[0];
    const getDate = date === "" ? today : date;

    const salesPayload = {
      outletID: station._id,
      organizationID: station.organisation,
      date: getDate,
      shift: currentShift
    }

    const currentSales = await APIs.post("/sales/current-sales", salesPayload);
    const salesList = currentSales.data.data;

    const PMSData = salesList.filter(data => data.productType === "PMS");
    const AGOData = salesList.filter(data => data.productType === "AGO");
    const DPKData = salesList.filter(data => data.productType === "DPK");

    setPMS(PMSData);
    setAGO(AGOData);
    setDPK(DPKData);
    setSalesList(salesList);
  }, [])

  const [pms, setPMS] = useState([]);
  const [ago, setAGO] = useState([]);
  const [dpk, setDPK] = useState([]);

  useEffect(() => {
    getSalesData(oneStationData, currentDate);
  }, [oneStationData, currentDate, refreshIt]);

  const refresh = () => {
    getSalesData(oneStationData, currentDate);
  }

  const onRadioClick = (data) => {
    if (data === "PMS") {
      setProductType("PMS");
    }

    if (data === "AGO") {
      setProductType("AGO");
    }

    if (data === "DPK") {
      setProductType("DPK");
    }
  };

  const pumpItem = () => {
    swal(
      "Warning!",
      "These pumps cannot be deselected here go to pump update!",
      "info"
    );
  };

  const deselect = () => {
    swal(
      "Warning!",
      "These pumps cannot be deselected here go to pump update!",
      "info"
    );
  };

  const setTotalizer = (e, item) => {
    switch(item.productType){
      case "PMS":{
        const copyPMS = JSON.parse(JSON.stringify(pms));
        const index = copyPMS.findIndex(data => data.pumpID === item.pumpID);
        if(index !== -1){
          copyPMS[index] = {...copyPMS[index], RTlitre: Number(e.target.value)};
          setPMS(copyPMS);
          updatePayload(copyPMS, ago, dpk);
          return
        }
        return swal("Error!", "This pump doesnt have a sales value", "error");
      }
      case "AGO":{
        const copyAGO = JSON.parse(JSON.stringify(ago));
        const index = copyAGO.findIndex(data => data.pumpID === item.pumpID);
        if(index !== -1){
          copyAGO[index] = {...copyAGO[index], RTlitre: Number(e.target.value)};
          setAGO(copyAGO);
          updatePayload(pms, copyAGO, dpk);
          return
        }
        return swal("Error!", "This pump doesnt have a sales value", "error");
      }
      case "DPK":{
        const copyDPK = JSON.parse(JSON.stringify(dpk));
        const index = copyDPK.findIndex(data => data.pumpID === item.pumpID);
        if(index !== -1){
          copyDPK[index] = {...copyDPK[index], RTlitre: Number(e.target.value)};
          setDPK(copyDPK);
          updatePayload(pms, ago, copyDPK);
          return
        }
        return swal("Error!", "This pump doesnt have a sales value", "error");
      }
      default:{}
    }
  };

  const updatePayload = (pms, ago, dpk) => {
    const totalSales = [...pms, ...ago, ...dpk];
    const getRTSales = totalSales.filter(item => item.RTlitre !== 0);

    const totalRT = getRTSales.map(data => {
      const rt = getRTPayload(data, currentDate, currentShift);
      return rt;
    })

    const payload = {
      sales: getRTSales,
      rt: totalRT
    }
    setRTpayload(payload);
  }

  const next = () => {
    if (oneStationData === null)
      return swal("Warning!", "Please select a station first", "info");
    if (!getPerm("4"))
      return swal("Warning!", "Permission denied", "info");

    if(rtPayload.sales.length === 0){
      navigate("/home/recordsales/lpo");
    }else{
      setOpenRt(true);
    }
  }

  const editRtHandler = async(item) => {
    const payload = {
      pumpID: item.pumpID,
      createdAt: item.createdAt
    }
    const {data} = await APIs.post("/sales/single-rt", payload);
    if(data.data !== 'none'){
      setOneRecord(data.data);
      setEditRt(true)
    }else{
      swal('Error!', 'Return to tank record was not found', 'error');
    }
  }

  return (
    <React.Fragment>
      <div className="form-body">
        <div
        style={{ flexDirection: "column", alignItems: "center" }}
        className="inner-body">
          <div style={rad} className="radio">
            <div className="rad-item">
              <Radio
                {...props}
                sx={{
                  "&, &.Mui-checked": {
                    color: "#054834",
                  },
                }}
                onClick={() => onRadioClick("PMS")}
                checked={productType === "PMS" ? true : false}
              />
              <div
                className="head-text2"
                style={{ marginRight: "5px", fontSize: "12px" }}>
                PMS
              </div>
            </div>
            <div className="rad-item">
              <Radio
                {...props}
                sx={{
                  "&, &.Mui-checked": {
                    color: "#054834",
                  },
                }}
                onClick={() => onRadioClick("AGO")}
                checked={productType === "AGO" ? true : false}
              />
              <div
                className="head-text2"
                style={{ marginRight: "5px", fontSize: "12px" }}>
                AGO
              </div>
            </div>
            <div className="rad-item">
              <Radio
                {...props}
                sx={{
                  "&, &.Mui-checked": {
                    color: "#054834",
                  },
                }}
                onClick={() => onRadioClick("DPK")}
                checked={productType === "DPK" ? true : false}
              />
              <div
                className="head-text2"
                style={{ marginRight: "5px", fontSize: "12px" }}>
                DPK
              </div>
            </div>
          </div>

          <div
            style={{ marginTop: "10px", marginBottom: "10px", fontWeight: "400" }}>
            Select Pump used for the day
          </div>
          <div
            style={{ flexDirection: "row", justifyContent: "center" }}
            className="pump-list">
            {salesList?.length === 0 ? (
              <div style={{ ...box, width: "170px" }}>
                <div style={{ marginRight: "10px", fontWeight: "500" }}>
                  No pump Created
                </div>
                <img
                  style={{ width: "20px", height: "20px" }}
                  src={cross}
                  alt="icon"
                />
              </div>
            ) : productType === "PMS" ? (
              pms.map((data, index) => {
                return (
                  <div key={index}>
                    <div className="box">
                      <p
                        onClick={(e) => pumpItem(e, index, data)}
                        style={{ marginRight: "10px" }}>
                        {data.pumpName}
                      </p>
                      <img
                        onClick={() => {
                          deselect(data);
                        }}
                        style={{ width: "20px", height: "20px" }}
                        src={cross}
                        alt="icon"
                      />
                    </div>
                  </div>
                );
              })
            ) : productType === "AGO" ? (
              ago.map((data, index) => {
                return (
                  <div key={index}>
                    <div className="box">
                      <p
                        onClick={(e) => pumpItem(e, index, data)}
                        style={{ marginRight: "10px" }}>
                        {data.pumpName}
                      </p>
                      <img
                        onClick={() => {
                          deselect(data);
                        }}
                        style={{ width: "20px", height: "20px" }}
                        src={cross}
                        alt="icon"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              dpk.map((data, index) => {
                return (
                  <div key={index}>
                    <div className="box">
                      <p
                        onClick={(e) => pumpItem(e, index, data)}
                        style={{ marginRight: "10px" }}>
                        {data.pumpName}
                      </p>
                      <img
                        onClick={() => {
                          deselect(data);
                        }}
                        style={{ width: "20px", height: "20px" }}
                        src={cross}
                        alt="icon"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div
            style={{ width: "100%", marginTop: "20px", justifyContent: "center" }}
            className="pumping">
            {productType === "PMS" &&
              (pms.length === 0 ? (
                <div style={cap}>Please click to select a pump</div>
              ) : (
                pms.map((item, index) => {
                  return (
                    <div
                      style={{
                        width: mediaMatch.matches ? "100%" : "270px",
                        height: "250px",
                      }}
                      key={index}
                      className="item">
                      <img
                        style={{ width: "55px", height: "60px", marginTop: "10px" }}
                        src={pump1}
                        alt="icon"
                      />
                      <div className="pop">{item.pumpName}</div>
                      {item.RTlitre !== 0 &&
                        <Button onClick={() => {editRtHandler(item)}} sx={editButton}>Edit</Button>
                      }
                      <div style={{ marginTop: "10px" }} className="label">
                        Date: {item.updatedAt.split("T")[0]}
                      </div>
                      <div style={{ width: "94%" }}>
                        <div style={{ marginTop: "10px" }} className="label">
                          Quantity (Litres)
                        </div>
                        <input
                          onChange={(e) => setTotalizer(e, item)}
                          style={{
                            ...imps,
                            width: "94%",
                            border:
                              Number(item.totalizerReading) >
                                Number(item.newTotalizer) &&
                              item.newTotalizer !== "0"
                                ? "1px solid red"
                                : "1px solid black",
                          }}
                          type="number"
                          value={item.RTlitre === 0? "": item.RTlitre}
                        />
                      </div>
                    </div>
                  );
                })
              ))}

            {productType === "AGO" &&
              (ago.length === 0 ? (
                <div style={cap}>Please click to select a pump</div>
              ) : (
                ago.map((item, index) => {
                  return (
                    <div
                      style={{
                        width: mediaMatch.matches ? "100%" : "300px",
                        height: "230px",
                      }}
                      key={index}
                      className="item">
                      <img
                        style={{ width: "55px", height: "60px", marginTop: "10px" }}
                        src={pump1}
                        alt="icon"
                      />
                      <div className="pop">{item.pumpName}</div>
                      <div style={{ marginTop: "10px" }} className="label">
                        Date: {item.updatedAt.split("T")[0]}
                      </div>
                      <div style={{ width: "94%" }}>
                        <div style={{ marginTop: "10px" }} className="label">
                          Quantity (Litres)
                        </div>
                        <input
                          onChange={(e) => setTotalizer(e, item)}
                          value={item.RTlitre === 0? "": item.RTlitre}
                          style={{
                            ...imps,
                            width: "94%",
                            border:
                              Number(item.totalizerReading) >
                                Number(item.newTotalizer) &&
                              item.newTotalizer !== "0"
                                ? "1px solid red"
                                : "1px solid black",
                          }}
                          type="number"
                        />
                      </div>
                    </div>
                  );
                })
              ))}

            {productType === "DPK" &&
              (dpk.length === 0 ? (
                <div style={cap}>Please click to select a pump</div>
              ) : (
                dpk.map((item, index) => {
                  return (
                    <div
                      style={{
                        width: mediaMatch.matches ? "100%" : "300px",
                        height: "230px",
                      }}
                      key={index}
                      className="item">
                      <img
                        style={{ width: "55px", height: "60px", marginTop: "10px" }}
                        src={pump1}
                        alt="icon"
                      />
                      <div className="pop">{item.pumpName}</div>
                      <div style={{ marginTop: "10px" }} className="label">
                        Date: {item.updatedAt.split("T")[0]}
                      </div>
                      <div style={{ width: "94%" }}>
                        <div style={{ marginTop: "10px" }} className="label">
                          Quantity (Litres)
                        </div>
                        <input
                          onChange={(e) => setTotalizer(e, item)}
                          value={item.RTlitre === 0? "": item.RTlitre}
                          style={{
                            ...imps,
                            width: "94%",
                            border:
                              Number(item.totalizerReading) >
                                Number(item.newTotalizer) &&
                              item.newTotalizer !== "0"
                                ? "1px solid red"
                                : "1px solid black",
                          }}
                          type="number"
                        />
                      </div>
                    </div>
                  );
                })
              ))}
          </div>
        </div>
      </div>
      {editRT && (
        <UpdateReturnToTank 
          data={oneRecord}
          update={setRefresh}
          open={editRT}
          close={setEditRt}
        />
      )}
      {openRt &&
        <RTDetails refresh={refresh} open={openRt} close={setOpenRt} data={rtPayload} />
      }
      <Navigation next={next} />
    </React.Fragment>
  );
};

const getRTPayload = (data, currentDate, currentShift) => {
  return {
    rtLitre: data.RTlitre,
    PMSCost: data.PMSCostPrice,
    AGOCost: data.AGOCostPrice,
    DPKCost: data.DPKCostPrice,
    PMSPrice: data.PMSSellingPrice,
    AGOPrice: data.AGOSellingPrice,
    DPKPrice: data.DPKSellingPrice,
    productType: data.productType,
    pumpID: data.pumpID,
    tankID: data.tankID,
    pumpName: data.pumpName,
    tankName: data.tankName,
    outletID: data.outletID,
    organizationID: data.organisationID,
    shift: currentShift,
    createdAt: currentDate,
    updatedAt: currentDate,
  };
};

const cap = {
  fontSize: "14px",
  marginBottom: "20px",
  fontWeight: "500",
};

const rad = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
};

const box = {
  width: "100px",
  height: "35px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#06805B",
  borderRadius: "30px",
  color: "#fff",
  marginRight: "10px",
  marginTop: "10px",
};

const imps = {
  height: "30px",
  width: "160px",
  background: "#D7D7D799",
  outline: "none",
  border: "1px solid #000",
  paddingLeft: "10px",
};

const editButton = {
  width: "80px",
  height: "25px",
  background: "tomato",
  marginTop: "5px",
  color: "#fff",
  fontSize: "12px",
  "&: hover":{
    background: "tomato"
  }
}

export default ReturnToTank;
