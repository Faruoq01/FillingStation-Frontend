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
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import swal from "sweetalert";
import { useDispatch } from "react-redux";
import { singleProductOrderRecord } from "../../storage/productOrder";
import ProductService from "../../services/360station/productService";

const Action = ({
  data,
  setProductOrderEditModal,
  openOrderDetails,
  refresh,
  skip,
}) => {
  const dispatch = useDispatch();

  const handleDelete = (data) => {
    swal({
      title: "Alert!",
      text: "Are you sure you want to delete this record?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const gap = Number(data.quantity) - Number(data.currentBalance);

        if (gap > 0)
          return swal(
            "Warning!",
            `${gap} litres has already been loaded, please new quantity should be greater than this.`,
            "info"
          );

        ProductService.deleteProductOrder({ ...data, id: data._id }).then(
          () => {
            refresh("None", "None", skip);
            swal(
              "Success",
              "Product order has been updated successfully!",
              "success"
            );
          }
        );
      }
    });
  };

  return (
    <React.Fragment>
      <div
        style={{
          width: "110px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}>
        <EditIcon
          style={{
            ...styles.icons,
            backgroundColor: "#054835",
          }}
          onClick={() => {
            dispatch(singleProductOrderRecord(data));
            setProductOrderEditModal(true);
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
        <VisibilityIcon
          onClick={() => {
            openOrderDetails(data);
          }}
          style={{
            ...styles.icons,
            backgroundColor: "#06805b",
          }}
        />
      </div>
    </React.Fragment>
  );
};

export const ProductDesktopTable = ({ data }) => {
  const {
    columns,
    tablePrints,
    allOutlets,
    loading,
    setProductOrderEditModal,
    openOrderDetails,
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
                <DesktopTableCell data={item.depot} />
                <DesktopTableCell data={item.depotAddress} />
                <DesktopTableCell data={item.productType} />
                <DesktopTableCell data={item.quantity} />
                <DesktopTableCell data={item.quantityLoaded} />
                <DesktopTableCell data={item.currentBalance} />
                <DesktopTableCell
                  data={
                    <Action
                      data={item}
                      setProductOrderEditModal={setProductOrderEditModal}
                      openOrderDetails={openOrderDetails}
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

export const ProductMobileTable = ({ data }) => {
  const {
    allOutlets,
    loading,
    setProductOrderEditModal,
    openOrderDetails,
    refresh,
    skip,
  } = data;
  return (
    <TableViewForMobile rows={allOutlets} loading={loading}>
      {!loading &&
        allOutlets.map((item, index) => {
          return (
            <MobileTableRows index={index}>
              <MobileTableCell
                columns={["Date created", "Company"]}
                cellData={[item.dateCreated, item.depot]}
              />
              <MobileTableCell
                columns={["Deport Address", "Product"]}
                cellData={[item.depotAddress, item.productType]}
              />
              <MobileTableCell
                columns={["Quantity Ordered", "Quantity Loaded"]}
                cellData={[item.quantity, item.quantityLoaded]}
              />
              <MobileTableCell
                columns={["Current balance", "action"]}
                cellData={[
                  item.currentBalance,
                  <Action
                    data={item}
                    setProductOrderEditModal={setProductOrderEditModal}
                    openOrderDetails={openOrderDetails}
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
