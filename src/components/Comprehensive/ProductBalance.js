import edit from "../../assets/comp/edit.png";
import del from "../../assets/comp/delete.png";
import { useDispatch, useSelector } from "react-redux";
import Sales from "../Modals/DailySales/sales";
import { useCallback, useEffect, useState } from "react";
import swal from "sweetalert";
import DailySalesService from "../../services/DailySales";
import ApproximateDecimal from "../common/approx";
import APIs from "../../services/api";
import moment from "moment";
import { setProduct } from "../../storage/comprehensive";
import React from "react";
import { useHistory } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { Button } from "@mui/material";
import PumpUpdate from "../Modals/comprehensive/pumpupdate";

const ProductBalance = (props) => {
  const history = useHistory();
  const sales = useSelector((state) => state.comprehensive.sales);
  const dispatch = useDispatch();
  const currentDate = useSelector((state) => state.dailysales.updatedDate);
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);

  const product = sales[props.type.toLowerCase()];
  const [openEdit, setOpenEdit] = useState(false);
  const [oneRecord, setOneRecord] = useState({});
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

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
    return user.permission?.dailySales[e];
  };

  const getAllProduct = useCallback((updatedDate) => {
    if (oneStationData === null) return history.push("/home/daily-sales");
    setLoad(true);
    const payload = {
      organizationID: resolveUserID().id,
      outletID: oneStationData._id,
      date: updatedDate,
      productType: props.type,
    };

    APIs.post("/comprehensive/products", payload)
      .then(({ data }) => {
        console.log(data, "sales");
        dispatch(setProduct({ type: props.type, data: data.product }));
      })
      .then(() => {
        setLoad(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllProduct(currentDate);
  }, [getAllProduct, currentDate, refresh]);

  const rate = (row, type) => {
    if (type === "PMS") return row.PMSSellingPrice;
    if (type === "AGO") return row.AGOSellingPrice;
    if (type === "DPK") return row.DPKSellingPrice;
  };

  const amount = (row, type) => {
    const diff = Number(row.closingMeter) - Number(row.openingMeter);

    if (type === "PMS") return row.PMSSellingPrice * diff;
    if (type === "AGO") return row.AGOSellingPrice * diff;
    if (type === "DPK") return row.DPKSellingPrice * diff;
  };

  const sumOfDifference = () => {
    const totalDifference = product.reduce((accum, current) => {
      return (
        Number(accum) +
        (Number(current.closingMeter) - Number(current.openingMeter))
      );
    }, 0);

    return totalDifference;
  };

  const sumOfTotals = () => {
    const totalSum = product.reduce((accum, current) => {
      return Number(accum) + amount(current, current.productType);
    }, 0);

    return totalSum;
  };

  const openEditModal = (data) => {
    setOneRecord(data);
    setOpenEdit(true);
  };

  const deleteRecord = (data) => {
    swal({
      title: "Alert!",
      text: "Are you sure you want to delete this record?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const getDate =
          currentDate === ""
            ? moment().format("YYYY-MM-DD").split()[0]
            : currentDate;

        const status = await APIs.post("/sales/delete/checkStatus", {
          org: resolveUserID().id,
          outletID: oneStationData._id,
          date: getDate,
        }).then((data) => {
          return data.data.data;
        });

        if (status) {
          swal(
            "Error!",
            "You can only delete from latest record as balance calculations depends on it!",
            "error"
          );
        } else {
          DailySalesService.deleteSales({
            record: data,
            station: oneStationData,
          })
            .then(() => {
              setRefresh(!refresh);
            })
            .then(() => {
              swal("Success", "Record deleted successfully", "success");
            });
        }
      }
    });
  };

  const ProductRow = ({ data }) => {
    return (
      <div style={{ marginTop: "5px" }} className="product_balance_header">
        <div style={ins} className="cells">
          {data.pumpName}
        </div>
        <div style={ins} className="cells">
          {data.openingMeter}
        </div>
        <div style={ins} className="cells">
          {data.closingMeter}
        </div>
        <div style={ins} className="cells">
          {ApproximateDecimal(
            Number(data.closingMeter) - Number(data.openingMeter)
          )}
        </div>
        <div style={ins} className="cells">
          {rate(data, props.type)}
        </div>
        <div style={ins} className="cells">
          {ApproximateDecimal(amount(data, props.type))}
        </div>
        {getPerm("12") && (
          <div style={ins} className="cells">
            <img
              onClick={() => {
                openEditModal(data);
              }}
              style={{ width: "20px", height: "20px", marginRight: "10px" }}
              src={edit}
              alt="icon"
            />
            <img
              onClick={() => {
                deleteRecord(data);
              }}
              style={{ width: "20px", height: "20px" }}
              src={del}
              alt="icon"
            />
          </div>
        )}
      </div>
    );
  };

  const MobileProduct = ({ data }) => {
    return (
      <div className="supply_card">
        <div style={rows}>
          <div style={{ width: "100%" }}>
            <div style={title}>{data.pumpName}</div>
            <div style={label}>Pump Name</div>
          </div>

          <div style={{ width: "100%" }}>
            <div style={title}>{ApproximateDecimal(data.openingMeter)}</div>
            <div style={label}>Opening Meter</div>
          </div>
        </div>

        <div style={rows}>
          <div style={{ width: "100%" }}>
            <div style={title}>{ApproximateDecimal(data.closingMeter)}</div>
            <div style={label}>Closing meter</div>
          </div>

          <div style={{ width: "100%" }}>
            <div style={title}>{rate(data, props.type)}</div>
            <div style={label}>Rate</div>
          </div>
        </div>

        <div style={rows}>
          <div style={{ width: "100%" }}>
            <div style={title}>
              {ApproximateDecimal(amount(data, props.type))}
            </div>
            <div style={label}>Amount</div>
          </div>

          <div style={{ width: "100%" }}>
            <div style={title}>
              {getPerm("12") && (
                <div className="cells">
                  <img
                    onClick={() => {
                      openEditModal(data);
                    }}
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "10px",
                    }}
                    src={edit}
                    alt="icon"
                  />
                  <img
                    onClick={() => {
                      deleteRecord(data);
                    }}
                    style={{ width: "20px", height: "20px" }}
                    src={del}
                    alt="icon"
                  />
                </div>
              )}
            </div>
            <div style={label}>Action</div>
          </div>
        </div>
      </div>
    );
  };

  const openSingleSaleModal = async () => {
    const getDate =
      currentDate === ""
        ? moment().format("YYYY-MM-DD").split()[0]
        : currentDate;

    const status = await APIs.post("/sales/delete/checkStatus", {
      org: resolveUserID().id,
      outletID: oneStationData._id,
      date: getDate,
    }).then((data) => {
      return data.data.data;
    });

    if (status) {
      swal(
        "Error",
        "Can only add a pump before the next sale is recorded to maintain data consistency!",
        "error"
      );
    } else {
      setOpenAdd(true);
    }
  };

  const resetAll = () => {
    swal({
      title: "Alert!",
      text: "Are you sure you want to delete all record?, this will erase all records on the current selected date only.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const getDate =
          currentDate === ""
            ? moment().format("YYYY-MM-DD").split()[0]
            : currentDate;

        const payload = {
          org: resolveUserID().id,
          outletID: oneStationData._id,
          date: getDate,
        };

        APIs.post("/sales/delete/checkStatus", payload).then((data) => {
          if (data.data.data) {
            swal(
              "Error!",
              "You can only delete from latest record as balance calculations depends on it!",
              "error"
            );
          } else {
            const load = {
              date: getDate,
              station: oneStationData,
            };
            APIs.post("/sales/delete/reset-sales", load).then(({ data }) => {
              if (data.status !== "empty") {
                APIs.post("/sales/delete/supply", load)
                  .then(() => {
                    swal("Success", "Record deleted successfully", "success");
                  })
                  .then((data) => {
                    swal("Success", "Record deleted successfully", "success");
                    setRefresh(!refresh);
                  });
              } else {
                swal("Success", "Record deleted successfully", "success");
                setRefresh(!refresh);
              }
            });
          }
        });
      }
    });
  };

  return (
    <React.Fragment>
      {load ? (
        <ThreeDots
          height="60"
          width="50"
          radius="9"
          color="#06805B"
          ariaLabel="three-dots-loading"
          wrapperStyle={{ marginLeft: "20px" }}
          wrapperClassName=""
          visible={true}
        />
      ) : (
        <div style={{ width: "100%" }}>
          <div className="initial_balance_container">
            {openEdit && (
              <Sales data={oneRecord} open={openEdit} close={setOpenEdit} />
            )}
            {openAdd && (
              <PumpUpdate
                update={setRefresh}
                open={openAdd}
                close={setOpenAdd}
              />
            )}
            <div style={{ marginTop: "30px" }} className="butStyle">
              <Button
                variant="contained"
                onClick={resetAll}
                sx={{
                  ...resetBut,
                  background: "#4CAF50",
                  "&:hover": {
                    backgroundColor: "#4CAF50",
                  },
                }}>
                Reset
              </Button>
              <Button
                variant="contained"
                onClick={openSingleSaleModal}
                sx={{
                  ...resetBut,
                  background: "#f44336",
                  "&:hover": {
                    backgroundColor: "#f44336",
                  },
                }}>
                Add
              </Button>
            </div>
            <div className="product_balance_header">
              <div className="cells">{props.type}</div>
              <div className="cells">Opening</div>
              <div className="cells">Closing</div>
              <div className="cells">Differences</div>
              <div className="cells">Rate</div>
              <div className="cells">Amount</div>
              {getPerm("12") && <div className="cells">Action</div>}
            </div>

            {product?.length === 0 ? (
              <div>No records</div>
            ) : (
              product.map((item, index) => {
                return <ProductRow key={index} data={item} />;
              })
            )}
            <div
              style={{ marginTop: "5px" }}
              className="product_balance_header">
              <div
                style={{ ...ins, background: "transparent" }}
                className="cells"></div>
              <div
                style={{ ...ins, background: "transparent" }}
                className="cells"></div>
              <div
                style={{ ...ins, background: "transparent" }}
                className="cells">
                Total
              </div>
              <div style={ins} className="cells">
                {ApproximateDecimal(sumOfDifference())}
              </div>
              <div style={ins} className="cells"></div>
              <div style={ins} className="cells">
                {ApproximateDecimal(sumOfTotals())}
              </div>
              <div
                style={{ ...ins, background: "transparent" }}
                className="cells"></div>
            </div>
          </div>

          <div className="initial_balance_container_mobile">
            {/* product records */}
            <div className="butStyle">
              <Button
                variant="contained"
                sx={{
                  ...resetBut,
                  background: "#4CAF50",
                  "&:hover": {
                    backgroundColor: "#4CAF50",
                  },
                }}>
                Reset
              </Button>
              <Button
                variant="contained"
                sx={{
                  ...resetBut,
                  background: "#f44336",
                  "&:hover": {
                    backgroundColor: "#f44336",
                  },
                }}>
                Add
              </Button>
            </div>
            <div className="mobile_header">&nbsp;&nbsp;&nbsp; {props.type}</div>
            <div
              style={{ marginBottom: "20px", marginTop: "10px" }}
              className="balance_mobile_detail">
              <div className="sups">
                <div className="slide">
                  {product?.length === 0 ? (
                    <div>No records</div>
                  ) : (
                    product.map((item, index) => {
                      return <MobileProduct key={index} data={item} />;
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const resetBut = {
  width: "80px",
  height: "30px",
  fontSize: "12px",
  marginLeft: "10px",
  borderRadius: "0px",
  textTransform: "capitalize",
};

const ins = {
  background: "#EDEDEDB2",
  color: "#000",
  fontWeight: "600",
};

const rows = {
  width: "90%",
  height: "auto",
  marginTop: "20px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
};

const title = {
  fontSize: "12px",
  fontWeight: "500",
  fontFamily: "Poppins",
  lineHeight: "30px",
  color: "#515151",
};

const label = {
  fontSize: "11px",
  fontWeight: "500",
  fontFamily: "Poppins",
  color: "#07956A",
};

export default ProductBalance;
