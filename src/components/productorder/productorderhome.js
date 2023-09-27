import React, { useEffect, useCallback, useState, Fragment } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ProductOrderModal from "../Modals/ProductOrderModal";
import ProductService from "../../services/360station/productService";
import {
  setProductOrder,
  searchProduct,
  singleProductOrderRecord,
} from "../../storage/productOrder";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
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
import { useNavigate } from "react-router-dom";
import DateRangeLib from "../common/DatePickerLib";
import GenerateReports from "../Modals/reports";

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

const ProductOrderHome = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [productOrderEditModal, setProductOrderEditModal] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const productOrder = useSelector((state) => state.productorder.productorder);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updateDate = useSelector((state) => state.dashboard.dateRange);

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

  const getAllProductData = useCallback((updateDate, skip) => {
    refresh("None", updateDate, skip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllProductData(updateDate, skip);
  }, [getAllProductData, updateDate, skip]);

  const refresh = (id, date, skip, limit = 15) => {
    setLoading(true);
    const payload = {
      skip: skip * limit,
      limit: limit,
      organisationID: resolveUserID().id,
      date: date,
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
    refresh("None", updateDate, skip, limit);
  };

  const openOrderDetails = (data) => {
    dispatch(singleProductOrderRecord(data));
    navigate("/home/productorder/deliveredorder");
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
            <DateRangeLib mt={mobile.matches ? "10px" : "0px"} />
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
          updateDate={updateDate}
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
      {prints && (
        <GenerateReports
          open={prints}
          close={setPrints}
          section={"product"}
          data={productOrder}
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

export default ProductOrderHome;
