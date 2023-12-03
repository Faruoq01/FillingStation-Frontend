import React, { useState, Fragment } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IncomingOrderModal from "../Modals/incoming/IncomingOrderModal";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  createIncomingOrder,
  searchIncoming,
} from "../../storage/incomingOrder";
import IncomingService from "../../services/360station/IncomingService";
import swal from "sweetalert";
import IncomingOrderEditModal from "../Modals/incoming/IncomingOrderEditModal";
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
import {
  IncomingOrderDesktopTable,
  IncomingOrderMobileTable,
} from "../tables/incomingorder";
import DateRangeLib from "../common/DatePickerLib";
import { useEffect } from "react";
import { useCallback } from "react";
import GenerateReports from "../Modals/reports";

const columns = [
  "S/N",
  "Date created",
  "Depot station",
  "Discharge station",
  "Products",
  "Quantity",
  "Truck no",
  "Waybill no",
  "Delivery status",
  "Actions",
];

const mobile = window.matchMedia("(max-width: 600px)");

const AllocatedOrder = () => {
  const user = useSelector((state) => state.auth.user);
  const incomingOrder = useSelector(
    (state) => state.incomingorder.incomingOrder
  );
  const [incomingOrderEditModal, setIncomingOrderEditModal] = useState(false);
  const dispatch = useDispatch();
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [entries, setEntries] = useState(10);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [prints, setPrints] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const updateDate = useSelector((state) => state.dashboard.dateRange);
  const [openAllocated, setOpenAllocated] = useState(false);

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
    return user.permission?.incomingOrder[e];
  };

  const getIncomingOrder = useCallback((outletID, updateDate, skip) => {
    refresh(outletID, updateDate, skip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const outletID = oneStationData === null ? "None" : oneStationData._id;
    getIncomingOrder(outletID, updateDate, skip);
  }, [getIncomingOrder, updateDate, skip, oneStationData]);

  const openCreateModal = () => {
    if (!getPerm("2")) return swal("Warning!", "Permission denied", "info");
    setOpen(true);
  };

  const refresh = (id, date, skip, limit = 15) => {
    setLoading(true);
    const payload = {
      skip: skip * limit,
      limit: limit,
      outletID: id,
      organisationID: resolveUserID().id,
      date: date,
    };

    IncomingService.getAllIncoming(payload)
      .then((data) => {
        setTotal(data.incoming.count);
        dispatch(createIncomingOrder(data.incoming.incoming));
      })
      .then(() => {
        setLoading(false);
      });
  };

  const searchTable = (value) => {
    dispatch(searchIncoming(value));
  };

  const printReport = () => {
    if (!getPerm("3")) return swal("Warning!", "Permission denied", "info");
    setPrints(true);
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    const outletID = oneStationData === null ? "None" : oneStationData._id;
    refresh(outletID, updateDate, skip, limit);
  };

  const stationHelper = (id) => {
    refresh(id, updateDate, skip);
  };

  const desktopTableData = {
    columns: columns,
    tablePrints: printReport,
    allOutlets: incomingOrder,
    loading: loading,
    setIncomingOrderEditModal: setIncomingOrderEditModal,
    refresh: refresh,
    skip: skip,
  };

  const mobileTableData = {
    allOutlets: incomingOrder,
    loading: loading,
    setIncomingOrderEditModal: setIncomingOrderEditModal,
    refresh: refresh,
    skip: skip,
  };

  return (
    <Fragment>
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
              marginRight: "5px",
            }}>
            <MenuItem value={10}>Action</MenuItem>
            <MenuItem onClick={openCreateModal} value={20}>
              Create Incoming Order
            </MenuItem>
            <MenuItem value={30}>Download PDF</MenuItem>
            <MenuItem value={40}>Print</MenuItem>
          </Select>
        </div>

        {mobile.matches || (
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
              <CreateButton
                callback={openCreateModal}
                label={"Create Incoming Order"}
              />
            </RightControls>
          </TableControls>
        )}

        {mobile.matches || (
          <TableControls mt={"10px"}>
            <LeftControls>
              <LimitSelect entries={entries} entriesMenu={entriesMenu} />
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
              <DateRangeLib disabled={!getPerm("6")} />
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
          <IncomingOrderMobileTable data={mobileTableData} />
        ) : (
          <IncomingOrderDesktopTable data={desktopTableData} />
        )}

        <TableNavigation
          skip={skip}
          limit={limit}
          total={total}
          setSkip={setSkip}
          updateDate={updateDate}
          callback={refresh}
        />
      </TablePageBackground>

      {incomingOrderEditModal && (
        <IncomingOrderEditModal
          open={incomingOrderEditModal}
          close={setIncomingOrderEditModal}
          skip={skip}
          refresh={refresh}
        />
      )}
      {openAllocated &&
        <IncomingOrderModal
          open={openAllocated}
          closeup={setOpenAllocated}
          skip={skip}
          refresh={refresh}
        />
      }
      {prints && (
        <GenerateReports
          open={prints}
          close={setPrints}
          section={"incoming"}
          data={incomingOrder}
        />
      )}
    </Fragment>
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

export default AllocatedOrder;
