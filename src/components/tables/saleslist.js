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
import ApproximateDecimal from "../common/approx";

const amount = (data) => {
  switch (data.productType) {
    case "PMS": {
      return data.PMSSellingPrice * data.sales;
    }
    case "AGO": {
      return data.AGOSellingPrice * data.sales;
    }
    case "DPK": {
      return data.DPKSellingPrice * data.sales;
    }
    default: {
    }
  }
};

export const SalesListDesktopTable = ({ data }) => {
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
                <DesktopTableCell data={item.outletName} />
                <DesktopTableCell data={item.pumpName} />
                <DesktopTableCell data={item.productType} />
                <DesktopTableCell data={ApproximateDecimal(item.sales)} />
                <DesktopTableCell data={ApproximateDecimal(amount(item))} />
              </DesktopTableRows>
            );
          })}
      </DesktopTableRowContainer>
    </TableViewForDesktop>
  );
};

export const SalesListMobileTable = ({ data }) => {
  const { allOutlets, loading } = data;
  return (
    <TableViewForMobile rows={allOutlets} loading={loading}>
      {!loading &&
        allOutlets.map((item, index) => {
          return (
            <MobileTableRows index={index}>
              <MobileTableCell
                columns={["Date created", "Station"]}
                cellData={[item.createdAt, item.outletName]}
              />
              <MobileTableCell
                columns={["Pump Name", "Product"]}
                cellData={[item.pumpName, item.productType]}
              />
              <MobileTableCell
                columns={["Sales", "Amount"]}
                cellData={[item.sales, amount(item)]}
              />
            </MobileTableRows>
          );
        })}
    </TableViewForMobile>
  );
};
