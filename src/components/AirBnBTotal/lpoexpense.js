import React, { useCallback, useEffect, useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useSelector } from "react-redux";
import PrintTankUpdate from "../Reports/PrintTankUpdate";
import { ThreeDots } from "react-loader-spinner";
import ApproximateDecimal from "../common/approx";
import { useNavigate } from "react-router-dom";
import APIs from "../../services/connections/api";
import moment from "moment";
import { Circle } from "@mui/icons-material";
import { PrintButton } from "../common/buttons";

const mobile = window.matchMedia("(max-width: 600px)");

const LPOExpense = () => {
  const date = new Date();
  const toString = date.toDateString();
  const [day, year, month] = toString.split(" ");
  const date2 = `${day} ${month} ${year}`;
  const [value, setValue] = React.useState(null);

  const tankList = useSelector((state) => state.outlet.tankList);
  const singleLPO = useSelector((state) => state.lpo.singleLPO);
  const lpos = useSelector((state) => state.lpo.lpoSales);
  const [entries, setEntries] = useState(10);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [prints, setPrints] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [creditData, setCreditData] = useState([]);

  const getAllCreditData = useCallback(() => {
    setLoading(true);
    const currentDate = moment().format("YYYY-MM-DD").split()[0];

    const payload = {
      skip: skip * limit,
      limit: limit,
      organizationID: singleLPO?.organizationID,
      startDate: currentDate,
      lpoID: singleLPO._id,
    };

    APIs.post("/lpo/allCreditRecord", payload)
      .then((data) => {
        setCreditData(data.data.credit.credit);
        setTotal(data.data.credit.count);
      })
      .then(() => {
        setLoading(false);
      });
  }, [limit, singleLPO._id, singleLPO?.organizationID, skip]);

  useEffect(() => {
    getAllCreditData();
    return () => {
      if (typeof singleLPO._id === "undefined") {
        navigate("lposales");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = (skip) => {
    if (skip < 0) return;
    setLoading(true);
    const currentDate =
      value === null
        ? moment().format("YYYY-MM-DD").split()[0]
        : value.format("YYYY-MM-DD");

    const payload = {
      skip: skip * limit,
      limit: limit,
      organizationID: singleLPO?.organizationID,
      startDate: currentDate,
      lpoID: singleLPO._id,
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

  const nextPage = () => {
    if (!(skip < 0)) {
      setSkip((prev) => prev + 1);
    }
    refresh(skip + 1);
  };

  const prevPage = () => {
    if (!(skip <= 0)) {
      setSkip((prev) => prev - 1);
    }
    refresh(skip - 1);
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    refresh();
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
        <div style={{ marginTop: "0px" }} className="search2">
          <div className="butt2">
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={entries}
              sx={selectStyle2}>
              <MenuItem style={menu} value={10}>
                Show entries
              </MenuItem>
              <MenuItem
                onClick={() => {
                  entriesMenu(20, 15);
                }}
                style={menu}
                value={20}>
                15 entries
              </MenuItem>
              <MenuItem
                onClick={() => {
                  entriesMenu(30, 30);
                }}
                style={menu}
                value={30}>
                30 entries
              </MenuItem>
              <MenuItem
                onClick={() => {
                  entriesMenu(40, 100);
                }}
                style={menu}
                value={40}>
                100 entries
              </MenuItem>
            </Select>
          </div>
          <PrintButton callback={printReport} />
        </div>

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
                              color: "#1B6602",
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

        <div className="footer">
          <div style={{ fontSize: "12px" }}>
            Showing {(skip + 1) * limit - (limit - 1)} to {(skip + 1) * limit}{" "}
            of {total} entries
          </div>
          <div className="nav">
            <button onClick={prevPage} className="but">
              Previous
            </button>
            <div className="num">{skip + 1}</div>
            <button onClick={nextPage} className="but2">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const selectStyle2 = {
  width: "100%",
  height: "35px",
  borderRadius: "0px",
  background: "#F2F1F1B2",
  color: "#000",
  fontSize: "13px",
  outline: "none",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const place = {
  width: "100%",
  textAlign: "center",
  fontSize: "13px",
  marginTop: "20px",
  color: "green",
};

const menu = {
  fontSize: "13px",
};

const load = {
  width: "100%",
  height: "30px",
  display: "flex",
  justifyContent: "center",
};

export default LPOExpense;
