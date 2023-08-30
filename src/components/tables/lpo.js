import ApproximateDecimal from "../common/approx";
import edit2 from "../../assets/edit2.png";
import eyes from "../../assets/eyes.png";
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
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import { singleLPORecord } from "../../storage/lpo";
import { useHistory } from "react-router-dom";

const Action = ({ data, setEditOptionsModal }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.corporateSales[e];
  };

  const openLPOSales = (data) => {
    if (!getPerm("3")) return swal("Warning!", "Permission denied", "info");
    dispatch(singleLPORecord(data));
    history.push("/home/estation/airbnb");
  };

  const createPrice = (data) => {
    if (!getPerm("4")) return swal("Warning!", "Permission denied", "info");
    dispatch(singleLPORecord(data));
    setEditOptionsModal((prev) => !prev);
  };
  return (
    <React.Fragment>
      <img
        onClick={() => {
          openLPOSales(data);
        }}
        style={{ width: "28px", height: "28px" }}
        src={eyes}
        alt="icon"
      />
      <img
        onClick={() => {
          createPrice(data);
        }}
        style={{
          width: "28px",
          height: "28px",
          marginLeft: "10px",
        }}
        src={edit2}
        alt="icon"
      />
    </React.Fragment>
  );
};

export const LPODesktopTable = ({ data }) => {
  const { columns, tablePrints, allOutlets, loading, setEditOptionsModal } =
    data;
  return (
    <TableViewForDesktop columns={columns} ref={tablePrints}>
      <DesktopTableRowContainer rows={allOutlets} loading={loading}>
        {!loading &&
          allOutlets.map((item, index) => {
            return (
              <DesktopTableRows index={index}>
                <DesktopTableCell data={index + 1} />
                <DesktopTableCell data={item.companyName} />
                <DesktopTableCell data={item.address} />
                <DesktopTableCell data={item.personOfContact} />
                <DesktopTableCell
                  data={ApproximateDecimal(item.currentBalance)}
                />
                <DesktopTableCell data={item.paymentStructure} />
                <DesktopTableCell
                  data={
                    <Action
                      data={item}
                      setEditOptionsModal={setEditOptionsModal}
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

export const LPOMobileTable = ({ data }) => {
  const { allOutlets, loading, setEditOptionsModal } = data;
  return (
    <TableViewForMobile rows={allOutlets} loading={loading}>
      {!loading &&
        allOutlets.map((item, index) => {
          return (
            <MobileTableRows index={index}>
              <MobileTableCell
                columns={["Company Name", "Address"]}
                cellData={[item.companyName, item.address]}
              />
              <MobileTableCell
                columns={["Person of contact", "Current balance"]}
                cellData={[item.personOfContact, item.currentBalance]}
              />
              <MobileTableCell
                columns={["Payment structure", "action"]}
                cellData={[
                  item.paymentStructure,
                  <Action
                    data={item}
                    setEditOptionsModal={setEditOptionsModal}
                  />,
                ]}
              />
            </MobileTableRows>
          );
        })}
    </TableViewForMobile>
  );
};
