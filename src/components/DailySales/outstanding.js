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
import { PrintButton } from "../common/buttons";
import { LimitSelect } from "../common/customselect";
import TableNavigation from "../controls/PageLayout/TableNavigation";
import TablePageBackground from "../controls/PageLayout/TablePageBackground";
import ShiftSelect from "../common/shift";
import DateRangeLib from "../common/DatePickerLib";
import GenerateReports from "../Modals/reports";
import moment from "moment";
import APIs from "../../services/connections/api";
import { setOutstanding } from "../../storage/dailysales";
import {
  OutstandingDesktopTable,
  OutstandingMobileTable,
} from "../tables/outstanding";

const columns = [
  "S/N",
  "Date Created",
  "Bank payment",
  "POS payment",
  "Net to bank",
  "Outstanding",
];

const mobile = window.matchMedia("(max-width: 1150px)");

const ListOutstanding = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const outData = useSelector((state) => state.dailysales.outstanding);
  const updateDate = useSelector((state) => state.dashboard.dateRange);
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

  const getOutstanding = (stationID, date, skip, salesShift) => {
    setLoading(true);
    const dates = getDatesInRange(date[0], date[1]);
    const range = dates.splice(skip * limit, limit);
    const copyRange = [...range];
    const payload = copyRange.map((data) => {
      return {
        outletID: stationID,
        organisation: resolveUserID().id,
        start: data,
        end: data,
        shift: salesShift,
      };
    });
    setTotal(range.length);

    APIs.post("/daily-sales/outstanding", { data: payload })
      .then(({ data }) => {
        dispatch(setOutstanding(data.outstanding));
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const updateOutstanding = useCallback((outlet, salesShift, updateDate) => {
    getOutstanding(outlet, updateDate, skip, salesShift);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const outlet = oneStationData === null ? "None" : oneStationData._id;
    updateOutstanding(outlet, salesShift, updateDate);
  }, [updateOutstanding, oneStationData, salesShift, updateDate]);

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
    getOutstanding(getID, updateDate, skip, salesShift);
  };

  const stationHelper = (id) => {
    getOutstanding(id, updateDate, skip, salesShift);
  };

  function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = moment(startDate);
    const stopDate = moment(endDate);

    while (currentDate <= stopDate) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.clone().add(1, "days");
    }

    return dates;
  }

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
        <OutstandingMobileTable data={mobileTableData} />
      ) : (
        <OutstandingDesktopTable data={desktopTableData} />
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

export default ListOutstanding;
