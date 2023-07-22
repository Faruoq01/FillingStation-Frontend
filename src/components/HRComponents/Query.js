import React, { useCallback, useEffect, useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import hr7 from "../../assets/hr7.png";
import hr8 from "../../assets/hr8.png";
import QueryModal from "../Modals/QueryModal";
import { useDispatch, useSelector } from "react-redux";
import QueryService from "../../services/query";
import { createQuery, searchQuery } from "../../storage/query";
import OutletService from "../../services/outletService";
import { OutlinedInput } from "@mui/material";
import { adminOutlet, getAllStations } from "../../storage/outlet";
import QueryReport from "../Reports/QueryReport";
import ViewQuery from "../Modals/ViewQuery";
import swal from "sweetalert";
import UpdateQuery from "../Modals/UpdateQuery";
import { ThreeDots } from "react-loader-spinner";
import { useHistory } from "react-router-dom";

const mediaMatch = window.matchMedia("(max-width: 530px)");
const mobile = window.matchMedia("(max-width: 600px)");

const Query = () => {
  const [open, setOpen] = useState(false);
  const [defaultState, setDefault] = useState(0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const queryData = useSelector((state) => state.query.query);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [prints, setPrints] = useState(false);
  const [openQuery, setOpenQuery] = useState(false);
  const [description, setDesc] = useState("");
  const [openUpdate, setUpdate] = useState(false);
  const [currentQuery, setCurrentQuery] = useState({});
  const [entries, setEntries] = useState(10);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

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
    return user.permission?.hr[e];
  };

  const handleQuery = () => {
    if (!getPerm("11")) return swal("Warning!", "Permission denied", "info");

    if (oneStationData === null) {
      swal("Warning!", "Please select a station first", "info");
    } else {
      setOpen(true);
    }
  };

  const getAllQueryData = useCallback(() => {
    if (oneStationData !== null) {
      if (getPerm("9") || getPerm("10") || user.userType === "superAdmin") {
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
        QueryService.allQueryRecords(payload).then((data) => {
          setLoading(false);
          setTotal(data.query.count);
          dispatch(createQuery(data.query.query));
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
          (getPerm("9") || user.userType === "superAdmin") &&
          oneStationData === null
        ) {
          if (!getPerm("10")) setDefault(1);
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
        QueryService.allQueryRecords(payload).then((data) => {
          setLoading(false);
          setTotal(data.query.count);
          dispatch(createQuery(data.query.query));
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllQueryData();
  }, [getAllQueryData]);

  const refresh = (skip) => {
    setLoading(true);
    const payload = {
      skip: skip * limit,
      limit: limit,
      outletID: oneStationData === null ? "None" : oneStationData?._id,
      organisationID: resolveUserID().id,
    };
    QueryService.allQueryRecords(payload)
      .then((data) => {
        setTotal(data.query.count);
        dispatch(createQuery(data.query.query));
      })
      .then(() => {
        setLoading(false);
      });
  };

  const changeMenu = (index, item) => {
    if (!getPerm("11") && item === null)
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
    QueryService.allQueryRecords(payload)
      .then((data) => {
        dispatch(createQuery(data.query.query));
      })
      .then(() => {
        setLoading(false);
      });
  };

  const searchTable = (value) => {
    dispatch(searchQuery(value));
  };

  const printReport = () => {
    if (!getPerm("12")) return swal("Warning!", "Permission denied", "info");
    setPrints(true);
  };

  const openView = (data) => {
    setDesc(data.description);
    setOpenQuery(true);
  };

  const deleteQuery = (item) => {
    swal({
      title: "Alert!",
      text: "Are you sure you want to delete this query?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        QueryService.deleteQuery({ id: item._id })
          .then((data) => {
            swal("Success", "Query created successfully!", "success");
          })
          .then(() => {
            getAllQueryData();
          });
      }
    });
  };

  const updateQuery = (item) => {
    setCurrentQuery(item);
    setUpdate(true);
  };

  const nextPage = () => {
    setSkip((prev) => prev + 1);
    refresh(skip + 1);
  };

  const prevPage = () => {
    if (skip < 1) return;
    setSkip((prev) => prev - 1);
    refresh(skip - 1);
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    refresh(skip);
  };

  const goToHistory = () => {
    history.push("/home/history");
  };

  return (
    <div data-aos="zoom-in-down" className="paymentsCaontainer">
      {<QueryModal open={open} close={setOpen} refresh={refresh} />}
      {
        <UpdateQuery
          open={openUpdate}
          close={setUpdate}
          id={currentQuery}
          refresh={refresh}
        />
      }
      {prints && (
        <QueryReport allOutlets={queryData} open={prints} close={setPrints} />
      )}
      {openQuery && (
        <ViewQuery open={openQuery} close={setOpenQuery} desc={description} />
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
              }}>
              <MenuItem value={10}>Action</MenuItem>
              <MenuItem onClick={handleQuery} value={20}>
                Add Query
              </MenuItem>
              <MenuItem value={30}>History</MenuItem>
              <MenuItem onClick={printReport} value={40}>
                Print
              </MenuItem>
            </Select>
          </div>
        </div>

        <div className="search">
          <div className="input-cont">
            <div className="second-select">
              {getPerm("9") && (
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={defaultState}
                  sx={selectStyle2}>
                  <MenuItem
                    onClick={() => {
                      changeMenu(0, null);
                    }}
                    style={menu}
                    value={0}>
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
                        value={index + 1}>
                        {item.outletName + ", " + item.alias}
                      </MenuItem>
                    );
                  })}
                </Select>
              )}
              {getPerm("9") || (
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={0}
                  sx={selectStyle2}
                  disabled>
                  <MenuItem style={menu} value={0}>
                    {!getPerm("9")
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
          <div style={{ width: "100px" }} className="butt">
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
              onClick={handleQuery}
              variant="contained">
              {" "}
              Add Query
            </Button>
          </div>
        </div>

        <div className="search2">
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
              variant="contained">
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
              variant="contained">
              {" "}
              Print
            </Button>
          </div>
        </div>

        {mobile.matches ? (
          !loading ? (
            queryData.length === 0 ? (
              <div style={place}>No data</div>
            ) : (
              queryData.map((item, index) => {
                return (
                  <div key={index} className="mobile-table-container">
                    <div className="inner-container">
                      <div className="row">
                        <div className="left-text">
                          <div className="heads">{item.queryTitle}</div>
                          <div className="foots">Query title</div>
                        </div>
                        <div className="right-text">
                          <Button
                            sx={{
                              width: "80px",
                              height: "30px",
                              background: "#427BBE",
                              borderRadius: "3px",
                              fontSize: "10px",
                              "&:hover": {
                                backgroundColor: "#427BBE",
                              },
                            }}
                            onClick={() => {
                              openView(item);
                            }}
                            variant="contained">
                            {" "}
                            View
                          </Button>
                        </div>
                      </div>

                      <div className="row">
                        <div className="left-text">
                          <div className="heads">{item.employeeName}</div>
                          <div className="foots">Employee Name</div>
                        </div>
                        <div className="right-text">
                          <div style={{ width: "70px" }} className="actions">
                            <img
                              onClick={() => {
                                updateQuery(item);
                              }}
                              style={{ width: "27px", height: "27px" }}
                              src={hr7}
                              alt="icon"
                            />
                            <img
                              onClick={() => {
                                deleteQuery(item);
                              }}
                              style={{ width: "27px", height: "27px" }}
                              src={hr8}
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
          <div className="table-container">
            <div className="table-head">
              <div className="column">S/N</div>
              <div className="column">Staff Name</div>
              <div className="column">Query Title</div>
              <div className="column">Description</div>
              <div className="column">Date Queried</div>
              <div className="column">Action</div>
            </div>

            {!loading ? (
              queryData.length === 0 ? (
                <div style={place}>No data</div>
              ) : (
                queryData.map((item, index) => {
                  return (
                    <div
                      data-aos="fade-up"
                      key={index}
                      className="row-container">
                      <div className="table-head2">
                        <div className="column">{index + 1}</div>
                        <div className="column">{item.employeeName}</div>
                        <div className="column">{item.queryTitle}</div>
                        <div className="column">
                          <Button
                            sx={{
                              width: "80px",
                              height: "30px",
                              background: "#427BBE",
                              borderRadius: "3px",
                              fontSize: "10px",
                              "&:hover": {
                                backgroundColor: "#427BBE",
                              },
                            }}
                            onClick={() => {
                              openView(item);
                            }}
                            variant="contained">
                            {" "}
                            View
                          </Button>
                        </div>
                        <div className="column">
                          {item.createdAt.split("T")[0]}
                        </div>
                        <div className="column">
                          <div style={{ width: "70px" }} className="actions">
                            <img
                              onClick={() => {
                                updateQuery(item);
                              }}
                              style={{ width: "27px", height: "27px" }}
                              src={hr7}
                              alt="icon"
                            />
                            <img
                              onClick={() => {
                                deleteQuery(item);
                              }}
                              style={{ width: "27px", height: "27px" }}
                              src={hr8}
                              alt="icon"
                            />
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
            )}
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
  fontSize: "12px",
  outline: "none",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const menu = {
  fontSize: "12px",
};

const place = {
  width: "100%",
  textAlign: "center",
  fontSize: "12px",
  marginTop: "20px",
  color: "green",
};

const load = {
  width: "100%",
  height: "30px",
  display: "flex",
  justifyContent: "center",
};

export default Query;
