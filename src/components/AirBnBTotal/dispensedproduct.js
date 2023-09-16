import React from "react";
import TablePageBackground from "../controls/PageLayout/TablePageBackground";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import { SearchField } from "../common/searchfields";
import { PrintButton } from "../common/buttons";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import TableNavigation from "../controls/PageLayout/TableNavigation";
import { LimitSelect } from "../common/customselect";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Stack } from "@mui/material";
import ButtonDatePicker from "../common/CustomDatePicker";
import { createLPOSales, setLPOSalesDate } from "../../storage/lpo";
import LPOService from "../../services/360station/lpo";
import { useEffect } from "react";
import {
  DispensedLPODesktopTable,
  DispensedLPOMobileTable,
} from "../tables/dispensedlpo";
import { useCallback } from "react";
import ShiftSelect from "../common/shift";

const mobile = window.matchMedia("(max-width: 600px)");

const columns = [
  "S/N",
  "Date",
  "Product",
  "Litres",
  "Rate",
  "Amount",
  "Station",
];

const ProductsDispensed = () => {
  const date = new Date();
  const toString = date.toDateString();
  const [day, year, month] = toString.split(" ");
  const date2 = `${day} ${month} ${year}`;
  const [value, setValue] = React.useState(null);

  const dispatch = useDispatch();
  const lpos = useSelector((state) => state.lpo.lpoSales);
  const type = useSelector((state) => state.lpo.dispensed);
  const singleLPO = useSelector((state) => state.lpo.singleLPO);
  const currentDate = useSelector((state) => state.lpo.singleDate);
  const salesShift = useSelector((state) => state.dailysales.salesShift);

  const [entries, setEntries] = useState(10);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  //   const [prints, setPrints] = useState(false);

  const getDispensed = useCallback((id, date, skip, salesShift) => {
    refresh(id, date, skip, salesShift);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getDate = currentDate === "" ? date2 : currentDate;
    getDispensed("None", getDate, skip, salesShift);
  }, [getDispensed, currentDate, date2, skip, salesShift]);

  const refresh = (id, date, skip, salesShift) => {
    setLoading(true);

    const payload = {
      skip: skip * limit,
      limit: limit,
      lpoID: singleLPO?._id,
      organisationID: singleLPO?.organizationID,
      productType: type,
      date: date,
      shift: salesShift,
    };

    LPOService.dispensed(payload)
      .then((data) => {
        dispatch(createLPOSales(data.lpo.lpo));
        setTotal(data.lpo.count);
      })
      .then(() => {
        setLoading(false);
      });
  };

  const searchTable = () => {};

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    refresh("None", currentDate, skip, salesShift);
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
    dispatch(setLPOSalesDate(getDate));
    refresh("None", getDate, skip, salesShift);
  };

  const printReport = () => {
    // if (!getPerm("5")) return swal("Warning!", "Permission denied", "info");
    // setPrints(true);
  };

  const desktopTableData = {
    columns: columns,
    tablePrints: printReport,
    allOutlets: lpos,
    loading: loading,
  };

  const mobileTableData = {
    allOutlets: lpos,
    loading: loading,
  };

  return (
    <React.Fragment>
      <TablePageBackground>
        <TableControls>
          <LeftControls>
            <SearchField callback={searchTable} />
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
            <ShiftSelect ml={"10px"} />
          </LeftControls>
          <RightControls>
            <PrintButton />
          </RightControls>
        </TableControls>

        {mobile.matches ? (
          <DispensedLPOMobileTable data={mobileTableData} />
        ) : (
          <DispensedLPODesktopTable data={desktopTableData} />
        )}

        <TableNavigation
          skip={skip}
          limit={limit}
          total={total}
          setSkip={setSkip}
          updateDate={currentDate}
          callback={refresh}
        />
      </TablePageBackground>
    </React.Fragment>
  );
};

export default ProductsDispensed;
