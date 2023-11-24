import { Radio } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import pump1 from "../../assets/pump1.png";
import cross from "../../assets/cross.png";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { updateSelectedPumps } from "../../storage/recordsales";
import Navigation from "./navigation";
import { useNavigate } from "react-router-dom";

const mediaMatch = window.matchMedia("(max-width: 450px)");

const ReturnToTank = (props) => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate()
  const [productType, setProductType] = useState("PMS");
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);

  ////////////////////////////////////////////////////////////
  const dispatch = useDispatch();
  const selectedPumps = useSelector((state) => state.recordsales.selectedPumps);
  const selectedTanks = useSelector((state) => state.recordsales.selectedTanks);

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.recordSales[e];
  };

  const getPMSPump = useCallback(() => {
    const newList = [...selectedPumps];
    const pms = newList.filter((data) => data.productType === "PMS");
    return pms;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAGOPump = useCallback(() => {
    const newList = [...selectedPumps];
    const ago = newList.filter((data) => data.productType === "AGO");
    return ago;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDPKPump = useCallback(() => {
    const newList = [...selectedPumps];
    const dpk = newList.filter((data) => data.productType === "DPK");
    return dpk;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [pms, setPMS] = useState([]);
  const [ago, setAGO] = useState([]);
  const [dpk, setDPK] = useState([]);

  useEffect(() => {
    setPMS(getPMSPump());
    setAGO(getAGOPump());
    setDPK(getDPKPump());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const updateTotalizer = (e, pump) => {
    if (Number(pump.sales) === 0)
      return swal("Error!", "You have made zero sales from this pump", "error");

    switch (productType) {
      case "PMS": {
        /*###########################################
                Update the pump readings for PMS
            ############################################*/

        const newPms = JSON.parse(JSON.stringify(pms));
        const findID = newPms.findIndex((data) => data._id === pump._id);
        newPms[findID] = { ...newPms[findID], RTlitre: e };
        newPms[findID] = { ...newPms[findID], outlet: oneStationData };
        setPMS(newPms);

        const FromAllPumps = JSON.parse(JSON.stringify(selectedPumps));
        const indexID = FromAllPumps.findIndex((data) => data._id === pump._id);
        FromAllPumps[indexID] = { ...FromAllPumps[indexID], RTlitre: e };
        dispatch(updateSelectedPumps(FromAllPumps));
        break;
      }

      case "AGO": {
        /*###########################################
                Update the pump readings for AGO
            ############################################*/

        const newAgo = JSON.parse(JSON.stringify(ago));
        const findID = newAgo.findIndex((data) => data._id === pump._id);
        newAgo[findID] = { ...newAgo[findID], RTlitre: e };
        newAgo[findID] = { ...newAgo[findID], outlet: oneStationData };
        setAGO(newAgo);

        const FromAllPumps = JSON.parse(JSON.stringify(selectedPumps));
        const indexID = FromAllPumps.findIndex((data) => data._id === pump._id);
        FromAllPumps[indexID] = { ...FromAllPumps[indexID], RTlitre: e };
        dispatch(updateSelectedPumps(FromAllPumps));
        break;
      }

      case "DPK": {
        /*###########################################
                Update the pump readings for DPK
            ############################################*/

        const newDpk = JSON.parse(JSON.stringify(dpk));
        const findID = newDpk.findIndex((data) => data._id === pump._id);
        newDpk[findID] = { ...newDpk[findID], RTlitre: e };
        newDpk[findID] = { ...newDpk[findID], outlet: oneStationData };
        setDPK(newDpk);

        const FromAllPumps = JSON.parse(JSON.stringify(selectedPumps));
        const indexID = FromAllPumps.findIndex((data) => data._id === pump._id);
        FromAllPumps[indexID] = { ...FromAllPumps[indexID], RTlitre: e };
        dispatch(updateSelectedPumps(FromAllPumps));
        break;
      }
      default: {
      }
    }
  };

  function removeSpecialCharacters(str) {
    return str.replace(/[^0-9.]/g, "");
  }

  const setTotalizer = (e, item) => {
    if (selectedTanks.length !== 0) {
      const clonedTanks = [...selectedTanks];
      const currentTank = clonedTanks.filter(
        (data) => data.tankID === item.hostTank
      );

      if (currentTank.length !== 0) {
        const quantity =
          Number(currentTank[0].currentLevel) +
          Number(removeSpecialCharacters(e.target.value));

        if (oneStationData === null) {
          swal("Warning!", "Please select a station", "info");
        } else if (!Number.isInteger(item.identity)) {
          updateTotalizer("0", item);
          swal("Warning!", "Please select a pump", "info");
        } else if (selectedPumps.length === 0) {
          updateTotalizer("0", item);
          swal("Warning!", "Please select a pump", "info");
        } else {
          if (quantity > Number(currentTank[0].tankCapacity)) {
            updateTotalizer("0", item);
            swal("Warning!", "Reading exceeded tank level", "info");
          } else {
            updateTotalizer(
              removeSpecialCharacters(e.target.value),
              item,
              currentTank
            );
          }
        }
      } else {
        updateTotalizer("0", "0", item);
        swal("Warning!", "Please select a pump", "info");
      }
    } else {
      swal("Warning!", "Please select a pump", "info");
    }
  };

  const next = () => {
    if (oneStationData === null)
      return swal("Warning!", "Please select a station first", "info");
    if (!getPerm("4"))
      return swal("Warning!", "Permission denied", "info");

    navigate("/home/recordsales/lpo");
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
            {selectedPumps?.length === 0 ? (
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
                    {Number.isInteger(data.identity) && (
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
                    )}
                    {!Number.isInteger(data.identity) && (
                      <div className="box2">
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
                    )}
                  </div>
                );
              })
            ) : productType === "AGO" ? (
              ago.map((data, index) => {
                return (
                  <div key={index}>
                    {Number.isInteger(data.identity) && (
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
                    )}
                    {!Number.isInteger(data.identity) && (
                      <div className="box2">
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
                    )}
                  </div>
                );
              })
            ) : (
              dpk.map((data, index) => {
                return (
                  <div key={index}>
                    {Number.isInteger(data.identity) && (
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
                    )}
                    {!Number.isInteger(data.identity) && (
                      <div className="box2">
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
                    )}
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
                          value={item.RTlitre}
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
                          value={item.RTlitre}
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
                          value={item.RTlitre}
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
      <Navigation next={next} />
    </React.Fragment>
  );
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

export default ReturnToTank;
