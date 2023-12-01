import { Button, Radio } from "@mui/material";
import React, { useCallback, useState } from "react";
import photo from "../../assets/photo.png";
import upload from "../../assets/upload.png";
import cross from "../../assets/cross.png";
import { useSelector } from "react-redux";
import ReactCamera from "../Modals/ReactCamera";
import { useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import hr8 from "../../assets/hr8.png";
import swal from "sweetalert";
import axios from "axios";
import config from "../../constants";
import { useEffect } from "react";
import "../../styles/lpoNew.scss";
import ApproximateDecimal from "../common/approx";
import { useNavigate } from "react-router-dom";
import Navigation from "./navigation";
import APIs from "../../services/connections/api";
import moment from "moment";
import SalesService from "../../services/360station/sales";

const LPOComponent = (props) => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate()
  const gallery = useRef();
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const currentDate = useSelector((state) => state.recordsales.currentDate);
  const currentShift = useSelector((state) => state.recordsales.currentShift);
  const [selectedPMS, setSelectedPMS] = useState(null);
  const [selectedAGO, setSelectedAGO] = useState(null);
  const [selectedDPK, setSelectedDPK] = useState(null);
  const [lpos, setLPOs] = useState([]);
  const [lposalesData, setLpoSalesData] = useState([]);
  const [open, setOpen] = useState(false);

  // payload records
  const [cam, setCam] = useState(null);
  const [gall, setGall] = useState(null);
  const [productType, setProductType] = useState(null);
  const [dispenseLpo, setDispensedLPO] = useState(null);
  const [dispensedPump, setDispensedPump] = useState(null);
  const [truckNo, setTruckNo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [refreshIt, setRefresh] = useState(false);
  const [saved, setSaved] = useState(true);

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.recordSales[e];
  };

  const getSalesData = useCallback(async (station, date) => {
    const today = moment().format("YYYY-MM-DD").split(" ")[0];
    const getDate = date === "" ? today : date;

    const lpoPayload = {
      organizationID:station.organisation,
      outletID: station._id,
      date: getDate,
      shift: currentShift
    }

    const {data} = await APIs.post("/sales/lpo-data", lpoPayload);
    const [lposales, lpoaccts, salesList] = data.data;

    const PMSData = salesList.filter(data => data.productType === "PMS");
    const AGOData = salesList.filter(data => data.productType === "AGO");
    const DPKData = salesList.filter(data => data.productType === "DPK");

    setPMS(PMSData);
    setAGO(AGOData);
    setDPK(DPKData);
    setLPOs(lpoaccts);
    setLpoSalesData(lposales);
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

  useEffect(() => {
    setProductType("PMS");
  }, []);

  const pumpItem = (e, index, item) => {
    e.preventDefault();
    setDispensedPump(item);

    if (productType === "PMS") {
      setSelectedPMS(index);
      setSelectedAGO(null);
      setSelectedDPK(null);
    } else if (productType === "AGO") {
      setSelectedPMS(null);
      setSelectedAGO(index);
      setSelectedDPK(null);
    } else {
      setSelectedPMS(null);
      setSelectedAGO(null);
      setSelectedDPK(index);
    }
  };

  const desselect = () => {
    if (productType === "PMS") {
      setSelectedPMS(null);
      setDispensedPump(null);
    } else if (productType === "AGO") {
      setSelectedAGO(null);
      setDispensedPump(null);
    } else {
      setSelectedDPK(null);
      setDispensedPump(null);
    }
  };

  const selectLPOAccount = (e) => {
    const value = e.target.options[e.target.options.selectedIndex].value;
    setDispensedLPO(JSON.parse(value));
    setSaved(false);
  };

  const openCamera = () => {
    setOpen(true);
    setSaved(false);
  };

  const openGallery = () => {
    gallery.current.click();
    setSaved(false);
  };

  const pickFromGallery = (e) => {
    let file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    const httpConfig = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    const url = `${config.BASE_URL}/360-station/api/upload`;
    axios.post(url, formData, httpConfig).then((data) => {
      setGall(data.data.path);
    });
  };

  const addDetailsToList = () => {
    setSaved(false);
    if (oneStationData === null)
      return swal("Warning!", "please select station", "info");
    if (dispensedPump === null)
      return swal("Warning!", "Please select lpo pump", "info");
    if (dispenseLpo === null)
      return swal("Warning!", "Please select lpo account", "info");
    if (truckNo === "")
      return swal("Warning!", "Truck no field cannot be empty", "info");
    if (quantity === "")
      return swal("Warning!", "Quantity field cannot be empty", "info");
    if (productType === "")
      return swal("Warning!", "Product type field cannot be empty", "info");

    if (isNaN(Number(quantity)))
      return swal(
        "Warning!",
        "quantity field is not a number, remove characters like comma",
        "info"
      );

    const getImage = () => {
      if (gall === null && cam === null) return "null";
      if (gall === null) return cam;
      if (cam === null) return gall;
    };

    const payload = {
      accountName: dispenseLpo.companyName,
      productType: productType,
      truckNo: truckNo,
      lpoLitre: quantity,
      attachApproval: getImage(),
      lpoID: dispenseLpo._id,
      PMSRate: oneStationData.PMSPrice,
      AGORate: oneStationData.AGOPrice,
      DPKRate: oneStationData.DPKPrice,
      PMSCost: oneStationData.PMSCost,
      AGOCost: oneStationData.AGOCost,
      DPKCost: oneStationData.DPKCost,
      pumpID: dispensedPump._id,
      station: oneStationData?.outletName + " " + oneStationData.alias,
      outletID: oneStationData?._id,
      organizationID: oneStationData?.organisation,
      shift: currentShift,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    const currentSalesList = [...lposalesData];
    currentSalesList.push(payload);
    setLpoSalesData(currentSalesList);

    setGall(null);
    setCam(null);
    setTruckNo("");
    setQuantity("");
    desselect();
  };

  const deleteFromList = (index) => {
    const copyLposales = [...lposalesData];
    copyLposales.splice(index, 1);
    setLpoSalesData(copyLposales);
    setSaved(false);
  };

  const updateTankWithLPO = (e) => {
    if (dispenseLpo === null)
      return swal("Error!", "Please select LPO account", "error");

    const removeFormat = e.target.value.replace(/^0|[^.\w\s]/gi, "");
    if (dispensedPump === null) {
      setQuantity("");
      swal("Warning!", "Please select lpo pump", "info");
    } else {
      setQuantity(removeFormat);
      setSaved(false);
    }
  };

  const next = () => {
    if (oneStationData === null)
      return swal("Warning!", "Please select a station first", "info");
    if (!getPerm("5"))
      return swal("Warning!", "Permission denied", "info");

    if(saved || lposalesData.length === 0){
      navigate("/home/recordsales/expenses");
    }else{
      swal({
        title: "Alert!",
        text: "Are you sure you want to save current changes?",
        icon: "warning",
        buttons: true,
      }).then(async (willSave) => {
        if(willSave){
          const payload = lposalesData.filter(data => !("_id" in data))
          try{
            const status = await SalesService.lpo({
              lposales: payload,
            });
            if(status){
              setSaved(true);
              swal("Success!", "LPO records saved successfully!", "success");
            }
          }catch(e){
            console.log(e)
          }
        }
      });
    }
  }

  return (
    <React.Fragment>
      <div className="form-body">
        <div
          className="inner-body"
          style={{
            width: "98%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <ReactCamera open={open} close={setOpen} setDataUri={setCam} />

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

          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            Select Pump used for the day
          </div>
          <div
            style={{ flexDirection: "row", justifyContent: "center" }}
            className="pump-list">
            {productType === "PMS" &&
              (pms.length === 0 ? (
                <div style={{ ...box, width: "170px" }}>
                  <div style={{ marginRight: "10px" }}>No pump Created</div>
                  <img
                    style={{ width: "20px", height: "20px" }}
                    src={cross}
                    alt="icon"
                  />
                </div>
              ) : (
                pms.map((data, index) => {
                  return (
                    <div key={index}>
                      {selectedPMS === index && (
                        <div className="box">
                          <p
                            onClick={(e) => pumpItem(e, index, data)}
                            style={{ marginRight: "10px" }}>
                            {data.pumpName}
                          </p>
                          <img
                            onClick={desselect}
                            style={{ width: "20px", height: "20px" }}
                            src={cross}
                            alt="icon"
                          />
                        </div>
                      )}
                      {selectedPMS !== index && (
                        <div className="box2">
                          <p
                            onClick={(e) => pumpItem(e, index, data)}
                            style={{ marginRight: "10px" }}>
                            {data.pumpName}
                          </p>
                          <img
                            onClick={desselect}
                            style={{ width: "20px", height: "20px" }}
                            src={cross}
                            alt="icon"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              ))}
            {productType === "AGO" &&
              (ago.length === 0 ? (
                <div style={{ ...box, width: "170px" }}>
                  <div style={{ marginRight: "10px" }}>No pump Created</div>
                  <img
                    style={{ width: "20px", height: "20px" }}
                    src={cross}
                    alt="icon"
                  />
                </div>
              ) : (
                ago.map((data, index) => {
                  return (
                    <div key={index}>
                      {selectedAGO === index && (
                        <div className="box">
                          <p
                            onClick={(e) => pumpItem(e, index, data)}
                            style={{ marginRight: "10px" }}>
                            {data.pumpName}
                          </p>
                          <img
                            onClick={desselect}
                            style={{ width: "20px", height: "20px" }}
                            src={cross}
                            alt="icon"
                          />
                        </div>
                      )}
                      {selectedAGO !== index && (
                        <div className="box2">
                          <p
                            onClick={(e) => pumpItem(e, index, data)}
                            style={{ marginRight: "10px" }}>
                            {data.pumpName}
                          </p>
                          <img
                            onClick={desselect}
                            style={{ width: "20px", height: "20px" }}
                            src={cross}
                            alt="icon"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              ))}
            {productType === "DPK" &&
              (dpk.length === 0 ? (
                <div style={{ ...box, width: "170px" }}>
                  <div style={{ marginRight: "10px" }}>No pump Created</div>
                  <img
                    style={{ width: "20px", height: "20px" }}
                    src={cross}
                    alt="icon"
                  />
                </div>
              ) : (
                dpk.map((data, index) => {
                  return (
                    <div key={index}>
                      {selectedDPK === index && (
                        <div className="box">
                          <p
                            onClick={(e) => pumpItem(e, index, data)}
                            style={{ marginRight: "10px" }}>
                            {data.pumpName}
                          </p>
                          <img
                            onClick={desselect}
                            style={{ width: "20px", height: "20px" }}
                            src={cross}
                            alt="icon"
                          />
                        </div>
                      )}
                      {selectedDPK !== index && (
                        <div className="box2">
                          <p
                            onClick={(e) => pumpItem(e, index, data)}
                            style={{ marginRight: "10px" }}>
                            {data.pumpName}
                          </p>
                          <img
                            onClick={desselect}
                            style={{ width: "20px", height: "20px" }}
                            src={cross}
                            alt="icon"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              ))}
          </div>

          <div className="lpo-body">
            <div className="lpo-left">
              <div className="single-form">
                <div className="input-d">
                  <span style={{ color: "green" }}>Account Name</span>
                  <select onChange={selectLPOAccount} className="text-field">
                    <option>Select lpo account</option>
                    {lpos.map((data, index) => {
                      return (
                        <option value={JSON.stringify(data)} key={index}>
                          {data.companyName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="single-form">
                <div className="input-d">
                  <span style={{ color: "green" }}>Product Type</span>
                  <input
                    defaultValue={productType}
                    disabled
                    className="lpo-inputs"
                    type={"text"}
                  />
                </div>
              </div>

              <div className="single-form">
                <div className="input-d">
                  <span style={{ color: "green" }}>Truck No</span>
                  <input
                    value={truckNo}
                    onChange={(e) => setTruckNo(e.target.value)}
                    className="lpo-inputs"
                    type={"text"}
                  />
                </div>
              </div>

              <div style={{ marginTop: "20px" }} className="single-form">
                <div className="input-d">
                  <span style={{ color: "green" }}>Quantity (Litres)</span>
                  <input
                    value={ApproximateDecimal(quantity)}
                    onChange={(e) => {
                      updateTankWithLPO(e);
                    }}
                    className="lpo-inputs"
                    type={"text"}
                  />
                </div>
              </div>
              {/* <SingleNumberInput value={quantity} setValue={updateTankWithLPO} /> */}

              <div style={{ marginTop: "40px" }} className="double-form">
                <div className="input-d">
                  <Button
                    variant="contained"
                    onClick={openCamera}
                    sx={{
                      width: "100%",
                      height: "35px",
                      background: "#216DB2",
                      fontSize: "13px",
                      borderRadius: "5px",
                      textTransform: "capitalize",
                      "&:hover": {
                        backgroundColor: "#216DB2",
                      },
                    }}>
                    <img
                      style={{ width: "22px", height: "18px", marginRight: "10px" }}
                      src={photo}
                      alt="icon"
                    />
                    <div>
                      {typeof cam === "string" ? (
                        "Image taken"
                      ) : (
                        <span>Take photo</span>
                      )}
                    </div>
                  </Button>
                </div>

                <div className="input-d">
                  <Button
                    onClick={openGallery}
                    variant="contained"
                    sx={{
                      width: "100%",
                      height: "35px",
                      background: "#087B36",
                      fontSize: "13px",
                      borderRadius: "5px",
                      textTransform: "capitalize",
                      "&:hover": {
                        backgroundColor: "#087B36",
                      },
                    }}>
                    <img
                      style={{ width: "22px", height: "18px", marginRight: "10px" }}
                      src={upload}
                      alt="icon"
                    />
                    <div>
                      {typeof gall === "string" ? (
                        "File uploaded"
                      ) : (
                        <span>Upload</span>
                      )}
                    </div>
                  </Button>
                </div>
              </div>

              <div style={add}>
                <Button
                  sx={{
                    width: "140px",
                    height: "30px",
                    background: "#427BBE",
                    borderRadius: "3px",
                    fontSize: "11px",
                    "&:hover": {
                      backgroundColor: "#427BBE",
                    },
                  }}
                  onClick={addDetailsToList}
                  variant="contained">
                  <AddIcon sx={{ marginRight: "10px" }} /> Add to List
                </Button>
              </div>
              <input
                onChange={pickFromGallery}
                ref={gallery}
                style={{ visibility: "hidden" }}
                type={"file"}
              />
            </div>

            <div className="lpo-right">
              <div className="table-head">
                <div className="col">S/N</div>
                <div className="col">Account</div>
                <div className="col">Product</div>
                <div className="col">Quantity</div>
                <div className="col">Action</div>
              </div>

              {lposalesData.length === 0 ? (
                <div style={{ marginTop: "10px" }}>No data</div>
              ) : (
                lposalesData.map((data, index) => {
                  return (
                    <div
                      key={index}
                      style={{ background: "#fff", marginTop: "5px" }}
                      className="table-head">
                      <div style={{ color: "#000" }} className="col">
                        {index + 1}
                      </div>
                      <div style={{ color: "#000" }} className="col">
                        {data?.accountName}
                      </div>
                      <div style={{ color: "#000" }} className="col">
                        {data?.productType}
                      </div>
                      <div style={{ color: "#000" }} className="col">
                        {data?.lpoLitre}
                      </div>
                      <div style={{ color: "#000" }} className="col">
                        <img
                          onClick={() => {
                            deleteFromList(index);
                          }}
                          style={{ width: "22px", height: "22px" }}
                          src={hr8}
                          alt="icon"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
      <Navigation next={next} />
    </React.Fragment>
  );
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

const add = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  marginTop: "30px",
};

export default LPOComponent;
