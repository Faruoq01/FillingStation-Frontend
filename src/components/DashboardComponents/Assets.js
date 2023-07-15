import React from "react";
import DashboardImage from "./dashImage";
import { useSelector } from "react-redux";
import { Button, Skeleton } from "@mui/material";
import { useState } from "react";
import slideMenu from "../../assets/slideMenu.png";
import me4 from "../../assets/me4.png";
import me5 from "../../assets/me5.png";

const Assets = () => {
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const assets = useSelector((state) => state.dashboard.assets);
  const [load, setLoad] = useState(false);

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
          value={assets.tanks.activeCounts}
        />
        <DashboardImage
          load={load}
          station={oneStationData}
          screen={"inactiveTank"}
          image={me4}
          name={"Inactive Tank"}
          value={assets.tanks.inactiveCounts}
        />
      </div>
      <div style={{ marginTop: "15px" }} className="dashImages">
        <DashboardImage
          load={load}
          station={oneStationData}
          screen={"activePump"}
          image={me5}
          name={"Active Pump"}
          value={assets.pumps.activeCounts}
        />
        <DashboardImage
          load={load}
          station={oneStationData}
          screen={"inactivePump"}
          image={me5}
          name={"Inactive Pump"}
          value={assets.pumps.inactiveCounts}
        />
      </div>
    </React.Fragment>
  );
};

export default Assets;
