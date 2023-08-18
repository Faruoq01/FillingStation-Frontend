import React, { useEffect } from "react";
import close from "../../assets/close.png";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import swal from "sweetalert";
import {
  balanceCF,
  creditPayloadObject,
  rtPayload,
  salesPayload,
  tanksPayload,
} from "../../storage/recordsales";
import { useHistory } from "react-router-dom";
import "../../styles/summary.scss";
import { useState } from "react";
import ApproximateDecimal from "../common/approx";
import { ThreeDots } from "react-loader-spinner";
import SalesService from "../../services/sales";
import APIs from "../../services/api";
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

const ReturnToTank = (props) => {
  const dispatch = useDispatch();
  const records = useSelector((state) => state.recordsales.load);

  const removeData = (index) => {
    swal({
      title: "Alert!",
      text: "Are you sure you want to delete this record?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const pumpUpdate = [...records["1"]];
        pumpUpdate.splice(index, 1);
        dispatch(rtPayload(pumpUpdate));
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
              {ApproximateDecimal(props.data.rtLitre)} ltrs
            </div>
            <div className="vol_label">Return to tank</div>
          </div>
          <div className="fuel_card_items_right">
            <div className="volum"></div>
            <div className="vol_label"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryRecord = (props) => {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);

  const handleClose = () => props.close(false);
  const dispatch = useDispatch();
  const history = useHistory();

  /////////////////////////////////////////////////////////
  const selectedPumps = useSelector((state) => state.recordsales.selectedPumps);
  const selectedTanks = useSelector((state) => state.recordsales.selectedTanks);
  const salesPayloadData = useSelector(
    (state) => state.recordsales.salesPayload
  );
  const rtPayloadData = useSelector((state) => state.recordsales.rtPayload);
  const lpoPayloadData = useSelector((state) => state.recordsales.lpoPayload);
  const creditPayloadData = useSelector(
    (state) => state.recordsales.creditPayload
  );
  const creditPayloadObjectData = useSelector(
    (state) => state.recordsales.creditPayloadObject
  );
  const expensesPayloadData = useSelector(
    (state) => state.recordsales.expensesPayload
  );
  const bankPayloadData = useSelector((state) => state.recordsales.bankPayload);
  const posPayloadData = useSelector((state) => state.recordsales.posPayload);
  const dippingPayloadData = useSelector(
    (state) => state.recordsales.dippingPayload
  );
  const tanksPayloadData = useSelector(
    (state) => state.recordsales.tanksPayload
  );

  const balanceCFRecord = useSelector((state) => state.recordsales.balanceCF);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const daySupplyData = useSelector((state) => state.supply.daySupply);
  const tankList = useSelector((state) => state.recordsales.tankList);
  const currentDate = useSelector((state) => state.recordsales.currentDate);
  const mainDate = moment
    .tz(currentDate, user.timezone)
    .format("YYYY-MM-DD HH:mm:ss")
    .split(" ")[0];
  // console.log(typeof currentDate, "date");
  // console.log(selectedPumps, "Pumps");
  // console.log(selectedTanks, "Tanks");

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
    const updatedPumps = deepCopy.map((data) => {
      const newSales = Number(data.sales) - Number(data.RTlitre);
      return { ...data, sales: newSales };
    });

    const allProductPumps = updatedPumps.filter(
      (pump) => pump.productType === product
    );

    const allTankPumps = updatedPumps.filter(
      (pump) => pump.hostTank === tank._id
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
    if (dippingPayloadData.length === 0) {
      handleClose();
      return swal("Error", "Dipping record cannot be empty!", "error");
    }
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

    /*############# Creating tank levels ##################*/
    const updatedSet = [...updatedTanks];
    let tankSet = [...tankList];
    for (let tank of updatedSet) {
      tankSet = tankSet.filter((data) => data._id !== tank._id);
    }
    const updatedTankList = [...updatedSet, ...tankSet];
    const shuttled = updatedTankList.map((data) => {
      const afterSales =
        data.afterSales === 0 ? data.currentLevel : data.afterSales;
      const updatedTank = { ...data, afterSales: afterSales };
      const oneTank = getTankLevelsPayload(updatedTank, mainDate);
      return oneTank;
    });
    dispatch(tanksPayload(shuttled));

    /*############# Creating credit balances ###############*/
    if (creditPayloadData.length !== 0) {
      const groupedObject = creditPayloadData.reduce((result, item) => {
        const { lpoID } = item;
        if (!result[lpoID]) {
          result[lpoID] = [];
        }
        result[lpoID].push(item);
        return result;
      }, {});
      dispatch(creditPayloadObject(groupedObject));
    }

    /*############# Getting payloads for sales ###############*/
    const salesList = [];
    const pumpUpdates = [];
    const tankUpdates = [];

    for (let tank of updatedTanks) {
      for (let pump of tank.pumps) {
        const salesPayload = getSalesPayload(tank, pump, mainDate);
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

    /*############# Getting payloads for RT ###############*/
    const rtList = [];
    for (let tank of updatedTanks) {
      for (let pump of tank.pumps) {
        if (pump.RTlitre !== 0) {
          const rt = getRTPayload(tank, pump, mainDate);
          rtList.push(rt);
        }
      }
    }

    const uniqueRTPumps = rtList.filter(
      (obj, index, self) =>
        index === self.findIndex((item) => item.pumpID === obj.pumpID)
    );

    dispatch(rtPayload(uniqueRTPumps));

    /*############# Getting payloads for balanceCF ###############*/
    const selectedProducts = {};
    for (const product of updatedTanks) {
      if (!selectedProducts[product.productType]) {
        selectedProducts[product.productType] = product;
      }
    }
    const getArraysOfCF = Object.values(selectedProducts);
    const balanceCFData = getArraysOfCF.map((data) => {
      const done = getBalanceCF(data, mainDate);
      return done;
    });
    dispatch(balanceCF(balanceCFData));
  };

  useEffect(() => {
    updateAllTanks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveRecordSales = async () => {
    if (currentDate === null)
      return swal("Warning!", "Please select date!", "info");
    setLoading(true);

    const result = await APIs.post("/sales/validateSales", {
      date: mainDate,
      organizationID: oneStationData.organisation,
      outletID: oneStationData._id,
    }).then((data) => {
      return data.data.data;
    });

    if (result) {
      handleClose();
      swal("Error!", "Record has been saved for this day already!", "error");
    } else {
      const settings = {
        currentDate: mainDate,
      };
      const payload = [
        SalesService.pumpUpdate({
          ...settings,
          station: oneStationData,
          sales: salesPayloadData,
        }),
        SalesService.returnToTank({
          ...settings,
          station: oneStationData,
          rt: rtPayloadData,
        }),
        SalesService.lpo({
          ...settings,
          station: oneStationData,
          lpo: lpoPayloadData,
        }),
        SalesService.expenses({
          ...settings,
          station: oneStationData,
          expenses: expensesPayloadData,
        }),
        SalesService.bankPayment({
          ...settings,
          station: oneStationData,
          bankpayments: bankPayloadData,
        }),
        SalesService.posPayment({
          ...settings,
          station: oneStationData,
          pospayments: posPayloadData,
        }),
        SalesService.dipping({
          ...settings,
          station: oneStationData,
          dipping: dippingPayloadData,
        }),
        SalesService.tankLevels({
          ...settings,
          station: oneStationData,
          tankLevels: tanksPayloadData,
        }),
        SalesService.creditBalance({
          ...settings,
          station: oneStationData,
          debits: creditPayloadObjectData,
        }),
        SalesService.balanceCF({
          ...settings,
          station: oneStationData,
          balanceCF: balanceCFRecord,
        }),
        SalesService.supply({
          ...settings,
          station: oneStationData,
          supply: daySupplyData,
        }),
      ];
      Promise.allSettled(payload)
        .then((results) => {
          handleClose();
          history.push("/home/daily-sales");
          swal("Success!", "Record saved successfully!", "success");
        })
        .catch((error) => {
          // Handle any other errors that may occur
          console.log(error, "form catch");
        });
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
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div
        style={{ background: "#F5F5F5", flexDirection: "column" }}
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
              <div style={nums}>2</div>
              <div style={texts}>Return To Tank</div>
            </div>

            {rtPayloadData?.length === 0 ? (
              <div style={men}>No records</div>
            ) : (
              rtPayloadData?.map((data, index) => {
                return (
                  <ReturnToTank
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
              <div style={nums}>3</div>
              <div style={texts}>LPO (Corporate Sales)</div>
            </div>

            {lpoPayloadData?.length === 0 ? (
              <div style={men}>No records</div>
            ) : (
              lpoPayloadData?.map((data, index) => {
                return (
                  <div className="other_label">
                    <div className="other_inner">
                      <div className="fuel_card_items">
                        <div className="fuel_card_items_left">
                          <div className="volum">{data.truckNo}</div>
                          <div className="vol_label">Truck No</div>
                        </div>
                        <div className="fuel_card_items_right">
                          <div className="volum">
                            {ApproximateDecimal(data.lpoLitre)} ltrs
                          </div>
                          <div className="vol_label">LPO Volume</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="tank_label">
            <div style={conts}>
              <div style={nums}>4</div>
              <div style={texts}>Expenses</div>
            </div>

            {expensesPayloadData?.length === 0 ? (
              <div style={men}>No records</div>
            ) : (
              expensesPayloadData?.map((data, index) => {
                return (
                  <div className="other_label">
                    <div className="other_inner">
                      <div className="fuel_card_items">
                        <div className="fuel_card_items_left">
                          <div className="volum">{data.expenseName}</div>
                          <div className="vol_label">Expense Name</div>
                        </div>
                        <div className="fuel_card_items_right">
                          <div className="volum">
                            NGN {ApproximateDecimal(data.expenseAmount)}
                          </div>
                          <div className="vol_label">Expense Amount</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="tank_label">
            <div style={conts}>
              <div style={nums}>5</div>
              <div style={texts}>Bank Payments</div>
            </div>

            {bankPayloadData?.length === 0 ? (
              <div style={men}>No records</div>
            ) : (
              bankPayloadData?.map((data, index) => {
                return (
                  <div className="other_label">
                    <div className="other_inner">
                      <div className="fuel_card_items">
                        <div className="fuel_card_items_left">
                          <div className="volum">{data.bankName}</div>
                          <div className="vol_label">Payment Type</div>
                        </div>
                        <div className="fuel_card_items_right">
                          <div className="volum">
                            {" "}
                            NGN {ApproximateDecimal(data.amountPaid)}
                          </div>
                          <div className="vol_label">Amount Paid</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="tank_label">
            <div style={conts}>
              <div style={nums}>6</div>
              <div style={texts}>POS Payments</div>
            </div>

            {posPayloadData?.length === 0 ? (
              <div style={men}>No records</div>
            ) : (
              posPayloadData?.map((data, index) => {
                return (
                  <div className="other_label">
                    <div className="other_inner">
                      <div className="fuel_card_items">
                        <div className="fuel_card_items_left">
                          <div className="volum">{data.posName}</div>
                          <div className="vol_label">Payment Type</div>
                        </div>
                        <div className="fuel_card_items_right">
                          <div className="volum">
                            {" "}
                            NGN {ApproximateDecimal(data.amountPaid)}
                          </div>
                          <div className="vol_label">Amount Paid</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="tank_label">
            <div style={conts}>
              <div style={nums}>7</div>
              <div style={texts}>Dipping</div>
            </div>

            {dippingPayloadData?.length === 0 ? (
              <div style={men}>No records</div>
            ) : (
              dippingPayloadData?.map((data, index) => {
                return (
                  <div key={index} className="other_label">
                    <div className="other_inner">
                      <div className="fuel_card_items">
                        <div className="fuel_card_items_left">
                          <div className="volum">
                            {data.tankName + "( " + data.productType + " )"}
                          </div>
                          <div className="vol_label">Product</div>
                        </div>
                        <div className="fuel_card_items_right">
                          <div className="volum">
                            {ApproximateDecimal(data.dipping)} Ltrs
                          </div>
                          <div className="vol_label">Dipping level</div>
                        </div>
                      </div>
                      <div className="fuel_card_items">
                        <div className="fuel_card_items_left">
                          <div className="volum"></div>
                          <div className="vol_label"></div>
                        </div>
                        <div className="fuel_card_items_right">
                          <div className="volum">
                            {ApproximateDecimal(data.afterSales)} Ltrs
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

          <div className="tank_label">
            <div style={conts}>
              <div style={nums}>8</div>
              <div style={texts}>Supply</div>
            </div>

            {daySupplyData?.length === 0 ? (
              <div style={men}>No records</div>
            ) : (
              daySupplyData?.map((data, index) => {
                return (
                  <div key={index} className="other_label">
                    <div className="other_inner">
                      <div className="fuel_card_items">
                        <div className="fuel_card_items_left">
                          <div className="volum">{data.transportationName}</div>
                          <div className="vol_label">Transporter</div>
                        </div>
                        <div className="fuel_card_items_right">
                          <div className="volum">
                            {ApproximateDecimal(data.quantity)} Ltrs
                          </div>
                          <div className="vol_label">Quantity</div>
                        </div>
                      </div>
                      {Object.values(data?.recipientTanks).map(
                        (item, index) => {
                          return (
                            <div key={index} className="fuel_card_items">
                              <div className="fuel_card_items_left">
                                <div className="volum">{item.tankName}</div>
                                <div className="vol_label">Tank Name</div>
                              </div>
                              <div className="fuel_card_items_right">
                                <div className="volum">
                                  {ApproximateDecimal(item.quantity)} Ltrs
                                </div>
                                <div className="vol_label">Quantity</div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="tank_label">
            <div style={conts}>
              <div style={nums}>9</div>
              <div style={texts}>Balance Carried Forward</div>
            </div>

            {tanksPayloadData?.length === 0 ? (
              <div style={men}>No records</div>
            ) : (
              tanksPayloadData?.map((data, index) => {
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
                            {ApproximateDecimal(data.afterSales)} Ltrs
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
            onClick={saveRecordSales}
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
    tankID: tank._id,
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
    id: tank._id,
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

const getRTPayload = (tank, pump, mainDate) => {
  return {
    rtLitre: pump.RTlitre,
    PMSCost: tank.outlet.PMSCost,
    AGOCost: tank.outlet.AGOCost,
    DPKCost: tank.outlet.DPKCost,
    PMSPrice: tank.outlet.PMSPrice,
    AGOPrice: tank.outlet.AGOPrice,
    DPKPrice: tank.outlet.DPKPrice,
    productType: tank.productType,
    pumpID: pump._id,
    tankID: tank._id,
    pumpName: pump.pumpName,
    tankName: tank.tankName,
    outletID: tank.outletID,
    organizationID: tank.organisationID,
    createdAt: mainDate,
    updatedAt: mainDate,
  };
};

const getTankLevelsPayload = (level, mainDate) => {
  return {
    currentLevel: level.currentLevel,
    tankName: level.tankName,
    productType: level.productType,
    afterSales: level.afterSales,
    tankCapacity: level.tankCapacity,
    outletID: level.outletID,
    tankID: level._id,
    organizationID: level.organisationID,
    createdAt: mainDate,
    updatedAt: mainDate,
  };
};

const getBalanceCF = (sales, mainDate) => {
  return {
    balanceCF: sales.balanceCF,
    initialState: "0",
    productType: sales.productType,
    outletID: sales.outletID,
    organizationID: sales.organisationID,
    createdAt: mainDate,
    updatedAt: mainDate,
  };
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

const inner = {
  width: "94%",
  height: "500px",
  overflowY: "scroll",
  overflowX: "hidden",
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

export default SummaryRecord;
