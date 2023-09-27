import React, { useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import OutletService from "../../services/360station/outletService";
import { getAllOutletTanks } from "../../storage/outlet";
import swal from "sweetalert";
import TablePageBackground from "../controls/PageLayout/TablePageBackground";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import SelectStation from "../common/selectstations";
import { SearchField } from "../common/searchfields";
import { LimitSelect } from "../common/customselect";
import TableNavigation from "../controls/PageLayout/TableNavigation";
import {
  TankUpdateDesktopTable,
  TankUpdateMobileTable,
} from "../tables/tankupdate";

const columns = [
  "S/N",
  "Date",
  "Tank name",
  "Tank Product",
  "Station",
  "Previous level",
  "Quantity added",
  "Updated level",
];

const mobile = window.matchMedia("(max-width: 600px)");

const TankUpdate = () => {
  const [setOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const tankList = useSelector((state) => state.outlet.tankList);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [entries, setEntries] = useState(10);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [setPrints] = useState(false);
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
    return user.permission?.tankUpdate[e];
  };

  const updateTankModal = () => {
    if (!getPerm("2")) return swal("Warning!", "Permission denied", "info");

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
      outletID: id,
      organisationID: resolveUserID().id,
    };
    OutletService.getAllOutletTanks(payload)
      .then((data) => {
        setTotal(data.count);
        dispatch(getAllOutletTanks(data.stations));
      })
      .then(() => {
        setLoading(false);
      });
  };

  const searchTable = (value) => {
    // dispatch(searchTanks(value));
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    refresh("None", "None", skip);
  };

  const printReport = () => {
    if (!getPerm("2")) return swal("Warning!", "Permission denied", "info");
    setPrints(true);
  };

  const stationHelper = (id) => {
    refresh(id, "None", skip);
  };

  const desktopTableData = {
    columns: columns,
    tablePrints: printReport,
    allOutlets: tankList,
    loading: loading,
  };

  const mobileTableData = {
    allOutlets: tankList,
    loading: loading,
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
              <MenuItem onClick={updateTankModal} value={20}>
                Update Tank
              </MenuItem>
              <MenuItem value={30}>Download PDF</MenuItem>
              <MenuItem value={40}>Print</MenuItem>
            </Select>
          </div>
        </div>

        <TableControls>
          <LeftControls>
            <LimitSelect entries={entries} entriesMenu={entriesMenu} />
            <SearchField ml={"10px"} callback={searchTable} />
          </LeftControls>
          <RightControls>
            <SelectStation
              ml={"0px"}
              oneStation={getPerm("0")}
              allStation={getPerm("1")}
              callback={stationHelper}
            />
          </RightControls>
        </TableControls>

        {mobile.matches ? (
          <TankUpdateMobileTable data={mobileTableData} />
        ) : (
          <TankUpdateDesktopTable data={desktopTableData} />
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

export default TankUpdate;
