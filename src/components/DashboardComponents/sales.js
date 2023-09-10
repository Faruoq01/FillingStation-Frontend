import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import me1 from "../../assets/me1.png";
import me2 from "../../assets/me2.png";
import me6 from "../../assets/me6.png";
import approximateNumber from "approximate-number";
import DashboardImage from "./dashImage";
import APIs from "../../services/connections/api";
import { useCallback } from "react";
import { employees, products } from "../../storage/dashboard";

const Sales = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const employee = useSelector((state) => state.dashboard.employees);
  const product = useSelector((state) => state.dashboard.products);
  const updatedDate = useSelector((state) => state.dashboard.dateRange);
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
    return user.permission?.dashboard[e];
  };

  const getEmployeeCounts = useCallback(() => {
    updateSalesValues(updatedDate, oneStationData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSalesValues = useCallback((date, station) => {
    setLoad(true);

    const payload = {
      outletID: station === null ? "None" : station._id,
      organisationID: resolveUserID().id,
      start: date[0],
      end: date[1],
    };

    APIs.post("/dashboard/employees", payload)
      .then(({ data }) => {
        dispatch(employees(data.data.employee));
        dispatch(products(data.data.sales));
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
    getEmployeeCounts();
  }, [getEmployeeCounts]);

  useEffect(() => {
    updateSalesValues(updatedDate, oneStationData);
  }, [oneStationData, updateSalesValues, updatedDate]);

  const openSalesDisplay = () => {
    if (!getPerm("5")) return swal("Warning!", "Permission denied", "info");
    props.priceModal(true);
  };

  return (
    <div className="dashImages">
      <DashboardImage
        load={load}
        screen={"employee"}
        image={me1}
        name={"Current staff"}
        value={employee}
      />
      <div data-aos="flip-left" className="first-image">
        {load ? (
          <Skeleton
            sx={{ borderRadius: "5px", background: "#f7f7f7" }}
            animation="wave"
            variant="rectangular"
            width={"100%"}
            height={110}
          />
        ) : (
          <div onClick={openSalesDisplay} className="inner-first-image">
            <div className="top-first-image">
              <div className="top-icon">
                <img className="img" src={me2} alt="icon" />
              </div>
              <div className="top-text">
                <div
                  style={{
                    width: "100%",
                    fontSize: "12px",
                    textAlign: "right",
                  }}>
                  <div
                    style={{
                      marginTop: "5px",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}>
                    Liter:{" "}
                    <span style={{ fontWeight: "bold", fontSize: "12px" }}>
                      {approximateNumber(
                        Number(product.pms.sales) +
                          Number(product.ago.sales) +
                          Number(product.dpk.sales)
                      )}
                    </span>{" "}
                    LTR
                  </div>
                  <div
                    style={{
                      marginTop: "10px",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}>
                    Total Sales:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      NGN{" "}
                      {approximateNumber(
                        Number(product.pms.amount) +
                          Number(product.ago.amount) +
                          Number(product.dpk.amount)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-first-image">
              <img
                style={{ width: "30px", height: "10px" }}
                src={me6}
                alt="icon"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
