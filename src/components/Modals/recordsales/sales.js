import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import {
  salesPayload, tanksPayload, updateAgoList, updateDpkList, updatePmsList, updateRecords, updateSelectedPumps, updateSelectedTanks,
} from "../../../storage/recordsales";
import "../../../styles/summary.scss";
import { useState } from "react";
import ApproximateDecimal from "../../common/approx";
import SalesService from "../../../services/360station/sales";
import APIs from "../../../services/connections/api";
import ModalBackground from "../../controls/Modal/ModalBackground";
import OutletService from "../../../services/360station/outletService";
import LPOService from "../../../services/360station/lpo";
import moment from "moment";

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
        pumpUpdate.tanks.splice(index, 1);
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
            {/* ({ApproximateDecimal(props.data.tankCapacity) + " ltrs"}) */}
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
              {ApproximateDecimal(props.data.previousLevel)} ltrs
            </div>
            <div className="vol_label">Current stock</div>
          </div>
          <div className="fuel_card_items_right">
            <div className="volum">
              {ApproximateDecimal(props.data.currentLevel)} ltrs
            </div>
            <div className="vol_label">Level after sales</div>
          </div>
        </div>

        <div className="fuel_card_items">
          <div className="fuel_card_items_left">
            <div className="volum">
              {ApproximateDecimal(props.data.tankSales)}
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

        {props.data?.pumps?.length === 0 ? (
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
        )}
      </div>
    </div>
  );
};

