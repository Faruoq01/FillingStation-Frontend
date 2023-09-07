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
import { Circle } from "@mui/icons-material";

const getAmount = (item) => {
  const rate = item[`${item.productType}Rate`];
  return rate * item.lpoLitre;
};

export const DispensedLPODesktopTable = ({ data }) => {
  const { columns, tablePrints, allOutlets, loading } = data;

  const getColor = {
    PMS: "#399A19",
    AGO: "#FFA010",
    DPK: "#35393E",
  };

  return (
    <TableViewForDesktop columns={columns} ref={tablePrints}>
      <DesktopTableRowContainer rows={allOutlets} loading={loading}>
        {!loading &&
          allOutlets.map((item, index) => {
            return (
              <DesktopTableRows index={index}>
                <DesktopTableCell data={index + 1} />
                <DesktopTableCell data={item.createdAt} />
                <DesktopTableCell data={item.productType}>
                  <Circle
                    style={{
                      color: getColor[item.productType],
                      fontSize: 10,
                      marginRight: 4,
                    }}
                  />
                </DesktopTableCell>
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
