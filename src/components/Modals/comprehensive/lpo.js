/* eslint-disable no-unused-expressions */
import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import close from "../../../assets/close.png";
import upload from "../../../assets/upload.png";
import photo from "../../../assets/photo.png";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import "../../../styles/lpo.scss";
import axios from "axios";
import "../../../styles/lpo.scss";
import config from "../../../constants";
import ReactCamera from "../ReactCamera";
import { MenuItem, Select } from "@mui/material";
import { useEffect } from "react";
import { useCallback } from "react";
import LPOService from "../../../services/360station/lpo";
import { setLPOAccount } from "../../../storage/comprehensive";
import APIs from "../../../services/connections/api";
import ModalInputField from "../../controls/Modal/ModalInputField";

const LPOSalesModal = (props) => {
  const attach = useRef();
  const [loading, setLoading] = useState(false);
  const [camLoader, setCamLoader] = useState(0);
  const [gallLoader, setGallLoader] = useState(0);
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const currentDate = useSelector((state) => state.dailysales.updatedDate);
  const salesList = useSelector((state) => state.comprehensive.salesList);
  const lpoAccount = useSelector((state) => state.comprehensive.lpoAccount);
  const [defaultState, setDefaultState] = useState(0);
  const [productState, setProductState] = useState(0);
  const [currentPump, setCurrentPump] = useState(null);
  const dispatch = useDispatch();
  const salesShift = useSelector((state) => state.dailysales.salesShift);

  const [account, setAccount] = useState(null);
  const [productType, setProductType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [truckNo, setTruckNo] = useState("");
  const [open, setOpen] = useState(false);
  const [cam, setCam] = useState(null);
  const [gall, setGall] = useState(null);

  const handleClose = () => props.close(false);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getAllAccounts = useCallback(() => {
    getAllRecordDetails(oneStationData, currentDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllAccounts();
  }, [getAllAccounts]);

  const submit = async () => {
    if (oneStationData === null)
      return swal("Warning!", "Please select a station", "info");
    if (account === null)
      return swal("Warning!", "Please select lpo account", "info");
    if (currentPump === null)
      return swal("Warning!", "Please select pump", "info");
    if (productType === "")
      return swal("Warning!", "Description field cannot be empty", "info");
    if (quantity === "")
      return swal("Warning!", "Amount field cannot be empty", "info");
    if (truckNo === "")
      return swal("Warning!", "Contact field cannot be empty", "info");
    setLoading(true);

    const payload = lpoPayload(
      account,
      productType,
      oneStationData,
      quantity,
      truckNo,
      currentDate,
      cam,
      gall,
      currentPump,
      salesShift
    );

    try {
      await APIs.post("/comprehensive/create-lpo", payload);
      setLoading(false);
      props.update((prev) => !prev);
      swal("Success!", "Record saved successfully!", "success");
      handleClose();
    } catch (e) {
      console.log(e, "error");
    }
  };

  const changeAccount = (index, item) => {
    setDefaultState(index);
    setAccount(item);
  };

  const changePump = (index, item) => {
    setProductState(index);
    setProductType(item.productType);
    setCurrentPump(item);
  };

  const selectedFile = (e) => {
    let file = e.target.files[0];
    setGallLoader(1);
    const formData = new FormData();
    formData.append("file", file);
    const httpConfig = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    const url = `${config.BASE_URL}/360-station/api/upload`;
    axios
      .post(url, formData, httpConfig)
      .then((data) => {
        setGall(data.data.path);
      })
      .then(() => {
        setGallLoader(2);
      });
  };

  const uploadProductOrders = () => {
    if (cam !== null)
      return swal("Error", "Picture already taken with cam", "error");
    attach.current.click();
  };

  const getPhotoFromCamera = () => {
    if (gall !== null)
      return swal("Error", "Picture already uploaded with gall", "error");
    setOpen(true);
    setCamLoader(2);
  };

  const getAllRecordDetails = (station, date) => {
    const payload = {
      outletID: station._id,
      organisationID: resolveUserID().id,
    };

    LPOService.getAllLPO(payload).then((data) => {
      dispatch(setLPOAccount(data.lpo.lpo));
    });
  };

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="modalContainer2">
        <ReactCamera open={open} close={setOpen} setDataUri={setCam} />
        <div className="inner">
          <div className="head">
            <div className="head-text">Register new LPO sales</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={inner}>
            <div className="inputs">
              <div className="head-text2">LPO Accounts</div>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={defaultState}
                sx={selectStyle2}>
                <MenuItem style={menu} value={0}>
                  Select LPO Account
                </MenuItem>
                {lpoAccount.map((item, index) => {
                  return (
                    <MenuItem
                      key={index}
                      style={menu}
                      onClick={() => {
                        changeAccount(index + 1, item);
                      }}
                      value={index + 1}>
                      {item.companyName}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>

            <div className="inputs">
              <div className="head-text2">Pump Dispensed</div>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={productState}
                sx={selectStyle2}>
                <MenuItem style={menu} value={0}>
                  Select Product
                </MenuItem>
                {salesList.map((item, index) => {
                  return (
                    <MenuItem
                      key={index}
                      style={menu}
                      onClick={() => {
                        changePump(index + 1, item);
                      }}
                      value={index + 1}>
                      {`${item.pumpName} (${item.productType} ${item.tankName})`}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>

            <div className="inputs">
              <div className="head-text2">productType</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                value={productType}
                disabled
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Truck number</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                value={truckNo}
                onChange={(e) => setTruckNo(e.target.value)}
              />
            </div>

            <ModalInputField
              value={quantity}
              setValue={setQuantity}
              type={"number"}
              label={`Quantity`}
              disabled={false}
            />

            <Button
              sx={{
                width: "100%",
                height: "35px",
                background: "#427BBE",
                borderRadius: "3px",
                fontSize: "10px",
                marginTop: "30px",
                "&:hover": {
                  backgroundColor: "#427BBE",
                },
              }}
              onClick={uploadProductOrders}
              variant="contained">
              <img
                style={{ width: "25px", height: "20px", marginRight: "10px" }}
                src={upload}
                alt={"icon"}
              />
              {gallLoader === 0 && <div>Attachment</div>}
              {gallLoader === 1 && (
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
              )}
              {gallLoader === 2 && (
                <div style={{ color: "#fff", fontSize: "12px" }}>Success</div>
              )}
            </Button>
            <Button
              sx={{
                width: "100%",
                height: "35px",
                background: "green",
                borderRadius: "3px",
                fontSize: "10px",
                marginTop: "30px",
                "&:hover": {
                  backgroundColor: "green",
                },
              }}
              onClick={getPhotoFromCamera}
              variant="contained">
              <img
                style={{ width: "25px", height: "20px", marginRight: "10px" }}
                src={photo}
                alt={"icon"}
              />
              {camLoader === 0 && <div>Take Photo</div>}
              {camLoader === 1 && (
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
              )}
              {camLoader === 2 && (
                <div style={{ color: "#fff", fontSize: "12px" }}>Success</div>
              )}
            </Button>
            <input
              onChange={selectedFile}
              ref={attach}
              type="file"
              style={{ visibility: "hidden" }}
            />
          </div>

          <div style={{ marginTop: "10px", height: "30px" }} className="butt">
            <Button
              sx={{
                width: "100px",
                height: "30px",
                background: "#427BBE",
                borderRadius: "3px",
                fontSize: "10px",
                marginTop: "0px",
                "&:hover": {
                  backgroundColor: "#427BBE",
                },
              }}
              onClick={submit}
              variant="contained">
              {" "}
              Save
            </Button>

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
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const lpoPayload = (
  account,
  productType,
  oneStationData,
  quantity,
  truckNo,
  currentDate,
  cam,
  gall,
  currentPump,
  salesShift
) => {
  const pic = () => {
    if (cam === null && gall === null) {
      return "null";
    } else if (cam !== null && gall === null) {
      return cam;
    } else if (cam === null && gall !== null) {
      return gall;
    }
  };
  return {
    accountName: account.companyName,
    productType: productType,
    truckNo: truckNo,
    pumpID: currentPump.pumpID,
    lpoLitre: quantity,
    attachApproval: pic(),
    lpoID: account._id,
    PMSCost: oneStationData.PMSCost,
    AGOCost: oneStationData.AGOCost,
    DPKCost: oneStationData.DPKCost,
    PMSRate: oneStationData.PMSPrice,
    AGORate: oneStationData.AGOPrice,
    DPKRate: oneStationData.DPKPrice,
    station: oneStationData.outletName.concat(" ", oneStationData.alias),
    outletID: oneStationData._id,
    organizationID: oneStationData.organisation,
    shift: salesShift,
    createdAt: currentDate,
    updatedAt: currentDate,
  };
};

const selectStyle2 = {
  width: "100%",
  height: "35px",
  borderRadius: "0px",
  background: "#EEF2F1",
  color: "#000",
  fontSize: "12px",
  outline: "none",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const menu = {
  fontSize: "12px",
};

const inner = {
  width: "100%",
  height: "500px",
  overflowY: "scroll",
};

export default LPOSalesModal;
