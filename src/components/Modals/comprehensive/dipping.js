/* eslint-disable no-unused-expressions */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import close from "../../../assets/close.png";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import "../../../styles/lpo.scss";
import "../../../styles/lpo.scss";
import APIs from "../../../services/api";
import { useEffect } from "react";
import { useCallback } from "react";
import OutletService from "../../../services/outletService";
import { setTankList } from "../../../storage/comprehensive";
import { MenuItem, Select } from "@mui/material";

const DippingModal = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [defaultState, setDefaultState] = useState(0);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const currentDate = useSelector((state) => state.dailysales.updatedDate);
  const tankListData = useSelector((state) => state.comprehensive.tankList);
  const user = useSelector((state) => state.auth.user);

  const [afterSales, setAfterSales] = useState("");
  const [tankCapacity, setTankCapacity] = useState("");
  const [beforeSales, setBeforeSales] = useState("");
  const [dipping, setDipping] = useState("");
  const [oneTank, setOneTank] = useState(null);

  const handleClose = () => props.close(false);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getAllStationTanks = useCallback(() => {
    const payload = {
      outletID: oneStationData._id,
      organisationID: resolveUserID().id,
    };

    OutletService.getAllOutletTanks(payload).then((data) => {
      dispatch(setTankList(data.stations));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllStationTanks();
  }, [getAllStationTanks]);

  const submit = async () => {
    if (oneStationData === null)
      return swal("Warning!", "Please select a station", "info");
    if (oneTank === null)
      return swal("Warning!", "Please select a tank", "info");
    if (dipping === "")
      return swal("Warning!", "Dipping field cannot be empty", "info");

    setLoading(true);

    const payload = dippingPayload(
      currentDate,
      oneTank._id,
      oneTank.productType,
      oneTank.currentLevel,
      tankCapacity,
      oneTank.tankName,
      dipping,
      afterSales,
      oneStationData
    );

    try {
      await APIs.post("/comprehensive/create-dipping", payload);
      setLoading(false);
      props.update((prev) => !prev);
      swal("Success!", "Record saved successfully!", "success");
      handleClose();
    } catch (e) {
      console.log(e, "error");
    }
  };

  const setSingleTank = (tank, index) => {
    setDefaultState(index);
    setOneTank(tank);

    setBeforeSales(tank.previousLevel);
    setAfterSales(tank.currentLevel);
    setTankCapacity(tank.tankCapacity);
  };

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="modalContainer2">
        <div className="inner">
          <div className="head">
            <div className="head-text">Register Dipping</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={inner}>
            <div className="inputs">
              <div style={{ marginBottom: "5px" }} className="head-text2">
                Tank List
              </div>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={defaultState}
                sx={selectStyle2}>
                <MenuItem style={menu} value={0}>
                  Select a tank
                </MenuItem>
                {tankListData.map((item, index) => {
                  return (
                    <MenuItem
                      key={index}
                      style={menu}
                      onClick={() => {
                        setSingleTank(item, index + 1);
                      }}
                      value={index + 1}>
                      {item.productType.concat(" ", item.tankName)}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>

            <div className="inputs">
              <div className="head-text2">Tank Capacity</div>
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
                value={tankCapacity}
                disabled
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Level Before Sale</div>
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
                value={beforeSales}
                disabled
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Level After Sale</div>
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
                value={afterSales}
                disabled
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Expense Date</div>
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
                value={currentDate}
                disabled
                type="date"
                // onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Dipping</div>
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
                type="number"
                value={dipping}
                onChange={(e) => setDipping(e.target.value)}
              />
            </div>
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

const dippingPayload = (
  currentDate,
  tankID,
  productType,
  currentLevel,
  tankCapacity,
  tankName,
  dipping,
  afterSales,
  oneStationData
) => {
  return {
    tankID: tankID,
    productType: productType,
    currentLevel: currentLevel,
    tankCapacity: tankCapacity,
    tankName: tankName,
    dipping: dipping,
    afterSales: afterSales,
    PMSCostPrice: oneStationData.PMSCost,
    PMSSellingPrice: oneStationData.PMSPrice,
    AGOCostPrice: oneStationData.AGOCost,
    AGOSellingPrice: oneStationData.AGOPrice,
    DPKCostPrice: oneStationData.DPKCost,
    DPKSellingPrice: oneStationData.DPKPrice,
    outletID: oneStationData._id,
    organizationID: oneStationData.organisation,
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

export default DippingModal;
