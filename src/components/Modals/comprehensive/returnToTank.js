import React, { useCallback, useEffect } from "react";
import close from "../../../assets/close.png";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { Button, MenuItem, Select } from "@mui/material";
import swal from "sweetalert";
import "../../../styles/summary.scss";
import { useState } from "react";
import ApproximateDecimal from "../../common/approx";
import { ThreeDots } from "react-loader-spinner";
import APIs from "../../../services/connections/api";
import OutletService from "../../../services/360station/outletService";
import { setTankList } from "../../../storage/comprehensive";

const FuelCard = (props) => {
  return (
    <div
      key={props.index}
      style={{ border: "1px solid #ccc" }}
      className="fuel_card">
      <div className="inner_fuel_card">
        <div className="fuel_card_header">
          <span
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: props.getBackground(props.data.productType),
            }}>
            {props.data.productType.concat(" ", props.data.tankName)}
          </span>
          <div
            style={{ background: props.getBackground(props.data.productType) }}
            className="fuel_delete">
            {props.data.productType}
          </div>
        </div>

        <div className="fuel_card_items">
          <div className="fuel_card_items_left">
            <div className="volum">
              {ApproximateDecimal(props.data.beforeReturn)} ltrs
            </div>
            <div className="vol_label">Before return</div>
          </div>
          <div className="fuel_card_items_right">
            <div className="volum">
              {ApproximateDecimal(props.data.afterReturn)} ltrs
            </div>
            <div className="vol_label">Level After Return</div>
          </div>
        </div>

        <div className="fuel_card_items">
          <div className="fuel_card_items_left">
            <div className="volum">
              {ApproximateDecimal(props.data.totalRt)}
            </div>
            <div className="vol_label">Total Return</div>
          </div>
          <div className="fuel_card_items_right">
            <div className="volum">{}</div>
            <div className="vol_label"></div>
          </div>
        </div>

        <div className="fuel_card_items">
          <div className="fuel_card_items_left">
            <div className="volum">
              {ApproximateDecimal(props.data.balanceBF)} ltrs
            </div>
            <div className="vol_label">Balance brought forward</div>
          </div>
          <div className="fuel_card_items_right">
            <div className="volum">
              {ApproximateDecimal(props.data.balanceCF)} ltrs
            </div>
            <div className="vol_label">Balance carried forward</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReturnToTankModal = (props) => {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState("");
  const [currentPump, setCurrentPump] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [item, setItem] = useState({
    productType: "None",
    tankName: "None",
    beforeReturn: 0,
    afterReturn: 0,
    totalRt: 0,
    balanceBF: 0,
    balanceCF: 0,
  });
  const [payload, setPayload] = useState(null);

  const handleClose = () => props.close(false);
  const dispatch = useDispatch();

  const currentDate = useSelector((state) => state.dailysales.updatedDate);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const recordSales = useSelector((state) => state.comprehensive.rtMetrics);

  const [defaultState, setDefaultState] = useState(0);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getBackground = (type) => {
    if (type === "PMS") {
      return "#06805B";
    } else if (type === "AGO") {
      return "#FFA010";
    } else if (type === "DPK") {
      return "#35393E";
    }
  };

  const getAllPumpsAndTanks = useCallback(() => {
    const payload = {
      outletID: oneStationData._id,
      organisationID: resolveUserID().id,
    };

    OutletService.getAllOutletTanks(payload).then((tanks) => {
      const outletTanks = tanks.stations.map((data) => {
        const newData = {
          ...data,
          sales: 0,
          outlet: null,
          beforeSales: data.currentLevel,
          afterSales: 0,
          supply: 0,
        };
        return newData;
      });
      dispatch(setTankList(outletTanks));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllPumpsAndTanks();
  }, [getAllPumpsAndTanks]);

  const selectPump = (index, sale) => {
    if (sale.RTlitre !== 0)
      return swal(
        "Error",
        "This pump has already recorded return to tank!",
        "error"
      );
    setDefaultState(index);
    setReading("");
    setCurrentPump(sale);

    const balanceClone = JSON.parse(JSON.stringify(recordSales.balanceCF));
    const findID = balanceClone.findIndex(
      (data) => data.productType === sale.productType
    );
    if (findID !== -1) {
      const [currentBalanceData] = balanceClone.splice(findID, 1);
      setCurrentBalance(currentBalanceData);

      const payload = {
        productType: sale.productType,
        tankName: sale.tankName,
        beforeReturn: sale.beforeSales,
        afterReturn: sale.afterSales,
        totalRt: 0,
        sales: sale.sales,
        balanceBF: currentBalanceData.balanceCF + sale.sales,
        balanceCF: currentBalanceData.balanceCF,
      };
      setItem(payload);
    }
  };

  const updateSalesVariables = (e) => {
    if (currentPump === null) {
      swal("Error", "Please select a pump", "error");
    } else {
      setReading(e.target.value);
      const rtValue = Number(e.target.value);

      const salesClone = JSON.parse(JSON.stringify(recordSales.sales));
      const tanksClone = JSON.parse(JSON.stringify(recordSales.tanks));
      const levelsClone = JSON.parse(JSON.stringify(recordSales.tankLevels));
      const balanceClone = JSON.parse(JSON.stringify(recordSales.balanceCF));
      const dippingClone = JSON.parse(JSON.stringify(recordSales.dipping));

      /////////////////////// find IDs ////////////////////////
      const salesID = salesClone.findIndex(
        (data) => data._id === currentPump._id
      );
      const tankID = tanksClone.findIndex(
        (data) => data._id === currentPump.tankID
      );
      const levelID = levelsClone.findIndex(
        (data) => data.tankID === currentPump.tankID
      );

      const balanceID = balanceClone.findIndex(
        (data) => data.productType === currentPump.productType
      );
      const dippingID = dippingClone.findIndex(
        (data) => data.tankID === currentPump.tankID
      );

      /////////////////////// update variables ////////////////////////
      if (salesID !== -1) {
        salesClone[salesID].RTlitre = rtValue;
        salesClone[salesID].sales -= rtValue;
      }
      if (tankID !== -1) {
        tanksClone[tankID].currentLevel =
          tanksClone[tankID].currentLevel + rtValue;
        if (levelID !== -1) {
          levelsClone[levelID].afterSales =
            levelsClone[levelID].afterSales + rtValue;
        }
        if (balanceID !== -1) {
          balanceClone[balanceID].balanceCF =
            balanceClone[balanceID].balanceCF + rtValue;
        }
        if (dippingID !== -1) {
          dippingClone[dippingID].afterSales =
            dippingClone[dippingID].afterSales + rtValue;
        }

        setItem((prev) => ({
          ...prev,
          afterReturn: currentPump.beforeSales - currentPump.sales + rtValue,
          totalRt: rtValue,
          balanceCF: currentBalance.balanceCF + rtValue,
        }));

        const updatedRecord = {
          tanks: tanksClone,
          tankLevels: levelsClone,
          dipping: dippingClone,
          balanceCF: balanceClone,
          sales: salesClone,
        };
        setPayload(updatedRecord);
      }
    }
  };

  const saveRecordSales = async () => {
    if (reading === "")
      return swal("Error", "Closing meter cannot be empty", "error");
    if (currentPump === null)
      return swal("Error", "Please select a pump!", "error");
    if (payload === null)
      return swal("Error", "Please enter correct details!", "error");
    setLoading(true);

    const rtLoad = getRTLoad(reading, oneStationData, currentPump, currentDate);

    const data = {
      sales: payload.sales,
      tanks: payload.tanks,
      tankLevels: payload.tankLevels,
      dipping: payload.dipping,
      balanceCF: payload.balanceCF,
      rtLoad: rtLoad,
    };

    try {
      await APIs.post("/comprehensive/create-rt", data);
      setLoading(false);
      props.update((prev) => !prev);
      swal("Success!", "Record saved successfully!", "success");
      handleClose();
    } catch (e) {
      console.log(e, "error");
    }
  };

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <div
        style={{
          height: "auto",
          //   background: "#F5F5F5",
          flexDirection: "column",
          paddingTop: "10px",
          paddingBottom: "10px",
        }}
        className="modalContainer2">
        <div style={topStyle} className="head">
          <div className="head-text">Summary Daily Sales</div>
          <img
            onClick={handleClose}
            style={{ width: "18px", height: "18px" }}
            src={close}
            alt={"icon"}
          />
        </div>

        <div style={inner} className="inner">
          <div style={{ width: "94%" }} className="tank_label">
            <FuelCard data={item} getBackground={getBackground} />
          </div>

          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={defaultState}
            sx={selectStyle2}>
            <MenuItem style={menu} value={0}>
              Select Station
            </MenuItem>
            {recordSales.sales.map((item, index) => {
              return (
                <MenuItem
                  key={index}
                  style={menu}
                  onClick={() => {
                    selectPump(index + 1, item);
                  }}
                  value={index + 1}>
                  {`${item.pumpName} ( ${item.productType} ${item.tankName})`}
                </MenuItem>
              );
            })}
          </Select>
          <input
            onChange={updateSalesVariables}
            style={{
              ...imps,
              borderColor:
                item.openingMeter > item.closingMeter && item.closingMeter > 0
                  ? "red"
                  : "#777777",
            }}
            type={"number"}
            value={reading}
            placeholder="Please Enter Closing Meter"
          />
        </div>

        <div style={{ ...add, justifyContent: "space-between" }}>
          <div style={{ marginLeft: "10px" }}>
            {loading ? (
              <ThreeDots
                height="30"
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
          <Button
            disabled={loading}
            sx={{
              width: "100px",
              height: "30px",
              background: "#427BBE",
              borderRadius: "3px",
              fontSize: "11px",
              marginRight: "10px",
              "&:hover": {
                backgroundColor: "#427BBE",
              },
            }}
            onClick={saveRecordSales}
            variant="contained">
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const getRTLoad = (reading, oneStationData, currentPump, currentDate) => {
  return {
    rtLitre: reading,
    PMSCost: oneStationData.PMSCost,
    AGOCost: oneStationData.AGOCost,
    DPKCost: oneStationData.DPKCost,
    PMSPrice: oneStationData.PMSPrice,
    AGOPrice: oneStationData.AGOPrice,
    DPKPrice: oneStationData.DPKPrice,
    productType: currentPump.productType,
    pumpID: currentPump.pumpID,
    tankID: currentPump.tankID,
    pumpName: currentPump.pumpName,
    tankName: currentPump.tankName,
    outletID: oneStationData._id,
    organizationID: oneStationData.organisation,
    createdAt: currentDate,
    updatedAt: currentDate,
  };
};

const imps = {
  height: "30px",
  width: "90%",
  background: "#F2F1F1B2",
  outline: "none",
  border: "1px solid #777777",
  marginTop: "10px",
  paddingLeft: "10px",
  color: "#000",
};

const add = {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alightItems: "center",
  marginTop: "10px",
};

const menu = {
  fontSize: "12px",
};

const selectStyle2 = {
  width: "94%",
  height: "35px",
  borderRadius: "0px",
  background: "#F2F1F1B2",
  marginTop: "10px",
  color: "#000",
  fontSize: "12px",
  outline: "none",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const inner = {
  width: "94%",
  minHeight: "200px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const topStyle = {
  width: "94%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  fontWeight: "bold",
  fontSize: "16px",
  marginBottom: "10px",
};

export default ReturnToTankModal;
