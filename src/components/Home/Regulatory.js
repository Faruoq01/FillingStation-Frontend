import React, { useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import PaymentModal from "../Modals/PaymentModal";
import { useDispatch, useSelector } from "react-redux";
import PaymentService from "../../services/paymentService";
import PaymentEditModal from "../Modals/PaymentEditModal";

import { createPayment, searchPayment } from "../../storage/regulatory";
import ViewPayment from "../Modals/ViewPayment";
import RegulatoryReports from "../Reports/RegulatoryReports";
import swal from "sweetalert";
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
  RegulatoryDesktopTable,
  RegulatoryMobileTable,
} from "../tables/regulatory";

const columns = [
  "S/N",
  "Organisation name",
  "Description",
  "Amount",
  "Contact person",
  "Attachment",
  "Payment",
  "Actions",
];

const mobile = window.matchMedia("(max-width: 600px)");

const Regulatory = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const payment = useSelector((state) => state.regulatory.payment);
  const [entries, setEntries] = useState(10);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [prints, setPrints] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [description, setDescription] = useState(false);
  const [loading, setLoading] = useState(false);
  const singleRegulatoryDetails = useSelector(
    (state) => state.regulatory.singlePayment
  );
  const [editPaymentModal, setEditPaymentModal] = useState(false);

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
    return user.permission?.regPay[e];
  };

  const openPaymentModal = () => {
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
    PaymentService.getAllPayment(payload)
      .then((data) => {
        setTotal(data.count);
        dispatch(createPayment(data.pay));
      })
      .then(() => {
        setLoading(false);
      });
  };

  const searchTable = (value) => {
    dispatch(searchPayment(value));
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    refresh("None", "None", skip);
  };

  const printReport = () => {
    if (!getPerm("3")) return swal("Warning!", "Permission denied", "info");
    setPrints(true);
  };

  const viewDescription = (data) => {
    setOpenPayment(true);
    setDescription(data.description);
  };

  const stationHelper = (id) => {
    refresh(id, "None", skip);
  };

  const desktopTableData = {
    columns: columns,
    tablePrints: printReport,
    allOutlets: payment,
    loading: loading,
    setEditPaymentModal: setEditPaymentModal,
    refresh: refresh,
    viewDescription: viewDescription,
  };

  const mobileTableData = {
    allOutlets: payment,
    loading: loading,
    setEditPaymentModal: setEditPaymentModal,
    refresh: refresh,
    viewDescription: viewDescription,
  };

  return (
    <>
      <div data-aos="zoom-in-down" className="paymentsCaontainer">
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
                <MenuItem onClick={openPaymentModal} value={20}>
                  Register Payment
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
              <CreateButton
                callback={openPaymentModal}
                label={"Register Payment"}
              />
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
            <RegulatoryMobileTable data={mobileTableData} />
          ) : (
            <RegulatoryDesktopTable data={desktopTableData} />
          )}

          <TableNavigation
            skip={skip}
            limit={limit}
            total={total}
            setSkip={setSkip}
            updateDate={"None"}
            callback={refresh}
          />
        </div>
      </div>
      {editPaymentModal && (
        <PaymentEditModal
          singleRegulatoryDetails={singleRegulatoryDetails}
          open={editPaymentModal}
          close={setEditPaymentModal}
        />
      )}
      {
        <PaymentModal
          station={oneStationData}
          open={open}
          close={setOpen}
          refresh={refresh}
        />
      }
      {prints && (
        <RegulatoryReports
          allOutlets={payment}
          open={prints}
          close={setPrints}
        />
      )}
      {openPayment && (
        <ViewPayment
          open={openPayment}
          close={setOpenPayment}
          desc={description}
        />
      )}
    </>
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

export default Regulatory;
