import React, { useState, useEffect, useCallback } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import avatar from "../../assets/avatar.png";
import hr6 from "../../assets/hr6.png";
import EmployeeDetails from "../Modals/EmployeeModal";
import OutlinedInput from "@mui/material/OutlinedInput";
import { adminOutlet, getAllStations } from "../../store/actions/outlet";
import OutletService from "../../services/outletService";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import AdminUserService from "../../services/adminUsers";
import ConfirmDeleteModal from "../Modals/ConfirmDeleteModal";
import {
  searchStaffs,
  singleEmployee,
  storeStaffUsers,
} from "../../store/actions/staffUsers";
import PrintStaffRecords from "../Reports/StaffRecord";
import ManagerModal from "../Modals/ManagerModal";
import swal from "sweetalert";
import { ThreeDots } from "react-loader-spinner";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import EditStaffModal from "../Modals/EditStaffModal";
import config from '../../constants';

const mediaMatch = window.matchMedia("(max-width: 530px)");
const mobile = window.matchMedia("(max-width: 600px)");

const Employee = () => {
  const [editStaffModalStatus, setEditStaffModalStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [defaultState, setDefault] = useState(0);
  const [currentStaff, setCurrentStaff] = useState({});
  const [prints, setPrints] = useState(false);
  const [entries, setEntries] = useState(10);
  const [filter, setFilter] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [roles, setRoles] = useState([
    "All Users",
    "Admin",
    "Accountant",
    "Manager",
    "Staff",
  ]);
  const [loading, setLoading] = useState(false);
  const [deleteLoad, setDeleteLoad] = useState(false);
  const [confirmDeleteModalStatus, setConfirmDeleteModalStatus] =
    useState(false);
  const singleEmployeeDetails = useSelector(
    (state) => state?.staffUserReducer?.singleEmployee
  );

  const user = useSelector((state) => state.authReducer.user);
  const allOutlets = useSelector((state) => state.outletReducer.allOutlets);
  const oneStationData = useSelector(
    (state) => state.outletReducer.adminOutlet
  );
  const staffUsers = useSelector((state) => state.staffUserReducer.staffUsers);
  const [cRoles, setCroles] = useState([]);
  const dispatch = useDispatch();

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

  const openModal = () => {
    if (!getPerm("2")) return swal("Warning!", "Permission denied", "info");

    if (oneStationData === null) {
      swal("Warning!", "Please select a station first", "info");
    } else {
      setOpen(true);
    }
  };

  const openEmployee = (item) => {
    setCurrentStaff(item);
    setOpen2(true);
  };

  const getAllEmployeeData = useCallback(() => {
    if (oneStationData !== null) {
      if (getPerm("0") || getPerm("1") || user.userType === "superAdmin") {
        const findID = allOutlets.findIndex(
          (data) => data._id === oneStationData._id
        );
        setDefault(findID + 1);

        const payload = {
          filter: roles[filter],
          skip: skip * limit,
          limit: limit,
          outletID: oneStationData._id,
          organisationID: resolveUserID().id,
        };
        AdminUserService.filterRecords(payload).then((data) => {
          setLoading(false);
          setTotal(data.staff.count);
          setCroles(data.staff.roles);

          const cloneRoles = [
            "All Users",
            "Admin",
            "Accountant",
            "Manager",
            "Staff",
          ];
          const extensions = [
            ...new Set(data.staff.roles.map((data) => data.role)),
          ];
          setRoles(cloneRoles.concat(extensions));
          dispatch(storeStaffUsers(data.staff.staff));
        });

        return;
      }
    }

    setLoading(true);
    const payload = {
      organisation: resolveUserID().id,
    };

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
          filter: roles[filter],
          skip: skip * limit,
          limit: limit,
          outletID: data,
          organisationID: resolveUserID().id,
        };
        AdminUserService.filterRecords(payload).then((data) => {
          setLoading(false);
          setTotal(data.staff.count);
          setCroles(data.staff.roles);

          const cloneRoles = [
            "All Users",
            "Admin",
            "Accountant",
            "Manager",
            "Staff",
          ];
          const extensions = [
            ...new Set(data.staff.roles.map((data) => data.role)),
          ];
          setRoles(cloneRoles.concat(extensions));
          dispatch(storeStaffUsers(data.staff.staff));
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllEmployeeData();
  }, [getAllEmployeeData]);

  const refresh = () => {
    setLoading(true);
    const payload = {
      filter: roles[filter],
      skip: skip * limit,
      limit: limit,
      outletID: oneStationData === null ? "None" : oneStationData?._id,
      organisationID: resolveUserID().id,
    };
    AdminUserService.filterRecords(payload)
      .then((data) => {
        setTotal(data.staff.count);
        setCroles(data.staff.roles);

        const cloneRoles = [
          "All Users",
          "Admin",
          "Accountant",
          "Manager",
          "Staff",
        ];
        const extensions = [
          ...new Set(data.staff.roles.map((data) => data.role)),
        ];
        setRoles(cloneRoles.concat(extensions));
        dispatch(storeStaffUsers(data.staff.staff));
      })
      .then(() => {
        setLoading(false);
      });
  };

  const changeMenu = (index, item) => {
    if (!getPerm("1") && item === null)
      return swal("Warning!", "Permission denied", "info");
    setLoading(true);
    setDefault(index);
    dispatch(adminOutlet(item));

    const payload = {
      filter: roles[filter],
      skip: skip * limit,
      limit: limit,
      outletID: item === null ? "None" : item?._id,
      organisationID: resolveUserID().id,
    };
    AdminUserService.filterRecords(payload)
      .then((data) => {
        setTotal(data.staff.count);
        dispatch(storeStaffUsers(data.staff.staff));
      })
      .then(() => {
        setLoading(false);
      });
  };

  const printReport = () => {
    if (!getPerm("4")) return swal("Warning!", "Permission denied", "info");
    setPrints(true);
  };

  const searchTable = (value) => {
    dispatch(searchStaffs(value));
  };

  const nextPage = () => {
    if (!(skip < 0)) {
      setSkip((prev) => prev + 1);
    }
    refresh();
  };

  const prevPage = () => {
    if (!(skip <= 0)) {
      setSkip((prev) => prev - 1);
    }
    refresh();
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    getAllEmployeeData();
  };

  const filterMenu = (data, index) => {
    if (!getPerm("3")) return swal("Warning!", "Permission denied", "info");
    setFilter(index);

    const payload = {
      skip: skip * limit,
      limit: limit,
      filter: data,
      outletID: oneStationData === null ? "None" : oneStationData?._id,
      organisationID: resolveUserID().id,
    };

    AdminUserService.filterRecords(payload).then((data) => {
      dispatch(storeStaffUsers(data.staff.staff));
    });
  };

  const handleDelete = () => {
    setDeleteLoad(true);
    if (!singleEmployeeDetails) {
      setDeleteLoad(false);
      return swal("Warning!", "You can't delete this product order", "info");
    }

    setTimeout(() => {
      setDeleteLoad(false);
      setConfirmDeleteModalStatus(false);
      refresh();
    }, 8000);
  };

  return (
    <>
      <div data-aos="zoom-in-down" className="paymentsCaontainer">
        {
          <ManagerModal
            roles={cRoles}
            open={open}
            close={setOpen}
            allOutlets={allOutlets}
            refresh={getAllEmployeeData}
          />
        }
        {<EmployeeDetails open={open2} close={setOpen2} data={currentStaff} />}
        {prints && (
          <PrintStaffRecords
            allOutlets={staffUsers}
            open={prints}
            close={setPrints}
          />
        )}
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
                }}
              >
                <MenuItem style={menu} value={10}>
                  Action
                </MenuItem>
                <MenuItem onClick={openModal} style={menu} value={20}>
                  Add Staff
                </MenuItem>
                <MenuItem style={menu} value={30}>
                  History
                </MenuItem>
                <MenuItem onClick={printReport} style={menu} value={40}>
                  Print
                </MenuItem>
              </Select>
            </div>
          </div>

          <div className="search">
            <div className="input-cont">
              <div className="second-select">
                {getPerm("0") && (
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={defaultState}
                    sx={selectStyle2}
                  >
                    <MenuItem
                      onClick={() => {
                        changeMenu(0, null);
                      }}
                      style={menu}
                      value={0}
                    >
                      All Stations
                    </MenuItem>
                    {allOutlets.map((item, index) => {
                      return (
                        <MenuItem
                          key={index}
                          style={menu}
                          onClick={() => {
                            changeMenu(index + 1, item);
                          }}
                          value={index + 1}
                        >
                          {item.outletName + ", " + item.alias}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
                {getPerm("0") || (
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={0}
                    sx={selectStyle2}
                    disabled
                  >
                    <MenuItem style={menu} value={0}>
                      {!getPerm("0")
                        ? oneStationData?.outletName +
                          ", " +
                          oneStationData?.alias
                        : "No station created"}
                    </MenuItem>
                  </Select>
                )}
              </div>
              <div className="second-select">
                <OutlinedInput
                  sx={{
                    width: "100%",
                    height: "35px",
                    background: "#EEF2F1",
                    fontSize: "12px",
                    borderRadius: "0px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #777777",
                    },
                  }}
                  type="text"
                  placeholder="Search"
                  onChange={(e) => {
                    searchTable(e.target.value);
                  }}
                />
              </div>
            </div>
            <div style={{ width: "120px" }} className="butt">
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
                onClick={openModal}
                variant="contained"
              >
                {" "}
                Add Employee
              </Button>
            </div>
          </div>

          <div className="search2">
            <div className="butt2">
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={entries}
                sx={selectStyle2}
              >
                <MenuItem style={menu} value={10}>
                  Show entries
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    entriesMenu(20, 15);
                  }}
                  style={menu}
                  value={20}
                >
                  15 entries
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    entriesMenu(30, 30);
                  }}
                  style={menu}
                  value={30}
                >
                  30 entries
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    entriesMenu(40, 100);
                  }}
                  style={menu}
                  value={40}
                >
                  100 entries
                </MenuItem>
              </Select>
            </div>
            <div
              style={{ width: mediaMatch.matches ? "100%" : "200px" }}
              className="input-cont2"
            >
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={filter}
                sx={{
                  ...selectStyle2,
                  height: "30px",
                  marginRight: "10px",
                  marginTop: mediaMatch.matches ? "20px" : "0px",
                }}
              >
                {roles.map((data, index) => {
                  return (
                    <MenuItem
                      onClick={() => {
                        filterMenu(data, index);
                      }}
                      style={menu}
                      value={index}
                    >
                      {data}
                    </MenuItem>
                  );
                })}
              </Select>
              <Button
                sx={{
                  width: mediaMatch.matches ? "100%" : "80px",
                  height: "30px",
                  background: "#F36A4C",
                  borderRadius: "0px",
                  fontSize: "10px",
                  display: mediaMatch.matches && "none",
                  marginTop: mediaMatch.matches ? "10px" : "0px",
                  "&:hover": {
                    backgroundColor: "#F36A4C",
                  },
                }}
                onClick={printReport}
                variant="contained"
              >
                {" "}
                Print
              </Button>
            </div>
          </div>

          {mobile.matches ? (
            !loading ? (
              staffUsers.length === 0 ? (
                <div style={place}>No data</div>
              ) : (
                staffUsers.map((item, index) => {
                  return (
                    <div key={index} className="mobile-table-container">
                      <div className="inner-container">
                        <div className="row">
                          <div className="left-text">
                            <img
                              style={{
                                width: "35px",
                                height: "35px",
                                borderRadius: "35px",
                              }}
                              src={avatar}
                              alt="icon"
                            />
                          </div>
                          <div className="right-text">
                            <div className="heads">{item.staffName}</div>
                            <div className="foots">Staff Name</div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="left-text">
                            <div className="heads">{item.sex}</div>
                            <div className="foots">Gender</div>
                          </div>
                          <div className="right-text">
                            <div className="heads">{item.previousLevel}</div>
                            <div className="foots">Previous Level</div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="left-text">
                            <div className="heads">{item.email}</div>
                            <div className="foots">Email</div>
                          </div>
                          <div className="right-text">
                            <div className="heads">{item.dateEmployed}</div>
                            <div className="foots">Date Employed</div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="left-text">
                            <div className="heads">{item.role}</div>
                            <div className="foots">Role</div>
                          </div>
                          <div className="right-text">
                            <div className="heads">
                              <img
                                onClick={() => {
                                  openEmployee(item);
                                }}
                                style={{ width: "27px", height: "27px" }}
                                src={hr6}
                                alt="icon"
                              />
                            </div>
                            <div className="foots">Details</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              <div style={load}>
                <ThreeDots
                  height="60"
                  width="50"
                  radius="9"
                  color="#076146"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              </div>
            )
          ) : (
            <div className="table-container">
              <div className="table-head">
                <div className="column">S/N</div>
                <div className="column">Staff Image</div>
                <div className="column">Staff Name</div>
                <div className="column">Sex</div>
                <div className="column">Email</div>
                <div className="column">Phone Number</div>
                <div className="column">Date Employed</div>
                <div className="column">Role</div>
                <div className="column">Action</div>
              </div>

              <div className="row-container">
                {!loading ? (
                  staffUsers.length === 0 ? (
                    <div style={place}>No data </div>
                  ) : (
                    staffUsers.map((item, index) => {
                      return (
                        <div key={index} className="table-head2">
                          <div className="column">{index + 1}</div>
                          <div className="column">
                            <img
                              style={{
                                width: "35px",
                                height: "35px",
                                borderRadius: "35px",
                              }}
                              src={item.image === null? avatar: config.BASE_URL.concat(item.image)}
                              alt="icon"
                            />
                          </div>
                          <div className="column">{item.staffName}</div>
                          <div className="column">{item.sex}</div>
                          <div className="column">{item.email}</div>
                          <div className="column">{item.phone}</div>
                          <div className="column">{item.dateEmployed}</div>
                          <div className="column">{item.role}</div>
                          <div className="column">
                            <div style={{}} className="actions">
                              <img
                                onClick={() => {
                                  openEmployee(item);
                                }}
                                style={{ width: "27px", height: "27px" }}
                                src={hr6}
                                alt="icon"
                              />
                              <EditIcon
                                style={{
                                  ...styles.icons,
                                  marginRight: "3px",
                                  backgroundColor: "#054835",
                                }}
                                onClick={() => {
                                  dispatch(singleEmployee(item));
                                  setEditStaffModalStatus(true);
                                }}
                              />
                              <DeleteIcon
                                onClick={() => {
                                  dispatch(singleEmployee(item));
                                  setConfirmDeleteModalStatus(
                                    !confirmDeleteModalStatus
                                  );
                                }}
                                style={{
                                  ...styles.icons,
                                  backgroundColor: "red",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )
                ) : (
                  <div style={load}>
                    <ThreeDots
                      height="60"
                      width="50"
                      radius="9"
                      color="#076146"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClassName=""
                      visible={true}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="footer">
            <div style={{ fontSize: "12px" }}>
              Showing {(skip + 1) * limit - (limit - 1)} to {(skip + 1) * limit}{" "}
              of {total} entries
            </div>
            <div className="nav">
              <button onClick={prevPage} className="but">
                Previous
              </button>
              <div className="num">{skip + 1}</div>
              <button onClick={nextPage} className="but2">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        deleteStatus={deleteLoad}
        handleDelete={handleDelete}
        open={confirmDeleteModalStatus}
        close={setConfirmDeleteModalStatus}
      />
      <EditStaffModal
        allOutlets={allOutlets}
        open={editStaffModalStatus}
        close={setEditStaffModalStatus}
      />
    </>
  );
};

const menu = {
  fontSize: "12px",
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
  fontSize: "10px",
  marginTop: "20px",
  color: "green",
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

export default Employee;
