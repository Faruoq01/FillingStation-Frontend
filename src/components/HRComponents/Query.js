import React, { useCallback, useEffect, useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import hr7 from "../../assets/hr7.png";
import hr8 from "../../assets/hr8.png";
import QueryModal from "../Modals/QueryModal";
import { useDispatch, useSelector } from "react-redux";
import QueryService from "../../services/360station/query";
import { createQuery, searchQuery } from "../../storage/query";
import ViewQuery from "../Modals/ViewQuery";
import swal from "sweetalert";
import UpdateQuery from "../Modals/UpdateQuery";
import { ThreeDots } from "react-loader-spinner";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import { LimitSelect } from "../common/customselect";
import { CreateButton, PrintButton } from "../common/buttons";
import { SearchField } from "../common/searchfields";
import SelectStation from "../common/selectstations";
import TableNavigation from "../controls/PageLayout/TableNavigation";
import DateRangeLib from "../common/DatePickerLib";
import GenerateReports from "../Modals/reports";

const mobile = window.matchMedia("(max-width: 600px)");

const Query = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const queryData = useSelector((state) => state.query.query);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updateDate = useSelector((state) => state.dashboard.dateRange);
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

  const getAllQueryData = useCallback((outlet, updateDate, skip) => {
    refresh(outlet, updateDate, skip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const outlet = oneStationData === null ? "None" : oneStationData?._id;
    getAllQueryData(outlet, updateDate, skip);
  }, [getAllQueryData, skip, updateDate, oneStationData]);

  const refresh = (id, updateDate, skip, limit = 15) => {
    setLoading(true);
    const payload = {
      skip: skip * limit,
      limit: limit,
      outletID: id,
      organisationID: resolveUserID().id,
      date: updateDate,
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

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    const id = oneStationData === null ? "None" : oneStationData?._id;
    refresh(id, updateDate, skip, limit);
  };

  const stationHelper = (id) => {
    refresh(id, updateDate, skip);
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
      {openQuery && (
        <ViewQuery open={openQuery} close={setOpenQuery} desc={description} />
      )}
      <div className="inner-pay">
        <div style={{ marginTop: "10px" }} className="action">
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={10}
            sx={{
              ...selectStyle2,
              backgroundColor: "#06805B",
              color: "#fff",
              marginRight: "5px",
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

        {mobile.matches || (
          <TableControls mt={"10px"}>
            <LeftControls>
              <SelectStation
                ml={"0px"}
                oneStation={getPerm("0")}
                allStation={getPerm("1")}
                callback={stationHelper}
              />
            </LeftControls>
            <RightControls>
              <CreateButton callback={handleQuery} label={"Add Query"} />
            </RightControls>
          </TableControls>
        )}

        {mobile.matches || (
          <TableControls mt={"10px"}>
            <LeftControls>
              <LimitSelect entries={entries} entriesMenu={entriesMenu} />
              <SearchField ml={"10px"} callback={searchTable} />
            </LeftControls>
            <RightControls>
              <DateRangeLib mt={mobile.matches ? "10px" : "0px"} />
              <PrintButton callback={printReport} />
            </RightControls>
          </TableControls>
        )}

        {mobile.matches && (
          <TableControls mt={"10px"}>
            <LeftControls>
              <DateRangeLib />
              <SelectStation
                ml={"10px"}
                oneStation={getPerm("0")}
                allStation={getPerm("1")}
                callback={stationHelper}
              />
            </LeftControls>
            <RightControls></RightControls>
          </TableControls>
        )}

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

        <TableNavigation
          skip={skip}
          limit={limit}
          total={total}
          setSkip={setSkip}
          updateDate={updateDate}
          callback={refresh}
        />

        {prints && (
          <GenerateReports
            open={prints}
            close={setPrints}
            section={"query"}
            data={queryData}
          />
        )}
      </div>
    </div>
  );
};

const selectStyle2 = {
  maxWidth: "150px",
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

const load = {
  width: "100%",
  height: "30px",
  display: "flex",
  justifyContent: "center",
};

export default Query;
