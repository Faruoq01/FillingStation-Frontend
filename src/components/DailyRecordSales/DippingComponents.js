import { Radio } from "@mui/material";
import React, { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import me4 from "../../assets/me4.png";
import { tankList, updateSelectedTanks } from "../../storage/recordsales";
import ApproximateDecimal from "../common/approx";
import { ThreeDots } from "react-loader-spinner";
import Navigation from "./navigation";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import SummaryRecord from "../Modals/SummaryRecord";
import APIs from "../../services/connections/api";
import moment from "moment";
import SalesService from "../../services/360station/sales";

const returnColor = (data, style) => {
  if (data === "PMS") {
    return { ...style, background: "#054834", color: "#fff" };
  } else if (data === "AGO") {
    return { ...style, background: "#FFA010" };
  } else if (data === "DPK") {
    return { ...style, background: "#35393E", color: "#fff" };
  }
};

const DippingComponents = (props) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user);
  const [productType, setProductType] = useState("PMS");
  const [loading] = useState(false);
  const dispatch = useDispatch();

  /////////////////////////////////////////////////////////
  const [pms, setPMS] = useState([]);
  const [ago, setAGO] = useState([]);
  const [dpk, setDPK] = useState([]);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const tankListData = useSelector((state) => state.recordsales.tankList);
  const currentDate = useSelector((state) => state.recordsales.currentDate);
  const currentShift = useSelector((state) => state.recordsales.currentShift);
  const [dippingList, setDippingList] = useState([]);
  const [saved, setSaved] = useState(true);
  const [refreshIt, setRefresh] = useState(false);

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.recordSales[e];
  };

  const getStationTanks = useCallback(async(station, date) => {
    const today = moment().format("YYYY-MM-DD").split(" ")[0];
    const getDate = date === "" ? today : date;

    const payload = {
      organizationID:station.organisation,
      outletID: station._id,
      createdAt: getDate,
      shift: currentShift
    }

    const {data} = await APIs.post("/sales/tanklevels-data", payload);
    const copyTanks = JSON.parse(JSON.stringify(data.data));
    const outletTanks = copyTanks.map((data) => {
      const newData = { ...data, label: data.tankName, value: data.tankID };
      return newData;
    });

    const pmsData = outletTanks.filter((data) => data.productType === "PMS");
    const agoData = outletTanks.filter((data) => data.productType === "AGO");
    const dpkData = outletTanks.filter((data) => data.productType === "DPK");

    setPMS(pmsData);
    setAGO(agoData);
    setDPK(dpkData);
    setDippingList(outletTanks)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getStationTanks(oneStationData, currentDate);
  }, [getStationTanks, oneStationData, currentDate, refreshIt]);

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

  const setTotalizer = (e, item, index) => {
    setSaved(false);
    const removeFormat = e.target.value.replace(/^0|[^.\w\s]/gi, "");
    const tankCopy = JSON.parse(JSON.stringify(item));
    tankCopy.dipping = Number(removeFormat);
    
    const copyList = JSON.parse(JSON.stringify(dippingList));
    const position = copyList.findIndex(data => data.tankID === item.tankID);

    if(position !== -1){
      copyList[position] = tankCopy;
      setDippingList(copyList);
    }


    switch (item.productType) {
      case "PMS": {
        const pmsCopy = JSON.parse(JSON.stringify(pms));
        pmsCopy.splice(index, 1, tankCopy);
        setPMS(pmsCopy);
        break;
      }
      case "AGO": {
        const agoCopy = JSON.parse(JSON.stringify(ago));
        agoCopy.splice(index, 1, tankCopy);
        setAGO(agoCopy);
        break;
      }
      case "DPK": {
        const dpkCopy = JSON.parse(JSON.stringify(dpk));
        dpkCopy.splice(index, 1, tankCopy);
        setDPK(dpkCopy);
        break;
      }
      default: {
      }
    }
  };

  const finish = () => {
    if (oneStationData === null)
      return swal("Warning!", "Please select a station first", "info");
    if (!getPerm("8"))
    return swal("Warning!", "Permission denied", "info");

    if(saved){
      navigate("/home/recordsales/pumpupdate/0");
    }else{
      swal({
        title: "Alert!",
        text: "Are you sure you want to save current changes?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async () => {
        try{
          const status = await SalesService.dipping({
            dipping: dippingList,
          });
          if(status){
            setSaved(true);
            setRefresh(prev => !prev)
            swal("Success!", "LPO records saved successfully!", "success");
          }
        }catch(e){
          console.log(e)
        }
      });
    }
  }

  return (
    <React.Fragment>
      <div className="form-body">
        <div
          style={{ flexDirection: "column", alignItems: "flex-start" }}
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

          <div style={returnColor(productType, pro)}>
            <span style={{ marginLeft: "15px" }}>{productType}</span>
          </div>

          <div style={{ width: "100%" }} className="pumping">
            {productType === "PMS" &&
              (pms.length === 0 ? (
                <div style={created}>
                  {loading ? (
                    <ThreeDots
                      height="60"
                      width="50"
                      radius="9"
                      color="#076146"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClassName=""
                      visible={true}
                    />
                  ) : (
                    <span>No tanks loaded</span>
                  )}
                </div>
              ) : (
                pms.map((item, index) => {
                  return (
                    <div
                      style={{
                        justifyContent: "flex-start",
                        height: "250px",
                        marginLeft: "20px",
                        marginRight: "0px",
                      }}
                      key={index}
                      className="item">
                      <img
                        style={{ width: "80px", height: "65px", marginTop: "15px" }}
                        src={me4}
                        alt="icon"
                      />
                      <div style={{ marginTop: "0px" }} className="pop">
                        {item.tankName + "( " + item.productType + " )"}
                      </div>
                      <div
                        style={{ marginTop: "10px", color: "tomato" }}
                        className="pop">{`Tank capacity: ${item.tankCapacity}`}</div>
                      <div
                        style={{ marginTop: "5px", color: "green" }}
                        className="pop">{`Opening stock: ${ApproximateDecimal(
                        item.currentLevel
                      )}`}</div>
                      <div
                        style={{ marginTop: "5px", color: "green" }}
                        className="pop">{`Closing stock: ${ApproximateDecimal(
                        item.afterSales
                      )}`}</div>
                      <div style={{ marginTop: "10px" }} className="label">
                        Dipping (Litres)
                      </div>

                      <input
                        value={ApproximateDecimal(item.dipping)}
                        onChange={(e) => setTotalizer(e, item, index)}
                        style={imps}
                        type="text"
                      />
                    </div>
                  );
                })
              ))}
            {productType === "AGO" &&
              (ago.length === 0 ? (
                <div style={created}>
                  {loading ? (
                    <ThreeDots
                      height="60"
                      width="50"
                      radius="9"
                      color="#076146"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClassName=""
                      visible={true}
                    />
                  ) : (
                    <span>No tanks loaded</span>
                  )}
                </div>
              ) : (
                ago.map((item, index) => {
                  return (
                    <div
                      style={{
                        justifyContent: "flex-start",
                        height: "250px",
                        marginLeft: "20px",
                        marginRight: "0px",
                      }}
                      key={index}
                      className="item">
                      <img
                        style={{ width: "80px", height: "65px", marginTop: "15px" }}
                        src={me4}
                        alt="icon"
                      />
                      <div style={{ marginTop: "0px" }} className="pop">
                        {item.tankName + "( " + item.productType + " )"}
                      </div>
                      <div
                        style={{ marginTop: "10px", color: "tomato" }}
                        className="pop">{`Tank capacity: ${item.tankCapacity}`}</div>
                      <div
                        style={{ marginTop: "5px", color: "green" }}
                        className="pop">{`Opening stock: ${ApproximateDecimal(
                        item.currentLevel
                      )}`}</div>
                      <div
                        style={{ marginTop: "5px", color: "green" }}
                        className="pop">{`Closing stock: ${ApproximateDecimal(
                        item.afterSales
                      )}`}</div>
                      <div style={{ marginTop: "10px" }} className="label">
                        Dipping (Litres)
                      </div>

                      <input
                        value={ApproximateDecimal(item.dipping)}
                        onChange={(e) => setTotalizer(e, item, index)}
                        style={imps}
                        type="text"
                      />
                    </div>
                  );
                })
              ))}
            {productType === "DPK" &&
              (dpk.length === 0 ? (
                <div style={created}>
                  {loading ? (
                    <ThreeDots
                      height="60"
                      width="50"
                      radius="9"
                      color="#076146"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClassName=""
                      visible={true}
                    />
                  ) : (
                    <span>No tanks loaded</span>
                  )}
                </div>
              ) : (
                dpk.map((item, index) => {
                  return (
                    <div
                      style={{
                        justifyContent: "flex-start",
                        height: "250px",
                        marginLeft: "20px",
                        marginRight: "0px",
                      }}
                      key={index}
                      className="item">
                      <img
                        style={{ width: "80px", height: "65px", marginTop: "15px" }}
                        src={me4}
                        alt="icon"
                      />
                      <div style={{ marginTop: "0px" }} className="pop">
                        {item.tankName + "( " + item.productType + " )"}
                      </div>
                      <div
                        style={{ marginTop: "10px", color: "tomato" }}
                        className="pop">{`Tank capacity: ${item.tankCapacity}`}</div>
                      <div
                        style={{ marginTop: "5px", color: "green" }}
                        className="pop">{`Opening stock: ${ApproximateDecimal(
                        item.currentLevel
                      )}`}</div>
                      <div
                        style={{ marginTop: "5px", color: "green" }}
                        className="pop">{`Closing stock: ${ApproximateDecimal(
                        item.afterSales
                      )}`}</div>
                      <div style={{ marginTop: "10px" }} className="label">
                        Dipping (Litres)
                      </div>

                      <input
                        value={ApproximateDecimal(item.dipping)}
                        onChange={(e) => setTotalizer(e, item, index)}
                        style={imps}
                        type="text"
                      />
                    </div>
                  );
                })
              ))}
          </div>
        </div>
      </div>
      <Navigation finish={finish} />
    </React.Fragment>
  );
};

const pro = {
  width: "98%",
  height: "35px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  fontWeight: "bold",
  marginTop: "20px",
  marginLeft: "1%",
};

const rad = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
};

const created = {
  width: "100%",
  fontSize: "14px",
  marginLeft: "10px",
  marginTop: "20px",
  marginBottom: "20px",
  fontWeight: "bold",
  textAlign: "center",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
};

const imps = {
  height: "30px",
  width: "170px",
  background: "#D7D7D799",
  outline: "none",
  border: "1px solid #000",
  paddingLeft: "10px",
  marginTop: "10px",
};

export default DippingComponents;
