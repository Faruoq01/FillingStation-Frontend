import { Skeleton } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import me5 from "../../../assets/me5.png";
import ApproximateDecimal from "../../common/approx";

const SalesCards = () => {
  const history = useHistory();
  const [load, setLoad] = useState();
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector(
    (state) => state.outlet.adminOutlet
  );

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

  const openDailySales = (data) => {
    if (load) return;
    if (oneStationData === null)
      return swal("Warning!", "Please select a station", "info");
    if (!getPerm("2")) return swal("Warning!", "Permission denied", "info");

    if (data === "pms") {
      history.push("/home/daily-sales/pms");
    } else if (data === "ago") {
      history.push("/home/daily-sales/ago");
    } else if (data === "dpk") {
      history.push("/home/daily-sales/dpk");
    }
  };

  return (
    <div className="item-dash-daily">
      <div data-aos="flip-left" className="dash-item">
        {load ? (
          <Skeleton
            sx={{ borderRadius: "5px", background: "#f7f7f7" }}
            animation="wave"
            variant="rectangular"
            width={"100%"}
            height={110}
          />
        ) : (
          <div
            onClick={() => {
              openDailySales("pms");
            }}
            className="inner-dash-item">
            <div className="dash-image">
              <img className="imag" src={me5} alt="icon" />
            </div>
            <div className="dash-details">
              <div
                style={{
                  display: "flex",
                  marginRight: "10px",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}>
                <div style={{ fontWeight: "bold", fontSize: "12px" }}>PMS</div>
                <div
                  style={{
                    fontWeight: "bold",
                    marginTop: "5px",
                    fontSize: "12px",
                  }}>
                  Litre {ApproximateDecimal(0)}
                  ltr
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    marginTop: "5px",
                    fontSize: "12px",
                  }}>
                  Total NGN {ApproximateDecimal(0)}
                </div>
              </div>
            </div>

            {/* Mobile views below here */}
            <div className="mobile-detail">
              <div className="top-icon">
                <img
                  style={{ width: "25px", height: "25px" }}
                  src={me5}
                  alt="icon"
                />
                <div className="top-head-text">PMS Sales</div>
              </div>
              <div className="top-head-tx">
                Litre {ApproximateDecimal(0)}
                ltr{" "}
              </div>
              <div className="top-head-tx">Total N {ApproximateDecimal(0)}</div>
            </div>
          </div>
        )}
      </div>
      <div data-aos="flip-left" className="dash-item">
        {load ? (
          <Skeleton
            sx={{ borderRadius: "5px", background: "#f7f7f7" }}
            animation="wave"
            variant="rectangular"
            width={"100%"}
            height={110}
          />
        ) : (
          <div
            onClick={() => {
              openDailySales("ago");
            }}
            className="inner-dash-item">
            <div className="dash-image">
              <img className="imag" src={me5} alt="icon" />
            </div>
            <div className="dash-details">
              <div
                style={{
                  display: "flex",
                  marginRight: "10px",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}>
                <div style={{ fontWeight: "bold", fontSize: "12px" }}>AGO</div>
                <div
                  style={{
                    fontWeight: "bold",
                    marginTop: "5px",
                    fontSize: "12px",
                  }}>
                  Litre {ApproximateDecimal(0)}
                  ltr
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    marginTop: "5px",
                    fontSize: "12px",
                  }}>
                  Total NGN {ApproximateDecimal(0)}
                </div>
              </div>
            </div>

            {/* Mobile views below here */}
            <div className="mobile-detail">
              <div className="top-icon">
                <img
                  style={{ width: "25px", height: "25px" }}
                  src={me5}
                  alt="icon"
                />
                <div className="top-head-text">AGO Sales</div>
              </div>
              <div className="top-head-tx">
                Litre {ApproximateDecimal(0)}
                ltr{" "}
              </div>
              <div className="top-head-tx">Total N {ApproximateDecimal(0)}</div>
            </div>
          </div>
        )}
      </div>
      <div data-aos="flip-left" className="dash-item">
        {load ? (
          <Skeleton
            sx={{ borderRadius: "5px", background: "#f7f7f7" }}
            animation="wave"
            variant="rectangular"
            width={"100%"}
            height={110}
          />
        ) : (
          <div
            onClick={() => {
              openDailySales("dpk");
            }}
            className="inner-dash-item">
            <div className="dash-image">
              <img className="imag" src={me5} alt="icon" />
            </div>
            <div className="dash-details">
              <div
                style={{
                  display: "flex",
                  marginRight: "10px",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}>
                <div style={{ fontWeight: "bold", fontSize: "12px" }}>DPK</div>
                <div
                  style={{
                    fontWeight: "bold",
                    marginTop: "5px",
                    fontSize: "12px",
                  }}>
                  Litre {ApproximateDecimal(0)}
                  ltr
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    marginTop: "5px",
                    fontSize: "12px",
                  }}>
                  TotaL NGN {ApproximateDecimal(0)}
                </div>
              </div>
            </div>

            {/* Mobile views below here */}
            <div className="mobile-detail">
              <div className="top-icon">
                <img
                  style={{ width: "25px", height: "25px" }}
                  src={me5}
                  alt="icon"
                />
                <div className="top-head-text">DPK Sales</div>
              </div>
              <div className="top-head-tx">
                Litre {ApproximateDecimal(0)}
                ltr{" "}
              </div>
              <div className="top-head-tx">Total N {ApproximateDecimal(0)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesCards;
