import React, { useCallback, useEffect } from "react";
import close from "../../../assets/close.png";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { Button, MenuItem, Select } from "@mui/material";
import swal from "sweetalert";
import {
  balanceCF,
  creditPayloadObject,
  rtPayload,
  salesPayload,
  tanksPayload,
} from "../../../storage/recordsales";
import { useHistory } from "react-router-dom";
import "../../../styles/summary.scss";
import { useState } from "react";
import ApproximateDecimal from "../../common/approx";
import { ThreeDots } from "react-loader-spinner";
import SalesService from "../../../services/sales";
import APIs from "../../../services/api";
import moment from "moment";
import OutletService from "../../../services/outletService";
import { setPumpList, setTankList } from "../../../storage/comprehensive";

const FuelCard = (props) => {
  const dispatch = useDispatch();
  const salesPayloadData = useSelector(
    (state) => state.recordsales.salesPayload
  );

  const removeData = (index) => {
    swal({
      title: "Alert!",
      text: "Are you sure you want to delete this record?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const pumpUpdate = JSON.parse(JSON.stringify(salesPayloadData));
        pumpUpdate.splice(index, 1);
        dispatch(salesPayload(pumpUpdate));
      }
    });
  };

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
            onClick={() => {
              removeData(props.index);
            }}
            className="fuel_delete">
            Delete
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

        {/* {props.data?.pumps?.length === 0 ? (
          <div style={men}>No records</div>
        ) : (
          props.data?.pumps?.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  background: "#F5F5F5",
                  marginTop: "5px",
                  borderRadius: "10px",
                }}
                className="fuel_card_items">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  className="fuel_card_items_left">
                  <div
                    style={{ marginLeft: "10px", fontSize: "14px" }}
                    className="volum">
                    {item.pumpName}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                  className="fuel_card_items_right">
                  <div
                    style={{ marginRight: "10px", fontSize: "14px" }}
                    className="volum">
                    {ApproximateDecimal(item.sales)} ltrs
                  </div>
                </div>
              </div>
            );
          })
        )} */}
      </div>
    </div>
  );
};

const PumpUpdate = (props) => {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [salesPayloadData, setSalesPayload] = useState([]);

  const handleClose = () => props.close(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const currentDate = useSelector((state) => state.dailysales.updatedDate);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const tankListData = useSelector((state) => state.comprehensive.tankList);
  const pumpListData = useSelector((state) => state.comprehensive.pumpList);
  const [defaultState, setDefaultState] = useState(0);
  // console.log(typeof currentDate, "date");
  console.log(tankListData, "Pumps");
  console.log(pumpListData, "Tanks");

  //   const saveRecordSales = async () => {
  //     if (currentDate === null)
  //       return swal("Warning!", "Please select date!", "info");
  //     setLoading(true);

  //     const result = await APIs.post("/sales/validateSales", {
  //       date: mainDate,
  //       organizationID: oneStationData.organisation,
  //       outletID: oneStationData._id,
  //     }).then((data) => {
  //       return data.data.data;
  //     });

  //     if (result) {
  //       handleClose();
  //       swal("Error!", "Record has been saved for this day already!", "error");
  //     } else {
  //       const settings = {
  //         currentDate: mainDate,
  //       };
  //       const payload = [
  //         SalesService.pumpUpdate({
  //           ...settings,
  //           station: oneStationData,
  //           sales: salesPayloadData,
  //         }),
  //         SalesService.returnToTank({
  //           ...settings,
  //           station: oneStationData,
  //           rt: rtPayloadData,
  //         }),
  //         SalesService.lpo({
  //           ...settings,
  //           station: oneStationData,
  //           lpo: lpoPayloadData,
  //         }),
  //         SalesService.expenses({
  //           ...settings,
  //           station: oneStationData,
  //           expenses: expensesPayloadData,
  //         }),
  //         SalesService.bankPayment({
  //           ...settings,
  //           station: oneStationData,
  //           bankpayments: bankPayloadData,
  //         }),
  //         SalesService.posPayment({
  //           ...settings,
  //           station: oneStationData,
  //           pospayments: posPayloadData,
  //         }),
  //         SalesService.dipping({
  //           ...settings,
  //           station: oneStationData,
  //           dipping: dippingPayloadData,
  //         }),
  //         SalesService.tankLevels({
  //           ...settings,
  //           station: oneStationData,
  //           tankLevels: tanksPayloadData,
  //         }),
  //         SalesService.creditBalance({
  //           ...settings,
  //           station: oneStationData,
  //           debits: creditPayloadObjectData,
  //         }),
  //         SalesService.balanceCF({
  //           ...settings,
  //           station: oneStationData,
  //           balanceCF: balanceCFRecord,
  //         }),
  //       ];
  //       Promise.allSettled(payload)
  //         .then((results) => {
  //           handleClose();
  //           history.push("/home/daily-sales");
  //           swal("Success!", "Record saved successfully!", "success");
  //         })
  //         .catch((error) => {
  //           // Handle any other errors that may occur
  //           console.log(error, "form catch");
  //         });
  //     }
  //   };

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
    const stationTanks = OutletService.getAllOutletTanks(payload);

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
      const outletTanks = tanks.stations.map((data) => {
        const newData = {
          ...data,
          sales: 0,
          outlet: null,
          beforeSales: data.currentLevel,
          afterSales: 0,
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

  const item = {
    productType: "PMS",
    tankName: "Tank 1",
    currentLevel: 20000,
    afterSales: 19900,
    totalSales: 100,
    totalTankLevel: 19900,
    balanceCF: 19900,
  };

  const selectPump = (index, pump) => {
    setDefaultState(index);
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
            {pumpListData.map((item, index) => {
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
          <input style={imps} placeholder="Please Enter Closing Meter" />
        </div>

        <div style={{ ...add, justifyContent: "space-between" }}>
          <div style={{ marginLeft: "10px" }}>
            {/* {loading && <div style={prog}>{progress}</div>} */}
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
            // onClick={saveRecordSales}
            variant="contained">
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const getSalesPayload = (tank, pump, currentDate) => {
  return {
    sales: pump.sales,
    RTlitre: pump.RTlitre,
    productSales: tank.productSales,
    totalSales: tank.totalSales,
    previousLevel: tank.previousLevel,
    currentLevel: tank.currentLevel,
    tankID: tank._id,
    tankName: tank.tankName,
    totalTankLevel: tank.totalTankLevel,
    pumpID: pump._id,
    pumpName: pump.pumpName,
    beforeSales: tank.beforeSales,
    afterSales: tank.afterSales,
    balanceCF: tank.balanceCF,
    openingMeter: pump.totalizerReading,
    closingMeter: pump.newTotalizer,
    productType: pump.productType,
    PMSCostPrice: tank.outlet.PMSCost,
    PMSSellingPrice: tank.outlet.PMSPrice,
    AGOCostPrice: tank.outlet.AGOCost,
    AGOSellingPrice: tank.outlet.AGOPrice,
    DPKCostPrice: tank.outlet.DPKCost,
    DPKSellingPrice: tank.outlet.DPKPrice,
    outletID: tank.outlet._id,
    outletName: tank.outlet.outletName.concat(", ", tank.outlet.alias),
    organisationID: tank.outlet.organisation,
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

export default PumpUpdate;
