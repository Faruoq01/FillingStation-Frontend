import React, { useCallback, useEffect, useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import PrintTankUpdate from "../Reports/PrintTankUpdate";
import { ThreeDots } from "react-loader-spinner";
import ApproximateDecimal from "../common/approx";
import { useNavigate } from "react-router-dom";
import ButtonDatePicker from "../common/CustomDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Stack } from "@mui/material";
import APIs from "../../services/connections/api";
import moment from "moment";

const mediaMatch = window.matchMedia("(max-width: 530px)");
const mobile = window.matchMedia("(max-width: 600px)");

const Transactions = () => {
  const date = new Date();
  const toString = date.toDateString();
  const [day, year, month] = toString.split(" ");
  const date2 = `${day} ${month} ${year}`;
  const [value, setValue] = React.useState(null);

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

  const convertDate = (newValue) => {
    const getDate = newValue === "" ? date2 : newValue.format("MM/DD/YYYY");
    const date = new Date(getDate);
    const toString = date.toDateString();
    const [day, year, month] = toString.split(" ");
    const finalDate = `${day} ${month} ${year}`;

    return finalDate;
  };

  const updateDate = (newValue) => {
    // if(!getPerm('4')) return swal("Warning!", "Permission denied", "info");
    setValue(newValue);
    setLoading(true);
    const currentDate = newValue.format("YYYY-MM-DD");

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
          <div
            style={{ width: mediaMatch.matches ? "100%" : "190px" }}
            className="input-cont2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={1}>
                <ButtonDatePicker
                  label={`${value == null || "" ? date2 : convertDate(value)}`}
                  value={value}
                  onChange={(newValue) => updateDate(newValue)}
                />
              </Stack>
            </LocalizationProvider>
            <Button
              sx={{
                width: mediaMatch.matches ? "100%" : "80px",
                height: "30px",
                background: "#F36A4C",
                borderRadius: "0px",
                fontSize: "10px",
                display: mediaMatch.matches && "none",
                marginTop: mediaMatch.matches ? "10px" : "0px",
                "&:hover": {
                  backgroundColor: "#F36A4C",
                },
              }}
              onClick={printReport}
              variant="contained">
              {" "}
              Print
            </Button>
          </div>
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

export default Transactions;
