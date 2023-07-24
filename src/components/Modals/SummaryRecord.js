import React, { useEffect } from "react";
import close from "../../assets/close.png";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import swal from "sweetalert";
import { updatePayload } from "../../storage/recordsales";
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
        const cloneRecords = { ...records };
        cloneRecords["1"] = pumpUpdate;
        dispatch(updatePayload(cloneRecords));
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
            {props.data.productType.concat(" ", props.data.tankName)} (
            {ApproximateDecimal(props.data.tankCapacity) + " ltrs"})
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
        const cloneRecords = { ...records };
        cloneRecords["1"] = pumpUpdate;
        dispatch(updatePayload(cloneRecords));
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
            {props.data.productType.concat(" ", props.data.tankName)} (
            {ApproximateDecimal(props.data.tankCapacity) + " ltrs"})
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
  const today = moment().format("YYYY-MM-DD").split(" ")[0];
  const records = useSelector((state) => state.recordsales.load);
  const [loading, setLoading] = useState(false);

  const handleClose = () => props.close(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const selectedPumps = useSelector((state) => state.recordsales.selectedPumps);
  const selectedTanks = useSelector((state) => state.recordsales.selectedTanks);
  const currentDate = useSelector((state) => state.recordsales.currentDate);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const tankList = useSelector((state) => state.outlet.tankList);
  console.log(records, "summary");
  // console.log(typeof currentDate, "date");
  // console.log(selectedPumps, "Pumps")
  // console.log(selectedTanks, "Tanks")

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

    const allPumps = updatedPumps.filter((pump) => pump.hostTank === tank._id);
    const allProductPumps = updatedPumps.filter(
      (pump) => pump.productType === product
    );

    const sales = allPumps.reduce((accum, current) => {
      return (
        Number(accum) +
        Number(current.newTotalizer) -
        Number(current.totalizerReading)
      );
    }, 0);

    const salesRT = allPumps.reduce((accum, current) => {
      return Number(accum) + Number(current.RTlitre);
    }, 0);

    const productSales = allProductPumps.reduce((accum, current) => {
      return (
        Number(accum) +
        Number(current.newTotalizer) -
        Number(current.totalizerReading)
      );
    }, 0);

    const productSalesRT = allProductPumps.reduce((accum, current) => {
      return Number(accum) + Number(current.RTlitre);
    }, 0);

    const finalUpdate = {
      ...tank,
      pumps: allPumps,
      totalSales: sales - salesRT,
      productSales: productSales - productSalesRT,
      afterSales: Number(tank.currentLevel) - sales + salesRT,
      outlet: oneStationData,
      totalTankLevel: totalTankLevel,
      totalTankCapacity: totalTankCapacity,
      balanceCF: totalTankLevel - productSales + productSalesRT,
    };

    return finalUpdate;
  };

  const updateAllTanks = () => {
    const mainDate = typeof currentDate !== "string" ? today : currentDate;

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
    const tankFromPayload = JSON.parse(JSON.stringify(records));

    /*############# Creating credit balances ###############*/
    const lpoCopy = [...records["3"]];
    const debitList = lpoCopy.map((data) => {
      return {
        debit: data.debit,
        lpoID: data.lpoID,
        quantity: data.lpoLitre,
        productType: data.productType,
        org: data.organizationID,
        truckNo: data.truckNo,
      };
    });

    const groupedObject = debitList.reduce((result, item) => {
      const { lpoID } = item;
      if (!result[lpoID]) {
        result[lpoID] = [];
      }
      result[lpoID].push(item);
      return result;
    }, {});

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

    /*############# Getting payloads for RT ###############*/
    const rtList = [];
    for (let tank of updatedTanks) {
      for (let pump of tank.pumps) {
        const rt = getRTPayload(tank, pump, mainDate);
        rtList.push(rt);
      }
    }

    /*############# Getting payloads for lpo ###############*/
    const lpoList = [];
    for (let lpo of tankFromPayload["3"]) {
      console.log(lpo, "gall");
      const lpoData = getLPOPayload(lpo, mainDate);
      lpoList.push(lpoData);
    }

    /*############# Getting payloads for expenses ###############*/
    const expenseList = [];
    for (let expense of tankFromPayload["4"]) {
      console.log(expense, "gall");
      const lpoData = getExpensePayload(expense, mainDate);
      expenseList.push(lpoData);
    }

    /*############# Getting payloads for bank payment ###############*/
    const bankList = [];
    for (let bank of tankFromPayload["5"]) {
      const bankData = getBankPayload(bank, mainDate);
      bankList.push(bankData);
    }

    /*############# Getting payloads for bank payment ###############*/
    const posList = [];
    for (let pos of tankFromPayload["6"]) {
      const posData = getPOSPayload(pos, mainDate);
      posList.push(posData);
    }

    /*############# Getting payloads for dipping ###############*/
    const dippingList = [];
    for (let dipping of tankFromPayload["7"]) {
      const dippingData = getDippingPayload(dipping, mainDate);
      dippingList.push(dippingData);
    }

    /*############# Getting payloads for tank levels ###############*/
    const tankLevelList = [];
    for (let level of updatedTankList) {
      const notUsed = {
        ...level,
        afterSales:
          level.afterSales === 0 ? level.currentLevel : level.afterSales,
      };
      const levelData = getTankLevelsPayload(notUsed, mainDate);
      tankLevelList.push(levelData);
    }

    /*############# Getting payloads for balance CF ###############*/
    let balanceCF = [];
    const pmsListing = updatedTanks.filter(
      (data) => data.productType === "PMS"
    );
    const agoListing = updatedTanks.filter(
      (data) => data.productType === "AGO"
    );
    const dpkListing = updatedTanks.filter(
      (data) => data.productType === "DPK"
    );

    if (pmsListing.length !== 0) {
      balanceCF.push(pmsListing[0]);
    }
    if (agoListing.length !== 0) {
      balanceCF.push(agoListing[0]);
    }
    if (dpkListing.length !== 0) {
      balanceCF.push(dpkListing[0]);
    }

    balanceCF = balanceCF.map((data) => {
      return {
        balanceCF: data.balanceCF,
        totalTankCapacity: data.totalTankCapacity,
        productType: data.productType,
        outletID: data.outlet._id,
        organizationID: data.outletID,
        createdAt: mainDate,
        updatedAt: mainDate,
      };
    });

    tankFromPayload["0"] = {
      sales: salesList,
      pumps: pumpUpdates,
      tanks: tankUpdates,
    };
    tankFromPayload["1"] = updatedTanks;
    tankFromPayload["2"] = rtList;
    tankFromPayload["3"] = lpoList;
    tankFromPayload["4"] = expenseList;
    tankFromPayload["5"] = bankList;
    tankFromPayload["6"] = posList;
    tankFromPayload["7"] = dippingList;
    tankFromPayload["8"] = tankLevelList;
    tankFromPayload["9"] = groupedObject;
    tankFromPayload["10"] = balanceCF;
    dispatch(updatePayload(tankFromPayload));
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
      date: currentDate,
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
        currentDate: currentDate,
      };
      const payload = [
        // SalesService.pumpUpdate({
        //   ...settings,
        //   station: oneStationData,
        //   sales: records["0"],
        // }),
        // SalesService.returnToTank({
        //   ...settings,
        //   station: oneStationData,
        //   rt: records["2"],
        // }),
        // SalesService.lpo({
        //   ...settings,
        //   station: oneStationData,
        //   lpo: records["3"],
        // }),
        SalesService.expenses({
          ...settings,
          station: oneStationData,
          expenses: records["4"],
        }),
        // SalesService.bankPayment({
        //   ...settings,
        //   station: oneStationData,
        //   bankpayments: records["5"],
        // }),
        // SalesService.posPayment({
        //   ...settings,
        //   station: oneStationData,
        //   pospayments: records["6"],
        // }),
        // SalesService.dipping({
        //   ...settings,
        //   station: oneStationData,
        //   dipping: records["7"],
        // }),
        // SalesService.tankLevels({
        //   ...settings,
        //   station: oneStationData,
        //   tankLevels: records["8"],
        // }),
        // SalesService.creditBalance({
        //   ...settings,
        //   station: oneStationData,
        //   debits: records["9"],
        // }),
        // SalesService.balanceCF({
        //   ...settings,
        //   station: oneStationData,
        //   balanceCF: records["10"],
        // }),
      ];
      Promise.allSettled(payload)
        .then((results) => {
          // dispatch(salesStatus(results));
          handleClose();
          // history.push("/home/daily-sales");
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

            {records["1"]?.length === 0 ? (
              <div style={men}>No records</div>
            ) : (
              records["1"]?.map((data, index) => {
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

            {records["2"]?.length === 0 ? (
              <div style={men}>No records</div>
            ) : (
              records["2"]?.map((data, index) => {
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

            {records["3"]?.length === 0 ? (
              <div style={men}>No records</div>
            ) : (
              records["3"]?.map((data, index) => {
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

            {records["4"]?.length === 0 ? (
              <div style={men}>No records</div>
            ) : (
              records["4"]?.map((data, index) => {
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

            {records["5"]?.length === 0 ? (
              <div style={men}>No records</div>
            ) : (
              records["5"]?.map((data, index) => {
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

            {records["6"]?.length === 0 ? (
              <div style={men}>No records</div>
            ) : (
              records["6"]?.map((data, index) => {
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

            {records["7"]?.length === 0 ? (
              <div style={men}>No records</div>
            ) : (
              records["7"]?.map((data, index) => {
                return (
                  <div className="other_label">
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
                          <div className="vol_label">Stock level</div>
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

const getPumpPayloads = (pump) => {
  return {
    id: pump._id,
    totalizerReading: pump.newTotalizer,
  };
};

const getTankPayloads = (tank) => {
  return {
    id: tank._id,
    previousLevel: tank.currentLevel,
    currentLevel: Number(tank.afterSales),
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

const getLPOPayload = (lpo, mainDate) => {
  return {
    accountName: lpo.accountName,
    productType: lpo.productType,
    truckNo: lpo.truckNo,
    lpoLitre: lpo.lpoLitre,
    attachApproval: lpo.attachApproval === null ? "None" : lpo.attachApproval,
    lpoID: lpo.lpoID,
    PMSRate: lpo.PMSRate,
    AGORate: lpo.AGORate,
    DPKRate: lpo.DPKRate,
    PMSCost: lpo.PMSCost,
    AGOCost: lpo.AGOCost,
    DPKCost: lpo.DPKCost,
    pumpID: lpo.pumpID,
    station: lpo.station,
    outletID: lpo.outletID,
    organizationID: lpo.organizationID,
    createdAt: mainDate,
    updatedAt: mainDate,
  };
};

const getExpensePayload = (expense, mainDate) => {
  return {
    dateCreated: "none",
    expenseName: expense.expenseName,
    description: expense.description,
    expenseAmount: expense.expenseAmount,
    attachApproval:
      expense.attachApproval === null ? "None" : expense.attachApproval,
    outletID: expense.outletID,
    organizationID: expense.organizationID,
    createdAt: mainDate,
    updatedAt: mainDate,
  };
};

const getBankPayload = (bank, mainDate) => {
  return {
    bankName: bank.bankName,
    tellerNumber: bank.tellerNumber,
    amountPaid: bank.amountPaid,
    paymentDate: bank.paymentDate,
    confirmation: "null",
    uploadSlip: bank.uploadSlip,
    outletID: bank.outletID,
    organizationID: bank.organizationID,
    createdAt: mainDate,
    updatedAt: mainDate,
  };
};

const getPOSPayload = (pos, mainDate) => {
  return {
    posName: pos.posName,
    terminalID: pos.terminalID,
    amountPaid: pos.amountPaid,
    paymentDate: pos.paymentDate,
    confirmation: "null",
    uploadSlip: pos.uploadSlip,
    outletID: pos.outletID,
    organizationID: pos.organizationID,
    createdAt: mainDate,
    updatedAt: mainDate,
  };
};

const getDippingPayload = (dipping, mainDate) => {
  return {
    tankID: dipping._id,
    productType: dipping.productType,
    currentLevel: dipping.currentLevel,
    tankCapacity: dipping.tankCapacity,
    dipping: dipping.dippingValue,
    afterSales: dipping.afterSales,
    tankName: dipping.tankName,
    outletID: dipping.outletID,
    organizationID: dipping.organisationID,
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
