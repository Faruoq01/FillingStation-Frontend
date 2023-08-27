import React, { useCallback, useRef } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import tan from "../../assets/tan.png";
import eye from "../../assets/eye.png";
import filling from "../../assets/filling.png";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useSelector } from "react-redux";
import {
  openModal,
  getAllStations,
  tankListType,
  adminOutlet,
} from "../../storage/outlet";
import { useDispatch } from "react-redux";
import Tank from "../Outlet/Tanks";
import Pumps from "../Outlet/Pumps";
import Sales from "../Outlet/Sales";
import { Switch, Route, useHistory } from "react-router-dom";
import CreateFillingStation from "../Modals/CreateStationModal";
import AddTankSuccess from "../Modals/AddTankSuccess";
import AddPumpSuccess from "../Modals/AddPumpSuccess";
import AddPumpMore from "../Modals/AddMorePumps";
import OutletService from "../../services/outletService";
import { useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import PrintOutLetsModal from "../Modals/PrintOutlets";
import { useState } from "react";
import activeList from "../../assets/activeList.png";
import inactiveList from "../../assets/inactiveList.png";
import activeGrid from "../../assets/activeGrid.png";
import inactiveGrid from "../../assets/inactiveGrid.png";
import swal from "sweetalert";
import TablePageBackground from "../controls/PageLayout/TablePageBackground";
import TableNavigation from "../controls/PageLayout/TableNavigation";
import {
  DesktopTableCell,
  DesktopTableRowContainer,
  DesktopTableRows,
  TableViewForDesktop,
} from "../controls/PageLayout/TableViewForDesktop";
import {
  MobileTableCell,
  MobileTableRows,
  TableViewForMobile,
} from "../controls/PageLayout/TableViewForMobile";
import CardItem from "../Outlet/CardItem";

const mobile = window.matchMedia("(max-width: 600px)");

const columns = [
  "S/N",
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
  const [searchKey, setSearchKey] = useState("");

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

  const goToSales = (item) => {
    dispatch(adminOutlet(item));
    props.history.push("/home/outlets/sales");
  };

  const goToTanks = (item) => {
    if (!getPerm("1")) return swal("Warning!", "Permission denied", "info");
    dispatch(adminOutlet(item));
    props.history.push("/home/outlets/tanks");
  };

  const goToPumps = (item) => {
    if (!getPerm("4")) return swal("Warning!", "Permission denied", "info");
    dispatch(adminOutlet(item));
    props.history.push("/home/outlets/pumps");
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

  const searchStation = (data) => {
    setSearchKey(data);
  };

  // const getStations = (data) => {
  //   const stationsCopy = [...data];

  //   if (searchKey === "") {
  //     return stationsCopy;
  //   } else {
  //     const search = stationsCopy.filter(
  //       (data) =>
  //         !data.outletName.toUpperCase().indexOf(searchKey.toUpperCase()) ||
  //         !data.alias.toUpperCase().indexOf(searchKey.toUpperCase()) ||
  //         !data.city.toUpperCase().indexOf(searchKey.toUpperCase())
  //     );
  //     return search;
  //   }
  // };

  const goToHistory = () => {
    history.push("/home/history");
  };

  const Action = ({ item }) => {
    return (
      <div className="actions">
        <img
          onClick={() => {
            goToSales(item);
          }}
          style={icon}
          src={eye}
          alt="icon"
        />
        <img
          onClick={() => {
            goToPumps(item);
          }}
          style={icon}
          src={filling}
          alt="icon"
        />
        <img
          onClick={() => {
            goToTanks(item);
          }}
          style={icon}
          src={tan}
          alt="icon"
        />
      </div>
    );
  };

  return (
    <>
      {props.activeRoute.split("/").length === 3 && (
        <TablePageBackground>
          {open === 1 && (
            <CreateFillingStation getStations={getAllStationData} />
          )}
          {open === 4 && <AddTankSuccess />}
          {open === 5 && <AddPumpSuccess />}
          {open === 6 && <AddPumpMore />}
          {prints && (
            <PrintOutLetsModal
              allOutlets={allOutlets}
              open={prints}
              close={setPrints}
            />
          )}
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
                  fontSize: "12px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}>
                <MenuItem style={menu} value={10}>
                  Action
                </MenuItem>
                <MenuItem
                  style={menu}
                  onClick={() => {
                    handleOpenModal(1);
                  }}
                  value={20}>
                  Create new filling station
                </MenuItem>
                <MenuItem style={menu} onClick={printTable} value={30}>
                  Download PDF
                </MenuItem>
                <MenuItem style={menu} onClick={preview} value={40}>
                  Print
                </MenuItem>
              </Select>
            </div>
          </div>

          <div className="search">
            <div className="input-cont">
              <div className="second-select">
                <OutlinedInput
                  placeholder="Search"
                  sx={{
                    width: "100%",
                    height: "35px",
                    fontSize: "12px",
                    background: "#F2F1F1",
                    color: "#000",
                    borderRadius: "0px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #777777",
                    },
                  }}
                  onChange={(e) => {
                    searchStation(e.target.value);
                  }}
                />
              </div>
            </div>
            <div style={{ width: "190px" }} className="butt">
              <Button
                sx={{
                  width: "100%",
                  height: "30px",
                  background: "#427BBE",
                  borderRadius: "0px",
                  fontSize: "12px",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#427BBE",
                  },
                }}
                onClick={() => {
                  handleOpenModal(1);
                }}
                variant="contained">
                {" "}
                Create new filling station
              </Button>
            </div>
          </div>

          <div className="search2">
            <div className="butt2">
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={10}
                sx={{ ...selectStyle2, borderRadius: "0px" }}>
                <MenuItem style={menu} value={10}>
                  Show entries
                </MenuItem>
                <MenuItem style={menu} value={20}>
                  Twenty
                </MenuItem>
                <MenuItem style={menu} value={30}>
                  Thirty
                </MenuItem>
              </Select>
            </div>
            <div
              style={{
                width: mobile.matches ? "100%" : "295px",
                marginTop: mobile.matches ? "20px" : "auto",
                display: "flex",
                justifyContent: "flex-end",
              }}
              className="input-cont2">
              <div style={{ display: "flex", flexDirection: "row" }}>
                {switchTabs || (
                  <img
                    onClick={changeSwitch}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "6px",
                    }}
                    src={activeList}
                    alt="icon"
                  />
                )}
                {switchTabs && (
                  <img
                    onClick={changeSwitch}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "6px",
                    }}
                    src={inactiveList}
                    alt="icon"
                  />
                )}
                {switchTabs || (
                  <img
                    onClick={changeSwitch}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "6px",
                    }}
                    src={inactiveGrid}
                    alt="icon"
                  />
                )}
                {switchTabs && (
                  <img
                    onClick={changeSwitch}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "6px",
                    }}
                    src={activeGrid}
                    alt="icon"
                  />
                )}
              </div>
              <div className="second-select2">
                <Button
                  sx={{
                    width: "120px",
                    height: "30px",
                    background: "#58A0DF",
                    borderRadius: "0px",
                    fontSize: "10px",
                    "&:hover": {
                      backgroundColor: "#58A0DF",
                    },
                  }}
                  onClick={goToHistory}
                  variant="contained">
                  {" "}
                  History
                </Button>
              </div>
              <div className="second-select3">
                <Button
                  sx={{
                    width: "100%",
                    height: "30px",
                    background: "#F36A4C",
                    borderRadius: "0px",
                    fontSize: "10px",
                    "&:hover": {
                      backgroundColor: "#F36A4C",
                    },
                  }}
                  onClick={preview}
                  variant="contained">
                  {" "}
                  Print
                </Button>
              </div>
            </div>
          </div>

          {!switchTabs ? (
            mobile.matches ? (
              <TableViewForMobile rows={allOutlets} loading={loading}>
                {!loading &&
                  allOutlets.map((item, index) => {
                    return (
                      <MobileTableRows index={index}>
                        <MobileTableCell
                          columns={["Station Name", "No Of Tanks"]}
                          cellData={[item.outletName, item.noOfTanks]}
                        />
                        <MobileTableCell
                          columns={["Alias", "No Of Pumps"]}
                          cellData={[item.alias, item.noOfPumps]}
                        />
                        <MobileTableCell
                          columns={["State", "action"]}
                          cellData={[item.state, <Action />]}
                        />
                      </MobileTableRows>
                    );
                  })}
              </TableViewForMobile>
            ) : (
              <TableViewForDesktop columns={columns} ref={tablePrints}>
                <DesktopTableRowContainer rows={allOutlets} loading={loading}>
                  {!loading &&
                    allOutlets.map((item, index) => {
                      return (
                        <DesktopTableRows index={index}>
                          <DesktopTableCell data={index + 1} />
                          <DesktopTableCell data={item.state} />
                          <DesktopTableCell data={item.outletName} />
                          <DesktopTableCell data={item._id.substring(0, 6)} />
                          <DesktopTableCell data={item.noOfTanks} />
                          <DesktopTableCell data={item.noOfPumps} />
                          <DesktopTableCell data={item.alias} />
                          <DesktopTableCell data={item.city} />
                          <DesktopTableCell data={<Action item={item} />} />
                        </DesktopTableRows>
                      );
                    })}
                </DesktopTableRowContainer>
              </TableViewForDesktop>
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

const icon = { width: "27px", height: "27px", marginLeft: "5px" };

const selectStyle2 = {
  width: "100%",
  height: "35px",
  borderRadius: "5px",
  background: "#F2F1F1B2",
  color: "#000",
  fontSize: "12px",
  outline: "none",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #F2F1F1B2",
  },
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

const menu = {
  fontSize: "12px",
  fontFamily: "Poppins",
};

export default Outlets;
