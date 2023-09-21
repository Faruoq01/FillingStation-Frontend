import React, { useEffect, useCallback, useState } from "react";
import TablePageBackground from "../controls/PageLayout/TablePageBackground";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import TableNavigation from "../controls/PageLayout/TableNavigation";
import {
  DeliveredOrderDesktopTable,
  DeliveredOrderMobileTable,
} from "../tables/deliveredorder";
import { useDispatch, useSelector } from "react-redux";
import IncomingService from "../../services/360station/IncomingService";
import { setDeliveredProduct } from "../../storage/productOrder";
import { LimitSelect } from "../common/customselect";
import { PrintButton } from "../common/buttons";
import DateRangeLib from "../common/DatePickerLib";

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
  const dispatch = useDispatch();
  const product = useSelector((state) => state.productorder.singleProductOrder);
  const deliveredOrder = useSelector(
    (state) => state.productorder.deliveredProduct
  );
  const [entries, setEntries] = useState(10);

  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  //   const [prints, setPrints] = useState(false);
  const [load, setLoad] = useState(false);

  const getIncomingList = useCallback(() => {
    refresh("None", limit, skip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getIncomingList();
  }, [getIncomingList]);

  const refresh = (date, limit, skip) => {
    setLoad(true);
    const payload = {
      productOrderID: product._id,
      limit: limit,
      skip: skip * limit,
    };

    IncomingService.getAllIncoming4(payload)
      .then((data) => {
        setTotal(data.counts);
        dispatch(setDeliveredProduct(data.incoming));
      })
      .then(() => {
        setLoad(false);
      });
  };

  const printReport = () => {
    // if (!getPerm("3")) return swal("Warning!", "Permission denied", "info");
    // setPrints(true);
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    refresh("None", limit, skip);
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
            <LimitSelect entries={entries} entriesMenu={entriesMenu} />
          </LeftControls>
          <RightControls>
            <DateRangeLib />
            <PrintButton callback={printReport} />
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
