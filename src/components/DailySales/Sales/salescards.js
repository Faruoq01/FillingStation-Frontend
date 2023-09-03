import { Skeleton } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import me5 from "../../../assets/me5.png";
import ApproximateDecimal from "../../common/approx";
import APIs from "../../../services/api";
import { sales } from "../../../storage/dailysales";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const SalesCards = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [load, setLoad] = useState();
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updatedDate = useSelector((state) => state.dailysales.updatedDate);
  const salesData = useSelector((state) => state.dailysales.sales);

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

  const updateSalesValues = useCallback((date, station) => {
    setLoad(true);
    const today = moment().format("YYYY-MM-DD").split(" ")[0];

    const payload = {
      outletID: station === null ? "None" : station._id,
      organisationID: resolveUserID().id,
      start: date === "" ? today : date,
      end: date === "" ? today : date,
    };

    APIs.post("/daily-sales/sales", payload)
      .then(({ data }) => {
        dispatch(sales(data.sales));
      })
      .then(() => {
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateSalesValues(updatedDate, oneStationData);
  }, [oneStationData, updateSalesValues, updatedDate]);

  const openDailySales = (data) => {
    if (load) return;
    if (oneStationData === null)
      return swal("Warning!", "Please select a station", "info");
    if (!getPerm("2")) return swal("Warning!", "Permission denied", "info");

    if (data === "pms") {
      navigate("pmssales");
    } else if (data === "ago") {
      navigate("agosales");
    } else if (data === "dpk") {
      navigate("dpksales");
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
                  Litre {ApproximateDecimal(salesData?.pms?.sales)} ltr
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    marginTop: "5px",
                    fontSize: "12px",
                  }}>
                  Total N {ApproximateDecimal(salesData?.pms?.amount)}
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
                Litre {ApproximateDecimal(salesData?.pms?.sales)}
                ltr{" "}
              </div>
              <div className="top-head-tx">
                Total N {ApproximateDecimal(salesData?.pms?.amoumt)}
              </div>
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
                  Litre {ApproximateDecimal(salesData?.ago?.sales)} ltr
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    marginTop: "5px",
                    fontSize: "12px",
                  }}>
                  Total N {ApproximateDecimal(salesData?.ago?.amount)}
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
                Litre {ApproximateDecimal(salesData?.ago?.sales)}
                ltr{" "}
              </div>
              <div className="top-head-tx">
                Total N {ApproximateDecimal(salesData?.ago?.amount)}
              </div>
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
                  Litre {ApproximateDecimal(salesData?.dpk?.sales)} ltr
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    marginTop: "5px",
                    fontSize: "12px",
                  }}>
                  TotaL N {ApproximateDecimal(salesData?.dpk?.amount)}
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
                Litre {ApproximateDecimal(salesData?.dpk?.sales)}
                ltr{" "}
              </div>
              <div className="top-head-tx">
                Total N {ApproximateDecimal(salesData?.dpk?.amount)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesCards;
