import edit from "../../assets/comp/edit.png";
import del from "../../assets/comp/delete.png";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { useState } from "react";
import UpdateReturnToTank from "../Modals/DailySales/returnToTank";
import ApproximateDecimal from "../common/approx";
import APIs from "../../services/api";
import { useCallback } from "react";
import { useEffect } from "react";
import { setRTSales, setReturnToTank } from "../../storage/comprehensive";
import { useHistory } from "react-router-dom";
import React from "react";
import { ThreeDots } from "react-loader-spinner";
import { Button } from "@mui/material";
import moment from "moment";
import ReturnToTankModal from "../Modals/comprehensive/returnToTank";

const ReturnToTank = () => {
  const history = useHistory();
  const rtVolumes = useSelector((state) => state.comprehensive.rtVolumes);
  const dispatch = useDispatch();
  const currentDate = useSelector((state) => state.dailysales.updatedDate);
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);

  const [openEdit, setOpenEdit] = useState(false);
  const [oneRecord, setOneRecord] = useState({});
  const [load, setLoad] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [addRT, setAddRT] = useState(false);

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

  const getReturnToTankData = useCallback((updatedDate) => {
    if (oneStationData === null) return history.push("/home/daily-sales");
    setLoad(true);
    const payload = {
      organizationID: resolveUserID().id,
      outletID: oneStationData._id,
      date: updatedDate,
    };

    APIs.post("/comprehensive/retruntotank", payload)
      .then(({ data }) => {
        dispatch(setReturnToTank(data.rt));
      })
      .then(() => {
        setLoad(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getReturnToTankData(currentDate);
  }, [getReturnToTankData, currentDate, refresh]);

  const rate = (data) => {
    if (data.productType === "PMS") return data.PMSPrice;
    if (data.productType === "AGO") return data.AGOPrice;
    if (data.productType === "DPK") return data.DPKPrice;
  };

  const amount = (data, type) => {
    if (type === "PMS") return data.PMSPrice * data.rtLitre;
    if (type === "AGO") return data.AGOPrice * data.rtLitre;
    if (type === "DPK") return data.DPKPrice * data.rtLitre;
  };

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
        APIs.post("/sales/delete/rt", { id: data._id })
          .then(() => {
            setRefresh(!refresh);
          })
          .then(() => {
            swal("Success", "Record deleted successfully", "success");
          });
      }
    });
  };

  const RTRows = ({ data }) => {
    return (
      <div style={{ marginTop: "5px" }} className="product_balance_header">
        <div style={ins} className="cells">
          {data.pumpName}
        </div>
        <div style={ins} className="cells">
          {data.tankName}
        </div>
        <div style={ins} className="cells">
          {data.productType}
        </div>
        <div style={ins} className="cells">
          {ApproximateDecimal(data.rtLitre)}
        </div>
        <div style={ins} className="cells">
          {rate(data)}
        </div>
        <div style={ins} className="cells">
          {ApproximateDecimal(amount(data, data.productType))}
        </div>
        {getPerm("13") && (
          <div style={ins} className="cells">
            <img
              onClick={() => {
                updateRecord(data);
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

  const MobileRTRows = ({ data }) => {
    return (
      <div className="supply_card">
        <div style={rows}>
          <div style={{ width: "100%" }}>
            <div style={title}>{data.pumpName}</div>
            <div style={label}>Pump Name</div>
          </div>

          <div style={{ width: "100%" }}>
            <div style={title}>{data.tankName}</div>
            <div style={label}>Tank Name</div>
          </div>
        </div>

        <div style={rows}>
          <div style={{ width: "100%" }}>
            <div style={title}>{data.productType}</div>
            <div style={label}>Product</div>
          </div>

          <div style={{ width: "100%" }}>
            <div style={title}>{ApproximateDecimal(data.rtLitre)}</div>
            <div style={label}>Litre Qty</div>
          </div>
        </div>

        <div style={rows}>
          <div style={{ width: "100%" }}>
            <div style={title}>{rate(data)}</div>
            <div style={label}>Rate</div>
          </div>

          <div style={{ width: "100%" }}>
            <div style={title}>
              {ApproximateDecimal(amount(data, data.productType))}
            </div>
            <div style={label}>Amount</div>
          </div>
        </div>

        <div style={rows}>
          <div style={{ width: "100%" }}>
            <div style={title}></div>
            <div style={label}></div>
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

  const openSingleSaleModal = async () => {
    const getDate =
      currentDate === ""
        ? moment().format("YYYY-MM-DD").split()[0]
        : currentDate;

    const status = await APIs.post("/comprehensive/check-sales-today", {
      org: resolveUserID().id,
      outletID: oneStationData._id,
      date: getDate,
      rt: true,
    }).then(({ data }) => {
      dispatch(setRTSales(data.data));
      return data.data;
    });

    if (status.sales.length === 0) {
      swal(
        "Error",
        "Can only add return to tank if there was sales today!",
        "error"
      );
    } else {
      setAddRT(true);
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
        const getDate =
          currentDate === ""
            ? moment().format("YYYY-MM-DD").split()[0]
            : currentDate;

        APIs.post("/sales/delete/reset-rt", {
          date: getDate,
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
          <div className="initial_balance_container">
            {openEdit && (
              <UpdateReturnToTank
                data={oneRecord}
                open={openEdit}
                close={setOpenEdit}
              />
            )}
            {addRT && (
              <ReturnToTankModal
                update={setRefresh}
                open={addRT}
                close={setAddRT}
              />
            )}
            <div className="product_balance_header">
              <div className="cells">Pump Name</div>
              <div className="cells">Tank Name</div>
              <div className="cells">Product</div>
              <div className="cells">Quantity</div>
              <div className="cells">Rate</div>
              <div className="cells">Amount</div>
              {getPerm("13") && <div className="cells">Action</div>}
            </div>

            {rtVolumes?.length === 0 ? (
              <div>No records</div>
            ) : (
              rtVolumes.map((item, index) => {
                return <RTRows key={index} data={item} />;
              })
            )}
          </div>

          <div className="initial_balance_container_mobile">
            {/* Supply records */}
            <div className="mobile_header">
              &nbsp;&nbsp;&nbsp; Return to tank
            </div>
            <div
              style={{ marginBottom: "20px", marginTop: "10px" }}
              className="balance_mobile_detail">
              <div className="sups">
                <div className="slide">
                  {rtVolumes?.length === 0 ? (
                    <div>No records</div>
                  ) : (
                    rtVolumes.map((item, index) => {
                      return <MobileRTRows key={index} data={item} />;
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

export default ReturnToTank;
