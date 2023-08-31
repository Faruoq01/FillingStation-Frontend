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
import { singlePaymentAction } from "../../storage/regulatory";
import { Button } from "@mui/material";
import config from "../../constants";

const Action = ({ data, setEditPaymentModal, refresh }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {};

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
            dispatch(singlePaymentAction(data));
            setEditPaymentModal(true);
          }}
        />
        <DeleteIcon
          onClick={handleDelete}
          style={{
            ...styles.icons,
            backgroundColor: "red",
          }}
        />
      </div>
    </React.Fragment>
  );
};

export const RegulatoryDesktopTable = ({ data }) => {
  const {
    columns,
    tablePrints,
    allOutlets,
    loading,
    setEditPaymentModal,
    refresh,
    viewDescription,
  } = data;

  return (
    <TableViewForDesktop columns={columns} ref={tablePrints}>
      <DesktopTableRowContainer rows={allOutlets} loading={loading}>
        {!loading &&
          allOutlets.map((item, index) => {
            return (
              <DesktopTableRows index={index}>
                <DesktopTableCell data={index + 1} />
                <DesktopTableCell data={item.organisationalName} />
                <DesktopTableCell
                  data={
                    <ViewMore data={item} viewDescription={viewDescription} />
                  }
                />
                <DesktopTableCell data={item.amount} />
                <DesktopTableCell data={item.contactPerson} />
                <DesktopTableCell
                  data={<ViewCert item={item} label={"DPRCertificate"} />}
                />
                <DesktopTableCell
                  data={<ViewCert item={item} label={"DPRReceip"} />}
                />
                <DesktopTableCell
                  data={
                    <Action
                      data={item}
                      setEditPaymentModal={setEditPaymentModal}
                      refresh={refresh}
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

export const RegulatoryMobileTable = ({ data }) => {
  const { allOutlets, loading, setEditPaymentModal, refresh, viewDescription } =
    data;
  return (
    <TableViewForMobile rows={allOutlets} loading={loading}>
      {!loading &&
        allOutlets.map((item, index) => {
          return (
            <MobileTableRows index={index}>
              <MobileTableCell
                columns={["Organisation", "Description"]}
                cellData={[
                  item.organisationalName,
                  <ViewMore data={item} viewDescription={viewDescription} />,
                ]}
              />
              <MobileTableCell
                columns={["Amount", "Contact person"]}
                cellData={[item.amount, item.contactPerson]}
              />
              <MobileTableCell
                columns={["Certificate", "Reciept"]}
                cellData={[
                  <ViewCert item={item} label={"DPRCertificate"} />,
                  <ViewCert item={item} label={"DPRReceip"} />,
                ]}
              />
              <MobileTableCell
                columns={["", "action"]}
                cellData={[
                  "",
                  <Action
                    data={item}
                    setEditPaymentModal={setEditPaymentModal}
                    refresh={refresh}
                  />,
                ]}
              />
            </MobileTableRows>
          );
        })}
    </TableViewForMobile>
  );
};

const ViewMore = ({ data, viewDescription }) => {
  return (
    <Button
      sx={{
        width: "80px",
        height: "30px",
        background: "#F36A4C",
        borderRadius: "3px",
        fontSize: "10px",
        "&:hover": {
          backgroundColor: "#F36A4C",
        },
      }}
      onClick={() => {
        viewDescription(data);
      }}
      variant="contained">
      {" "}
      View
    </Button>
  );
};

const ViewCert = ({ item, label }) => {
  return (
    <a
      href={config.BASE_URL + item.attachCertificate}
      target="_blank"
      rel="noreferrer">
      {label}
    </a>
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
