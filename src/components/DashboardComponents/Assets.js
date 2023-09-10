import React, { useCallback, useEffect } from "react";
import DashboardImage from "./dashImage";
import { useDispatch, useSelector } from "react-redux";
import { Button, Skeleton } from "@mui/material";
import { useState } from "react";
import slideMenu from "../../assets/slideMenu.png";
import me4 from "../../assets/me4.png";
import me5 from "../../assets/me5.png";
import APIs from "../../services/connections/api";
import { assets } from "../../storage/dashboard";
import { useNavigate } from "react-router-dom";

const Assets = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const updatedDate = useSelector((state) => state.dashboard.dateRange);
  const assetsData = useSelector((state) => state.dashboard.assets);
  const [load, setLoad] = useState(false);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getAssetCounts = useCallback((date, station) => {
    setLoad(true);

    const payload = {
      outletID: station === null ? "None" : station._id,
      organisationID: resolveUserID().id,
      start: date[0],
      end: date[1],
    };

    APIs.post("/dashboard/assets", payload)
      .then(({ data }) => {
        dispatch(assets(data.assets));
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

  const goToStation = () => {
    navigate("/home/mystation/mystationhome/0");
  };

  return (
    <React.Fragment>
      <div className="asset">
        <div
          style={{
            color: user.isDark === "0" ? "#000" : "#fff",
            fontSize: "16px",
          }}>
          Asset
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
            onClick={goToStation}
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
            }}>
            View in details
          </Button>
        )}
      </div>
      <div className="dashImages">
        <DashboardImage
          load={load}
          station={oneStationData}
          screen={"activeTank"}
          image={me4}
          name={"Active Tank"}
          value={assetsData.tanks.activeCounts}
        />
        <DashboardImage
          load={load}
          station={oneStationData}
          screen={"inactiveTank"}
          image={me4}
          name={"Inactive Tank"}
          value={assetsData.tanks.inactiveCounts}
        />
      </div>
      <div style={{ marginTop: "15px" }} className="dashImages">
        <DashboardImage
          load={load}
          station={oneStationData}
          screen={"activePump"}
          image={me5}
          name={"Active Pump"}
          value={assetsData.pumps.activeCounts}
        />
        <DashboardImage
          load={load}
          station={oneStationData}
          screen={"inactivePump"}
          image={me5}
          name={"Inactive Pump"}
          value={assetsData.pumps.inactiveCounts}
        />
      </div>
    </React.Fragment>
  );
};

export default Assets;
