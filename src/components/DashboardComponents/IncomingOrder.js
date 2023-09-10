import { Button } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import slideMenu from "../../assets/slideMenu.png";
import swal from "sweetalert";
import ApproximateDecimal from "../common/approx";
import { incoming } from "../../storage/dashboard";
import APIs from "../../services/connections/api";
import { useNavigate } from "react-router-dom";

const IncomingOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const incomingData = useSelector((state) => state.dashboard.incoming);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);

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

  const getIncomingOrder = useCallback((station) => {
    const payload = {
      outletID: station === null ? "None" : station._id,
      organisationID: resolveUserID().id,
    };

    APIs.post("/dashboard/incoming", payload)
      .then(({ data }) => {
        dispatch(incoming(data.incoming));
      })
      .catch((err) => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getIncomingOrder(oneStationData);
  }, [getIncomingOrder, oneStationData]);

  const goToInc = () => {
    if (!getPerm("8")) return swal("Warning!", "Permission denied", "info");
    navigate("/home/incomingorder");
  };

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          marginTop: "40px",
          justifyContent: "space-between",
        }}
        className="tank-text">
        <div
          style={{ color: user.isDark === "0" ? "#000" : "#fff" }}
          className="tank-text">
          Incoming Order
        </div>
        <Button
          variant="contained"
          startIcon={
            <img
              style={{
                width: "15px",
                height: "10px",
                marginRight: "15px",
              }}
              src={slideMenu}
              alt="icon"
            />
          }
          sx={{
            width: "150px",
            height: "30px",
            background: "#06805B",
            fontSize: "11px",
            borderRadius: "0px",
            fontFamily: "Poppins",
            textTransform: "capitalize",
            "&:hover": {
              backgroundColor: "#06805B",
            },
          }}
          onClick={goToInc}>
          View in details
        </Button>
      </div>

      <div style={{ width: "100%", marginBottom: "40px" }}>
        <div className="table-view">
          <div className="table-text">Outlets</div>
          <div className="table-text">Date approved</div>
          <div className="table-text">Depot</div>
          <div className="table-text">Products</div>
          <div className="table-text">Quantity</div>
        </div>

        {incomingData.length === 0 ? (
          <div style={dats}> No incoming order today </div>
        ) : (
          incomingData.map((data, index) => {
            return (
              <div key={index} className="table-view2">
                <div className="table-text">{data.outletName}</div>
                <div className="table-text">{data.createdAt.split("T")[0]}</div>
                <div className="table-text">{data.depotStation}</div>
                <div className="table-text">{data.product}</div>
                <div className="table-text">
                  {ApproximateDecimal(data.quantity)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </React.Fragment>
  );
};

const dats = {
  marginTop: "20px",
  fontSize: "12px",
  fontWeight: "bold",
};

export default IncomingOrder;
