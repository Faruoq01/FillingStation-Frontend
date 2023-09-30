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

export const OutstandingDesktopTable = ({ data }) => {
  const { columns, tablePrints, allOutlets, loading } = data;

  return (
    <TableViewForDesktop columns={columns} ref={tablePrints}>
      <DesktopTableRowContainer rows={allOutlets} loading={loading}>
        {!loading &&
          allOutlets.map((item, index) => {
            return (
              <DesktopTableRows index={index}>
                <DesktopTableCell data={index + 1} />
                <DesktopTableCell data={item.date} />
                <DesktopTableCell
                  data={ApproximateDecimal(item.bankPayments)}
                />
                <DesktopTableCell data={ApproximateDecimal(item.posPayments)} />
                <DesktopTableCell data={ApproximateDecimal(item.netToBank)} />
                <DesktopTableCell
                  data={ApproximateDecimal(item.outstandingBalance)}
                />
              </DesktopTableRows>
            );
          })}
      </DesktopTableRowContainer>
    </TableViewForDesktop>
  );
};

export const OutstandingMobileTable = ({ data }) => {
  const { allOutlets, loading } = data;
  return (
    <TableViewForMobile rows={allOutlets} loading={loading}>
      {!loading &&
        allOutlets.map((item, index) => {
          return (
            <MobileTableRows index={index}>
              <MobileTableCell
                columns={["Date created", "Bank Payment"]}
                cellData={[item.date, ApproximateDecimal(item.bankPayments)]}
              />
              <MobileTableCell
                columns={["POS payment", "Net to bank"]}
                cellData={[
                  ApproximateDecimal(item.posPayments),
                  ApproximateDecimal(item.netToBank),
                ]}
              />
              <MobileTableCell
                columns={["", "Outstanding"]}
                cellData={["", ApproximateDecimal(item.outstandingBalance)]}
              />
            </MobileTableRows>
          );
        })}
    </TableViewForMobile>
  );
};
