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
import { setPumpList, setTankList } from "../../../storage/comprehensive";

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
              {ApproximateDecimal(props.data.currentLevel)} ltrs
            </div>
            <div className="vol_label">Current stock</div>
          </div>
          <div className="fuel_card_items_right">
            <div className="volum">
              {ApproximateDecimal(props.data.afterSales)} ltrs
            </div>
            <div className="vol_label">Level after sales</div>
          </div>
        </div>

        <div className="fuel_card_items">
          <div className="fuel_card_items_left">
            <div className="volum">
              {ApproximateDecimal(props.data.totalSales)}
            </div>
            <div className="vol_label">Total Sales</div>
          </div>
          <div className="fuel_card_items_right">
            <div className="volum">{props.data.supply}</div>
            <div className="vol_label">Supply</div>
          </div>
        </div>

        <div className="fuel_card_items">
          <div className="fuel_card_items_left">
            <div className="volum">
              {ApproximateDecimal(props.data.openingMeter)}
            </div>
            <div className="vol_label">Opening Meter</div>
          </div>
          <div className="fuel_card_items_right">
            <div className="volum"></div>
            <div className="vol_label"></div>
          </div>
        </div>

        <div className="fuel_card_items">
          <div className="fuel_card_items_left">
            <div className="volum">
              {ApproximateDecimal(props.data.totalTankLevel)} ltrs
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

