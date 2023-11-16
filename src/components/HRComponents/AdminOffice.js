import React, { useCallback, useEffect, useState } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import EmployeeDetails from "../Modals/EmployeeModal";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import AdminUserService from "../../services/360station/adminUsers";
import { searchStaffs, storeStaffUsers } from "../../storage/employee";
import swal from "sweetalert";
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
import { EmployeeDesktopTable, EmployeeMobileTable } from "../tables/employees";
import GenerateReports from "../Modals/reports";
import AdminModal from "../Modals/CreateAdminUser";
import EditAdminModal from "../Modals/EditAdminModal";

const columns = [
  "S/N",
  "Staff Image",
  "Staff name",
  "Sex",
  "Email",
  "Phone number",
  "Date employed",
  "Role",
  "Actions",
];

const mediaMatch = window.matchMedia("(max-width: 530px)");
const mobile = window.matchMedia("(max-width: 600px)");

const AdminOffice = () => {
  const [editStaff, setEditStaff] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
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

  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const staffUsers = useSelector((state) => state.employee.staffUsers);
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
    setOpen(true);
  };

  const openEmployee = (item) => {
    setCurrentStaff(item);
    setOpen2(true);
  };

  const refresh = (id, date, skip, limit = 15) => {
    setLoading(true);
    const payload = {
      filter: roles[filter],
      skip: skip * limit,
      limit: limit,
      outletID: id,
      organisationID: resolveUserID().id,
    };
    AdminUserService.filterRecords(payload)
      .then((data) => {
        setTotal(data.staff.count);
        setCroles(data.staff.roles);

        const cloneRoles = ["All Users", "Admin", "Accountant", "Staff"];
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

  const getAllUsers = useCallback((id, date, skip) => {
    refresh(id, "None", skip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = oneStationData === null ? "None" : oneStationData._id;
    getAllUsers(id, "None", skip);
  }, [getAllUsers, oneStationData, skip]);

  const printReport = () => {
    if (!getPerm("4")) return swal("Warning!", "Permission denied", "info");
    setPrints(true);
  };

  const searchTable = (value) => {
    dispatch(searchStaffs(value));
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    refresh("None", "None", skip, limit);
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

  const desktopTableData = {
    columns: columns,
    tablePrints: printReport,
    allOutlets: staffUsers,
    loading: loading,
    openEmployee: openEmployee,
    setEditStaff: setEditStaff,
  };

  const mobileTableData = {
    allOutlets: staffUsers,
    loading: loading,
    openEmployee: openEmployee,
    setEditStaff: setEditStaff,
  };

  return (
    <React.Fragment>
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

        {mobile.matches || (
          <TableControls>
            <LeftControls>
              <SearchField callback={searchTable} />
            </LeftControls>
            <RightControls>
              <CreateButton callback={openModal} label={"Add Employee"} />
            </RightControls>
          </TableControls>
        )}

        {mobile.matches || (
          <TableControls mt={"10px"}>
            <LeftControls>
              <LimitSelect entries={entries} entriesMenu={entriesMenu} />
            </LeftControls>
            <RightControls>
              <UserSelect
                filter={filter}
                roles={roles}
                filterMenu={filterMenu}
              />
              <PrintButton callback={printReport} />
            </RightControls>
          </TableControls>
        )}

        {mobile.matches && (
          <TableControls>
            <LeftControls>
              <UserSelect
                filter={filter}
                roles={roles}
                filterMenu={filterMenu}
              />
            </LeftControls>
            <RightControls></RightControls>
          </TableControls>
        )}

        {mobile.matches ? (
          <EmployeeMobileTable data={mobileTableData} />
        ) : (
          <EmployeeDesktopTable data={desktopTableData} />
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
      {editStaff && (
        <EditAdminModal
          roles={cRoles}
          roleList={roles}
          open={editStaff}
          close={setEditStaff}
          refresh={refresh}
        />
      )}
      {open && (
        <AdminModal
          roles={cRoles}
          roleList={roles}
          open={open}
          close={setOpen}
          refresh={refresh}
        />
      )}
      {<EmployeeDetails open={open2} close={setOpen2} data={currentStaff} />}
      {prints && (
        <GenerateReports
          open={prints}
          close={setPrints}
          section={"employee"}
          data={staffUsers}
        />
      )}
    </React.Fragment>
  );
};

const UserSelect = ({ filter, roles, filterMenu }) => {
  return (
    <Select
      labelId="demo-select-small"
      id="demo-select-small"
      value={filter}
      sx={{
        ...selectStyle2,
        height: "30px",
      }}>
      {roles.map((data, index) => {
        return (
          <MenuItem
            onClick={() => {
              filterMenu(data, index);
            }}
            style={menu}
            value={index}>
            {data}
          </MenuItem>
        );
      })}
    </Select>
  );
};

const menu = {
  fontSize: "12px",
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

export default AdminOffice;
