import React, { useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import RecordPaymentService from "../../services/360station/recordPayment";
import {
  allBankPayment,
  allPosPayment,
  searchBankPayment,
  searchPosPayment,
} from "../../storage/payment";
import swal from "sweetalert";
import DailySalesService from "../../services/360station/DailySales";
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
import TablePageBackground from "../controls/PageLayout/TablePageBackground";
import { useCallback } from "react";
import { useEffect } from "react";
import ShiftSelect from "../common/shift";
import DateRangeLib from "../common/DatePickerLib";
import GenerateReports from "../Modals/reports";

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

const mobile = window.matchMedia("(max-width: 1150px)");

const Payments = (props) => {
  const [setLpo] = React.useState(false);
  const user = useSelector((state) => state.auth.user);
  const bank = useSelector((state) => state.payments.bank);
  const pos = useSelector((state) => state.payments.pos);
  const [prints, setPrints] = useState(false);
  const dispatch = useDispatch();
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [activeButton, setActiveButton] = useState(false);
  const [entries, setEntries] = useState(10);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total1, setTotal1] = useState(0);
  const [loading, setLoading] = useState(false);
  const updateDate = useSelector((state) => state.dashboard.dateRange);
  const salesShift = useSelector((state) => state.dailysales.salesShift);

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

  const LPOCompanies = () => {
    setActiveButton(true);
  };

  const dispensed = () => {
    setActiveButton(false);
  };

  const getAllPayments = (stationID, date, skip, salesShift) => {
    setLoading(true);
    const payload = {
      skip: skip * limit,
      limit: limit,
      outletID: stationID,
      organisationID: resolveUserID().id,
      date: date,
      shift: salesShift,
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

  const updatePayments = useCallback((outlet, updateDate, salesShift) => {
    getAllPayments(outlet, updateDate, skip, salesShift);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const outlet = oneStationData === null ? "None" : oneStationData._id;
    updatePayments(outlet, updateDate, salesShift);
  }, [updatePayments, oneStationData, salesShift, updateDate]);

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
    getAllPayments(ID, updateDate, skip, salesShift);
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

  const stationHelper = (id) => {
    getAllPayments(id, updateDate, skip, salesShift);
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
      <TablePageBackground>
        <div style={{ marginTop: "10px" }} className="action">
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={10}
            sx={{
              ...selectStyle2,
              backgroundColor: "#06805B",
              color: "#fff",
              marginLeft: "5px",
            }}>
            <MenuItem value={10}>Action</MenuItem>
            <MenuItem onClick={openModal} value={20}>
              Register LPO
            </MenuItem>
            <MenuItem value={30}>Download PDF</MenuItem>
            <MenuItem value={40}>Print</MenuItem>
          </Select>
        </div>

        {mobile.matches || (
          <TableControls>
            <LeftControls>
              <SearchField ml={"0px"} callback={searchTable} />
              <SelectStation
                ml={"10px"}
                oneStation={getPerm("0")}
                allStation={getPerm("1")}
                callback={stationHelper}
              />
              <ShiftSelect ml={"10px"} />
            </LeftControls>
            <RightControls>
              <DateRangeLib mt={mobile.matches ? "10px" : "0px"} />
            </RightControls>
          </TableControls>
        )}

        {mobile.matches || (
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
        )}

        {mobile && (
          <TableControls mt={"10px"}>
            <LeftControls>
              <SelectStation
                ml={"0px"}
                oneStation={getPerm("0")}
                allStation={getPerm("1")}
                callback={stationHelper}
              />
              <ShiftSelect ml={"10px"} />
            </LeftControls>
            <RightControls>
              <DateRangeLib />
            </RightControls>
          </TableControls>
        )}

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

        <TableNavigation
          skip={skip}
          limit={limit}
          total={total1}
          setSkip={setSkip}
          updateDate={updateDate}
          callback={getAllPayments}
          salesShift={salesShift}
        />
      </TablePageBackground>
      {prints && (
        <GenerateReports
          open={prints}
          close={setPrints}
          section={activeButton ? "pos" : "bank"}
          data={activeButton ? pos : bank}
        />
      )}
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
  maxWidth: "150px",
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
