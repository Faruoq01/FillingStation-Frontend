import React, { useEffect, useCallback, useState, Fragment } from "react";
import "../../styles/payments.scss";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import ProductOrderModal from "../Modals/ProductOrderModal";
import ProductService from "../../services/productService";
import {
  setProductOrder,
  searchProduct,
  singleProductOrderRecord,
} from "../../storage/productOrder";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ProductReport from "../Reports/ProductReport";
import IncomingList from "../Modals/IncomingList";
import swal from "sweetalert";
import { ThreeDots } from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import ProductOrderEditModal from "../Modals/ProductOrderEditModal";

const mediaMatch = window.matchMedia("(max-width: 530px)");
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
  const history = useHistory();

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

  const refresh = (skip) => {
    setLoading(true);
    const payload = {
      skip: skip * limit,
      limit: limit,
      outletID: oneStationData === null ? "None" : oneStationData?._id,
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
    refresh();
  };

  const nextPage = () => {
    setSkip((prev) => prev + 1);
    refresh(skip + 1);
  };

  const prevPage = () => {
    if (skip < 1) return;
    setSkip((prev) => prev - 1);
    refresh(skip - 1);
  };

  const openOrderDetails = (data) => {
    setOpen2({ ...open2, id: data._id, trigger: true });
  };

  const goToHistory = () => {
    history.push("/home/history");
  };

  const handleDelete = () => {};

  return (
    <Fragment>
      <div data-aos="zoom-in-down" className="paymentsCaontainer">
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
        <div className="inner-pay">
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

          <div className="search">
            <div className="input-cont">
              <div className="second-select">
                <OutlinedInput
                  sx={{
                    width: "100%",
                    height: "35px",
                    background: "#EEF2F1",
                    fontSize: "12px",
                    borderRadius: "0px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #777777",
                    },
                  }}
                  type="text"
                  placeholder="Search"
                  onChange={(e) => {
                    searchTable(e.target.value);
                  }}
                />
              </div>
            </div>
            <div style={{ width: "120px" }} className="butt">
              <Button
                sx={{
                  width: "100%",
                  height: "30px",
                  background: "#427BBE",
                  borderRadius: "0px",
                  fontSize: "12px",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#427BBE",
                  },
                }}
                onClick={createOrderHandler}
                variant="contained">
                {" "}
                Create Order
              </Button>
            </div>
          </div>

          <div className="search2">
            <div className="butt2">
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={entries}
                sx={selectStyle2}>
                <MenuItem style={menu} value={10}>
                  Show entries
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    entriesMenu(20, 15);
                  }}
                  style={menu}
                  value={20}>
                  15 entries
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    entriesMenu(30, 30);
                  }}
                  style={menu}
                  value={30}>
                  30 entries
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    entriesMenu(40, 100);
                  }}
                  style={menu}
                  value={40}>
                  100 entries
                </MenuItem>
              </Select>
            </div>
            <div
              style={{ width: mediaMatch.matches ? "100%" : "190px" }}
              className="input-cont2">
              <Button
                sx={{
                  width: mediaMatch.matches ? "100%" : "100px",
                  height: "30px",
                  background: "#58A0DF",
                  borderRadius: "0px",
                  fontSize: "12px",
                  textTransform: "capitalize",
                  display: mediaMatch.matches && "none",
                  marginTop: mediaMatch.matches ? "10px" : "0px",
                  "&:hover": {
                    backgroundColor: "#58A0DF",
                  },
                }}
                onClick={goToHistory}
                variant="contained">
                {" "}
                History
              </Button>
              <Button
                sx={{
                  width: mediaMatch.matches ? "100%" : "80px",
                  height: "30px",
                  background: "#F36A4C",
                  borderRadius: "0px",
                  fontSize: "12px",
                  textTransform: "capitalize",
                  display: mediaMatch.matches && "none",
                  marginTop: mediaMatch.matches ? "10px" : "0px",
                  "&:hover": {
                    backgroundColor: "#F36A4C",
                  },
                }}
                onClick={printReport}
                variant="contained">
                {" "}
                Print
              </Button>
            </div>
          </div>

          {mobile.matches ? (
            !loadingData ? (
              productOrder.length === 0 ? (
                <div style={place}>No data</div>
              ) : (
                productOrder.map((item, index) => {
                  return (
                    <div key={index} className="mobile-table-container">
                      <div className="inner-container">
                        <div className="row">
                          <div className="left-text">
                            <div className="heads">{item.depot}</div>
                            <div className="foots">Company</div>
                          </div>
                          <div className="right-text">
                            <div className="heads">{item.productType}</div>
                            <div className="foots">Product</div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="left-text">
                            <div className="heads">{item.quantity}</div>
                            <div className="foots">Ordered quantity</div>
                          </div>
                          <div className="right-text">
                            <div className="heads">{item.quantityLoaded}</div>
                            <div className="foots">Loaded Quantity</div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="left-text">
                            <div className="heads">{item.dateCreated}</div>
                            <div className="foots">Date created</div>
                          </div>
                          <div className="right-text">
                            <div className="heads">{item.currentBalance}</div>
                            <div className="foots">Current Balance</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              <div style={load}>
                <ThreeDots
                  height="60"
                  width="50"
                  radius="9"
                  color="#076146"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              </div>
            )
          ) : (
            <div className="table-container">
              <div className="table-head">
                <div className="column">S/N</div>
                <div className="column">Date Created</div>
                <div className="column">Company</div>
                <div className="column">Depot Address</div>
                <div className="column">Product</div>
                <div className="column">Quantity Ordered (ltr)</div>
                <div className="column">Quantity Loaded (ltr)</div>
                <div className="column">Current balance (ltr)</div>
                <div className="column">Actions</div>
              </div>

              <div className="row-container">
                {!loadingData ? (
                  productOrder.length === 0 ? (
                    <div style={place}>No product data</div>
                  ) : (
                    productOrder.map((data, index) => {
                      return (
                        <div className="table-head2">
                          <div className="column">{index + 1}</div>
                          <div className="column">{data.dateCreated}</div>
                          <div className="column">{data.depot}</div>
                          <div className="column">{data.depotAddress}</div>
                          <div className="column">{data.productType}</div>
                          <div className="column">{data.quantity}</div>
                          <div className="column">{data.quantityLoaded}</div>
                          <div className="column">{data.currentBalance}</div>

                          <div className="column">
                            <div
                              style={{ justifyContent: "space-around" }}
                              className="actions">
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
                                onClick={handleDelete}
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
                          </div>
                        </div>
                      );
                    })
                  )
                ) : (
                  <div style={load}>
                    <ThreeDots
                      height="60"
                      width="50"
                      radius="9"
                      color="#076146"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClassName=""
                      visible={true}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="footer">
            <div style={{ fontSize: "12px" }}>
              Showing {(skip + 1) * limit - (limit - 1)} to {(skip + 1) * limit}{" "}
              of {total} entries
            </div>
            <div className="nav">
              <button onClick={prevPage} className="but">
                Previous
              </button>
              <div className="num">{skip + 1}</div>
              <button onClick={nextPage} className="but2">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {productOrderEditModal && (
        <ProductOrderEditModal
          refresh={refresh}
          open={productOrderEditModal}
          close={setProductOrderEditModal}
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

const place = {
  width: "100%",
  textAlign: "center",
  fontSize: "12px",
  marginTop: "20px",
  color: "green",
};

const menu = {
  fontSize: "12px",
};

const load = {
  width: "100%",
  height: "30px",
  display: "flex",
  justifyContent: "center",
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

export default ProductOrders;
