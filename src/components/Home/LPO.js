import React, { useEffect, useCallback, useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import LPOModal from "../Modals/LPOModal";
import LPOService from "../../services/lpo";
import { useSelector } from "react-redux";
import { createLPO, searchLPO, singleLPORecord } from "../../storage/lpo";
import { useDispatch } from "react-redux";
import LPORateModal from "../Modals/SetLPORate";
import LPOReport from "../Reports/LpoReport";
import swal from "sweetalert";
import LPOEditOptions from "../Modals/LPOEditOptions";
import LPOModalEdit from "../Modals/LPOModalEdit";
import TablePageBackground from "../controls/PageLayout/TablePageBackground";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import { SearchField } from "../common/searchfields";
import { CreateButton, PrintButton } from "../common/buttons";
import { LimitSelect } from "../common/customselect";
import TableNavigation from "../controls/PageLayout/TableNavigation";
import { LPODesktopTable, LPOMobileTable } from "../tables/lpo";

const columns = [
  "S/N",
  "Company name",
  "Address",
  "Person of contact",
  "Current balance",
  "Payment Structure",
  "Action",
];

const mobile = window.matchMedia("(max-width: 600px)");

const LPO = (props) => {
  const [lpoModalEditStatus, setLpoModalEditStatus] = React.useState(false);
  const [lpo, setLpo] = React.useState(false);
  const user = useSelector((state) => state.auth.user);
  const lpos = useSelector((state) => state.lpo.lpo);
  const dispatch = useDispatch();
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [entries, setEntries] = useState(10);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [prints, setPrints] = useState(false);
  const [priceModal, setPriceModal] = useState(false);
  const [editOptionModal, setEditOptionsModal] = useState(false);
  const [loading, setLoading] = useState(true);

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
    return user.permission?.corporateSales[e];
  };

  const openModal = () => {
    if (!getPerm("2")) return swal("Warning!", "Permission denied", "info");
    setLpo(true);
  };

  const getAllLPOData = useCallback(() => {
    setLoading(true);

    const payload = {
      skip: skip * limit,
      limit: limit,
      organisationID: resolveUserID().id,
    };

    LPOService.getAllLPO(payload).then((data) => {
      setLoading(false);
      setTotal(data.lpo.count);
      dispatch(createLPO(data.lpo.lpo));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllLPOData();
  }, [getAllLPOData]);

  const refresh = (id, updateDate, skip) => {
    setLoading(true);
    const payload = {
      skip: skip * limit,
      limit: limit,
      outletID: id,
      organisationID: resolveUserID().id,
    };

    LPOService.getAllLPO(payload)
      .then((data) => {
        setTotal(data.lpo.count);
        dispatch(createLPO(data.lpo.lpo));
      })
      .then(() => {
        setLoading(false);
      });
  };

  const searchTable = (value) => {
    dispatch(searchLPO(value));
  };

  const printReport = () => {
    if (!getPerm("5")) return swal("Warning!", "Permission denied", "info");
    setPrints(true);
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    refresh("None", "None", skip);
  };

  const handleEditDetailsModal = () => {
    setEditOptionsModal(!editOptionModal);
    if (!getPerm("4")) return swal("Warning!", "Permission denied", "info");

    setLpoModalEditStatus(!lpoModalEditStatus);
  };

  const handleEditRateModal = (data) => {
    setEditOptionsModal(!editOptionModal);
    if (!getPerm("4")) return swal("Warning!", "Permission denied", "info");
    dispatch(singleLPORecord(data));
    setPriceModal(true);
  };

  const desktopTableData = {
    columns: columns,
    tablePrints: printReport,
    allOutlets: lpos,
    loading: loading,
    setEditOptionsModal: setEditOptionsModal,
  };

  const mobileTableData = {
    allOutlets: lpos,
    loading: loading,
    setEditOptionsModal: setEditOptionsModal,
  };

  return (
    <React.Fragment>
      {props.activeRoute.split("/").length === 3 && (
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
                <MenuItem onClick={openModal} value={20}>
                  Register LPO
                </MenuItem>
                <MenuItem value={30}>Download PDF</MenuItem>
                <MenuItem value={40}>Print</MenuItem>
              </Select>
            </div>
          </div>

          <TableControls>
            <LeftControls>
              <SearchField callback={searchTable} />
            </LeftControls>
            <RightControls>
              <CreateButton callback={openModal} label={"Register LPO"} />
            </RightControls>
          </TableControls>

          <TableControls mt={"10px"}>
            <LeftControls></LeftControls>
            <RightControls>
              <LimitSelect entries={entries} entriesMenu={entriesMenu} />
              <PrintButton callback={printReport} />
            </RightControls>
          </TableControls>

          {mobile.matches ? (
            <LPOMobileTable data={mobileTableData} />
          ) : (
            <LPODesktopTable data={desktopTableData} />
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
      )}
      {/* {props.activeRoute.split("/").length === 4 && (
        <Switch>
          <Route path="/home/lpo/list">
            <ListLPO />
          </Route>
          <Route path="/home/lpo/company">
            <CompanyLPO />
          </Route>
        </Switch>
      )} */}
      <LPOModalEdit
        refresh={refresh}
        close={setLpoModalEditStatus}
        open={lpoModalEditStatus}
      />
      <LPOEditOptions
        handleEditDetails={handleEditDetailsModal}
        handleEditRate={handleEditRateModal}
        close={setEditOptionsModal}
        open={editOptionModal}
      />
      {
        <LPOModal
          station={oneStationData}
          open={lpo}
          close={setLpo}
          refresh={refresh}
        />
      }
      {
        <LPORateModal
          station={oneStationData}
          open={priceModal}
          close={setPriceModal}
          refresh={refresh}
        />
      }
      {prints && (
        <LPOReport allOutlets={lpos} open={prints} close={setPrints} />
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

export default LPO;
