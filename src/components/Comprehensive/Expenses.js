import edit from "../../assets/comp/edit.png";
import del from "../../assets/comp/delete.png";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { useCallback, useState } from "react";
import UpdateExpenses from "../Modals/DailySales/expenses";
import ApproximateDecimal from "../common/approx";
import APIs from "../../services/connections/api";
import React from "react";
import { useNavigate } from "react-router-dom";
import { setExpenses } from "../../storage/comprehensive";
import { useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import { Button } from "@mui/material";
import ExpensesModal from "../Modals/comprehensive/expenses";

const Expenses = () => {
  const navigate = useNavigate();
  const expenses = useSelector((state) => state.comprehensive.expenses);

  const dispatch = useDispatch();
  const currentDate = useSelector((state) => state.dashboard.dateRange);
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const salesShift = useSelector((state) => state.dailysales.salesShift);

  const [openEdit, setOpenEdit] = useState(false);
  const [openExpenses, setOpenExpenses] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [oneRecord, setOneRecord] = useState({});
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

  const getExpensesData = useCallback((updatedDate, salesShift) => {
    if (oneStationData === null) return navigate("dailysales");
    setLoad(true);
    const payload = {
      organizationID: resolveUserID().id,
      outletID: oneStationData._id,
      date: updatedDate[0],
      shift: salesShift,
    };

    APIs.post("/comprehensive/expenses", payload)
      .then(({ data }) => {
        dispatch(setExpenses(data.expenses));
      })
      .then(() => {
        setLoad(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getExpensesData(currentDate, salesShift);
  }, [getExpensesData, currentDate, refresh, salesShift]);

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
        APIs.post("/sales/delete/expenses", { id: data._id })
          .then(() => {
            setRefresh(!refresh);
          })
          .then(() => {
            swal("Success", "Record deleted successfully", "success");
          });
      }
    });
  };

  const ExpensesRow = (props) => {
    return (
      <div style={{ marginTop: "5px" }} className="product_balance_header">
        <div style={ins} className="cells">
          {props.index + 1}
        </div>
        <div style={ins} className="cells">
          {props.data.expenseName}
        </div>
        <div style={ins} className="cells">
          {ApproximateDecimal(props.data.expenseAmount)}
        </div>
        {getPerm("15") && (
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

  const MobileExpensesRow = ({ data }) => {
    return (
      <div className="supply_card">
        <div style={rows}>
          <div style={{ width: "100%" }}>
            <div style={title}>{data.expenseName}</div>
            <div style={label}>Expense Name</div>
          </div>

          <div style={{ width: "100%" }}>
            <div style={title}>{ApproximateDecimal(data.expenseAmount)}</div>
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
              {getPerm("15") && (
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

  const openAddExpenses = () => {
    setOpenExpenses(true);
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
        APIs.post("/sales/delete/reset-expenses", {
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
          <div style={{ width: "59%" }} className="butStyle">
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
              onClick={openAddExpenses}
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
          <div
            style={{ maxWidth: "700px" }}
            className="initial_balance_container">
            {openEdit && (
              <UpdateExpenses
                update={setRefresh}
                data={oneRecord}
                open={openEdit}
                close={setOpenEdit}
              />
            )}
            {openExpenses && (
              <ExpensesModal
                update={setRefresh}
                open={openExpenses}
                close={setOpenExpenses}
              />
            )}
            <div className="product_balance_header">
              <div className="cells">S/N</div>
              <div className="cells">Expense Name</div>
              <div className="cells">Amount</div>
              {getPerm("15") && <div className="cells">Action</div>}
            </div>

            {expenses.length === 0 ? (
              <div>No records </div>
            ) : (
              expenses.map((item, index) => {
                return <ExpensesRow key={index} data={item} index={index} />;
              })
            )}
          </div>

          <div className="initial_balance_container_mobile">
            {/* Supply records */}
            <div className="mobile_header">&nbsp;&nbsp;&nbsp; Expenses</div>
            <div
              style={{ marginBottom: "20px", marginTop: "10px" }}
              className="balance_mobile_detail">
              <div className="sups">
                <div className="slide">
                  {expenses.length === 0 ? (
                    <div>No records </div>
                  ) : (
                    expenses.map((item, index) => {
                      return (
                        <MobileExpensesRow
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

export default Expenses;
