import React, { useCallback, useEffect, useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import PaymentModal from "../Modals/PaymentModal";
import { useDispatch, useSelector } from "react-redux";
import { adminOutlet, getAllStations } from "../../store/actions/outlet";
import OutletService from "../../services/outletService";
import PaymentService from "../../services/paymentService";
import ConfirmDeleteModal from "../Modals/ConfirmDeleteModal";
import PaymentEditModal from "../Modals/PaymentEditModal";

import {
  createPayment,
  searchPayment,
  singlePaymentAction,
} from "../../store/actions/payment";
import ViewPayment from "../Modals/ViewPayment";
import RegulatoryReports from "../Reports/RegulatoryReports";
import config from "../../constants";
import swal from "sweetalert";
import { ThreeDots } from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const mediaMatch = window.matchMedia("(max-width: 530px)");
const mobile = window.matchMedia("(max-width: 600px)");

const Regulatory = () => {
  const [open, setOpen] = useState(false);
  const [defaultState, setDefault] = useState(0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  const allOutlets = useSelector((state) => state.outletReducer.allOutlets);
  const oneStationData = useSelector(
    (state) => state.outletReducer.adminOutlet
  );
  const payment = useSelector((state) => state.paymentReducer.payment);
  const [entries, setEntries] = useState(10);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [prints, setPrints] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [description, setDescription] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoad, setDeleteLoad] = useState(false);
  const singleRegulatoryDetails = useSelector(
    (state) => state.paymentReducer.singlePayment
  );
  const [confirmDeleteModalStatus, setConfirmDeleteModalStatus] =
    useState(false);
  const history = useHistory();
  const [paymentEditModalStatus, setPaymentEditModalStatus] = useState(false);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.regPay[e];
  };

  const openPaymentModal = () => {
    if (!getPerm("2")) return swal("Warning!", "Permission denied", "info");

    if (oneStationData === null) {
      swal("Warning!", "Please select a station first", "info");
    } else {
      setOpen(true);
    }
  };

  const getTankData = useCallback(() => {
    if (oneStationData !== null) {
      if (getPerm("0") || getPerm("1") || user.userType === "superAdmin") {
        const findID = allOutlets.findIndex(
          (data) => data._id === oneStationData._id
        );
        setDefault(findID + 1);

        const payload = {
          skip: skip * limit,
          limit: limit,
          outletID: oneStationData._id,
          organisationID: resolveUserID().id,
        };
        PaymentService.getAllPayment(payload).then((data) => {
          setLoading(false);
          setTotal(data.count);
          dispatch(createPayment(data.pay));
        });

        return;
      }
    }

    setLoading(true);
    const payload = {
      organisation: resolveUserID().id,
    };

    OutletService.getAllOutletStations(payload)
      .then((data) => {
        dispatch(getAllStations(data.station));
        if (
          (getPerm("0") || user.userType === "superAdmin") &&
          oneStationData === null
        ) {
          if (!getPerm("1")) setDefault(1);
          dispatch(adminOutlet(null));
          return "None";
        } else {
          OutletService.getOneOutletStation({ outletID: user.outletID }).then(
            (data) => {
              dispatch(adminOutlet(data.station));
            }
          );

          return user.outletID;
        }
      })
      .then((data) => {
        const payload = {
          skip: skip * limit,
          limit: limit,
          outletID: data,
          organisationID: resolveUserID().id,
        };
        PaymentService.getAllPayment(payload).then((data) => {
          setLoading(false);
          setTotal(data.count);
          dispatch(createPayment(data.pay));
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getTankData();
  }, [getTankData]);

  const refresh = () => {
    setLoading(true);
    const payload = {
      skip: skip * limit,
      limit: limit,
      outletID: oneStationData === null ? "None" : oneStationData?._id,
      organisationID: resolveUserID().id,
    };
    PaymentService.getAllPayment(payload)
      .then((data) => {
        setTotal(data.count);
        dispatch(createPayment(data.pay));
      })
      .then(() => {
        setLoading(false);
      });
  };

  const changeMenu = (index, item) => {
    if (!getPerm("1") && item === null)
      return swal("Warning!", "Permission denied", "info");
    setLoading(true);
    setDefault(index);
    dispatch(adminOutlet(item));

    const payload = {
      skip: skip * limit,
      limit: limit,
      outletID: item === null ? "None" : item?._id,
      organisationID: resolveUserID().id,
    };
    PaymentService.getAllPayment(payload)
      .then((data) => {
        setTotal(data.count);
        dispatch(createPayment(data.pay));
      })
      .then(() => {
        setLoading(false);
      });
  };

  const searchTable = (value) => {
    dispatch(searchPayment(value));
  };

  const nextPage = () => {
    if (!(skip < 0)) {
      setSkip((prev) => prev + 1);
    }
    refresh();
  };

  const prevPage = () => {
    if (!(skip <= 0)) {
      setSkip((prev) => prev - 1);
    }
    refresh();
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    refresh();
  };

  const printReport = () => {
    if (!getPerm("3")) return swal("Warning!", "Permission denied", "info");
    setPrints(true);
  };

  const viewDescription = (data) => {
    setOpenPayment(true);
    setDescription(data.description);
  };

  const goToHistory = () => {
    history.push("/home/history");
  };

  const handleDelete = () => {
    setDeleteLoad(true);
    if (!singleRegulatoryDetails) {
      setDeleteLoad(false);
      return swal("Warning!", "You can't delete this product order", "info");
    }

    setTimeout(() => {
      setDeleteLoad(false);
      setConfirmDeleteModalStatus(false);
      refresh();
    }, 8000);
  };

  return (
    <>
      <div data-aos="zoom-in-down" className="paymentsCaontainer">
        {
          <PaymentModal
            station={oneStationData}
            open={open}
            close={setOpen}
            refresh={refresh}
          />
        }
        {prints && (
          <RegulatoryReports
            allOutlets={payment}
            open={prints}
            close={setPrints}
          />
        )}
        {openPayment && (
          <ViewPayment
            open={openPayment}
            close={setOpenPayment}
            desc={description}
          />
        )}
        <div className="inner-pay">
          <div className="action">
            <div style={{ width: "150px" }} className="butt2">
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={10}
                sx={{
                  ...selectStyle2,
                  backgroundColor: "#06805B",
                  color: "#fff",
                }}
              >
                <MenuItem value={10}>Action</MenuItem>
                <MenuItem onClick={openPaymentModal} value={20}>
                  Register Payment
                </MenuItem>
                <MenuItem value={30}>Download PDF</MenuItem>
                <MenuItem value={40}>Print</MenuItem>
              </Select>
            </div>
          </div>

          <div className="search">
            <div className="input-cont">
              <div className="second-select">
                {getPerm("0") && (
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={defaultState}
                    sx={selectStyle2}
                  >
                    <MenuItem
                      onClick={() => {
                        changeMenu(0, null);
                      }}
                      style={menu}
                      value={0}
                    >
                      All Stations
                    </MenuItem>
                    {allOutlets.map((item, index) => {
                      return (
                        <MenuItem
                          key={index}
                          style={menu}
                          onClick={() => {
                            changeMenu(index + 1, item);
                          }}
                          value={index + 1}
                        >
                          {item.outletName + ", " + item.alias}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
                {getPerm("0") || (
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={0}
                    sx={selectStyle2}
                    disabled
                  >
                    <MenuItem style={menu} value={0}>
                      {!getPerm("0")
                        ? oneStationData?.outletName +
                          ", " +
                          oneStationData?.alias
                        : "No station created"}
                    </MenuItem>
                  </Select>
                )}
              </div>
              <div className="second-select">
                <OutlinedInput
                  sx={{
                    width: "100%",
                    height: "35px",
                    background: "#EEF2F1",
                    fontSize: "12px",
                    borderRadius: "0px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #777777",
                    },
                  }}
                  type="text"
                  placeholder="Search"
                  onChange={(e) => {
                    searchTable(e.target.value);
                  }}
                />
              </div>
            </div>
            <div style={{ width: "140px" }} className="butt">
              <Button
                sx={{
                  width: "100%",
                  height: "30px",
                  background: "#427BBE",
                  borderRadius: "0px",
                  fontSize: "10px",
                  "&:hover": {
                    backgroundColor: "#427BBE",
                  },
                }}
                onClick={openPaymentModal}
                variant="contained"
              >
                {" "}
                Register Payment
              </Button>
            </div>
          </div>

          <div className="search2">
            <div className="butt2">
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={entries}
                sx={selectStyle2}
              >
                <MenuItem style={menu} value={10}>
                  Show entries
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    entriesMenu(20, 15);
                  }}
                  style={menu}
                  value={20}
                >
                  15 entries
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    entriesMenu(30, 30);
                  }}
                  style={menu}
                  value={30}
                >
                  30 entries
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    entriesMenu(40, 100);
                  }}
                  style={menu}
                  value={40}
                >
                  100 entries
                </MenuItem>
              </Select>
            </div>
            <div
              style={{ width: mediaMatch.matches ? "100%" : "190px" }}
              className="input-cont2"
            >
              <Button
                sx={{
                  width: mediaMatch.matches ? "100%" : "100px",
                  height: "30px",
                  background: "#58A0DF",
                  borderRadius: "0px",
                  fontSize: "10px",
                  display: mediaMatch.matches && "none",
                  marginTop: mediaMatch.matches ? "10px" : "0px",
                  "&:hover": {
                    backgroundColor: "#58A0DF",
                  },
                }}
                onClick={goToHistory}
                variant="contained"
              >
                {" "}
                History
              </Button>
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
                variant="contained"
              >
                {" "}
                Print
              </Button>
            </div>
          </div>

          {mobile.matches ? (
            !loading ? (
              payment.length === 0 ? (
                <div style={place}>No data</div>
              ) : (
                payment.map((item, index) => {
                  return (
                    <div key={index} className="mobile-table-container">
                      <div className="inner-container">
                        <div className="row">
                          <div className="left-text">
                            <div className="heads">
                              {item.organisationalName}
                            </div>
                            <div className="foots">Organisation</div>
                          </div>
                          <div className="right-text">
                            <div className="heads">{item.amount}</div>
                            <div className="foots">Amount</div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="left-text">
                            <Button
                              sx={{
                                width: "80px",
                                height: "30px",
                                background: "#F36A4C",
                                borderRadius: "3px",
                                fontSize: "10px",
                                "&:hover": {
                                  backgroundColor: "#F36A4C",
                                },
                              }}
                              onClick={() => {
                                viewDescription(item);
                              }}
                              variant="contained"
                            >
                              {" "}
                              View
                            </Button>
                          </div>
                          <div className="right-text">
                            <div className="heads">{item.contactPerson}</div>
                            <div className="foots">Contact Person</div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="left-text">
                            <div className="heads">
                              <a
                                href={config.BASE_URL + item.attachCertificate}
                                target="_blank"
                                rel="noreferrer"
                              >
                                DPRCertificate
                              </a>
                            </div>
                            <div className="foots">Certificate</div>
                          </div>
                          <div className="right-text">
                            <div className="heads">
                              <a
                                href={config.BASE_URL + item.paymentReceipt}
                                target="_blank"
                                rel="noreferrer"
                              >
                                DPRReceip
                              </a>
                            </div>
                            <div className="foots">Reciept</div>
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
                <div className="column">Organisation Name</div>
                <div className="column">Description</div>
                <div className="column">Amount</div>
                <div className="column">Contact Person</div>
                <div className="column">Attachment (Certificate)</div>
                <div className="column">Payment reciept</div>
                <div className="column">Actions</div>
              </div>

              <div className="row-container">
                {!loading ? (
                  payment.length === 0 ? (
                    <div style={place}>No payment data</div>
                  ) : (
                    payment.map((item, index) => {
                      return (
                        <div
                          style={{
                            height: "50px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          className="table-head2"
                        >
                          <div className="column">{Number(index) + 1}</div>
                          <div className="column">
                            {item.organisationalName}
                          </div>
                          <div
                            style={{ textAlign: "left", lineHeight: "20px" }}
                            className="column"
                          >
                            <Button
                              sx={{
                                width: "80px",
                                height: "30px",
                                background: "#F36A4C",
                                borderRadius: "3px",
                                fontSize: "10px",
                                "&:hover": {
                                  backgroundColor: "#F36A4C",
                                },
                              }}
                              onClick={() => {
                                viewDescription(item);
                              }}
                              variant="contained"
                            >
                              {" "}
                              View
                            </Button>
                          </div>
                          <div className="column">{item.amount}</div>
                          <div className="column">{item.contactPerson}</div>
                          <div className="column">
                            <a
                              href={config.BASE_URL + item.attachCertificate}
                              target="_blank"
                              rel="noreferrer"
                            >
                              DPRCertificate
                            </a>
                          </div>
                          <div className="column">
                            <a
                              href={config.BASE_URL + item.paymentReceipt}
                              target="_blank"
                              rel="noreferrer"
                            >
                              DPRReceip
                            </a>
                          </div>
                          <div className="column">
                            <div style={{}} className="actions">
                              <EditIcon
                                style={{
                                  ...styles.icons,
                                  backgroundColor: "#054835",
                                  marginRight: "3px",
                                }}
                                onClick={() => {
                                  dispatch(singlePaymentAction(item));
                                  setPaymentEditModalStatus(true);
                                }}
                              />
                              <DeleteIcon
                                onClick={() => {
                                  dispatch(singlePaymentAction(item));
                                  setConfirmDeleteModalStatus(
                                    !confirmDeleteModalStatus
                                  );
                                }}
                                style={{
                                  ...styles.icons,
                                  backgroundColor: "red",
                                }}
                              />
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
      <ConfirmDeleteModal
        deleteStatus={deleteLoad}
        handleDelete={handleDelete}
        open={confirmDeleteModalStatus}
        close={setConfirmDeleteModalStatus}
      />
      <PaymentEditModal
        singleRegulatoryDetails={singleRegulatoryDetails}
        open={paymentEditModalStatus}
        close={setPaymentEditModalStatus}
      />
    </>
  );
};

const selectStyle2 = {
  width: "100%",
  height: "35px",
  borderRadius: "0px",
  background: "#F2F1F1B2",
  color: "#000",
  fontSize: "12px",
  outline: "none",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const place = {
  width: "100%",
  textAlign: "center",
  fontSize: "12px",
  marginTop: "20px",
  color: "green",
};

const menu = {
  fontSize: "12px",
};

const load = {
  width: "100%",
  height: "30px",
  display: "flex",
  justifyContent: "center",
};
const styles = {
  icons: {
    cursor: "pointer",
    color: "#fff",
    padding: 2,
    backgroundColor: "#06805b",
    borderRadius: "100%",
    cursor: "pointer",
  },
};

export default Regulatory;
