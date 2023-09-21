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

export const DeliveredOrderDesktopTable = ({ data }) => {
  const { columns, tablePrints, allOutlets, loading } = data;

  return (
    <TableViewForDesktop columns={columns} ref={tablePrints}>
      <DesktopTableRowContainer rows={allOutlets} loading={loading}>
        {!loading &&
          allOutlets.map((item, index) => {
            return (
              <DesktopTableRows index={index}>
                <DesktopTableCell data={index + 1} />
                <DesktopTableCell data={item.dateCreated} />
                <DesktopTableCell data={item.depotStation} />
                <DesktopTableCell data={item.destination} />
                <DesktopTableCell data={item.product} />
                <DesktopTableCell data={item.quantity} />
                <DesktopTableCell data={item.truckNo} />
                <DesktopTableCell data={item.deliveryStatus} />
                <DesktopTableCell data={item.shortage} />
                <DesktopTableCell data={item.overage} />
              </DesktopTableRows>
            );
          })}
      </DesktopTableRowContainer>
    </TableViewForDesktop>
  );
};

export const DeliveredOrderMobileTable = ({ data }) => {
  const { allOutlets, loading } = data;
  return (
    <TableViewForMobile rows={allOutlets} loading={loading}>
      {!loading &&
        allOutlets.map((item, index) => {
          return (
            <MobileTableRows index={index}>
              <MobileTableCell
                columns={["Date created", "Depot station"]}
                cellData={[item.dateCreated, item.depotStation]}
              />
              <MobileTableCell
                columns={["Destination", "Truck no"]}
                cellData={[item.destination, item.truckNo]}
              />
              <MobileTableCell
                columns={["Product", "Delivery status"]}
                cellData={[item.product, item.deliveryStatus]}
              />
              <MobileTableCell
                columns={["Sortage", "Overage"]}
                cellData={[item.shortage, item.overage]}
              />
            </MobileTableRows>
          );
        })}
    </TableViewForMobile>
  );
};
