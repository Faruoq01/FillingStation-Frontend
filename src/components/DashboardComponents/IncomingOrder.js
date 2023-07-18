import { Button } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import slideMenu from "../../assets/slideMenu.png";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";
import ApproximateDecimal from "../common/approx";

const IncomingOrder = () => {
  const user = useSelector((state) => state.auth.user);
  const history = useHistory();
  const incoming = useSelector((state) => state.dashboard.incoming);

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
    return user.permission?.dashboard[e];
  };

  const goToIncoming = () => {
    if (!getPerm("9")) return swal("Warning!", "Permission denied", "info");
    history.push("/home/inc-orders");
  };

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          marginTop: "30px",
          justifyContent: "space-between",
        }}
        className="tank-text">
        <div
          style={{
            color: user.isDark === "0" ? "#000" : "#fff",
            fontSize: "15px",
            fontWeight: "bold",
          }}>
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
          onClick={goToIncoming}>
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

        {incoming.length === 0 ? (
          <div style={place}>No incoming data</div>
        ) : (
          incoming.map((data, index) => {
            return (
              <div key={index} className="table-view2">
                <div className="table-text">{data.outletName}</div>
                <div className="table-text">{data.createdAt}</div>
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

const place = {
  fontSize: "12px",
  fontWeight: "bold",
  marginTop: "10px",
  color: "green",
};

export default IncomingOrder;
