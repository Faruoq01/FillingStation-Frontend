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
import { Edit as EditIcon } from "@mui/icons-material";
import avatar from "../../assets/avatar.png";
import hr6 from "../../assets/hr6.png";
import config from "../../constants";
import { useDispatch } from "react-redux";
import { singleEmployee } from "../../storage/employee";

const Action = ({ item, openEmployee, setEditStaff }) => {
  const dispatch = useDispatch();

  return (
    <div style={{ width: "70px" }} className="actions">
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
          setEditStaff(true);
        }}
      />
    </div>
  );
};

export const EmployeeDesktopTable = ({ data }) => {
  const {
    columns,
    tablePrints,
    allOutlets,
    loading,
    openEmployee,
    setEditStaff,
  } = data;
  return (
    <TableViewForDesktop columns={columns} ref={tablePrints}>
      <DesktopTableRowContainer rows={allOutlets} loading={loading}>
        {!loading &&
          allOutlets.map((item, index) => {
            return (
              <DesktopTableRows index={index}>
                <DesktopTableCell data={index + 1} />
                <DesktopTableCell data={<Avatar item={item} />} />
                <DesktopTableCell data={item.staffName} />
                <DesktopTableCell data={item.sex} />
                <DesktopTableCell data={item.email} />
                <DesktopTableCell data={item.phone} />
                <DesktopTableCell data={item.dateEmployed} />
                <DesktopTableCell data={item.role} />
                <DesktopTableCell
                  data={
                    <Action
                      item={item}
                      openEmployee={openEmployee}
                      setEditStaff={setEditStaff}
                    />
                  }
                />
              </DesktopTableRows>
            );
          })}
      </DesktopTableRowContainer>
    </TableViewForDesktop>
  );
};

export const EmployeeMobileTable = ({ data }) => {
  const { allOutlets, loading, openEmployee, setEditStaff } = data;
  return (
    <TableViewForMobile rows={allOutlets} loading={loading}>
      {!loading &&
        allOutlets.map((item, index) => {
          return (
            <MobileTableRows index={index}>
              <MobileTableCell
                columns={["Staff image", "Staff name"]}
                cellData={[<Avatar item={item} />, item.staffName]}
              />
              <MobileTableCell
                columns={["Sex", "Email"]}
                cellData={[item.sex, item.email]}
              />
              <MobileTableCell
                columns={["Phone", "Date employed"]}
                cellData={[item.phone, item.dateEmployed]}
              />
              <MobileTableCell
                columns={["Role", "action"]}
                cellData={[
                  item.role,
                  <Action
                    item={item}
                    openEmployee={openEmployee}
                    setEditStaff={setEditStaff}
                  />,
                ]}
              />
            </MobileTableRows>
          );
        })}
    </TableViewForMobile>
  );
};

const Avatar = ({ item }) => {
  return (
    <img
      style={{
        width: "35px",
        height: "35px",
        borderRadius: "35px",
      }}
      src={item.image === null ? avatar : config.BASE_URL.concat(item.image)}
      alt="icon"
    />
  );
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
