import { Radio } from "@mui/material";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import me4 from "../../assets/me4.png";
import { dippingPayload } from "../../storage/recordsales";
import ApproximateDecimal from "../common/approx";
import { ThreeDots } from "react-loader-spinner";

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
  const [productType, setProductType] = useState("PMS");
  const [loading] = useState(false);
  const dispatch = useDispatch();

  /////////////////////////////////////////////////////////
  const dippingPayloadData = useSelector(
    (state) => state.recordsales.dippingPayload
  );
  const [pms, setPMS] = useState([]);
  const [ago, setAGO] = useState([]);
  const [dpk, setDPK] = useState([]);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const selectedPumps = useSelector((state) => state.recordsales.selectedPumps);
  const tankListData = useSelector((state) => state.recordsales.tankList);
  const currentDate = useSelector((state) => state.recordsales.currentDate);
  const currentShift = useSelector((state) => state.recordsales.currentShift);
  console.log(tankListData, "tank list data");

  const getStationTanks = useCallback(() => {
    const copyTanks = JSON.parse(JSON.stringify(tankListData));
    const outletTanks = copyTanks.map((data) => {
      const newData = { ...data, label: data.tankName, value: data._id };
      return newData;
    });

    const pmsData = outletTanks.filter((data) => data.productType === "PMS");
    const agoData = outletTanks.filter((data) => data.productType === "AGO");
    const dpkData = outletTanks.filter((data) => data.productType === "DPK");

    setPMS(pmsData);
    setAGO(agoData);
    setDPK(dpkData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oneStationData._id]);

  useEffect(() => {
    getStationTanks();
  }, [getStationTanks]);

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
    const removeFormat = e.target.value.replace(/^0|[^.\w\s]/gi, "");
    switch (item.productType) {
      case "PMS": {
        const connectedPumps = selectedPumps.filter(
          (data) => data.hostTank === item._id
        );
        const totalSales = connectedPumps.reduce((accum, current) => {
          return Number(accum) + Number(current.sales);
        }, 0);

        const totalSalesRT = connectedPumps.reduce((accum, current) => {
          return Number(accum) + Number(current.RTlitre);
        }, 0);

        const levelAfterSales =
          Number(item.afterSales) - totalSales + totalSalesRT;
        let clonedPMS = { ...item };
        clonedPMS = {
          ...clonedPMS,
          dippingValue: removeFormat,
          afterSales: levelAfterSales,
        };
        const newPMSList = [...pms];
        newPMSList[index] = clonedPMS;
        setPMS(newPMSList);

        const payload = {
          tankID: item._id,
          productType: item.productType,
          currentLevel: item.afterSales,
          tankCapacity: item.tankCapacity,
          dipping: removeFormat,
          afterSales: levelAfterSales,
          tankName: item.tankName,
          PMSCostPrice: oneStationData.PMSCost,
          PMSSellingPrice: oneStationData.PMSPrice,
          AGOCostPrice: oneStationData.AGOCost,
          AGOSellingPrice: oneStationData.AGOPrice,
          DPKCostPrice: oneStationData.DPKCost,
          DPKSellingPrice: oneStationData.DPKPrice,
          outletID: oneStationData._id,
          organizationID: oneStationData.organisation,
          shift: currentShift,
          createdAt: currentDate,
          updatedAt: currentDate,
        };

        const copyDipping = JSON.parse(JSON.stringify(dippingPayloadData)); // Create a deep copy
        const indices = copyDipping.findIndex(
          (data) => data.tankID === item._id
        );

        if (indices === -1) {
          copyDipping.push(payload);
          dispatch(dippingPayload(copyDipping));
        } else {
          copyDipping[indices] = payload;
          dispatch(dippingPayload(copyDipping));
        }
        break;
      }

      case "AGO": {
        const connectedPumps = selectedPumps.filter(
          (data) => data.hostTank === item._id
        );
        const totalSales = connectedPumps.reduce((accum, current) => {
          return Number(accum) + Number(current.sales);
        }, 0);

        const totalSalesRT = connectedPumps.reduce((accum, current) => {
          return Number(accum) + Number(current.RTlitre);
        }, 0);

        const levelAfterSales =
          Number(item.afterSales) - totalSales + totalSalesRT;
        let clonedAGO = { ...item };
        clonedAGO = {
          ...clonedAGO,
          dippingValue: removeFormat,
          afterSales: levelAfterSales,
        };
        const newAGOList = [...ago];
        newAGOList[index] = clonedAGO;
        setAGO(newAGOList);

        const payload = {
          tankID: item._id,
          productType: item.productType,
          currentLevel: item.afterSales,
          tankCapacity: item.tankCapacity,
          dipping: removeFormat,
          afterSales: levelAfterSales,
          tankName: item.tankName,
          PMSCostPrice: oneStationData.PMSCost,
          PMSSellingPrice: oneStationData.PMSPrice,
          AGOCostPrice: oneStationData.AGOCost,
          AGOSellingPrice: oneStationData.AGOPrice,
          DPKCostPrice: oneStationData.DPKCost,
          DPKSellingPrice: oneStationData.DPKPrice,
          outletID: oneStationData._id,
          organizationID: oneStationData.organisation,
          shift: currentShift,
          createdAt: currentDate,
          updatedAt: currentDate,
        };

        const copyDipping = JSON.parse(JSON.stringify(dippingPayloadData));
        const indices = copyDipping.findIndex(
          (data) => data.tankID === item._id
        );
        if (indices === -1) {
          copyDipping.push(payload);
          dispatch(dippingPayload(copyDipping));
        } else {
          copyDipping[indices] = payload;
          dispatch(dippingPayload(copyDipping));
        }
        break;
      }

      case "DPK": {
        const connectedPumps = selectedPumps.filter(
          (data) => data.hostTank === item._id
        );
        const totalSales = connectedPumps.reduce((accum, current) => {
          return Number(accum) + Number(current.sales);
        }, 0);

        const totalSalesRT = connectedPumps.reduce((accum, current) => {
          return Number(accum) + Number(current.RTlitre);
        }, 0);

        const levelAfterSales =
          Number(item.afterSales) - totalSales + totalSalesRT;
        let clonedDPK = { ...item };
        clonedDPK = {
          ...clonedDPK,
          dippingValue: removeFormat,
          afterSales: levelAfterSales,
        };
        const newDPKList = [...dpk];
        newDPKList[index] = clonedDPK;
        setDPK(newDPKList);

        const payload = {
          tankID: item._id,
          productType: item.productType,
          currentLevel: item.afterSales,
          tankCapacity: item.tankCapacity,
          dipping: removeFormat,
          afterSales: levelAfterSales,
          tankName: item.tankName,
          PMSCostPrice: oneStationData.PMSCost,
          PMSSellingPrice: oneStationData.PMSPrice,
          AGOCostPrice: oneStationData.AGOCost,
          AGOSellingPrice: oneStationData.AGOPrice,
          DPKCostPrice: oneStationData.DPKCost,
          DPKSellingPrice: oneStationData.DPKPrice,
          outletID: oneStationData._id,
          organizationID: oneStationData.organisation,
          shift: currentShift,
          createdAt: currentDate,
          updatedAt: currentDate,
        };

        const copyDipping = JSON.parse(JSON.stringify(dippingPayloadData));
        const indices = copyDipping.findIndex(
          (data) => data.tankID === item._id
        );
        if (indices === -1) {
          copyDipping.push(payload);
          dispatch(dippingPayload(copyDipping));
        } else {
          copyDipping[indices] = payload;
          dispatch(dippingPayload(copyDipping));
        }
        break;
      }
      default: {
      }
    }
  };

  return (
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
                    height: "210px",
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
                    style={{ marginTop: "5px", color: "green" }}
                    className="pop">{`Tank capacity: ${item.tankCapacity}`}</div>
                  {/* <div
                    style={{ marginTop: "5px", color: "green" }}
                    className="pop">{`Opening stock: ${ApproximateDecimal(
                    item.afterSales
                  )}`}</div> */}
                  <div style={{ marginTop: "10px" }} className="label">
                    Dipping (Litres)
                  </div>

                  <input
                    value={ApproximateDecimal(item.dippingValue)}
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
                    height: "210px",
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
                    style={{ marginTop: "5px", color: "green" }}
                    className="pop">{`Tank capacity: ${item.tankCapacity}`}</div>
                  {/* <div
                    style={{ marginTop: "5px", color: "green" }}
                    className="pop">{`Opening stock: ${ApproximateDecimal(
                    item.afterSales
                  )}`}</div> */}
                  <div style={{ marginTop: "10px" }} className="label">
                    Dipping (Litres)
                  </div>

                  <input
                    value={ApproximateDecimal(item.dippingValue)}
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
                    height: "210px",
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
                    style={{ marginTop: "5px", color: "green" }}
                    className="pop">{`Tank capacity: ${item.tankCapacity}`}</div>
                  {/* <div
                    style={{ marginTop: "5px", color: "green" }}
                    className="pop">{`Opening stock: ${ApproximateDecimal(
                    item.afterSales
                  )}`}</div> */}
                  <div style={{ marginTop: "10px" }} className="label">
                    Dipping (Litres)
                  </div>

                  <input
                    value={ApproximateDecimal(item.dippingValue)}
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
