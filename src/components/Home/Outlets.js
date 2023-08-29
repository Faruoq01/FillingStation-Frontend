import React, { useCallback, useRef } from "react";
import "../../styles/payments.scss";
import { useSelector } from "react-redux";
import { openModal, getAllStations, tankListType } from "../../storage/outlet";
import { useDispatch } from "react-redux";
import Tank from "../Outlet/Tanks";
import Pumps from "../Outlet/Pumps";
import Sales from "../Outlet/Sales";
import { Switch, Route, useHistory } from "react-router-dom";
import OutletService from "../../services/outletService";
import { useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import PrintOutLetsModal from "../Modals/PrintOutlets";
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
import { CreateButton, HistoryButton, PrintButton } from "../common/buttons";
import { SearchField } from "../common/searchfields";
import { LimitSelect } from "../common/customselect";
import OutletGridSwitch from "../common/outletgrid";
import MobileMenuListing from "../common/mobilemenulist";

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

const Outlets = (props) => {
  const history = useHistory();
  const open = useSelector((state) => state.outlet.openModal);
  const user = useSelector((state) => state.auth.user);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const dispatch = useDispatch();
  const [prints, setPrints] = useState(false);
  const tablePrints = useRef();
  const [switchTabs, setSwitchTabs] = useState(false);
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
    return user.permission?.myStation[e];
  };

  const handleOpenModal = (value) => {
    if (!getPerm("0")) return swal("Warning!", "Permission denied", "info");
    dispatch(openModal(value));
  };

  const goToTankList = (item) => {
    dispatch(tankListType(item));
    props.history.push("/home/tankList");
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
  }, [getAllStationData]);

  const printTable = () => {
    const input = tablePrints.current;
    html2canvas(input).then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imageData, "PNG", 5, 5);
      pdf.save("download.pdf");
    });
  };

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

  const goToHistory = () => {
    history.push("/home/history");
  };

  const desktopTableData = {
    columns: columns,
    tablePrints: tablePrints,
    allOutlets: allOutlets,
    loading: loading,
    Action: Action,
  };

  const mobileTableData = {
    allOutlets: allOutlets,
    loading: loading,
    Action: Action,
  };

  return (
    <>
      {props.activeRoute.split("/").length === 3 && (
        <TablePageBackground>
          {open === 1 && <CreateStation getStations={getAllStationData} />}
          {open === 2 && <CreateStationAssets />}
          {prints && (
            <PrintOutLetsModal
              allOutlets={allOutlets}
              open={prints}
              close={setPrints}
            />
          )}
          <MobileMenuListing
            callback={handleOpenModal}
            preview={preview}
            print={printTable}
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

          <TableControls mt={"10px"}>
            <LeftControls>
              <LimitSelect />
            </LeftControls>
            <RightControls>
              <OutletGridSwitch
                switchTabs={switchTabs}
                callback={changeSwitch}
              />
              <HistoryButton callback={goToHistory} />
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

          <TableNavigation />
        </TablePageBackground>
      )}

      {props.activeRoute.split("/").length === 4 && (
        <div style={contain}>
          <Switch>
            <Route path="/home/outlets/sales">
              <Sales goToList={goToTankList} />
            </Route>
            <Route path="/home/outlets/tanks">
              <Tank refresh={getAllStationData} />
            </Route>
            <Route path="/home/outlets/pumps">
              <Pumps refresh={getAllStationData} />
            </Route>
          </Switch>
        </div>
      )}
    </>
  );
};

const contain = {
  width: "96%",
  height: "89%",
};

const place = {
  width: "100%",
  textAlign: "center",
  fontSize: "12px",
  marginTop: "20px",
  color: "green",
};

export default Outlets;
