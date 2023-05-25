import React, { useEffect, useCallback, useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import LPOModal from "../Modals/LPOModal";
import LPOService from "../../services/lpo";
import { useSelector } from "react-redux";
import { createLPO, searchLPO, singleLPORecord } from "../../store/actions/lpo";
import { useDispatch } from "react-redux";
import { OutlinedInput } from "@mui/material";
import edit2 from "../../assets/edit2.png";
import eyes from "../../assets/eyes.png";
import LPORateModal from "../Modals/SetLPORate";
import { Route, Switch, useHistory } from "react-router-dom";
import ListLPO from "../LPO/ListLPO";
import LPOReport from "../Reports/LpoReport";
import swal from "sweetalert";
import { ThreeDots } from "react-loader-spinner";
import CompanyLPO from "../LPO/company";
import LPORateAndEditOptions from "../Modals/LPOEditOptions";
import LPOEditOptions from "../Modals/LPOEditOptions";
import LPOModalEdit from "../Modals/LPOModalEdit";

const mediaMatch = window.matchMedia("(max-width: 530px)");
const mobile = window.matchMedia("(max-width: 600px)");

const LPO = (props) => {
  const [lpoModalEditStatus, setLpoModalEditStatus] = React.useState(false);
  const [lpo, setLpo] = React.useState(false);
  const user = useSelector((state) => state.authReducer.user);
  const lpos = useSelector((state) => state.lpoReducer.lpo);
  const dispatch = useDispatch();
  const history = useHistory();
  const oneStationData = useSelector(
    (state) => state.outletReducer.adminOutlet
  );
  const [activeButton, setActiveButton] = useState(false);
  const [entries, setEntries] = useState(10);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [prints, setPrints] = useState(false);
  const [priceModal, setPriceModal] = useState(false);
  const [editProductModal, setEditProductModal] = useState(false);
  const [editOptionModal, setEditOptionsModal] = useState(true);
  const [loading, setLoading] = useState(true);

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
    return user.permission?.corporateSales[e];
  };

  const openModal = () => {
    if (!getPerm("2")) return swal("Warning!", "Permission denied", "info");
    setLpo(true);
  };

  const getAllLPOData = useCallback(() => {
    setLoading(true);

    const payload = {
      skip: skip * limit,
      limit: limit,
      organisationID: resolveUserID().id,
    };

    LPOService.getAllLPO(payload).then((data) => {
      setLoading(false);
      setTotal(data.lpo.count);
      dispatch(createLPO(data.lpo.lpo));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllLPOData();
  }, [getAllLPOData]);

  const LPOCompanies = () => {
    setActiveButton(true);
  };

  const dispensed = () => {
    setActiveButton(false);
  };

  const refresh = () => {
    setLoading(true);
    const payload = {
      skip: skip * limit,
      limit: limit,
      outletID: oneStationData === null ? "None" : oneStationData?._id,
      organisationID: resolveUserID().id,
    };

    LPOService.getAllLPO(payload)
      .then((data) => {
        setTotal(data.lpo.count);
        dispatch(createLPO(data.lpo.lpo));
      })
      .then(() => {
        setLoading(false);
      });
  };

  const searchTable = (value) => {
    dispatch(searchLPO(value));
  };

  const printReport = () => {
    if (!getPerm("5")) return swal("Warning!", "Permission denied", "info");
    setPrints(true);
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    refresh();
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

  const openLPOSales = (data) => {
    if (!getPerm("3")) return swal("Warning!", "Permission denied", "info");
    dispatch(singleLPORecord(data));
    props.history.push("/home/lpo/list");
  };

  const createPrice = (data) => {
    if (!getPerm("4")) return swal("Warning!", "Permission denied", "info");
    dispatch(singleLPORecord(data));
    setEditOptionsModal(!editOptionModal);
  };
  const handleEditDetailsModal = () => {
    setEditOptionsModal(!editOptionModal);
    if (!getPerm("4")) return swal("Warning!", "Permission denied", "info");

    setLpoModalEditStatus(!lpoModalEditStatus);
  };

  const handleEditRateModal = (data) => {
    setEditOptionsModal(!editOptionModal);
    if (!getPerm("4")) return swal("Warning!", "Permission denied", "info");
    dispatch(singleLPORecord(data));
    setPriceModal(true);
  };

  const openLPOCompany = () => {
    history.push("/home/lpo/company");
  };

  const goToHistory = () => {
    history.push("/home/history");
  };

  return (
    <React.Fragment>
      <div data-aos="zoom-in-down" className="paymentsCaontainer">
        {
          <LPOModal
            station={oneStationData}
            open={lpo}
            close={setLpo}
            refresh={refresh}
          />
        }
        {
          <LPORateModal
            station={oneStationData}
            open={priceModal}
            close={setPriceModal}
            refresh={refresh}
          />
        }
        {prints && (
          <LPOReport allOutlets={lpos} open={prints} close={setPrints} />
        )}

        {props.activeRoute.split("/").length === 3 && (
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
                  <MenuItem onClick={openModal} value={20}>
                    Register LPO
                  </MenuItem>
                  <MenuItem value={30}>Download PDF</MenuItem>
                  <MenuItem value={40}>Print</MenuItem>
                </Select>
              </div>
            </div>

            <div className="search">
              <div className="input-cont">
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
              <div style={{ justifyContent: "flex-end" }} className="butt">
                <Button
                  sx={{
                    width: "120px",
                    height: "30px",
                    background: "#427BBE",
                    borderRadius: "0px",
                    fontSize: "12px",
                    textTransform: "capitalize",
                    "&:hover": {
                      backgroundColor: "#427BBE",
                    },
                  }}
                  onClick={openModal}
                  variant="contained"
                >
                  {" "}
                  Register LPO
                </Button>
              </div>
            </div>

            <div style={{ marginTop: "20px" }} className="search2">
              <div className="lpo-butt">
                <Button
                  sx={{
                    width: "120px",
                    height: "30px",
                    background: !activeButton ? "#06805B" : "#fff",
                    borderRadius: "27px",
                    fontSize: "10px",
                    marginRight: "10px",
                    color: !activeButton ? "#fff" : "#000",
                    "&:hover": {
                      background: !activeButton ? "#06805B" : "#fff",
                    },
                  }}
                  onClick={dispensed}
                  variant="contained"
                >
                  {" "}
                  LPO Dispensed
                </Button>
                <Button
                  sx={{
                    width: "120px",
                    height: "30px",
                    background: activeButton ? "#06805B" : "#fff",
                    borderRadius: "27px",
                    fontSize: "10px",
                    color: activeButton ? "#fff" : "#000",
                    "&:hover": {
                      background: activeButton ? "#06805B" : "#fff",
                    },
                  }}
                  onClick={LPOCompanies}
                  variant="contained"
                >
                  {" "}
                  LPO Companies
                </Button>
              </div>
              <div
                style={{
                  width: mediaMatch.matches ? "100%" : "330px",
                  alignItems: "center",
                }}
                className="input-cont2"
              >
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={entries}
                  sx={{
                    ...selectStyle2,
                    width: "130px",
                    height: "32px",
                    display: mediaMatch.matches && "none",
                  }}
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

            {!activeButton ? (
              mobile.matches ? (
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
                                <div className="heads">{item.companyName}</div>
                                <div className="foots">Company Name</div>
                              </div>
                              <div className="right-text">
                                <div className="heads">
                                  {item.personOfContact}
                                </div>
                                <div className="foots">Person of Contact</div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="left-text">
                                <div className="heads">{item.currentPMS}</div>
                                <div className="foots">PMS Dispensed</div>
                              </div>
                              <div className="right-text">
                                <div className="heads">{item.currentAGO}</div>
                                <div className="foots">AGO Dispensed</div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="left-text">
                                <div className="heads">{item.currentDPK}</div>
                                <div className="foots">DPK Dispensed</div>
                              </div>
                              <div className="right-text">
                                <div className="column">
                                  <img
                                    onClick={() => {
                                      openLPOSales(item);
                                    }}
                                    style={{ width: "28px", height: "28px" }}
                                    src={eyes}
                                    alt="icon"
                                  />
                                  <img
                                    onClick={() => {
                                      createPrice(item);
                                    }}
                                    style={{
                                      width: "28px",
                                      height: "28px",
                                      marginLeft: "10px",
                                    }}
                                    src={edit2}
                                    alt="icon"
                                  />
                                </div>
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
                <div style={{ marginTop: "10px" }} className="table-container">
                  <div className="table-head">
                    <div className="column">S/N</div>
                    <div className="column">Company Name</div>
                    <div className="column">Address</div>
                    <div className="column">Person of Contact</div>
                    <div className="column">PMS Dispensed</div>
                    <div className="column">AGO Dispensed</div>
                    <div className="column">DPK Dispensed</div>
                    <div className="column">Payment Structure</div>
                    <div className="column">Actions</div>
                  </div>

                  <div className="row-container">
                    {!loading ? (
                      lpos.length === 0 ? (
                        <div style={place}>No LPO Data </div>
                      ) : (
                        lpos.map((data, index) => {
                          return (
                            <div className="table-head2">
                              <div className="column">{index + 1}</div>
                              <div className="column">{data.companyName}</div>
                              <div className="column">{data.address}</div>
                              <div className="column">
                                {data.personOfContact}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                                className="column"
                              >
                                {data.currentPMS}
                                <span
                                  style={{ color: "green", fontSize: "12px" }}
                                >
                                  {data.PMSRate === "pending"
                                    ? "N 0. 000"
                                    : "NGN " +
                                      String(
                                        Number(data.PMSRate) *
                                          Number(data.currentPMS)
                                      )}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                                className="column"
                              >
                                {data.currentAGO}
                                <span
                                  style={{ color: "green", fontSize: "12px" }}
                                >
                                  {data.AGORate === "pending"
                                    ? "N 0. 000"
                                    : "NGN " +
                                      String(
                                        Number(data.AGORate) *
                                          Number(data.currentAGO)
                                      )}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                                className="column"
                              >
                                {data.currentDPK}
                                <span
                                  style={{ color: "green", fontSize: "12px" }}
                                >
                                  {data.DPKRate === "pending"
                                    ? "N 0. 000"
                                    : "NGN " +
                                      String(
                                        Number(data.DPKRate) *
                                          Number(data.currentDPK)
                                      )}
                                </span>
                              </div>
                              <div className="column">
                                {data.paymentStructure}
                              </div>
                              <div className="column">
                                <img
                                  onClick={() => {
                                    openLPOSales(data);
                                  }}
                                  style={{ width: "28px", height: "28px" }}
                                  src={eyes}
                                  alt="icon"
                                />
                                <img
                                  onClick={() => {
                                    createPrice(data);
                                  }}
                                  style={{
                                    width: "28px",
                                    height: "28px",
                                    marginLeft: "10px",
                                  }}
                                  src={edit2}
                                  alt="icon"
                                />
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
              )
            ) : mobile.matches ? (
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
                              <div className="heads">{item.companyName}</div>
                              <div className="foots">Company Name</div>
                            </div>
                            <div className="right-text">
                              <div className="heads">
                                {item.personOfContact}
                              </div>
                              <div className="foots">Person of Contact</div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="left-text">
                              <div className="heads">{item.PMS}</div>
                              <div className="foots">PMS Limit</div>
                            </div>
                            <div className="right-text">
                              <div className="heads">{item.AGO}</div>
                              <div className="foots">AGO Limit</div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="left-text">
                              <div className="heads">{item.DPK}</div>
                              <div className="foots">PMS Limit</div>
                            </div>
                            <div className="right-text">
                              <div className="heads">
                                {item.paymentStructure}
                              </div>
                              <div className="foots">Payment Structure</div>
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
              <div style={{ marginTop: "10px" }} className="table-container">
                <div className="table-head">
                  <div className="column">S/N</div>
                  <div className="column">Company Name</div>
                  <div className="column">Address</div>
                  <div className="column">Person of Contact</div>
                  <div className="column">PMS Limit</div>
                  <div className="column">AGO Limit</div>
                  <div className="column">DPK Limit</div>
                  <div className="column">Payment Structure</div>
                  <div className="column">Actions</div>
                </div>

                <div className="row-container">
                  {!loading ? (
                    lpos.length === 0 ? (
                      <div style={place}>No LPO Data </div>
                    ) : (
                      lpos.map((data, index) => {
                        return (
                          <div className="table-head2">
                            <div className="column">{index + 1}</div>
                            <div className="column">{data.companyName}</div>
                            <div className="column">{data.address}</div>
                            <div className="column">{data.personOfContact}</div>
                            <div className="column">{data.PMS}</div>
                            <div className="column">{data.AGO}</div>
                            <div className="column">{data.DPK}</div>
                            <div className="column">
                              {data.paymentStructure}
                            </div>
                            <div className="column">
                              <img
                                onClick={() => {
                                  openLPOCompany(data);
                                }}
                                style={{ width: "28px", height: "28px" }}
                                src={eyes}
                                alt="icon"
                              />
                              <img
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  marginLeft: "10px",
                                }}
                                src={edit2}
                                alt="icon"
                              />
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
                Showing {(skip + 1) * limit - (limit - 1)} to{" "}
                {(skip + 1) * limit} of {total} entries
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
        )}
        {props.activeRoute.split("/").length === 4 && (
          <Switch>
            <Route path="/home/lpo/list">
              <ListLPO />
            </Route>
            <Route path="/home/lpo/company">
              <CompanyLPO />
            </Route>
          </Switch>
        )}
      </div>
      <LPOModalEdit close={setLpoModalEditStatus} open={lpoModalEditStatus} />
      <LPOEditOptions
        handleEditDetails={handleEditDetailsModal}
        handleEditRate={handleEditRateModal}
        close={setEditOptionsModal}
        open={editOptionModal}
      />
    </React.Fragment>
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

export default LPO;
