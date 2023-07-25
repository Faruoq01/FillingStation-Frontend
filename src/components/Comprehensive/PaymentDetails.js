import "../../styles/compPayment.scss";
import edit from "../../assets/comp/edit.png";
import del from "../../assets/comp/delete.png";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { useState } from "react";
import UpdatePayments from "../Modals/DailySales/payments";
import ApproximateDecimal from "../common/approx";
import APIs from "../../services/api";

const PaymentDetails = () => {
  const payments = useSelector((state) => state.comprehensive.payments);

  const dispatch = useDispatch();
  const currentDate = useSelector((state) => state.dailysales.updatedDate);
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);

  const [openEdit, setOpenEdit] = useState(false);
  const [oneRecord, setOneRecord] = useState({});

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

  const updateRecord = (data, bank) => {
    setOpenEdit(true);
    setOneRecord({ data: data, bank: bank });
  };

  const deleteRecord = (data, type) => {
    if (type === "bank") {
      swal({
        title: "Alert!",
        text: "Are you sure you want to delete this record?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          APIs.post("/sales/delete/bankPayment", { id: data._id })
            .then((data) => {})
            .then(() => {
              swal("Success", "Record deleted successfully", "success");
            });
        }
      });
    } else {
      swal({
        title: "Alert!",
        text: "Are you sure you want to delete this record?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          APIs.post("/sales/delete/posPayment", { id: data._id })
            .then((data) => {})
            .then(() => {
              swal("Success", "Record deleted successfully", "success");
            });
        }
      });
    }
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

  return (
    <div style={{ width: "100%" }}>
      <div className="initial_balance_container_mobile">
        {/* Supply records */}
        <div className="mobile_header">&nbsp;&nbsp;&nbsp; Bank Payments</div>
        <div
          style={{ marginBottom: "20px", marginTop: "10px" }}
          className="balance_mobile_detail"
        >
          <div className="sups">
            <div className="slide">
              {payments.bank.length === 0 ? (
                <div>No record</div>
              ) : (
                payments.bank.map((item, index) => {
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
          className="balance_mobile_detail"
        >
          <div className="sups">
            <div className="slide">
              {payments.pos.length === 0 ? (
                <div>No record</div>
              ) : (
                payments.pos.map((item, index) => {
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
            open={openEdit}
            close={setOpenEdit}
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

              {payments.bank.length === 0 ? (
                <div>No record</div>
              ) : (
                payments.bank.map((item, index) => {
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

              {payments.pos.length === 0 ? (
                <div>No records</div>
              ) : (
                payments.pos.map((item, index) => {
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
                {ApproximateDecimal(0)}
              </div>
            </div>

            <div className="summary_details">
              <div className="detail_cell">Sales Amount (no LPO)</div>
              <div style={vals} className="detail_cell">
                {ApproximateDecimal(0)}
              </div>
            </div>

            <div className="summary_details">
              <div className="detail_cell">Net to bank</div>
              <div style={vals} className="detail_cell">
                {ApproximateDecimal(0)}
              </div>
            </div>

            <div className="summary_details">
              <div className="detail_cell">Outstanding</div>
              <div style={vals} className="detail_cell">
                {ApproximateDecimal(0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
