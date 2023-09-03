import { Button, Skeleton } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import slideMenu from "../../assets/slideMenu.png";
import swal from "sweetalert";
import ApproximateDecimal from "../common/approx";
import { useCallback } from "react";
import { useEffect } from "react";
import APIs from "../../services/api";
import { supplies } from "../../storage/dashboard";
import { useNavigate } from "react-router-dom";

const Supply = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const suppliesData = useSelector((state) => state.dashboard.supplies);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updatedDate = useSelector((state) => state.dashboard.dateRange);
  const navigate = useNavigate();
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

  const getAssetCounts = useCallback((date, station) => {
    setLoad(true);

    const payload = {
      outletID: station === null ? "None" : station._id,
      organisationID: resolveUserID().id,
      start: date[0],
      end: date[1],
    };

    APIs.post("/dashboard/supplies", payload)
      .then(({ data }) => {
        dispatch(supplies(data.supplies));
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
    getAssetCounts(updatedDate, oneStationData);
  }, [getAssetCounts, oneStationData, updatedDate]);

  const goToSupplyPage = () => {
    if (!getPerm("7")) return swal("Warning!", "Permission denied", "info");
    navigate("supply");
  };

  return (
    <React.Fragment>
      <div className="asset">
        <div
          style={{
            color: user.isDark === "0" ? "#000" : "#fff",
            fontSize: "15px",
          }}>
          Supply
        </div>
        {load ? (
          <Skeleton
            sx={{ borderRadius: "5px", background: "#f7f7f7" }}
            animation="wave"
            variant="rectangular"
            width={130}
            height={35}
          />
        ) : (
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
            onClick={goToSupplyPage}>
            View in details
          </Button>
        )}
      </div>
      <div className="inner-section">
        <div className="cardss">
          {load ? (
            <Skeleton
              sx={{ borderRadius: "5px", background: "#f7f7f7" }}
              animation="wave"
              variant="rectangular"
              width={"100%"}
              height={90}
            />
          ) : (
            <>
              <div className="left">PMS</div>
              <div className="right">
                <div>Litre Qty</div>
                <div>{ApproximateDecimal(suppliesData.pms)} Litres</div>
              </div>
            </>
          )}
        </div>
        <div className="cardss">
          {load ? (
            <Skeleton
              sx={{ borderRadius: "5px", background: "#f7f7f7" }}
              animation="wave"
              variant="rectangular"
              width={"100%"}
              height={90}
            />
          ) : (
            <>
              <div className="left">AGO</div>
              <div className="right">
                <div>Litre Qty</div>
                <div>{ApproximateDecimal(suppliesData.ago)} Litres</div>
              </div>
            </>
          )}
        </div>
        <div style={{ marginRight: "0px" }} className="cardss">
          {load ? (
            <Skeleton
              sx={{ borderRadius: "5px", background: "#f7f7f7" }}
              animation="wave"
              variant="rectangular"
              width={"100%"}
              height={90}
            />
          ) : (
            <>
              <div className="left">DPK</div>
              <div className="right">
                <div>Litre Qty</div>
                <div>{ApproximateDecimal(suppliesData.dpk)} Litres</div>
              </div>
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Supply;
