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

export const TankUpdateDesktopTable = ({ data }) => {
  const { columns, tablePrints, allOutlets, loading } = data;

  return (
    <TableViewForDesktop columns={columns} ref={tablePrints}>
      <DesktopTableRowContainer rows={allOutlets} loading={loading}>
        {!loading &&
          allOutlets.map((item, index) => {
            return (
              <DesktopTableRows index={index}>
                <DesktopTableCell data={index + 1} />
                <DesktopTableCell data={item.dateUpdated} />
                <DesktopTableCell data={item.tankName} />
                <DesktopTableCell data={item.productType} />
                <DesktopTableCell data={item.station} />
                <DesktopTableCell
                  data={ApproximateDecimal(item.previousLevel)}
                />
                <DesktopTableCell data={item.quantityAdded} />
                <DesktopTableCell
                  data={ApproximateDecimal(data.currentLevel)}
                />
              </DesktopTableRows>
            );
          })}
      </DesktopTableRowContainer>
    </TableViewForDesktop>
  );
};

export const TankUpdateMobileTable = ({ data }) => {
  const { allOutlets, loading } = data;
  return (
    <TableViewForMobile rows={allOutlets} loading={loading}>
      {!loading &&
        allOutlets.map((item, index) => {
          return (
            <MobileTableRows index={index}>
              <MobileTableCell
                columns={["Date", "Tank name"]}
                cellData={[item.dateUpdated, item.tankName]}
              />
              <MobileTableCell
                columns={["Product", "Station"]}
                cellData={[item.productType, item.station]}
              />
              <MobileTableCell
                columns={["Quantity", "Previous level"]}
                cellData={[
                  item.outletName,
                  ApproximateDecimal(item.previousLevel),
                ]}
              />
              <MobileTableCell
                columns={["Quantity", "Current level"]}
                cellData={[
                  ApproximateDecimal(item.quantityAdded),
                  ApproximateDecimal(item.currentLevel),
                ]}
              />
            </MobileTableRows>
          );
        })}
    </TableViewForMobile>
  );
};
