import "../../styles/compPayment.scss";
import edit from "../../assets/comp/edit.png";
import del from "../../assets/comp/delete.png";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { useCallback, useEffect, useState } from "react";
import UpdatePayments from "../Modals/DailySales/payments";
import ApproximateDecimal from "../common/approx";
import APIs from "../../services/connections/api";
import { paymentDetails } from "../../storage/comprehensive";
import { Button } from "@mui/material";
import PaymentsModal from "../Modals/comprehensive/payments";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const PaymentDetails = () => {
  const navigate = useNavigate();
  const payments = useSelector((state) => state.comprehensive.paymentDetails);

  const dispatch = useDispatch();
  const currentDate = useSelector((state) => state.dailysales.updatedDate);
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const salesShift = useSelector((state) => state.dailysales.salesShift);

  const [openEdit, setOpenEdit] = useState(false);
  const [oneRecord, setOneRecord] = useState({});
  const [openPayments, setOpenPayments] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [load, setLoad] = useState(false);

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

  const getPaymentDetails = useCallback((updatedDate, salesShift) => {
    if (oneStationData === null) return navigate("dailysales");
    setLoad(true);

    const payload = {
      organisation: resolveUserID().id,
      outletID: oneStationData._id,
      start: updatedDate,
      end: updatedDate,
      shift: salesShift,
    };

    APIs.post("/comprehensive/payments", payload)
      .then(({ data }) => {
        dispatch(paymentDetails(data.netToBank));
      })
      .then(() => {
        setLoad(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getPaymentDetails(currentDate, salesShift);
  }, [getPaymentDetails, currentDate, refresh, salesShift]);

  const updateRecord = (data, bank) => {
    setOpenEdit(true);
    setOneRecord({ data: data, bank: bank });
  };

  const deleteRecord = (data, type) => {
    swal({
      title: "Alert!",
      text: "Are you sure you want to delete this record?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        if (type === "bank") {
          APIs.post("/sales/delete/bankPayment", { id: data._id })
            .then(() => {
              setRefresh(!refresh);
            })
            .then(() => {
              swal("Success", "Record deleted successfully", "success");
            });
        } else {
          APIs.post("/sales/delete/posPayment", { id: data._id })
            .then((data) => {
              setRefresh(!refresh);
            })
            .then(() => {
              swal("Success", "Record deleted successfully", "success");
            });
        }
      }
    });
  };

  const MobileBankPayment = ({ data, type }) => {
    const resolvePayment = () => {
      if (type === "bank")
        return { bank: data.bankName, teller: data.tellerNumber };
      if (type === "pos")
        return { bank: data.posName, teller: data.terminalID };
    };

    return (
      <div className="supply_card">
        <div style={rows}>
          <div style={{ width: "100%" }}>
            <div style={title}>{resolvePayment().bank}</div>
            <div style={label}>
              {type === "bank" ? "Bank Name" : "POS Name"}
            </div>
          </div>

          <div style={{ width: "100%" }}>
            <div style={title}>{resolvePayment().teller}</div>
            <div style={label}>
              {type === "bank" ? "Teller No" : "Terminal ID"}
            </div>
          </div>
        </div>

        <div style={rows}>
          <div style={{ width: "100%" }}>
            <div style={title}>{ApproximateDecimal(data.amountPaid)}</div>
            <div style={label}>Amount</div>
          </div>

          <div style={{ width: "100%" }}>
            <div style={title}>
              {getPerm("16") && (
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

  const openAddPayments = () => {
    setOpenPayments(true);
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
        const payload = {
          date: getDate,
          station: oneStationData,
        };

        const bank = APIs.post("/sales/delete/reset-bank", payload);
        const pos = APIs.post("/sales/delete/reset-pos", payload);

        Promise.all([bank, pos]).then(() => {
          setRefresh(!refresh);
          swal("Success", "Record deleted successfully", "success");
        });
      }
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ width: "90%" }} className="butStyle">
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
          onClick={openAddPayments}
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
      <div className="initial_balance_container_mobile">
        {/* Supply records */}
        <div className="mobile_header">&nbsp;&nbsp;&nbsp; Bank Payments</div>
        <div
          style={{ marginBottom: "20px", marginTop: "10px" }}
          className="balance_mobile_detail">
          <div className="sups">
            <div className="slide">
              {payments.bankList.length === 0 ? (
                <div>No record</div>
              ) : (
                payments.bankList.map((item, index) => {
                  return (
                    <MobileBankPayment key={index} data={item} type={"bank"} />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="initial_balance_container_mobile">
        {/* Supply records */}
        <div className="mobile_header">&nbsp;&nbsp;&nbsp; POS Payments</div>
        <div
          style={{ marginBottom: "20px", marginTop: "10px" }}
          className="balance_mobile_detail">
          <div className="sups">
            <div className="slide">
              {payments.posList.length === 0 ? (
                <div>No record</div>
              ) : (
                payments.posList.map((item, index) => {
                  return (
                    <MobileBankPayment key={index} data={item} type={"pos"} />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="payment_details">
        {openEdit && (
          <UpdatePayments
            data={oneRecord}
            update={setRefresh}
            open={openEdit}
            close={setOpenEdit}
          />
        )}
        {openPayments && (
          <PaymentsModal
            update={setRefresh}
            open={openPayments}
            close={setOpenPayments}
          />
        )}
        <div className="details_containser">
          <div className="details_left">
            <div className="details_table">
              <div className="details_title">Bank Payments</div>
              <div className="detail_table_header">
                <div className="detail_table_row">S/N</div>
                <div className="detail_table_row">Bank Name</div>
                <div className="detail_table_row">Teller No</div>
                <div className="detail_table_row">Amount</div>
                {getPerm("16") && (
                  <div className="detail_table_row">Action</div>
                )}
              </div>

              {payments.bankList.length === 0 ? (
                <div>No record</div>
              ) : (
                payments.bankList.map((item, index) => {
                  return (
                    <div key={index} className="detail_table_header">
                      <div className="detail_table_row2">{index + 1}</div>
                      <div className="detail_table_row2">{item.bankName}</div>
                      <div className="detail_table_row2">
                        {item.tellerNumber}
                      </div>
                      <div className="detail_table_row2">
                        {ApproximateDecimal(item.amountPaid)}
                      </div>
                      {getPerm("16") && (
                        <div style={ins} className="detail_table_row2">
                          <img
                            onClick={() => {
                              updateRecord(item, "bank");
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
                              deleteRecord(item, "bank");
                            }}
                            style={{ width: "20px", height: "20px" }}
                            src={del}
                            alt="icon"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ marginTop: "30px" }} className="details_table">
              <div className="details_title">POS Payments</div>
              <div className="detail_table_header">
                <div className="detail_table_row">S/N</div>
                <div className="detail_table_row">Bank Name</div>
                <div className="detail_table_row">Terminal ID</div>
                <div className="detail_table_row">Amount</div>
                {getPerm("16") && (
                  <div className="detail_table_row">Action</div>
                )}
              </div>

              {payments.posList.length === 0 ? (
                <div>No records</div>
              ) : (
                payments.posList.map((item, index) => {
                  return (
                    <div key={index} className="detail_table_header">
                      <div className="detail_table_row2">{index + 1}</div>
                      <div className="detail_table_row2">{item.posName}</div>
                      <div className="detail_table_row2">{item.terminalID}</div>
                      <div className="detail_table_row2">
                        {ApproximateDecimal(item.amountPaid)}
                      </div>
                      {getPerm("16") && (
                        <div style={ins} className="detail_table_row2">
                          <img
                            onClick={() => {
                              updateRecord(item, "pos");
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
                              deleteRecord(item, "pos");
                            }}
                            style={{ width: "20px", height: "20px" }}
                            src={del}
                            alt="icon"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="details_right">
            <div className="summary_details">
              <div className="detail_cell">Total Sales</div>
              <div style={vals} className="detail_cell">
                {ApproximateDecimal(payments.totalSales)}
              </div>
            </div>

            <div className="summary_details">
              <div className="detail_cell">Sales Amount (no LPO)</div>
              <div style={vals} className="detail_cell">
                {ApproximateDecimal(payments.salesAmount)}
              </div>
            </div>

            <div className="summary_details">
              <div className="detail_cell">Net to bank</div>
              <div style={vals} className="detail_cell">
                {ApproximateDecimal(payments.netToBank)}
              </div>
            </div>

            <div className="summary_details">
              <div className="detail_cell">Outstanding</div>
              <div style={vals} className="detail_cell">
                {ApproximateDecimal(payments.outstandingBalance)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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

const vals = {
  background: "#F0F0F0",
  color: "#000",
  marginTop: "5px",
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

export default PaymentDetails;
