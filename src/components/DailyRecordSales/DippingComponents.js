import { Radio } from "@mui/material";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import me4 from "../../assets/me4.png";
import { tankList, updateSelectedTanks } from "../../storage/recordsales";
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
  const [pms, setPMS] = useState([]);
  const [ago, setAGO] = useState([]);
  const [dpk, setDPK] = useState([]);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const tankListData = useSelector((state) => state.recordsales.tankList);
  const selectedTanks = useSelector((state) => state.recordsales.selectedTanks);

  const getStationTanks = useCallback(() => {
    const copyTanks = JSON.parse(JSON.stringify(tankListData));
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
    const tankCopy = JSON.parse(JSON.stringify(item));
    tankCopy.dipping = removeFormat;

    const tankListCopy = JSON.parse(JSON.stringify(tankListData));
    const selectedTanksCopy = JSON.parse(JSON.stringify(selectedTanks));
    const findID = tankListCopy.findIndex(
      (data) => data.tankID === item.tankID
    );
    if (findID !== -1) {
      tankListCopy[findID] = tankCopy;
      dispatch(tankList(tankListCopy));
    }

    const tankIndex = selectedTanksCopy.findIndex(
      (data) => data.tankID === item.tankID
    );

    if (tankIndex !== -1) {
      selectedTanksCopy[tankIndex] = tankCopy;
      dispatch(updateSelectedTanks(selectedTanksCopy));
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
                    height: "230px",
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
                  <div
                    style={{ marginTop: "5px", color: "green" }}
                    className="pop">{`Opening stock: ${ApproximateDecimal(
                    item.currentLevel
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
                    height: "230px",
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
                  <div
                    style={{ marginTop: "5px", color: "green" }}
                    className="pop">{`Opening stock: ${ApproximateDecimal(
                    item.currentLevel
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
                    height: "230px",
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
                  <div
                    style={{ marginTop: "5px", color: "green" }}
                    className="pop">{`Opening stock: ${ApproximateDecimal(
                    item.currentLevel
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
