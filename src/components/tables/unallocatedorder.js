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
import { singleUnallocatedOrder } from "../../storage/incomingOrder";
import swal from "sweetalert";
import IncomingService from "../../services/360station/IncomingService";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Action = ({ data, setOpenEditUnallocated, refresh, skip }) => {
  const dispatch = useDispatch();
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updateDate = useSelector((state) => state.dashboard.dateRange);

  const handleDelete = (data) => {
    if(data.deliveryStatus === "approved"){
      return swal("Error", "This order has already been approved, disapprove to delete", "error");
    }else{
      swal({
        title: "Alert!",
        text: "Are you sure you want to delete this record?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          IncomingService.deleteUnallocated(data).then(()=>{
            refresh(oneStationData._id, updateDate, skip);
            swal("Success", "Record deleted successfully", 'success');
          })
        }
      });
    }
  };

  const openEditModal = (data) => {
    dispatch(singleUnallocatedOrder(data));
    setOpenEditUnallocated(true);
  }

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
          onClick={()=>openEditModal(data)}
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

const allocateOrder = (setOpenAllocated, item, dispatch) => {
  setOpenAllocated(true);
  dispatch(singleUnallocatedOrder(item));
}

export const UnallocatedOrderDesktop = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    columns,
    tablePrints,
    allOutlets,
    loading,
    setOpenEditUnallocated,
    refresh,
    skip,
    setOpenAllocated
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
                <DesktopTableCell data={item.depotStation} />
                <DesktopTableCell data={item.destination} />
                <DesktopTableCell data={item.product} />
                <DesktopTableCell data={item.quantity} />
                <DesktopTableCell data={item.truckNo} />
                <DesktopTableCell data={item.wayBillNo} />
                <DesktopTableCell data={item.deliveryStatus} />
                <DesktopTableCell
                  data={
                    item.deliveryStatus === 'pending'?
                    <Action
                      data={item}
                      setOpenEditUnallocated={setOpenEditUnallocated}
                      refresh={refresh}
                      skip={skip}
                    />:
                    item.deliveryStatus === 'approved'?
                    <Button onClick={()=>{allocateOrder(setOpenAllocated, item, dispatch)}} sx={allocate}>Allocate</Button>:
                    <Button onClick={()=>{navigate("/home/unallocatedorder/incomingorder")}} sx={allocate}>View</Button>
                  }
                />
              </DesktopTableRows>
            );
          })}
      </DesktopTableRowContainer>
    </TableViewForDesktop>
  );
};

export const UnallocatedOrderMobileTable = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allOutlets, loading, setOpenEditUnallocated, refresh, skip, setOpenAllocated } =
    data;
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
                columns={["Waybill no", "Delivery status"]}
                cellData={[item.wayBillNo, item.deliveryStatus]}
              />
              <MobileTableCell
                columns={["", "action"]}
                cellData={[
                  "",
                  item.deliveryStatus === 'pending'?
                  <Action
                    data={item}
                    setOpenEditUnallocated={setOpenEditUnallocated}
                    refresh={refresh}
                    skip={skip}
                  />: 
                  item.deliveryStatus === 'approved'?
                  <Button onClick={()=>{allocateOrder(setOpenAllocated, item, dispatch)}} sx={allocate}>Allocate</Button>:
                  <Button onClick={()=>{navigate("/home/unallocatedorder/incomingorder")}} sx={allocate}>View</Button>
                  ,
                ]}
              />
            </MobileTableRows>
          );
        })}
    </TableViewForMobile>
  );
};

const allocate = {
  height: '30px',
  textTransform: 'capitalize',
  background: '#006892',
  fontSize: '12px',
  color: 'white',
  '&:hover':{
    background: '#006892',
  }
}

const styles = {
  icons: {
    cursor: "pointer",
    color: "#fff",
    padding: 3,
    backgroundColor: "#06805b",
    borderRadius: "100%",
  },
};