const PumpUpdate = (props) => {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState("");
  const [currentTank, setCurrentTank] = useState(null);
  const [currentPump, setCurrentPump] = useState(null);
  const [item, setItem] = useState({
    productType: "Type",
    tankName: "Tank Name",
    currentLevel: 0,
    afterSales: 0,
    totalSales: 0,
    totalTankLevel: 0,
    balanceCF: 0,
    openingMeter: 0,
    closingMeter: 0,
  });

  const handleClose = () => props.close(false);
  const dispatch = useDispatch();

  const currentDate = useSelector((state) => state.dashboard.dateRange);
  const salesShift = useSelector((state) => state.dailysales.salesShift);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const tankListData = useSelector((state) => state.comprehensive.tankList);
  const pumpListData = useSelector((state) => state.comprehensive.pumpList);

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

    const stationPumps = OutletService.getAllStationPumps(payload);
    const stationTanks = APIs.post("/daily-sales/all-tanks", payload);

    Promise.all([stationPumps, stationTanks]).then((data) => {
      const [pumps, tanks] = data;

      ///////////////// station pumps //////////////////////
      const copyData = JSON.parse(JSON.stringify(pumps));
      const updated = copyData.map((data) => {
        let pumps = { ...data };
        return {
          ...pumps,
          closingMeter: 0,
          newTotalizer: "Enter closing meter",
          sales: 0,
        };
      });
      dispatch(setPumpList(updated));

      ///////////////// station tanks //////////////////////
      const outletTanks = tanks.data.tanks.map((data) => {
        const newData = {
          ...data,
          sales: 0,
          outlet: null,
          beforeSales:
            currentDate[0] === data.createdAt
              ? data.currentLevel
              : data.afterSales,
          afterSales: 0,
          currentLevel:
            currentDate[0] === data.createdAt
              ? data.currentLevel
              : data.afterSales,
          dipping: 0,
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

  const selectPump = (index, pump) => {
    setDefaultState(index);
    setReading("");
    const tankListClone = JSON.parse(JSON.stringify(tankListData));
    const extractType = tankListClone.filter(
      (data) => data.productType === pump.productType
    );
    const totalLevels = extractType.reduce((accum, current) => {
      return Number(accum) + Number(current.currentLevel);
    }, 0);
    const hostTank = tankListClone.filter(
      (data) => data.tankID === pump.hostTank
    );
    if (hostTank.length === 0) {
      swal(
        "Error",
        "Tank connecting pump not found, may have been deleted",
        "error"
      );
    } else {
      const [tank] = hostTank;
      setCurrentTank(tank);
      setCurrentPump(pump);
      const itemClone = { ...item };
      itemClone.productType = tank.productType;
      itemClone.tankName = tank.tankName;
      itemClone.currentLevel = tank.currentLevel;
      itemClone.totalSales = 0;
      itemClone.afterSales = tank.currentLevel;
      itemClone.totalTankLevel = totalLevels;
      itemClone.balanceCF = totalLevels;
      itemClone.openingMeter = pump.totalizerReading;
      setItem(itemClone);
    }
  };

  const updateSalesVariables = (e) => {
    if (currentPump === null || currentTank === null) {
      swal(
        "Error",
        "Pump not selected or connecting tank does not exist",
        "error"
      );
    } else {
      setReading(e.target.value);
      const itemClone = { ...item };
      const openingMeter = Number(itemClone.openingMeter);
      const closingMeter = Number(e.target.value);
      const sales = closingMeter - openingMeter;
      const actualSale = sales < 0 ? 0 : sales;

      const newLevel = Number(itemClone.currentLevel) - actualSale;
      const totalProductLevel = Number(itemClone.totalTankLevel) - actualSale;
      itemClone.totalSales = actualSale;
      itemClone.afterSales = newLevel;
      itemClone.balanceCF = totalProductLevel;
      itemClone.closingMeter = closingMeter;
      setItem(itemClone);
    }
  };

  const saveRecordSales = async () => {
    if (reading === "")
      return swal("Error", "Closing meter cannot be empty", "error");
    if (currentTank === null)
      return swal("Error", "Connecting tank cannot be found", "error");
    setLoading(true);

    const getSalesLoad = getSalesPayload(
      currentTank,
      currentPump,
      oneStationData,
      currentDate[0],
      item,
      salesShift
    );

    const getTankList = getTankListPayload(
      tankListData,
      currentTank,
      item,
      currentDate[0],
      salesShift
    );

    const payload = {
      sales: getSalesLoad,
      tankLevels: getTankList,
      date: currentDate[0],
      station: oneStationData,
    };

    await APIs.post("/comprehensive/create-sales", payload);
    setLoading(false);
    props.update((prev) => !prev);
    swal("Success!", "Record saved successfully!", "success");
    handleClose();
  };

  const pumpListFiltered = () => {
    const filtered = pumpListData.filter(
      (data) => data.productType === props.type
    );
    return filtered;
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
            {pumpListFiltered().map((item, index) => {
              return (
                <MenuItem
                  key={index}
                  style={menu}
                  onClick={() => {
                    selectPump(index + 1, item);
                  }}
                  value={index + 1}>
                  {`${item.pumpName} ( ${item.productType} ${item.hostTankName})`}
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

const getSalesPayload = (
  tank,
  pump,
  station,
  currentDate,
  item,
  salesShift
) => {
  return {
    sales: item.totalSales,
    RTlitre: 0,
    tankID: tank.tankID,
    tankName: tank.tankName,
    pumpID: pump._id,
    pumpName: pump.pumpName,
    beforeSales: tank.beforeSales,
    afterSales: item.afterSales,
    openingMeter: item.openingMeter,
    closingMeter: item.closingMeter,
    productType: pump.productType,
    PMSCostPrice: station.PMSCost,
    PMSSellingPrice: station.PMSPrice,
    AGOCostPrice: station.AGOCost,
    AGOSellingPrice: station.AGOPrice,
    DPKCostPrice: station.DPKCost,
    DPKSellingPrice: station.DPKPrice,
    outletID: station._id,
    outletName: station.outletName.concat(", ", station.alias),
    organisationID: station.organisation,
    shift: salesShift,
    createdAt: currentDate,
    updatedAt: currentDate,
  };
};

const getTankListPayload = (
  tankList,
  currentTank,
  item,
  currentDate,
  salesShift
) => {
  const otherTanks = tankList.filter(
    (data) => data.tankID !== currentTank.tankID
  );
  const otherTankList = otherTanks.map((data) => {
    return {
      tankHeight: data.tankHeight,
      deadStockLevel: data.deadStockLevel,
      dipping: data.dipping,
      calibrationDate: data.calibrationDate,
      station: data.station,
      quantityAdded: data.quantityAdded,
      activeState: data.activeState,
      PMSCostPrice: data.PMSCostPrice,
      PMSSellingPrice: data.PMSSellingPrice,
      AGOCostPrice: data.AGOCostPrice,
      AGOSellingPrice: data.AGOSellingPrice,
      DPKCostPrice: data.DPKCostPrice,
      DPKSellingPrice: data.DPKSellingPrice,
      currentLevel: data.currentLevel,
      tankName: data.tankName,
      productType: data.productType,
      afterSales: data.currentLevel,
      tankID: data.tankID,
      tankCapacity: data.tankCapacity,
      outletID: data.outletID,
      organizationID: data.organizationID,
      shift: salesShift,
      createdAt: currentDate,
      updatedAt: currentDate,
    };
  });

  const presentTank = {
    tankHeight: currentTank.tankHeight,
    deadStockLevel: currentTank.deadStockLevel,
    dipping: currentTank.dipping,
    calibrationDate: currentTank.calibrationDate,
    station: currentTank.station,
    quantityAdded: currentTank.quantityAdded,
    activeState: currentTank.activeState,
    PMSCostPrice: currentTank.PMSCostPrice,
    PMSSellingPrice: currentTank.PMSSellingPrice,
    AGOCostPrice: currentTank.AGOCostPrice,
    AGOSellingPrice: currentTank.AGOSellingPrice,
    DPKCostPrice: currentTank.DPKCostPrice,
    DPKSellingPrice: currentTank.DPKSellingPrice,
    currentLevel: currentTank.currentLevel,
    tankName: currentTank.tankName,
    productType: currentTank.productType,
    afterSales: item.afterSales,
    tankID: currentTank.tankID,
    tankCapacity: currentTank.tankCapacity,
    outletID: currentTank.outletID,
    organizationID: currentTank.organizationID,
    shift: salesShift,
    createdAt: currentDate,
    updatedAt: currentDate,
  };

  return [...otherTankList, presentTank];
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

export default PumpUpdate;
