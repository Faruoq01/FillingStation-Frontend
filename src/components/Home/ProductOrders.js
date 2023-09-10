import React, { useEffect, useCallback, useState, Fragment } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ProductOrderModal from "../Modals/ProductOrderModal";
import ProductService from "../../services/360station/productService";
import { setProductOrder, searchProduct } from "../../storage/productOrder";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ProductReport from "../Reports/ProductReport";
import IncomingList from "../Modals/IncomingList";
import swal from "sweetalert";
import ProductOrderEditModal from "../Modals/ProductOrderEditModal";
import TablePageBackground from "../controls/PageLayout/TablePageBackground";
import {
  LeftControls,
  RightControls,
  TableControls,
} from "../controls/PageLayout/TableControls";
import { SearchField } from "../common/searchfields";
import { CreateButton, PrintButton } from "../common/buttons";
import { LimitSelect } from "../common/customselect";
import TableNavigation from "../controls/PageLayout/TableNavigation";
import {
  ProductDesktopTable,
  ProductMobileTable,
} from "../tables/productorder";

const columns = [
  "S/N",
  "Date created",
  "Company",
  "Depot Address",
  "Product",
  "Quantity Ordered (ltr)",
  "Quantity Loaded (ltr)",
  "Current balance (ltr)",
  "Actions",
];

const mobile = window.matchMedia("(max-width: 600px)");

const ProductOrders = () => {
  const [open, setOpen] = React.useState(false);
  const [productOrderEditModal, setProductOrderEditModal] = useState(false);
  const [open2, setOpen2] = React.useState({ id: "", trigger: false });
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const productOrder = useSelector((state) => state.productorder.productorder);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);

  const [entries, setEntries] = useState(10);

  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [prints, setPrints] = useState(false);
  const [loadingData, setLoading] = useState(false);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getPerm = (e) => {
    if (user.userType === "superAdmin") {
      return true;
    }
    return user.permission?.productOrder[e];
  };

  const createOrderHandler = () => {
    if (!getPerm("2")) return swal("Warning!", "Permission denied", "info");
    setOpen(true);
  };

  const getAllProductData = useCallback(() => {
    setLoading(true);

    const payload = {
      skip: skip * limit,
      limit: limit,
      organisationID: resolveUserID().id,
    };

    ProductService.getAllProductOrder(payload).then((data) => {
      setLoading(false);
      setTotal(data.product.count);
      dispatch(setProductOrder(data.product.product));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllProductData();
  }, [getAllProductData]);

  const refresh = (id, date, skip) => {
    setLoading(true);
    const payload = {
      skip: skip * limit,
      limit: limit,
      outletID: id,
      organisationID: resolveUserID().id,
    };

    ProductService.getAllProductOrder(payload)
      .then((data) => {
        setTotal(data.product.count);
        dispatch(setProductOrder(data.product.product));
      })
      .then(() => {
        setLoading(false);
      });
  };

  const searchTable = (value) => {
    dispatch(searchProduct(value));
  };

  const printReport = () => {
    if (!getPerm("3")) return swal("Warning!", "Permission denied", "info");
    setPrints(true);
  };

  const entriesMenu = (value, limit) => {
    setEntries(value);
    setLimit(limit);
    refresh("None", "None", skip);
  };

  const openOrderDetails = (data) => {
    setOpen2({ ...open2, id: data._id, trigger: true });
  };

  const desktopTableData = {
    columns: columns,
    tablePrints: printReport,
    allOutlets: productOrder,
    loading: loadingData,
    setProductOrderEditModal: setProductOrderEditModal,
    openOrderDetails: openOrderDetails,
    refresh: refresh,
    skip: skip,
  };

  const mobileTableData = {
    allOutlets: productOrder,
    loading: loadingData,
    setProductOrderEditModal: setProductOrderEditModal,
    openOrderDetails: openOrderDetails,
    refresh: refresh,
    skip: skip,
  };

  return (
    <Fragment>
      <TablePageBackground>
        <div className="action">
          <div style={{ width: "150px" }} className="butt2">
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={10}
              sx={{
                ...selectStyle2,
                backgroundColor: "#06805B",
                color: "#fff",
              }}>
              <MenuItem value={10}>Actions</MenuItem>
              <MenuItem onClick={createOrderHandler} value={20}>
                Create Order
              </MenuItem>
              <MenuItem value={30}>Download PDF</MenuItem>
              <MenuItem value={40}>Print</MenuItem>
            </Select>
          </div>
        </div>

        <TableControls>
          <LeftControls>
            <SearchField callback={searchTable} />
          </LeftControls>
          <RightControls>
            <CreateButton
              callback={createOrderHandler}
              label={"Create Order"}
            />
          </RightControls>
        </TableControls>

        <TableControls mt={"10px"}>
          <LeftControls>
            <LimitSelect entries={entries} entriesMenu={entriesMenu} />
          </LeftControls>
          <RightControls>
            <PrintButton callback={printReport} />
          </RightControls>
        </TableControls>

        {mobile.matches ? (
          <ProductMobileTable data={mobileTableData} />
        ) : (
          <ProductDesktopTable data={desktopTableData} />
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
      {productOrderEditModal && (
        <ProductOrderEditModal
          refresh={refresh}
          open={productOrderEditModal}
          close={setProductOrderEditModal}
        />
      )}
      {open && (
        <ProductOrderModal
          station={oneStationData}
          open={open}
          close={setOpen}
          refresh={refresh}
        />
      )}
      {open2.trigger && <IncomingList open={open2} close={setOpen2} />}
      {prints && (
        <ProductReport
          allOutlets={productOrder}
          open={prints}
          close={setPrints}
        />
      )}
    </Fragment>
  );
};

const selectStyle2 = {
  width: "100%",
  height: "35px",
  borderRadius: "0px",
  background: "#F2F1F1B2",
  color: "#000",
  fontSize: "12px",
  outline: "none",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

export default ProductOrders;
