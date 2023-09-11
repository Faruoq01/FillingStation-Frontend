import React, { useCallback } from "react";
import "../../styles/payments.scss";
import { useSelector } from "react-redux";
import { openModal, getAllStations } from "../../storage/outlet";
import { useDispatch } from "react-redux";
import OutletService from "../../services/360station/outletService";
import { useEffect } from "react";
import { useState } from "react";
import swal from "sweetalert";
import TablePageBackground from "../controls/PageLayout/TablePageBackground";
import TableNavigation from "../controls/PageLayout/TableNavigation";
import CardItem from "../Outlet/CardItem";
import { OutletDesktopTable, OutletMobileTable } from "../tables/outlet";
import CreateStation from "../Modals/outlet/createstationmodal";
import CreateStationAssets from "../Modals/outlet/stationsuccess";
import { Action } from "../tables/outlet/tableactions";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import { CreateButton, PrintButton } from "../common/buttons";
import { SearchField } from "../common/searchfields";
import { LimitSelect } from "../common/customselect";
import OutletGridSwitch from "../common/outletgrid";
import MobileMenuListing from "../common/mobilemenulist";
import { useLocation } from "react-router-dom";
import GenerateReports from "../Modals/reports";

const mobile = window.matchMedia("(max-width: 600px)");

const columns = [
  "S/N",
  "State",
  "Name",
  "Outlet Code",
  "No Of Tanks",
  "No Of Pumps",
  "Alias",
  "City",
  "Actions",
];

const OutletHome = (props) => {
  const open = useSelector((state) => state.outlet.openModal);
  const user = useSelector((state) => state.auth.user);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const dispatch = useDispatch();
  const [prints, setPrints] = useState(false);
  const [switchTabs, setSwitchTabs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [entries, setEntries] = useState(10);
  const { pathname } = useLocation();
  const [routes, setRoutes] = useState("");

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
    return user.permission?.myStation[e];
  };

  const handleOpenModal = (value) => {
    if (!getPerm("0")) return swal("Warning!", "Permission denied", "info");
    dispatch(openModal(value));
  };

  const getAllStationData = useCallback(() => {
    setLoading(true);
    const payload = {
      organisation: resolveUserID().id,
    };
    OutletService.getAllOutletStations(payload)
      .then((data) => {
        dispatch(getAllStations(data.station));
      })
      .then(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    getAllStationData();
  }, [getAllStationData, routes]);

  useEffect(() => {
    const route = pathname.split("/")[2];
    setRoutes(route);
  }, [pathname]);

  const preview = () => {
    setPrints(true);
  };

  const changeSwitch = () => {
    setSwitchTabs(!switchTabs);
  };

  const getStations = (data) => {
    // const stationsCopy = [...data];
    // if (searchKey === "") {
    //   return stationsCopy;
    // } else {
    //   const search = stationsCopy.filter(
    //     (data) =>
    //       !data.outletName.toUpperCase().indexOf(searchKey.toUpperCase()) ||
    //       !data.alias.toUpperCase().indexOf(searchKey.toUpperCase()) ||
    //       !data.city.toUpperCase().indexOf(searchKey.toUpperCase())
    //   );
    //   return search;
    // }
  };

  const desktopTableData = {
    columns: columns,
    allOutlets: allOutlets,
    loading: loading,
    Action: Action,
  };

  const mobileTableData = {
    allOutlets: allOutlets,
    loading: loading,
    Action: Action,
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    // setLimit(limit);
    // const getID = oneStationData === null ? "None" : oneStationData._id;
    // getExpenseData(getID, updateDate, skip);
  };

  return (
    <React.Fragment>
      <TablePageBackground>
        <MobileMenuListing
          callback={handleOpenModal}
          preview={preview}
          print={() => {}}
          label={"Create Station"}
        />

        <TableControls>
          <LeftControls>
            <SearchField callback={getStations} />
          </LeftControls>
          <RightControls>
            <CreateButton
              callback={handleOpenModal}
              label={"Create new filling station"}
            />
          </RightControls>
        </TableControls>

        <TableControls mt={"15px"}>
          <LeftControls>
            <LimitSelect entries={entries} entriesMenu={entriesMenu} />
          </LeftControls>
          <RightControls>
            <OutletGridSwitch switchTabs={switchTabs} callback={changeSwitch} />
            <PrintButton callback={preview} />
          </RightControls>
        </TableControls>

        {!switchTabs ? (
          mobile.matches ? (
            <OutletMobileTable data={mobileTableData} />
          ) : (
            <OutletDesktopTable data={desktopTableData} />
          )
        ) : (
          <div className="gridCard">
            {allOutlets.length === 0 ? (
              <div style={place}>No data</div>
            ) : (
              allOutlets.map((item, index) => {
                return <CardItem data={item} index={index} />;
              })
            )}
          </div>
        )}

        <TableNavigation
          skip={skip}
          limit={15}
          total={100}
          setSkip={setSkip}
          updateDate={"None"}
          callback={() => {}}
        />
      </TablePageBackground>

      {prints && (
        <GenerateReports open={prints} close={setPrints} section={"station"} />
      )}
      {open === 1 && <CreateStation getStations={getAllStationData} />}
      {open === 2 && <CreateStationAssets />}
    </React.Fragment>
  );
};

const place = {
  width: "100%",
  textAlign: "center",
  fontSize: "12px",
  marginTop: "20px",
  color: "green",
};

export default OutletHome;
