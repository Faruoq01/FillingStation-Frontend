import edit from "../../assets/comp/edit.png";
import del from "../../assets/comp/delete.png";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import UpdateDipping from "../Modals/DailySales/Dipping";
import { useState } from "react";
import ApproximateDecimal from "../common/approx";
import APIs from "../../services/connections/api";
import { useEffect } from "react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { setSalesList, setTankLevels } from "../../storage/comprehensive";
import React from "react";
import { ThreeDots } from "react-loader-spinner";
import { Button } from "@mui/material";
import DippingModal from "../Modals/comprehensive/dipping";

const Dipping = () => {
  const navigate = useNavigate();
  const dipping = useSelector((state) => state.comprehensive.tankLevels);

  const dispatch = useDispatch();
  const currentDate = useSelector((state) => state.dashboard.dateRange);
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const salesShift = useSelector((state) => state.dailysales.salesShift);

  const [openEdit, setOpenEdit] = useState(false);
  const [openDipping, setOpenDipping] = useState(false);
  const [oneRecord, setOneRecord] = useState({});
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);

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

  const getTankLevels = useCallback((updatedDate, salesShift) => {
    if (oneStationData === null)
      return navigate("/home/dailysales/dailysaleshome/0");
    setLoad(true);
    const payload = {
      organizationID: resolveUserID().id,
      outletID: oneStationData._id,
      date: updatedDate[0],
      shift: salesShift,
    };

    APIs.post("/comprehensive/tankLevels", payload)
      .then(({ data }) => {
        dispatch(setTankLevels(data.tankLevels));
      })
      .then(() => {
        setLoad(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getTankLevels(currentDate, salesShift);
  }, [getTankLevels, currentDate, refresh, salesShift]);

  const updateRecord = (data) => {
    setOpenEdit(true);
    setOneRecord(data);
  };

  const deleteRecord = (data) => {
    swal({
      title: "Alert!",
      text: "Are you sure you want to delete this record?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        APIs.post("/sales/delete/dipping", { id: data._id })
          .then((data) => {
            setRefresh(!refresh);
          })
          .then(() => {
            swal("Success", "Record deleted successfully", "success");
          });
      }
    });
  };

  const DippingRow = (props) => {
    return (
      <div style={{ marginTop: "5px" }} className="product_balance_header">
        <div style={ins} className="cells">
          {props.index + 1}
        </div>
        <div style={ins} className="cells">
          {props.data.tankName}
        </div>
        <div style={ins} className="cells">
          {props.data.productType}
        </div>
        <div style={ins} className="cells">
          {ApproximateDecimal(props.data.afterSales)}
        </div>
        <div style={ins} className="cells">
          {ApproximateDecimal(props.data.dipping)}
        </div>
        <div style={ins} className="cells">
          {ApproximateDecimal(
            Number(props.data.dipping) - Number(props.data.afterSales)
          )}
        </div>
        {getPerm("17") && (
          <div style={ins} className="cells">
            <img
              onClick={() => {
                updateRecord(props.data);
              }}
              style={{ width: "20px", height: "20px", marginRight: "10px" }}
              src={edit}
              alt="icon"
            />
            <img
              onClick={() => {
                deleteRecord(props.data);
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

  const MobileDippingRow = ({ data }) => {
    return (
      <div className="supply_card">
        <div style={rows}>
          <div style={{ width: "100%" }}>
            <div style={title}>{data.tankName}</div>
            <div style={label}>Tank Name</div>
          </div>

          <div style={{ width: "100%" }}>
            <div style={title}>{data.productType}</div>
            <div style={label}>Product</div>
          </div>
        </div>

        <div style={rows}>
          <div style={{ width: "100%" }}>
            <div style={title}>
              {ApproximateDecimal(Number(data.afterSales))}
            </div>
            <div style={label}>Computed Level</div>
          </div>

          <div style={{ width: "100%" }}>
            <div style={title}>{ApproximateDecimal(data.dipping)}</div>
            <div style={label}>Dipping</div>
          </div>
        </div>

        <div style={rows}>
          <div style={{ width: "100%" }}>
            <div style={title}>
              {ApproximateDecimal(
                Number(data.dipping) - Number(data.afterSales)
              )}
            </div>
            <div style={label}>Difference</div>
          </div>

          <div style={{ width: "100%" }}>
            <div style={title}>
              {getPerm("13") && (
                <div className="cells">
                  <img
                    onClick={() => {
                      updateRecord(data);
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

  const openAddDipping = async () => {
    const status = await APIs.post("/comprehensive/check-sales-today", {
      org: resolveUserID().id,
      outletID: oneStationData._id,
      date: currentDate[0],
      rt: false,
      shift: salesShift,
    }).then(({ data }) => {
      dispatch(setSalesList(data.data));
      return data.data;
    });

    if (status.length === 0) {
      swal("Error", "Can only add lpo if there was sales today!", "error");
    } else {
      setOpenDipping(true);
    }
  };

  const resetAll = () => {
    swal({
      title: "Alert!",
      text: "Are you sure you want to delete all record?, this will erase all records on the current selected date only.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        APIs.post("/sales/delete/reset-dipping", {
          date: currentDate[0],
          station: oneStationData,
        }).then(() => {
          setRefresh(!refresh);
          swal("Success", "Record deleted successfully", "success");
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
          <div style={{ width: "95%" }} className="butStyle">
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
              onClick={openAddDipping}
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
          <div className="initial_balance_container">
            {openEdit && (
              <UpdateDipping
                update={setRefresh}
                data={oneRecord}
                open={openEdit}
                close={setOpenEdit}
              />
            )}
            {openDipping && (
              <DippingModal
                update={setRefresh}
                open={openDipping}
                close={setOpenDipping}
              />
            )}
            <div className="product_balance_header">
              <div className="cells">S/N</div>
              <div className="cells">Tank Name</div>
              <div className="cells">Product</div>
              <div className="cells">Computed Level</div>
              <div className="cells">Dipping</div>
              <div className="cells">Difference</div>
              {getPerm("17") && <div className="cells">Action</div>}
            </div>

            {dipping.length === 0 ? (
              <div>No records </div>
            ) : (
              dipping.map((item, index) => {
                return <DippingRow key={index} data={item} index={index} />;
              })
            )}
          </div>

          <div className="initial_balance_container_mobile">
            {/* Supply records */}
            <div className="mobile_header">&nbsp;&nbsp;&nbsp; Dipping</div>
            <div
              style={{ marginBottom: "20px", marginTop: "10px" }}
              className="balance_mobile_detail">
              <div className="sups">
                <div className="slide">
                  {dipping.length === 0 ? (
                    <div>No records </div>
                  ) : (
                    dipping.map((item, index) => {
                      return (
                        <MobileDippingRow
                          key={index}
                          data={item}
                          index={index}
                        />
                      );
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

export default Dipping;
