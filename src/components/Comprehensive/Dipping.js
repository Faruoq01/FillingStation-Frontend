import edit from "../../assets/comp/edit.png";
import del from "../../assets/comp/delete.png";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import UpdateDipping from "../Modals/DailySales/Dipping";
import { useState } from "react";
import ApproximateDecimal from "../common/approx";
import APIs from "../../services/api";
import { useEffect } from "react";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { setDipping } from "../../storage/comprehensive";
import { Skeleton } from "@mui/material";
import React from "react";

const Dipping = () => {
  const history = useHistory();
  const dipping = useSelector((state) => state.comprehensive.dipping);

  const dispatch = useDispatch();
  const currentDate = useSelector((state) => state.dailysales.updatedDate);
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);

  const [openEdit, setOpenEdit] = useState(false);
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

  const getDippingData = useCallback((updatedDate) => {
    if (oneStationData === null) return history.push("/home/daily-sales");
    setLoad(true);
    const payload = {
      organizationID: resolveUserID().id,
      outletID: oneStationData._id,
      date: updatedDate,
    };

    APIs.post("/comprehensive/dipping", payload)
      .then(({ data }) => {
        dispatch(setDipping(data.dipping));
      })
      .then(() => {
        setLoad(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getDippingData(currentDate);
  }, [getDippingData, currentDate]);

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
          .then((data) => {})
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

  return (
    <React.Fragment>
      {load ? (
        <Skeleton
          sx={{
            borderRadius: "5px",
            background: "#f7f7f7",
            marginLeft: "20px",
            marginTop: "20px",
          }}
          animation="wave"
          variant="rectangular"
          width={"94%"}
          height={200}
        />
      ) : (
        <div style={{ width: "100%" }}>
          <div className="initial_balance_container">
            {openEdit && (
              <UpdateDipping
                data={oneRecord}
                open={openEdit}
                close={setOpenEdit}
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
