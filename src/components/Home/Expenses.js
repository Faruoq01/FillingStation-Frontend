import React, { useCallback, useEffect, useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ExpenseService from "../../services/360station/expense";
import { allExpenses, searchExpenses } from "../../storage/expenses";
import ExpenseReport from "../Reports/ExpenseReport";
import { Stack } from "@mui/material";
import ButtonDatePicker from "../common/CustomDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { setDateValue } from "../../storage/dailysales";
import { dateRange } from "../../storage/dashboard";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import { SearchField } from "../common/searchfields";
import SelectStation from "../common/selectstations";
import { PrintButton } from "../common/buttons";
import { LimitSelect } from "../common/customselect";
import TableNavigation from "../controls/PageLayout/TableNavigation";
import { ExpenseDesktopTable, ExpenseMobileTable } from "../tables/expenses";
import TablePageBackground from "../controls/PageLayout/TablePageBackground";
import ShiftSelect from "../common/shift";

const columns = [
  "S/N",
  "Date Created",
  "Expense Date",
  "Expense Name",
  "Description",
  "Expense Amount",
  "Action",
];

const mobile = window.matchMedia("(max-width: 1150px)");

const Expenses = () => {
  const date = new Date();
  const toString = date.toDateString();
  const [day, year, month] = toString.split(" ");
  const date2 = `${day} ${month} ${year}`;
  const [value, setValue] = React.useState(null);

  const [setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const expense = useSelector((state) => state.expenses.expense);
  const updateDate = useSelector((state) => state.dailysales.updatedDate);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const salesShift = useSelector((state) => state.dailysales.salesShift);
  const [entries, setEntries] = useState(10);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [prints, setPrints] = useState(false);
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
    return user?.permission?.expenses[e];
  };

  const createOrderHandler = () => {
    setOpen(true);
  };

  const getExpenseData = (stationID, date, skip, salesShift) => {
    setLoading(true);
    const payload = {
      skip: skip * limit,
      limit: limit,
      outletID: stationID,
      organisationID: resolveUserID().id,
      date: date,
      shift: salesShift,
    };

    ExpenseService.getAllExpenses(payload)
      .then((data) => {
        setLoading(false);
        setTotal(data.expense.count);
        dispatch(allExpenses(data.expense.expense));
      })
      .then(() => {
        setLoading(false);
      });
  };

  const updateExpenses = useCallback((outlet, salesShift) => {
    getExpenseData(outlet, updateDate, skip, salesShift);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const outlet = oneStationData === null ? "None" : oneStationData._id;
    updateExpenses(outlet, salesShift);
  }, [updateExpenses, oneStationData, salesShift]);

  const searchTable = (value) => {
    dispatch(searchExpenses(value));
  };

  const printReport = () => {
    setPrints(true);
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    const getID = oneStationData === null ? "None" : oneStationData._id;
    getExpenseData(getID, updateDate, skip, salesShift);
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

    const getID = oneStationData === null ? "None" : oneStationData._id;
    getExpenseData(getID, getDate, skip, salesShift);
  };

  const stationHelper = (id) => {
    getExpenseData(id, updateDate, skip, salesShift);
  };

  const desktopTableData = {
    columns: columns,
    tablePrints: printReport,
    allOutlets: expense,
    loading: loading,
  };

  const mobileTableData = {
    allOutlets: expense,
    loading: loading,
  };

  return (
    <TablePageBackground>
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
            <MenuItem value={10}>Actions</MenuItem>
            <MenuItem onClick={createOrderHandler} value={20}>
              Create Order
            </MenuItem>
            <MenuItem value={30}>Download PDF</MenuItem>
            <MenuItem value={40}>Print</MenuItem>
          </Select>
        </div>
      </div>

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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={1}>
              <ButtonDatePicker
                label={`${value == null || "" ? date2 : convertDate(value)}`}
                value={value}
                onChange={(newValue) => updateDated(newValue)}
              />
            </Stack>
          </LocalizationProvider>
        </RightControls>
      </TableControls>

      <TableControls mt={"10px"}>
        <LeftControls>
          <LimitSelect entries={entries} entriesMenu={entriesMenu} />
        </LeftControls>
        <RightControls>
          <PrintButton callback={printReport} />
        </RightControls>
      </TableControls>

      {mobile.matches ? (
        <ExpenseMobileTable data={mobileTableData} />
      ) : (
        <ExpenseDesktopTable data={desktopTableData} />
      )}

      <TableNavigation
        skip={skip}
        limit={limit}
        total={total}
        setSkip={setSkip}
        updateDate={updateDate}
        callback={getExpenseData}
      />
      {prints && (
        <ExpenseReport allOutlets={expense} open={prints} close={setPrints} />
      )}
    </TablePageBackground>
  );
};

const selectStyle2 = {
  width: "100%",
  height: "35px",
  borderRadius: "0px",
  background: "#F2F1F1B2",
  color: "grey",
  fontSize: "12px",
  outline: "none",
  fontFamily: "Poppins",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

export default Expenses;
