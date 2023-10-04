import React, { useCallback, useEffect, useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import { SearchField } from "../common/searchfields";
import SelectStation from "../common/selectstations";
// import { PrintButton } from "../common/buttons";
import { LimitSelect } from "../common/customselect";
import TableNavigation from "../controls/PageLayout/TableNavigation";
import TablePageBackground from "../controls/PageLayout/TablePageBackground";
import ShiftSelect from "../common/shift";
import DateRangeLib from "../common/DatePickerLib";
import GenerateReports from "../Modals/reports";
import APIs from "../../services/connections/api";
import { setSalesList } from "../../storage/dashboard";
import {
  SalesListDesktopTable,
  SalesListMobileTable,
} from "../tables/saleslist";

const columns = [
  "S/N",
  "Date Created",
  "Station",
  "Pump Name",
  "Product",
  "Sales",
  "Amount",
];

const mobile = window.matchMedia("(max-width: 1150px)");

const ListSales = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const outData = useSelector((state) => state.dashboard.saleslist);
  const updateDate = useSelector((state) => state.dashboard.dateRange);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const salesShift = useSelector((state) => state.dailysales.salesShift);
  const salesType = useSelector((state) => state.dashboard.salesType);
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

  const getOutstanding = (stationID, date, skip, salesShift, limit = 15) => {
    setLoading(true);
    const payload = {
      outletID: stationID,
      organisation: resolveUserID().id,
      date: date,
      shift: salesShift,
      productType: salesType,
      skip: skip * limit,
      limit: limit,
    };

    APIs.post("/dashboard/salesList", payload)
      .then(({ data }) => {
        dispatch(setSalesList(data.sales));
        setTotal(data.counts);
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const updateSalesList = useCallback((outlet, salesShift, updateDate) => {
    getOutstanding(outlet, updateDate, skip, salesShift);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const outlet = oneStationData === null ? "None" : oneStationData._id;
    updateSalesList(outlet, salesShift, updateDate);
  }, [updateSalesList, oneStationData, salesShift, updateDate]);

  const searchTable = (value) => {
    // dispatch(searchExpenses(value));
  };

  const printReport = () => {
    setPrints(true);
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    const getID = oneStationData === null ? "None" : oneStationData._id;
    getOutstanding(getID, updateDate, skip, salesShift, limit);
  };

  const stationHelper = (id) => {
    getOutstanding(id, updateDate, skip, salesShift);
  };

  const desktopTableData = {
    columns: columns,
    tablePrints: printReport,
    allOutlets: outData,
    loading: loading,
  };

  const mobileTableData = {
    allOutlets: outData,
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
        </LeftControls>
        <RightControls>
          <ShiftSelect ml={"10px"} />
        </RightControls>
      </TableControls>

      <TableControls mt={"10px"}>
        <LeftControls>
          <LimitSelect entries={entries} entriesMenu={entriesMenu} />
        </LeftControls>
        <RightControls>
          <DateRangeLib mt={mobile.matches ? "10px" : "0px"} />
          {/* <PrintButton callback={printReport} /> */}
        </RightControls>
      </TableControls>

      {mobile.matches ? (
        <SalesListMobileTable data={mobileTableData} />
      ) : (
        <SalesListDesktopTable data={desktopTableData} />
      )}

      <TableNavigation
        skip={skip}
        limit={limit}
        total={total}
        setSkip={setSkip}
        updateDate={updateDate}
        callback={getOutstanding}
        salesShift={salesShift}
      />
      {prints && (
        <GenerateReports
          open={prints}
          close={setPrints}
          section={"outstanding"}
          data={outData}
        />
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

export default ListSales;
