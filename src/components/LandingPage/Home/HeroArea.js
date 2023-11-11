import { Button } from "@mui/material";
import React from "react";
import doubleArrow from "../../../assets/landing/doubleArrow.png";
import { useNavigate } from "react-router-dom";

const HeroArea = () => {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <div className="hero">
        <div className="text">
          <div className="text-container">
            <p className="header-text">
              Manage your fueling outlets in a{" "}
              <span className="col">digitized way</span>
            </p>
            <p className="body-text">
              Take control of your fueling outlets with 360 Station, the
              comprehensive management system designed to streamline your
              operations. Our digitized approach empowers you to efficiently
              manage and monitor all aspects of your fueling outlets,
              revolutionizing the way you do business.
            </p>

            <Button
              sx={{
                width: "200px",
                height: "40px",
                background: "#266910",
                borderRadius: "0px",
                fontStyle: "normal",
                fontWeight: "700",
                fontSize: "12px",
                color: "#fff",
                marginTop: "20px",
                "&:hover": {
                  backgroundColor: "#266910",
                },
              }}
              onClick={() => {
                navigate("login");
              }}
              variant="contained">
              <span style={{ marginRight: "20px" }}>Getting started</span>
              <img
                style={{ width: "20px", height: "20px" }}
                src={doubleArrow}
                alt="icon"
              />
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HeroArea;
