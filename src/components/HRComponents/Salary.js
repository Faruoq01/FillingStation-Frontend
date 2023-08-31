import React, { useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import SalaryModal from "../Modals/SalaryModal";
import SalaryService from "../../services/salary";
import { createSalary, searchSalary } from "../../storage/salary";
import { useDispatch, useSelector } from "react-redux";
import UpdateSalary from "../Modals/UpdateSalary";
import swal from "sweetalert";
import SalaryReports from "../Reports/SalaryReport";
import TablePageBackground from "../controls/PageLayout/TablePageBackground";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import SelectStation from "../common/selectstations";
import { SearchField } from "../common/searchfields";
import { CreateButton, PrintButton } from "../common/buttons";
import { LimitSelect } from "../common/customselect";
import TableNavigation from "../controls/PageLayout/TableNavigation";
import { SalaryDesktopTable, SalaryMobileTable } from "../tables/salary";

const columns = ["S/N", "Position", "Level", "Salary range", "Actions"];

const mobile = window.matchMedia("(max-width: 600px)");

const Salary = () => {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const salaryData = useSelector((state) => state.salary.salary);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [currentSalary, setCurrentSalary] = useState(false);
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
    return user.permission?.hr[e];
  };

  const openSalaryModal = () => {
    if (!getPerm("7")) return swal("Warning!", "Permission denied", "info");

    if (oneStationData === null) {
      swal("Warning!", "Please select a station first", "info");
    } else {
      setOpen(true);
    }
  };

  const refresh = (id, date, skip) => {
    setLoading(true);
    const payload = {
      skip: skip * limit,
      limit: limit,
      outletID: oneStationData === null ? "None" : oneStationData?._id,
      organisationID: resolveUserID().id,
    };
    SalaryService.allSalaryRecords(payload)
      .then((data) => {
        setTotal(data.salary.count);
        dispatch(createSalary(data.salary.salary));
      })
      .then(() => {
        setLoading(false);
      });
  };

  const searchTable = (value) => {
    dispatch(searchSalary(value));
  };

  const updateSalary = (item) => {
    setOpen2(true);
    setCurrentSalary(item);
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    refresh("None", "None", skip);
  };

  const printReport = () => {
    if (!getPerm("8")) return swal("Warning!", "Permission denied", "info");
    setPrints(true);
  };

  const stationHelper = (id) => {
    refresh(id, "None", skip);
  };

  const desktopTableData = {
    columns: columns,
    tablePrints: printReport,
    allOutlets: salaryData,
    loading: loading,
    refresh: refresh,
    updateSalary: updateSalary,
  };

  const mobileTableData = {
    allOutlets: salaryData,
    loading: loading,
    refresh: refresh,
    updateSalary: updateSalary,
  };

  return (
    <React.Fragment>
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
              <MenuItem value={10}>Action</MenuItem>
              <MenuItem onClick={openSalaryModal} value={20}>
                Add Salary
              </MenuItem>
              <MenuItem value={30}>History</MenuItem>
              <MenuItem onClick={printReport} value={40}>
                Print
              </MenuItem>
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
            <CreateButton callback={openSalaryModal} label={"Add Salary"} />
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
          <SalaryMobileTable data={mobileTableData} />
        ) : (
          <SalaryDesktopTable data={desktopTableData} />
        )}

        <TableNavigation
          skip={skip}
          limit={limit}
          total={total}
          setSkip={setSkip}
          updateDate={"None"}
          callback={refresh}
        />
      </TablePageBackground>
      {
        <SalaryModal
          station={oneStationData}
          open={open}
          close={setOpen}
          refresh={refresh}
        />
      }
      {
        <UpdateSalary
          open={open2}
          id={currentSalary}
          close={setOpen2}
          refresh={refresh}
        />
      }
      {prints && (
        <SalaryReports
          allOutlets={salaryData}
          open={prints}
          close={setPrints}
        />
      )}
    </React.Fragment>
  );
};

const selectStyle2 = {
  width: "100%",
  height: "35px",
  borderRadius: "0px",
  background: "#F2F1F1B2",
  color: "#000",
  fontSize: "13px",
  outline: "none",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

export default Salary;
