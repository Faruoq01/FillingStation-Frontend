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
import config from "../../constants";
import { Button } from "@mui/material";

const confirmPaym = (data, confirmPayment) => {
  return (
    <React.Fragment>
      {"confirmation" in data ? (
        data.confirmation === "null" ? (
          <Button
            sx={confirmButton}
            onClick={() => {
              confirmPayment(data, "bank");
            }}
            variant="contained">
            {" "}
            Confirm
          </Button>
        ) : (
          <div>{data.confirmation}</div>
        )
      ) : (
        <Button
          sx={confirmButton}
          onClick={() => {
            confirmPayment(data, "bank");
          }}
          variant="contained">
          {" "}
          Confirm
        </Button>
      )}
    </React.Fragment>
  );
};

const getReciept = (data) => {
  return (
    <React.Fragment>
      {data.attachApproval !== "null" && (
        <a
          href={config.BASE_URL + data.attachApproval}
          target="_blank"
          rel="noreferrer">
          View Slip
        </a>
      )}
      {data.attachApproval === "null" && <span>No attachment</span>}
    </React.Fragment>
  );
};

export const BankPaymentDesktopTable = ({ data }) => {
  const { columns, tablePrints, allOutlets, loading, confirmPayment } = data;

  return (
    <TableViewForDesktop columns={columns} ref={tablePrints}>
      <DesktopTableRowContainer rows={allOutlets} loading={loading}>
        {!loading &&
          allOutlets.map((item, index) => {
            return (
              <DesktopTableRows index={index}>
                <DesktopTableCell data={index + 1} />
                <DesktopTableCell data={item.bankName} />
                <DesktopTableCell data={item.tellerNumber} />
                <DesktopTableCell data={item.amountPaid} />
                <DesktopTableCell data={item.paymentDate} />
                <DesktopTableCell data={item.createdAt} />
                <DesktopTableCell data={confirmPaym(item, confirmPayment)} />
                <DesktopTableCell data={getReciept(item)} />
              </DesktopTableRows>
            );
          })}
      </DesktopTableRowContainer>
    </TableViewForDesktop>
  );
};

export const BankPaymentMobileTable = ({ data }) => {
  const { allOutlets, loading, confirmPayment } = data;
  return (
    <TableViewForMobile rows={allOutlets} loading={loading}>
      {!loading &&
        allOutlets.map((item, index) => {
          return (
            <MobileTableRows index={index}>
              <MobileTableCell
                columns={["Bank name", "Teller number"]}
                cellData={[item.bankName, item.tellerNumber]}
              />
              <MobileTableCell
                columns={["Amount", "Payment date"]}
                cellData={[item.amountPaid, item.paymentDate]}
              />
              <MobileTableCell
                columns={["Date created", "Confirmation"]}
                cellData={[item.createdAt, confirmPaym(item, confirmPayment)]}
              />
              <MobileTableCell
                columns={["Reciept", ""]}
                cellData={[getReciept(item), ""]}
              />
            </MobileTableRows>
          );
        })}
    </TableViewForMobile>
  );
};

const confirmButton = {
  width: "60px",
  height: "30px",
  background: "#F36A4C",
  borderRadius: "3px",
  fontSize: "10px",
  textTransform: "capitalize",
  "&:hover": {
    backgroundColor: "#F36A4C",
  },
};
