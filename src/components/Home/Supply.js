import React, { useState, useEffect, useCallback } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import SupplyModal from "../Modals/SupplyModal";
import { createSupply, searchSupply, singleSupply } from "../../storage/supply";
import SupplyService from "../../services/supplyService";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import OutletService from "../../services/outletService";
import {
  adminOutlet,
  getAllOutletTanks,
  getAllStations,
} from "../../storage/outlet";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { OutlinedInput } from "@mui/material";
import PrintSupplyRecords from "../Reports/SupplyRecords";
import { Route, Switch, useHistory } from "react-router-dom";
import CreateSupply from "../Supply/CreateSupply";
import swal from "sweetalert";
import IncomingService from "../../services/IncomingService";
import { createIncomingOrder } from "../../storage/incomingOrder";
import { ThreeDots } from "react-loader-spinner";
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
import { SupplyDesktopTable, SupplyMobileTable } from "../tables/supply";

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

const mediaMatch = window.matchMedia("(max-width: 530px)");
const mobile = window.matchMedia("(max-width: 600px)");

const Supply = (props) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const [defaultState, setDefault] = useState(0);
  const user = useSelector((state) => state.auth.user);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);

  const supply = useSelector((state) => state.supply.supply);
  const [prints, setPrints] = useState(false);
  const [entries, setEntries] = useState(10);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editSupply, setEditSupply] = useState(false);

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
    history.push("/home/supply/create");
  };

  const handleNavigateToEditSupply = () => {
    if (!getPerm("2")) return swal("Warning!", "Permission denied", "info");

    if (oneStationData === null) {
      return swal("Warning!", "Please select a station to proceed", "info");
    }
    history.push("/home/supply/edit");
  };

  const getAllSupplyData = useCallback(() => {
    if (oneStationData !== null) {
      if (getPerm("0") || getPerm("1") || user.userType === "superAdmin") {
        const findID = allOutlets.findIndex(
          (data) => data._id === oneStationData._id
        );
        setDefault(findID + 1);

        const payload = {
          skip: skip * limit,
          limit: limit,
          outletID: oneStationData._id,
          organisationID: resolveUserID().id,
        };

        SupplyService.getAllSupply(payload).then((data) => {
          setLoading(false);
          setTotal(data.count);
          dispatch(createSupply(data.supply));
        });

        const payload2 = {
          organisationID: resolveUserID().id,
          outletID: oneStationData._id,
        };

        OutletService.getAllOutletTanks(payload2).then((data) => {
          dispatch(getAllOutletTanks(data.stations));
        });

        return;
      }
    }

    const payload = {
      organisation: resolveUserID().id,
    };

    setLoading(true);
    OutletService.getAllOutletStations(payload)
      .then((data) => {
        dispatch(getAllStations(data.station));
        if (
          (getPerm("0") || user.userType === "superAdmin") &&
          oneStationData === null
        ) {
          if (!getPerm("1")) setDefault(1);
          dispatch(adminOutlet(null));
          return "None";
        } else {
          OutletService.getOneOutletStation({ outletID: user.outletID }).then(
            (data) => {
              dispatch(adminOutlet(data.station));
            }
          );

          return user.outletID;
        }
      })
      .then((data) => {
        const payload = {
          skip: skip * limit,
          limit: limit,
          outletID: data,
          organisationID: resolveUserID().id,
        };

        SupplyService.getAllSupply(payload).then((data) => {
          setLoading(false);
          setTotal(data.count);
          dispatch(createSupply(data.supply));
        });

        const payload2 = {
          organisationID: resolveUserID().id,
          outletID: data,
        };
        OutletService.getAllOutletTanks(payload2).then((data) => {
          dispatch(getAllOutletTanks(data.stations));
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllSupplyData();
  }, [getAllSupplyData]);

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

  const changeMenu = (index, item) => {
    if (!getPerm("1") && item === null)
      return swal("Warning!", "Permission denied", "info");
    setLoading(true);
    setDefault(index);
    dispatch(adminOutlet(item));

    const payload = {
      skip: skip * limit,
      limit: limit,
      outletID: item._id,
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
      outletID: item._id,
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

  const nextPage = () => {
    setSkip((prev) => prev + 1);
    refresh("None", "None", skip + 1);
  };

  const prevPage = () => {
    if (skip < 1) return;
    setSkip((prev) => prev - 1);
    refresh("None", "None", skip - 1);
  };

  const goToHistory = () => {
    history.push("/home/history");
  };
  const handleDelete = () => {};

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
      )}

      {props.activeRoute.split("/").length === 4 && (
        <div style={{ width: "100%", marginTop: "30px" }}>
          <Switch>
            <Route path="/home/supply/create">
              <CreateSupply refresh={refresh} history={props.history} />
            </Route>
          </Switch>
        </div>
      )}
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

const place = {
  width: "100%",
  textAlign: "center",
  fontSize: "12px",
  marginTop: "20px",
  color: "green",
};

const menu = {
  fontSize: "12px",
};

const load = {
  width: "100%",
  height: "30px",
  display: "flex",
  justifyContent: "center",
};
const styles = {
  icons: {
    cursor: "pointer",
    color: "#fff",
    padding: 2,
    backgroundColor: "#06805b",
    borderRadius: "100%",
  },
};
export default Supply;
