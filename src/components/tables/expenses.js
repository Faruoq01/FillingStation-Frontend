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
import config from "../../constants";

const getReciept = (data) => {
  return (
    <React.Fragment>
      {data.attachApproval !== "null" && (
        <a
          href={config.BASE_URL + data.attachApprovalCam}
          target="_blank"
          rel="noreferrer">
          View Invoice
        </a>
      )}
      {data.attachApproval === "null" && <span>No attachment</span>}
    </React.Fragment>
  );
};

export const ExpenseDesktopTable = ({ data }) => {
  const { columns, tablePrints, allOutlets, loading } = data;

  return (
    <TableViewForDesktop columns={columns} ref={tablePrints}>
      <DesktopTableRowContainer rows={allOutlets} loading={loading}>
        {!loading &&
          allOutlets.map((item, index) => {
            return (
              <DesktopTableRows index={index}>
                <DesktopTableCell data={index + 1} />
                <DesktopTableCell data={item.createdAt} />
                <DesktopTableCell data={item.dateCreated} />
                <DesktopTableCell data={item.expenseName} />
                <DesktopTableCell data={item.description} />
                <DesktopTableCell data={item.expenseAmount} />
                <DesktopTableCell data={getReciept(item)} />
              </DesktopTableRows>
            );
          })}
      </DesktopTableRowContainer>
    </TableViewForDesktop>
  );
};

export const ExpenseMobileTable = ({ data }) => {
  const { allOutlets, loading } = data;
  return (
    <TableViewForMobile rows={allOutlets} loading={loading}>
      {!loading &&
        allOutlets.map((item, index) => {
          return (
            <MobileTableRows index={index}>
              <MobileTableCell
                columns={["Date created", "Expense date"]}
                cellData={[item.createdAt, item.dateCreated]}
              />
              <MobileTableCell
                columns={["Expense name", "description"]}
                cellData={[item.expenseName, item.description]}
              />
              <MobileTableCell
                columns={["Amount", "action"]}
                cellData={[item.expenseAmount, getReciept(item)]}
              />
            </MobileTableRows>
          );
        })}
    </TableViewForMobile>
  );
};
