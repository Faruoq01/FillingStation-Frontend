import React, { useCallback, useEffect, useState } from "react";
import "../../styles/payments.scss";
import { useSelector } from "react-redux";
import PrintTankUpdate from "../Reports/PrintTankUpdate";
import { ThreeDots } from "react-loader-spinner";
import ApproximateDecimal from "../common/approx";
import { useNavigate } from "react-router-dom";
import APIs from "../../services/connections/api";
import DateRangeLib from "../common/DatePickerLib";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import ShiftSelect from "../common/shift";
import { LimitSelect } from "../common/customselect";
import { PrintButton } from "../common/buttons";
import TableNavigation from "../controls/PageLayout/TableNavigation";

const mobile = window.matchMedia("(max-width: 600px)");

const Transactions = () => {
  const updateDate = useSelector((state) => state.dashboard.dateRange);
  const salesShift = useSelector((state) => state.dailysales.salesShift);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);

  const tankList = useSelector((state) => state.outlet.tankList);
  const singleLPO = useSelector((state) => state.lpo.singleLPO);
  const [entries, setEntries] = useState(10);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [prints, setPrints] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [creditData, setCreditData] = useState([]);

  const getAllCreditData = useCallback((updateDate, salesShift) => {
    refresh("None", updateDate, skip, salesShift);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllCreditData(updateDate, salesShift);
    return () => {
      if (typeof singleLPO._id === "undefined") {
        navigate("/home/lposales/lposaleshome/0");
      }
    };
  }, [getAllCreditData, navigate, singleLPO._id, updateDate, salesShift]);

  const refresh = (id, updateDate, skip, salesShift, limit = 15) => {
    setLoading(true);
    const payload = {
      skip: skip * limit,
      limit: limit,
      organizationID: singleLPO?.organizationID,
      startDate: updateDate,
      lpoID: singleLPO._id,
      shift: salesShift,
    };

    APIs.post("/lpo/allCreditRecord", payload)
      .then((data) => {
        setCreditData(data.data.credit.credit);
        setTotal(data.data.credit.count);
      })
      .then(() => {
        setLoading(false);
      });
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    const getID = oneStationData === null ? "None" : oneStationData._id;
    refresh(getID, updateDate, skip, salesShift, limit);
  };

  const printReport = () => {
    setPrints(true);
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
            creditData.length === 0 ? (
              <div style={place}>No data</div>
            ) : (
              creditData.map((item, index) => {
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
              <div className="column">Credit</div>
              <div className="column">Debit</div>
              <div className="column">Balance</div>
              <div style={{ width: "130%" }} className="column">
                Description
              </div>
            </div>

            <div className="row-container">
              {!loading ? (
                creditData.length === 0 ? (
                  <div style={place}>No tank updates</div>
                ) : (
                  creditData.map((data, index) => {
                    return (
                      <div key={index} className="table-head2">
                        <div className="column">{index + 1}</div>
                        <div className="column">{data.createdAt}</div>
                        <div className="column">{data.credit}</div>
                        <div className="column">{data.debit}</div>
                        <div className="column">
                          {ApproximateDecimal(data.balance)}
                        </div>
                        <div style={{ width: "130%" }} className="column">
                          {data.description}
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

export default Transactions;
