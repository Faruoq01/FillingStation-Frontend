import { MenuItem, Select } from "@mui/material";
import "../../styles/payments.scss";
import TablePageBackground from "../controls/PageLayout/TablePageBackground";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import SelectStation from "../common/selectstations";
import { SearchField } from "../common/searchfields";
import { CreateButton, PrintButton } from "../common/buttons";
import TableNavigation from "../controls/PageLayout/TableNavigation";
import { LimitSelect } from "../common/customselect";
import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import SupplyService from "../../services/360station/supplyService";
import { createSupply, searchSupply } from "../../storage/supply";
import IncomingService from "../../services/360station/IncomingService";
import { createIncomingOrder } from "../../storage/incomingOrder";
import OutletService from "../../services/360station/outletService";
import { getAllOutletTanks } from "../../storage/outlet";
import { SupplyDesktopTable, SupplyMobileTable } from "../tables/supply";
import SupplyModal from "../Modals/SupplyModal";
import PrintSupplyRecords from "../Reports/SupplyRecords";
import DateRangeLib from "../common/DatePickerLib";

const columns = [
  "S/N",
  "Date",
  "Transporter",
  "Truck no",
  "Waybill no",
  "Station",
  "Products",
  "Quantity",
  "Shortage",
  "Overage",
  "Actions",
];

const mobile = window.matchMedia("(max-width: 600px)");

const SupplyHome = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);

  const supply = useSelector((state) => state.supply.supply);
  const [prints, setPrints] = useState(false);
  const [entries, setEntries] = useState(10);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [setEditSupply] = useState(false);

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
    return user.permission?.supply[e];
  };

  const openPaymentModal = () => {
    if (!getPerm("2")) return swal("Warning!", "Permission denied", "info");

    if (oneStationData === null) {
      return swal("Warning!", "Please select a station to proceed", "info");
    }
    navigate("/home/supply/createsupply");
  };

  const refresh = (id, date, skip) => {
    setLoading(true);
    const payload = {
      skip: skip * limit,
      limit: limit,
      outletID: id,
      organisationID: resolveUserID().id,
    };

    SupplyService.getAllSupply(payload)
      .then((data) => {
        setTotal(data.count);
        dispatch(createSupply(data.supply));
      })
      .then(() => {
        setLoading(false);
      });

    const income = {
      outletID: id,
      organisationID: resolveUserID().id,
    };

    IncomingService.getAllIncoming3(income).then((data) => {
      setTotal(data.incoming.count);
      dispatch(createIncomingOrder(data.incoming.incoming));
    });

    OutletService.getAllOutletTanks(income).then((data) => {
      dispatch(getAllOutletTanks(data.stations));
    });
  };

  const searchTable = (value) => {
    dispatch(searchSupply(value));
  };

  const printReport = () => {
    if (!getPerm("3")) return swal("Warning!", "Permission denied", "info");
    setPrints(true);
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    refresh("None", "None", "None");
  };

  const stationHelper = (id) => {
    refresh(id, "None", skip);
  };

  const desktopTableData = {
    columns: columns,
    tablePrints: printReport,
    allOutlets: supply,
    loading: loading,
    setEditSupply: setEditSupply,
    refresh: refresh,
  };

  const mobileTableData = {
    allOutlets: supply,
    loading: loading,
    setEditSupply: setEditSupply,
    refresh: refresh,
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
              <MenuItem style={menu} value={10}>
                Action
              </MenuItem>
              <MenuItem style={menu} onClick={openPaymentModal} value={20}>
                Add Supply
              </MenuItem>
              <MenuItem style={menu} value={30}>
                History
              </MenuItem>
              <MenuItem style={menu} onClick={printReport} value={40}>
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
            <CreateButton callback={openPaymentModal} label={"Add Supply"} />
          </RightControls>
        </TableControls>

        <TableControls mt={"10px"}>
          <LeftControls>
            <LimitSelect entries={entries} entriesMenu={entriesMenu} />
          </LeftControls>
          <RightControls>
            <DateRangeLib mt={mobile.matches ? "10px" : "0px"} />
            <PrintButton callback={printReport} />
          </RightControls>
        </TableControls>

        {mobile.matches ? (
          <SupplyMobileTable data={mobileTableData} />
        ) : (
          <SupplyDesktopTable data={desktopTableData} />
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
      {open && (
        <SupplyModal
          station={oneStationData}
          open={open}
          close={setOpen}
          refresh={refresh}
        />
      )}
      {prints && (
        <PrintSupplyRecords
          allOutlets={supply}
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
  fontSize: "12px",
  outline: "none",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const menu = {
  fontSize: "12px",
};

export default SupplyHome;