const SummarySales = (props) => {
  const [loading, setLoading] = useState(false);

  const handleClose = () => props.close(false);
  const dispatch = useDispatch();

  /////////////////////////////////////////////////////////
  const selectedPumps = useSelector((state) => state.recordsales.selectedPumps);
  const selectedTanks = useSelector((state) => state.recordsales.selectedTanks);

  const salesPayloadData = useSelector(
    (state) => state.recordsales.salesPayload
  );
  const tanksPayloadData = useSelector(
    (state) => state.recordsales.tanksPayload
  );

  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const tankList = useSelector((state) => state.recordsales.tankList);
  const currentDate = useSelector((state) => state.recordsales.currentDate);
  const currentShift = useSelector((state) => state.recordsales.currentShift);

  const updateTankDetails = (product, tank) => {
    const onlyPMS = [...tankList].filter(
      (data) => data.productType === product
    );
    const totalTankLevel = onlyPMS.reduce((accum, current) => {
      return Number(accum) + Number(current.currentLevel);
    }, 0);

    const totalTankCapacity = onlyPMS.reduce((accum, current) => {
      return Number(accum) + Number(current.tankCapacity);
    }, 0);

    const deepCopy = JSON.parse(JSON.stringify(selectedPumps));
    const allProductPumps = deepCopy.filter(
      (pump) => pump.productType === product
    );

    const allTankPumps = deepCopy.filter(
      (pump) => pump.hostTank === tank.tankID
    );

    const productSales = allProductPumps.reduce((accum, current) => {
      return Number(accum) + Number(current.sales);
    }, 0);

    const tankSales = allTankPumps.reduce((accum, current) => {
      return Number(accum) + Number(current.sales);
    }, 0);

    const finalUpdate = {
      ...tank,
      pumps: allTankPumps,
      tankSales: tankSales,
      afterSales: Number(tank.currentLevel) - tankSales,
      outlet: oneStationData,
      totalTankCapacity: totalTankCapacity,
      totalTankLevel: totalTankLevel,
      balanceCF: totalTankLevel - productSales,
    };

    return finalUpdate;
  };

  const updateAllTanks = () => {
    if (typeof currentDate !== "string") {
      handleClose();
      return swal("Error", "Please select record date", "error");
    }

    const updatedTanks = selectedTanks?.map((data) => {
      let update;

      if (data.productType === "PMS") {
        update = updateTankDetails("PMS", data);
      } else if (data.productType === "AGO") {
        update = updateTankDetails("AGO", data);
      } else if (data.productType === "DPK") {
        update = updateTankDetails("DPK", data);
      }

      return update;
    });
    console.log(updatedTanks, "tanks")

    /*############# Creating tank levels ##################*/
    const updatedSet = [...updatedTanks];
    let tankSet = [...tankList];
    for (let tank of updatedSet) {
      tankSet = tankSet.filter((data) => data.tankID !== tank.tankID);
    }
    const updatedTankList = [...updatedSet, ...tankSet];
    const shuttled = updatedTankList.map((data) => {
      const afterSales =
        data.afterSales === 0 ? data.currentLevel : data.afterSales;
      const updatedTank = { ...data, afterSales: afterSales };
      const oneTank = getTankLevelsPayload(
        updatedTank,
        currentDate,
        currentShift
      );
      return oneTank;
    });
    dispatch(tanksPayload(shuttled));

    /*############# Getting payloads for sales ###############*/
    const salesList = [];
    const pumpUpdates = [];
    const tankUpdates = [];

    for (let tank of updatedTanks) {
      for (let pump of tank.pumps) {
        const salesPayload = getSalesPayload(
          tank,
          pump,
          currentDate,
          currentShift
        );
        const pumpPayload = getPumpPayloads(pump);
        const tankPayload = getTankPayloads(tank);

        salesList.push(salesPayload);
        pumpUpdates.push(pumpPayload);
        tankUpdates.push(tankPayload);
      }
    }

    const uniqueSales = salesList.filter(
      (obj, index, self) =>
        index === self.findIndex((item) => item.pumpID === obj.pumpID)
    );

    const uniquePumps = pumpUpdates.filter(
      (obj, index, self) =>
        index === self.findIndex((item) => item.id === obj.id)
    );

    const uniqueTanks = tankUpdates.filter(
      (obj, index, self) =>
        index === self.findIndex((item) => item.id === obj.id)
    );

    const salesLoad = {
      sales: uniqueSales,
      pumps: uniquePumps,
      tanks: uniqueTanks,
    };
    dispatch(salesPayload(salesLoad));
  };

  useEffect(() => {
    updateAllTanks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    if (currentDate === null)
      return swal("Warning!", "Please select date!", "info");
    setLoading(true);

    const result = await APIs.post("/sales/validateSales", {
      date: currentDate,
      organizationID: oneStationData.organisation,
      outletID: oneStationData._id,
    }).then((data) => {
      return data.data.data;
    });

    if (result) {
      handleClose();
      return swal("Error!", "Record has been saved for this day already!", "error");
    } 

    const settings = {
        currentDate: currentDate,
    };
    
    try{
      const responseData = await SalesService.pumpUpdate({
          ...settings,
          station: oneStationData,
          sales: salesPayloadData,
          tanklevels: tanksPayloadData
      });
      props.refreshIt(prev => !prev);
      handleClose();
      dispatch(updateSelectedPumps([]));
      dispatch(updateSelectedTanks([]));
      dispatch(updatePmsList([]));
      dispatch(updateAgoList([]));
      dispatch(updateDpkList([]));
      swal("Success!", "Record saved successfully!", "success");
    }catch(e){
        console.log(e)
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

  return (
    <React.Fragment>
        <ModalBackground
            openModal={props.open}
            closeModal={props.close}
            submit={submit}
            loading={loading}
            ht={'500px'}
            label={"Pump Sales Summary"}>
            <div className="tank_label">
                <div style={conts}>
                <div style={nums}>1</div>
                <div style={texts}>Pump updates and Sales</div>
                </div>

                {salesPayloadData?.tanks?.length === 0 ? (
                <div style={men}>No records</div>
                ) : (
                salesPayloadData?.tanks?.map((data, index) => {
                    return (
                    <FuelCard
                        index={index}
                        key={index}
                        data={data}
                        getBackground={getBackground}
                    />
                    );
                })
                )}
            </div>

            <div className="tank_label">
                <div style={conts}>
                <div style={nums}>9</div>
                <div style={texts}>Balance Carried Forward</div>
                </div>

                {salesPayloadData?.tanks?.length === 0 ? (
                <div style={men}>No records</div>
                ) : (
                    salesPayloadData?.tanks?.map((data, index) => {
                    return (
                    <div key={index} className="other_label">
                        <div className="other_inner">
                        <div className="fuel_card_items">
                            <div className="fuel_card_items_left">
                            <div className="volum">
                                {`${data.tankName} (${data.productType})`}
                            </div>
                            <div className="vol_label">Tank Name</div>
                            </div>
                            <div className="fuel_card_items_right">
                            <div className="volum">
                                {ApproximateDecimal(data.currentLevel)} Ltrs
                            </div>
                            <div className="vol_label">After Sales</div>
                            </div>
                        </div>
                        </div>
                    </div>
                    );
                })
                )}
            </div>
      </ModalBackground>
    </React.Fragment>
  );
};

const getSalesPayload = (tank, pump, currentDate, currentShift) => {
  return {
    sales: pump.sales,
    RTlitre: pump.RTlitre,
    tankID: tank.tankID,
    tankName: tank.tankName,
    pumpID: pump._id,
    pumpName: pump.pumpName,
    beforeSales: tank.beforeSales,
    afterSales: tank.afterSales,
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
    shift: currentShift,
    createdAt: currentDate,
    updatedAt: currentDate,
  };
};

const getPumpPayloads = (pump) => {
  return {
    id: pump._id,
    totalizerReading: pump.newTotalizer,
  };
};

const getTankPayloads = (tank) => {
  return {
    id: tank.tankID,
    productType: tank.productType,
    tankName: tank.tankName,
    previousLevel: tank.currentLevel,
    currentLevel: Number(tank.afterSales),
    tankSales: tank.tankSales,
    totalTankLevel: tank.totalTankLevel,
    balanceCF: tank.balanceCF,
    pumps: tank.pumps,
  };
};

const getTankLevelsPayload = (level, currentDate, currentShift) => {
    return {
      tankHeight: level.tankHeight,
      deadStockLevel: level.deadStockLevel,
      dipping: level.dipping,
      calibrationDate: level.calibrationDate,
      station: level.station,
      quantityAdded: level.quantityAdded,
      activeState: level.activeState,
      PMSCostPrice: level.PMSCostPrice,
      PMSSellingPrice: level.PMSSellingPrice,
      AGOCostPrice: level.AGOCostPrice,
      AGOSellingPrice: level.AGOSellingPrice,
      DPKCostPrice: level.DPKCostPrice,
      DPKSellingPrice: level.DPKSellingPrice,
      currentLevel: level.currentLevel,
      tankName: level.tankName,
      productType: level.productType,
      afterSales: level.afterSales,
      tankCapacity: level.tankCapacity,
      outletID: level.outletID,
      tankID: level.tankID,
      organizationID: level.organizationID,
      shift: currentShift,
      createdAt: currentDate,
      updatedAt: currentDate,
    };
  };

const men = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const texts = {
  fontSize: "14px",
  color: "#000",
  fontWeight: "bold",
};

const nums = {
  width: "20px",
  height: "20px",
  display: "flex",
  justifyContent: "center",
  alightItems: "center",
  background: "#454343",
  borderRadius: "20px",
  color: "#fff",
  fontSize: "12px",
  marginRight: "10px",
};

const conts = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alightItems: "center",
  marginTop: "30px",
  marginBottom: "5px",
  justifyContent: "flex-start",
  color: "#000",
};

export default SummarySales;
