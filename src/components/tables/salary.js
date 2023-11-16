import React from "react";
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
import swal from "sweetalert";
import SalaryService from "../../services/360station/salary";
import hr7 from "../../assets/hr7.png";
import hr8 from "../../assets/hr8.png";

const Action = ({ item, refresh, updateSalary }) => {
  const deleteSalary = (item) => {
    swal({
      title: "Alert!",
      text: "Are you sure you want to delete this salary?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        if (willDelete) {
          SalaryService.deleteSalary({ id: item._id })
            .then((data) => {
              swal("Success", "Salary created successfully!", "success");
            })
            .then(() => {
              refresh();
            });
        }
      }
    });
  };

  return (
    <React.Fragment>
      <div
        style={{
          width: "60px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}>
        <img
          onClick={() => {
            updateSalary(item);
          }}
          style={{ width: "27px", height: "27px" }}
          src={hr7}
          alt="icon"
        />
        <img
          onClick={() => {
            deleteSalary(item);
          }}
          style={{ width: "27px", height: "27px" }}
          src={hr8}
          alt="icon"
        />
      </div>
    </React.Fragment>
  );
};

export const SalaryDesktopTable = ({ data }) => {
  const { columns, tablePrints, allOutlets, loading, refresh, updateSalary } =
    data;

  return (
    <TableViewForDesktop columns={columns} ref={tablePrints}>
      <DesktopTableRowContainer rows={allOutlets} loading={loading}>
        {!loading &&
          allOutlets.map((item, index) => {
            return (
              <DesktopTableRows index={index}>
                <DesktopTableCell data={index + 1} />
                <DesktopTableCell data={item.position} />
                <DesktopTableCell data={item.level} />
                <DesktopTableCell
                  data={item.low_range + " - " + item.high_range}
                />
                <DesktopTableCell
                  data={
                    <Action
                      item={item}
                      refresh={refresh}
                      updateSalary={updateSalary}
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

export const SalaryMobileTable = ({ data }) => {
  const { allOutlets, loading, refresh, updateSalary } = data;
  return (
    <TableViewForMobile rows={allOutlets} loading={loading}>
      {!loading &&
        allOutlets.map((item, index) => {
          return (
            <MobileTableRows index={index}>
              <MobileTableCell
                columns={["Position", "Level"]}
                cellData={[item.position, item.level]}
              />
              <MobileTableCell
                columns={["Salary range", "Actions"]}
                cellData={[
                  item.low_range + " - " + item.high_range,
                  <Action
                    item={item}
                    refresh={refresh}
                    updateSalary={updateSalary}
                  />,
                ]}
              />
            </MobileTableRows>
          );
        })}
    </TableViewForMobile>
  );
};
