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

export const OutletDesktopTable = ({ data }) => {
  const { columns, tablePrints, allOutlets, loading, Action } = data;
  return (
    <TableViewForDesktop columns={columns} ref={tablePrints}>
      <DesktopTableRowContainer rows={allOutlets} loading={loading}>
        {!loading &&
          allOutlets.map((item, index) => {
            return (
              <DesktopTableRows index={index}>
                <DesktopTableCell data={index + 1} />
                <DesktopTableCell data={item.state} />
                <DesktopTableCell data={item.outletName} />
                <DesktopTableCell data={item._id.substring(0, 6)} />
                <DesktopTableCell data={item.noOfTanks} />
                <DesktopTableCell data={item.noOfPumps} />
                <DesktopTableCell data={item.alias} />
                <DesktopTableCell data={item.city} />
                <DesktopTableCell data={<Action item={item} />} />
              </DesktopTableRows>
            );
          })}
      </DesktopTableRowContainer>
    </TableViewForDesktop>
  );
};

export const OutletMobileTable = ({ data }) => {
  const { allOutlets, loading, Action } = data;
  return (
    <TableViewForMobile rows={allOutlets} loading={loading}>
      {!loading &&
        allOutlets.map((item, index) => {
          return (
            <MobileTableRows index={index}>
              <MobileTableCell
                columns={["Station Name", "No Of Tanks"]}
                cellData={[item.outletName, item.noOfTanks]}
              />
              <MobileTableCell
                columns={["Alias", "No Of Pumps"]}
                cellData={[item.alias, item.noOfPumps]}
              />
              <MobileTableCell
                columns={["State", "action"]}
                cellData={[item.state, <Action />]}
              />
            </MobileTableRows>
          );
        })}
    </TableViewForMobile>
  );
};
