import React, { useEffect, useCallback, useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import OutletService from "../../services/outletService";
import { adminOutlet, getAllStations } from "../../storage/outlet";
import { OutlinedInput, Stack } from "@mui/material";
import RecordPaymentService from "../../services/recordPayment";
import {
  allBankPayment,
  allPosPayment,
  searchBankPayment,
  searchPosPayment,
} from "../../storage/payment";
import config from "../../constants";
import { ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import DailySalesService from "../../services/DailySales";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { setDateValue } from "../../storage/dailysales";
import { dateRange } from "../../storage/dashboard";
import ButtonDatePicker from "../common/CustomDatePicker";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import SelectStation from "../common/selectstations";
import { SearchField } from "../common/searchfields";
import { LimitSelect } from "../common/customselect";
import { PrintButton } from "../common/buttons";
import TableNavigation from "../controls/PageLayout/TableNavigation";
import {
  BankPaymentDesktopTable,
  BankPaymentMobileTable,
} from "../tables/bankpayment";
import {
  PosPaymentDesktopTable,
  PosPaymentMobileTable,
} from "../tables/pospayment";

const bankColumns = [
  "S/N",
  "Bank name",
  "Teller number",
  "Amount paid",
  "Payment date",
  "date created",
  "Confirm",
  "Receipt",
];

const posColumns = [
  "S/N",
  "POS name",
  "Terminal ID",
  "Amount paid",
  "Payment date",
  "date created",
  "Confirm",
  "Receipt",
];

const mediaMatch = window.matchMedia("(max-width: 530px)");
const mobile = window.matchMedia("(max-width: 1150px)");

const Payments = (props) => {
  const date = new Date();
  const toString = date.toDateString();
  const [day, year, month] = toString.split(" ");
  const date2 = `${day} ${month} ${year}`;
  const [value, setValue] = React.useState(null);

  const [setLpo] = React.useState(false);
  const user = useSelector((state) => state.auth.user);
  const bank = useSelector((state) => state.payments.bank);
  const pos = useSelector((state) => state.payments.pos);
  const dispatch = useDispatch();
  const [defaultState, setDefault] = useState(0);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [activeButton, setActiveButton] = useState(false);
  const [entries, setEntries] = useState(10);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total1, setTotal1] = useState(0);
  const [setPrints] = useState(false);
  const [loading, setLoading] = useState(false);
  const updateDate = useSelector((state) => state.dailysales.updatedDate);

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
    return user?.permission?.payments[e];
  };

  const openModal = () => {
    setLpo(true);
  };

  const getAllLPOData = useCallback(() => {
    if (oneStationData !== null) {
      if (getPerm("0") || getPerm("1") || user.userType === "superAdmin") {
        const findID = allOutlets.findIndex(
          (data) => data._id === oneStationData._id
        );
        setDefault(findID + 1);
        getAllPayments(oneStationData._id, updateDate, skip);

        return;
      }
    }

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
        getAllPayments(data, updateDate, skip);
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

  const getAllPayments = (stationID, date, skip) => {
    setLoading(true);
    const payload = {
      skip: skip * limit,
      limit: limit,
      outletID: stationID,
      organisationID: resolveUserID().id,
      date: date,
    };

    const bank = RecordPaymentService.getBankPayments(payload);
    const pos = RecordPaymentService.getPOSPayments(payload);

    Promise.all([bank, pos])
      .then((data) => {
        const [bankData, posData] = data;
        setTotal1(bankData.bank.count);
        dispatch(allBankPayment(bankData.bank.bank));
        dispatch(allPosPayment(posData.pos.pos));
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const changeMenu = (index, item) => {
    setDefault(index);
    dispatch(adminOutlet(item));

    const ID = item === null ? "None" : item._id;
    getAllPayments(ID, updateDate, skip);
  };

  const searchTable = (value) => {
    dispatch(searchBankPayment(value));
    dispatch(searchPosPayment(value));
  };

  const printReport = () => {
    setPrints(true);
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    const ID = oneStationData === null ? "None" : oneStationData._id;
    getAllPayments(ID, updateDate, skip);
  };

  const nextPage = () => {
    setSkip((prev) => prev + 1);
    const ID = oneStationData === null ? "None" : oneStationData._id;
    getAllPayments(ID, updateDate, skip + 1);
  };

  const prevPage = () => {
    if (skip < 1) return;
    setSkip((prev) => prev - 1);
    const ID = oneStationData === null ? "None" : oneStationData._id;
    getAllPayments(ID, updateDate, skip - 1);
  };

  const confirmPayment = (data, type) => {
    if (!getPerm("2")) return swal("Warning!", "Permission denied", "info");

    swal({
      title: "Alert!",
      text: "Are you sure you want to confirm this payment?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const payload = {
          type: "bank",
          id: data._id,
          confirmation:
            user.userType === "superAdmin"
              ? user.firstname.concat(" ", user.lastname)
              : user.staffName,
        };

        const payload2 = {
          type: "pos",
          id: data._id,
          confirmation:
            user.userType === "superAdmin"
              ? user.firstname.concat(" ", user.lastname)
              : user.staffName,
        };

        DailySalesService.updateSales(type === "bank" ? payload : payload2)
          .then((data) => {
            const ID = oneStationData === null ? "None" : oneStationData._id;
            getAllPayments(ID, updateDate, skip);
          })
          .then(() => {
            swal("Success", "Record updated successfully", "success");
          });
      }
    });
  };

  const convertDate = (newValue) => {
    const getDate = newValue === "" ? date2 : newValue.format("MM/DD/YYYY");
    const date = new Date(getDate);
    const toString = date.toDateString();
    const [day, year, month] = toString.split(" ");
    const finalDate = `${day} ${month} ${year}`;

    return finalDate;
  };

  const updateDated = (newValue) => {
    // if(!getPerm('4')) return swal("Warning!", "Permission denied", "info");
    setValue(newValue);

    const getDate = newValue === "" ? date2 : newValue.format("YYYY-MM-DD");
    dispatch(setDateValue(getDate));
    dispatch(dateRange([getDate, getDate]));

    const ID = oneStationData === null ? "None" : oneStationData._id;
    getAllPayments(ID, getDate, skip);
  };

  const stationHelper = (id) => {
    getAllPayments(id, updateDate, skip);
  };

  const desktopTableData = {
    columns: bankColumns,
    printReport: printReport,
    allOutlets: bank,
    loading: loading,
    confirmPayment: confirmPayment,
  };

  const mobileTableData = {
    allOutlets: bank,
    loading: loading,
    confirmPayment: confirmPayment,
  };

  const posDesktopTableData = {
    columns: posColumns,
    printReport: printReport,
    allOutlets: pos,
    loading: loading,
    confirmPayment: confirmPayment,
  };

  const posMobileTableData = {
    allOutlets: pos,
    loading: loading,
    confirmPayment: confirmPayment,
  };

  return (
    <React.Fragment>
      <div
        data-aos="zoom-in-down"
        style={{ marginTop: mobile.matches ? "10px" : "auto" }}
        className="paymentsCaontainer">
        {/* { prints && <LPOReport allOutlets={lpos} open={prints} close={setPrints}/>} */}
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
                <MenuItem onClick={openModal} value={20}>
                  Register LPO
                </MenuItem>
                <MenuItem value={30}>Download PDF</MenuItem>
                <MenuItem value={40}>Print</MenuItem>
              </Select>
            </div>
          </div>

          <TableControls>
            <LeftControls>
              <SelectStation
                ml={"0px"}
                oneStation={getPerm("0")}
                allStation={getPerm("1")}
                callback={stationHelper}
              />
              <SearchField ml={"10px"} callback={searchTable} />
            </LeftControls>
            <RightControls>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={1}>
                  <ButtonDatePicker
                    label={`${
                      value == null || "" ? date2 : convertDate(value)
                    }`}
                    value={value}
                    onChange={(newValue) => updateDated(newValue)}
                  />
                </Stack>
              </LocalizationProvider>
            </RightControls>
          </TableControls>

          <TableControls mt={"15px"}>
            <LeftControls>
              <PaymentTypeSwitch
                activeButton={activeButton}
                dispensed={dispensed}
                LPOCompanies={LPOCompanies}
              />
            </LeftControls>
            <RightControls>
              <LimitSelect entries={entries} entriesMenu={entriesMenu} />
              <PrintButton callback={printReport} />
            </RightControls>
          </TableControls>

          {!activeButton ? (
            mobile.matches ? (
              <BankPaymentMobileTable data={mobileTableData} />
            ) : (
              <BankPaymentDesktopTable data={desktopTableData} />
            )
          ) : null}

          {activeButton ? (
            mobile.matches ? (
              <PosPaymentMobileTable data={posMobileTableData} />
            ) : (
              <PosPaymentDesktopTable data={posDesktopTableData} />
            )
          ) : null}

          {/* {activeButton || (
            <div style={{ marginTop: "10px" }} className="table-container">
              <div className="table-head">
                <div className="column">S/N</div>
                <div className="column">Bank Name</div>
                <div className="column">Teller Number</div>
                <div className="column">Amount Paid</div>
                <div className="column">Payment Date</div>
                <div className="column">Date Created</div>
                <div className="column">Confirmed By</div>
                <div className="column">Reciept</div>
              </div>

              <div className="row-container">
                {!loading ? (
                  bank.length === 0 ? (
                    <div style={place}>No Bank Payment Data </div>
                  ) : (
                    bank.map((data, index) => {
                      return (
                        <div className="table-head2">
                          <div className="column">{index + 1}</div>
                          <div className="column">{data.bankName}</div>
                          <div className="column">{data.tellerNumber}</div>
                          <div className="column">{data.amountPaid}</div>
                          <div className="column">{data.paymentDate}</div>
                          <div className="column">
                            {data.createdAt.split("T")[0]}
                          </div>
                          <div className="column">
                            {"confirmation" in data ? (
                              data.confirmation === "null" ? (
                                <Button
                                  sx={{
                                    width: "60px",
                                    height: "30px",
                                    background: "#F36A4C",
                                    borderRadius: "3px",
                                    fontSize: "10px",
                                    textTransform: "capitalize",
                                    "&:hover": {
                                      backgroundColor: "#F36A4C",
                                    },
                                  }}
                                  onClick={() => {
                                    confirmPayment(data, "bank");
                                  }}
                                  variant="contained">
                                  {" "}
                                  Confirm
                                </Button>
                              ) : (
                                <div>{data.confirmation}</div>
                              )
                            ) : (
                              <Button
                                sx={{
                                  width: "60px",
                                  height: "30px",
                                  background: "#F36A4C",
                                  borderRadius: "3px",
                                  fontSize: "10px",
                                  textTransform: "capitalize",
                                  "&:hover": {
                                    backgroundColor: "#F36A4C",
                                  },
                                }}
                                onClick={() => {
                                  confirmPayment(data, "bank");
                                }}
                                variant="contained">
                                {" "}
                                Confirm
                              </Button>
                            )}
                          </div>
                          <div className="column">
                            {data.uploadSlip !== "null" && (
                              <a
                                href={config.BASE_URL + data.uploadSlip}
                                target="_blank"
                                rel="noreferrer">
                                View Slip
                              </a>
                            )}
                            {data.uploadSlip === "null" && (
                              <span>No attachment</span>
                            )}
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
          )} */}

          {/* {activeButton && (
            <div style={{ marginTop: "10px" }} className="table-container">
              <div className="table-head">
                <div className="column">S/N</div>
                <div className="column">POS Name</div>
                <div className="column">Terminal ID</div>
                <div className="column">Amount Paid</div>
                <div className="column">Payment Date</div>
                <div className="column">Date Created</div>
                <div className="column">Confirmed By</div>
                <div className="column">Reciept</div>
              </div>

              <div className="row-container">
                {!loading ? (
                  pos.length === 0 ? (
                    <div style={place}>No POS Payment Data </div>
                  ) : (
                    pos.map((data, index) => {
                      return (
                        <div className="table-head2">
                          <div className="column">{index + 1}</div>
                          <div className="column">{data.posName}</div>
                          <div className="column">{data.terminalID}</div>
                          <div className="column">{data.amountPaid}</div>
                          <div className="column">{data.paymentDate}</div>
                          <div className="column">
                            {data.createdAt.split("T")[0]}
                          </div>
                          <div className="column">
                            {"confirmation" in data ? (
                              data.confirmation === "null" ? (
                                <Button
                                  sx={{
                                    width: "60px",
                                    height: "30px",
                                    background: "#F36A4C",
                                    borderRadius: "3px",
                                    fontSize: "10px",
                                    textTransform: "capitalize",
                                    "&:hover": {
                                      backgroundColor: "#F36A4C",
                                    },
                                  }}
                                  onClick={() => {
                                    confirmPayment(data, "pos");
                                  }}
                                  variant="contained">
                                  {" "}
                                  Confirm
                                </Button>
                              ) : (
                                <div>{data.confirmation}</div>
                              )
                            ) : (
                              <Button
                                sx={{
                                  width: "60px",
                                  height: "30px",
                                  background: "#F36A4C",
                                  borderRadius: "3px",
                                  fontSize: "10px",
                                  textTransform: "capitalize",
                                  "&:hover": {
                                    backgroundColor: "#F36A4C",
                                  },
                                }}
                                onClick={() => {
                                  confirmPayment(data, "pos");
                                }}
                                variant="contained">
                                {" "}
                                Confirm
                              </Button>
                            )}
                          </div>
                          <div className="column">
                            {data.uploadSlip !== "null" && (
                              <a
                                href={config.BASE_URL + data.uploadSlip}
                                target="_blank"
                                rel="noreferrer">
                                View Slip
                              </a>
                            )}
                            {data.uploadSlip === "null" && (
                              <span>No attachment</span>
                            )}
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
          )} */}

          <TableNavigation
            skip={skip}
            limit={limit}
            total={total1}
            setSkip={setSkip}
            updateDate={updateDate}
            callback={getAllPayments}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

const PaymentTypeSwitch = ({ activeButton, dispensed, LPOCompanies }) => {
  let ac = activeButton;
  return (
    <div style={toggle} className="lpo-butt">
      <Button
        sx={{
          ...switchButton,
          background: ac ? "#fff" : "#06805B",
          borderRadius: "27px",
          color: ac ? "#000" : "#fff",
          "&:hover": {
            background: ac ? "#fff" : "#06805B",
          },
        }}
        onClick={dispensed}
        variant="contained">
        {" "}
        Bank Payments
      </Button>
      <Button
        sx={{
          ...switchButton,
          background: ac ? "#06805B" : "#fff",
          borderRadius: "27px",
          color: ac ? "#fff" : "#000",
          "&:hover": {
            background: ac ? "#06805B" : "#fff",
          },
        }}
        onClick={LPOCompanies}
        variant="contained">
        {" "}
        POS payments
      </Button>
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
  fontFamily: "Poppins",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const switchButton = {
  width: "120px",
  height: "30px",
  borderRadius: "27px",
  fontSize: "10px",
  marginRight: "10px",
};

const toggle = {
  marginTop: mobile.matches ? "10px" : "0px",
};

export default Payments;
