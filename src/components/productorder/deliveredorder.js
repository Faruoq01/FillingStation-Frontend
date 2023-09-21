import React from "react";
import TablePageBackground from "../controls/PageLayout/TablePageBackground";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import TableNavigation from "../controls/PageLayout/TableNavigation";
import { useState } from "react";
import {
  DeliveredOrderDesktopTable,
  DeliveredOrderMobileTable,
} from "../tables/deliveredorder";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import IncomingService from "../../services/360station/IncomingService";
import { useEffect } from "react";

const columns = [
  "S/N",
  "Date created",
  "Depot station",
  "Discharge station",
  "Product",
  "Quantity",
  "Truck No",
  "Status",
  "Shortage",
  "Overage",
];

const mobile = window.matchMedia("(max-width: 600px)");

const DeliveredOrder = () => {
  const deliveredOrder = [];
  const productOrder = useSelector((state) => state.productorder.productorder);
  const [entries, setEntries] = useState(10);

  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  //   const [prints, setPrints] = useState(false);
  const [load, setLoad] = useState(false);

  const getIncomingList = useCallback(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getIncomingList();
  }, [getIncomingList]);

  const refresh = () => {
    setLoad(true);
    const payload = {
      productOrderID: productOrder._id,
      limit: limit,
      skip: skip * limit,
    };

    IncomingService.getAllIncoming4(payload)
      .then((data) => {
        console.log(data);
      })
      .then(() => {
        setLoad(false);
      });
  };

  const printReport = () => {
    // if (!getPerm("3")) return swal("Warning!", "Permission denied", "info");
    // setPrints(true);
  };

  const desktopTableData = {
    columns: columns,
    tablePrints: printReport,
    allOutlets: deliveredOrder,
    loading: load,
    refresh: refresh,
    skip: skip,
  };

  const mobileTableData = {
    allOutlets: deliveredOrder,
    loading: load,
    refresh: refresh,
    skip: skip,
  };

  return (
    <React.Fragment>
      <TablePageBackground>
        <TableControls>
          <LeftControls>
            {/* <SearchField callback={searchTable} /> */}
          </LeftControls>
          <RightControls>
            {/* <CreateButton
              callback={createOrderHandler}
              label={"Create Order"}
            /> */}
          </RightControls>
        </TableControls>

        {mobile.matches ? (
          <DeliveredOrderMobileTable data={mobileTableData} />
        ) : (
          <DeliveredOrderDesktopTable data={desktopTableData} />
        )}

        <TableNavigation
          skip={skip}
          limit={limit}
          total={total}
          setSkip={setSkip}
          updateDate={"None"}
          callback={refresh}
        />
      </TablePageBackground>
    </React.Fragment>
  );
};

export default DeliveredOrder;
