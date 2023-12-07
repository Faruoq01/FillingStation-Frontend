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
import { useDispatch, useSelector } from "react-redux";
import { singleIncomingOrderRecord } from "../../storage/incomingOrder";
import swal from "sweetalert";
import IncomingService from "../../services/360station/IncomingService";

const Action = ({ data, setIncomingOrderEditModal, refresh, skip }) => {
  const dispatch = useDispatch();
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updateDate = useSelector((state) => state.dashboard.dateRange);

  const handleDelete = (data) => {
    if(oneStationData === null){
      swal("Error!", "Please select a station to delete this order", "error")
    }else{
      swal({
        title: "Alert!",
        text: "Are you sure you want to delete this record?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          IncomingService.deleteIncoming({
            id: data._id,
            quantity: data.quantity,
            productOrderID: data.productOrderID,
          }).then(() => {
            refresh(oneStationData._id, updateDate, skip);
            swal("Success", "Incoming order deleted successfully!", "success");
          });
        }
      });
    }
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
            dispatch(singleIncomingOrderRecord(data));
            setIncomingOrderEditModal(true);
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

export const IncomingOrderDesktopTable = ({ data }) => {
  const {
    columns,
    tablePrints,
    allOutlets,
    loading,
    setIncomingOrderEditModal,
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
                <DesktopTableCell data={item.dateCreated} />
                <DesktopTableCell data={item.outletID === "Others"? "External customer": "Inhouse"} />
                <DesktopTableCell data={item.quantity} />
                <DesktopTableCell data={item.product} />
                <DesktopTableCell data={item.outletID === "Others"? item.customerName: item.outletName} />
                <DesktopTableCell data={item.outletID === "Others"? item.customerAddress: item.destination} />
                <DesktopTableCell data={item.truckNo} />
                <DesktopTableCell data={item.deliveryStatus} />
                <DesktopTableCell
                  data={
                    <Action
                      data={item}
                      setIncomingOrderEditModal={setIncomingOrderEditModal}
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

export const IncomingOrderMobileTable = ({ data }) => {
  const { allOutlets, loading, setIncomingOrderEditModal, refresh, skip } =
    data;
  return (
    <TableViewForMobile rows={allOutlets} loading={loading}>
      {!loading &&
        allOutlets.map((item, index) => {
          return (
            <MobileTableRows index={index}>
              <MobileTableCell
                columns={["Date created", "Allocation type"]}
                cellData={[item.dateCreated, item.outletID === "Others"? "External customer": "Inhouse"]}
              />
              <MobileTableCell
                columns={["Quantity", "Product"]}
                cellData={[item.quantity, item.product]}
              />
              <MobileTableCell
                columns={["Customer Name", "Address"]}
                cellData={[item.outletID === "Others"? item.customerName: item.outletName, item.deliveryStatus, item.outletID === "Other"? item.customerAddress: item.destination]}
              />
              <MobileTableCell
                columns={["Delivery status", "action"]}
                cellData={[
                  item.deliveryStatus,
                  <Action
                    data={item}
                    setIncomingOrderEditModal={setIncomingOrderEditModal}
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
