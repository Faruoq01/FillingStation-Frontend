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

const getAmount = (item) => {
  const rate = item[`${item.productType}Rate`];
  return rate * item.lpoLitre;
};

export const DispensedLPODesktopTable = ({ data }) => {
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
                <DesktopTableCell data={item.productType} />
                <DesktopTableCell data={item.lpoLitre} />
                <DesktopTableCell data={item[`${item.productType}Rate`]} />
                <DesktopTableCell data={getAmount(item)} />
                <DesktopTableCell data={item.station} />
              </DesktopTableRows>
            );
          })}
      </DesktopTableRowContainer>
    </TableViewForDesktop>
  );
};

export const DispensedLPOMobileTable = ({ data }) => {
  const { allOutlets, loading } = data;
  return (
    <TableViewForMobile rows={allOutlets} loading={loading}>
      {!loading &&
        allOutlets.map((item, index) => {
          return (
            <MobileTableRows index={index}>
              <MobileTableCell
                columns={["Date Created", "Product"]}
                cellData={[item.createdAt, item.productType]}
              />
              <MobileTableCell
                columns={["Quantity", "Rate"]}
                cellData={[item.lpoLitre, item[`${item.productType}Rate`]]}
              />
              <MobileTableCell
                columns={["Amount", "Station"]}
                cellData={[getAmount(item), item.station]}
              />
            </MobileTableRows>
          );
        })}
    </TableViewForMobile>
  );
};
