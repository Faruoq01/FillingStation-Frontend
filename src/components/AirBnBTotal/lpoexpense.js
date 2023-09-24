import React, { useCallback, useEffect, useState } from "react";
import "../../styles/payments.scss";
import { useDispatch, useSelector } from "react-redux";
import PrintTankUpdate from "../Reports/PrintTankUpdate";
import { ThreeDots } from "react-loader-spinner";
import ApproximateDecimal from "../common/approx";
import { useNavigate } from "react-router-dom";
import { Circle } from "@mui/icons-material";
import { PrintButton } from "../common/buttons";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import DateRangeLib from "../common/DatePickerLib";
import ShiftSelect from "../common/shift";
import { LimitSelect } from "../common/customselect";
import TableNavigation from "../controls/PageLayout/TableNavigation";
import LPOService from "../../services/360station/lpo";
import { createLPOSales } from "../../storage/lpo";

const mobile = window.matchMedia("(max-width: 600px)");

const LPOExpense = () => {
  const dispatch = useDispatch();
  const updateDate = useSelector((state) => state.dashboard.dateRange);
  const salesShift = useSelector((state) => state.dailysales.salesShift);

  const tankList = useSelector((state) => state.outlet.tankList);
  const singleLPO = useSelector((state) => state.lpo.singleLPO);
  const [entries, setEntries] = useState(10);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [prints, setPrints] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const lpos = useSelector((state) => state.lpo.lpoSales);

  const getAllCreditData = useCallback((updateDate, salesShift, skip) => {
    refresh("None", updateDate, salesShift, skip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllCreditData(updateDate, salesShift, skip);
    return () => {
      if (typeof singleLPO._id === "undefined") {
        navigate("/home/lposales/lposaleshome/0");
      }
    };
  }, [getAllCreditData, navigate, singleLPO._id, skip, updateDate, salesShift]);

  const refresh = (id, updateDate, salesShift, skip, limit = 15) => {
    setLoading(true);

    const payload = {
      skip: skip * limit,
      limit: limit,
      lpoID: singleLPO?._id,
      organisationID: singleLPO?.organizationID,
      startDate: updateDate[0],
      endDate: updateDate[1],
    };

    LPOService.getAllLPOSales(payload)
      .then((data) => {
        dispatch(createLPOSales(data.lpo.lpo));
        setTotal(data.lpo.count);
      })
      .then(() => {
        setLoading(false);
      });
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    refresh("None", updateDate, salesShift, skip, limit);
  };

  const printReport = () => {
    setPrints(true);
  };

  const getPrice = (item) => {
    if (item.productType === "PMS") return item.PMSRate;
    if (item.productType === "AGO") return item.AGORate;
    if (item.productType === "DPK") return item.DPKRate;
  };

  const getAmount = (item) => {
    if (item.productType === "PMS")
      return Number(item.PMSRate) * Number(item.lpoLitre);
    if (item.productType === "AGO")
      return Number(item.AGORate) * Number(item.lpoLitre);
    if (item.productType === "DPK")
      return Number(item.DPKRate) * Number(item.lpoLitre);
  };

  const getColor = {
    PMS: "#399A19",
    AGO: "#FFA010",
    DPK: "#35393E",
  };

  return (
    <div data-aos="zoom-in-down" className="paymentsCaontainer">
      {prints && (
        <PrintTankUpdate
          allOutlets={tankList}
          open={prints}
          close={setPrints}
        />
      )}
      <div className="inner-pay">
        <TableControls>
          <LeftControls>
            <LimitSelect entries={entries} entriesMenu={entriesMenu} />
            <ShiftSelect ml={"10px"} />
          </LeftControls>
          <RightControls>
            <DateRangeLib mt={mobile.matches ? "10px" : "0px"} />
            <PrintButton callback={printReport} />
          </RightControls>
        </TableControls>

        {mobile.matches ? (
          !loading ? (
            lpos.length === 0 ? (
              <div style={place}>No data</div>
            ) : (
              lpos.map((item, index) => {
                return (
                  <div key={index} className="mobile-table-container">
                    <div className="inner-container">
                      <div className="row">
                        <div className="left-text">
                          <div className="heads">{item.dateUpdated}</div>
                          <div className="foots">Date Updated</div>
                        </div>
                        <div className="right-text">
                          <div className="heads">{item.tankName}</div>
                          <div className="foots">Tank Name</div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="left-text">
                          <div className="heads">{item.productType}</div>
                          <div className="foots">Tank Product</div>
                        </div>
                        <div className="right-text">
                          <div className="heads">{item.previousLevel}</div>
                          <div className="foots">Previous Level</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            <div style={load}>
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
            </div>
          )
        ) : (
          <div className="table-container">
            <div className="table-head">
              <div className="column">S/N</div>
              <div className="column">Date</div>
              <div className="column">Products</div>
              <div className="column">Litres</div>
              <div className="column">Price/Litre</div>
              <div className="column">Amount</div>
              <div className="column">Station</div>
              <div className="column">Reference</div>
            </div>

            <div className="row-container">
              {!loading ? (
                lpos.length === 0 ? (
                  <div style={place}>No tank updates</div>
                ) : (
                  lpos.map((data, index) => {
                    return (
                      <div key={index} className="table-head2">
                        <div className="column">{index + 1}</div>
                        <div className="column">{data.createdAt}</div>
                        <div className="column">
                          <Circle
                            style={{
                              color: getColor[data.productType],
                              fontSize: 10,
                              marginRight: 4,
                            }}
                          />
                          <label>{data.productType}</label>
                        </div>
                        <div className="column">{data.lpoLitre}</div>
                        <div className="column">
                          {ApproximateDecimal(getPrice(data))}
                        </div>
                        <div className="column">{getAmount(data)}</div>
                        <div className="column">{data.station}</div>
                        <div className="column">{data.truckNo}</div>
                      </div>
                    );
                  })
                )
              ) : (
                <div style={load}>
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
                </div>
              )}
            </div>
          </div>
        )}

        <TableNavigation
          skip={skip}
          limit={limit}
          total={total}
          setSkip={setSkip}
          updateDate={updateDate}
          callback={refresh}
          salesShift={salesShift}
        />
      </div>
    </div>
  );
};

const place = {
  width: "100%",
  textAlign: "center",
  fontSize: "13px",
  marginTop: "20px",
  color: "green",
};

const load = {
  width: "100%",
  height: "30px",
  display: "flex",
  justifyContent: "center",
};

export default LPOExpense;
