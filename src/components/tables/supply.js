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
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { singleSupply } from "../../storage/supply";
import swal from "sweetalert";
import APIs from "../../services/connections/api";
// import swal from "sweetalert";

const Action = ({ data, setEditSupply, refresh, skip }) => {
  const dispatch = useDispatch();

  const handleDelete = (supply) => {
    swal({
      title: "Alert!",
      text: "Are you sure you want to delete this record?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const result = await APIs.post("/sales/validateSales", {
          date: supply.createdAt,
          organizationID: supply.organizationID,
          outletID: supply.outletID,
          shift: "All shifts",
        }).then((data) => {
          return data.data.data;
        });

        if (result) {
          return swal(
            "Error!",
            "Record has been saved for this day already, you have to remove all records made beyond this date to update this record!",
            "error"
          );
        } else {
          const payload = {
            supply: supply,
          };

          const response = await APIs.post("/supply/delete", payload);
          refresh(supply.outletID, "None", skip);
          if(response){
            swal(
              "Success!",
              "Record has been deleted successfully!",
              "success"
            );
          }
        }
      }
    });
  };

  return (
    <React.Fragment>
      <div
        style={{
          padding: 0,
          margin: 0,
        }}>
        <EditIcon
          style={{
            ...styles.icons,
            backgroundColor: "#054835",
            marginRight: 5,
          }}
          onClick={() => {
            dispatch(singleSupply(data));
            setEditSupply(true);
          }}
        />
        <DeleteIcon
          onClick={() => {
            handleDelete(data);
          }}
          style={{
            ...styles.icons,
            backgroundColor: "red",
          }}
        />
      </div>
    </React.Fragment>
  );
};

export const SupplyDesktopTable = ({ data }) => {
  const {
    columns,
    tablePrints,
    allOutlets,
    loading,
    setEditSupply,
    refresh,
    skip,
  } = data;

  return (
    <TableViewForDesktop columns={columns} ref={tablePrints}>
      <DesktopTableRowContainer rows={allOutlets} loading={loading}>
        {!loading &&
          allOutlets.map((item, index) => {
            return (
              <DesktopTableRows index={index}>
                <DesktopTableCell data={index + 1} />
                <DesktopTableCell data={item.date} />
                <DesktopTableCell data={item.transportationName} />
                <DesktopTableCell data={item.truckNo} />
                <DesktopTableCell data={item.wayBillNo} />
                <DesktopTableCell data={item.outletName} />
                <DesktopTableCell data={item.productType} />
                <DesktopTableCell data={item.quantity} />
                <DesktopTableCell data={item.shortage} />
                <DesktopTableCell data={item.overage} />
                <DesktopTableCell
                  data={
                    <Action
                      data={item}
                      setEditSupply={setEditSupply}
                      refresh={refresh}
                      skip={skip}
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

export const SupplyMobileTable = ({ data }) => {
  const { allOutlets, loading, setEditSupply, refresh, skip } = data;
  return (
    <TableViewForMobile rows={allOutlets} loading={loading}>
      {!loading &&
        allOutlets.map((item, index) => {
          return (
            <MobileTableRows index={index}>
              <MobileTableCell
                columns={["Date", "Transporter"]}
                cellData={[item.date, item.transportationName]}
              />
              <MobileTableCell
                columns={["Truck no", "WayBillNo"]}
                cellData={[item.truckNo, item.wayBillNo]}
              />
              <MobileTableCell
                columns={["Station", "Product"]}
                cellData={[item.outletName, item.productType]}
              />
              <MobileTableCell
                columns={["Quantity", "Shortage"]}
                cellData={[item.quantity, item.shortage]}
              />
              <MobileTableCell
                columns={["Overage", "action"]}
                cellData={[
                  item.overage,
                  <Action
                    data={item}
                    setEditSupply={setEditSupply}
                    refresh={refresh}
                    skip={skip}
                  />,
                ]}
              />
            </MobileTableRows>
          );
        })}
    </TableViewForMobile>
  );
};

const styles = {
  icons: {
    cursor: "pointer",
    color: "#fff",
    padding: 3,
    backgroundColor: "#06805b",
    borderRadius: "100%",
  },
};
