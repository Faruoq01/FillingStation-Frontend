import React from "react";
import "../../../styles/landing/about.scss";
import { Grid } from "@mui/material";
import data from "./data";

const AboutHero = () => {
  return (
    <React.Fragment>
      <div className="about-container">
        <div className="header">About Us</div>
        <div className="content-header">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pulvinar non
          amet, proin sed consequat. Quisque quis massa nullam ornare fusce eget
          massa sed. Phasellus tempus nulla non, facilisi ullamcorper Lorem
          ipsum dolor sit amet, consectetur adipiscing elit. Pulvinar non amet,
          proin sed consequat. Quisque quis massa nullam ornare fusce eget massa
          sed. Phasellus tempus nulla non, . Pulvinar non amet, proin sed
          consequat. Quisque quis massa nullam ornare fusce eget massa sed.
          Phasellus tempus nulla non, facilisi ullamcorper Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Pulvinar non amet, proin sed
          consequat. Quisque quis massa nullam ornare fusce eget massa sed.
          Phasellus tempus nulla non, .
        </div>
      </div>

      <div className="mission-container">
        <div className="about-mission">
          <div className="image-mission"></div>
          <div className="text-mission">
            <div className="mission-title">OUR VISION</div>
            <div className="mission-content">
              To revolutionize fueling station management and redefine industry
              standards through cutting-edge software solutions, empowering
              businesses to thrive with transparency, efficiency, and unwavering
              integrity.
            </div>
          </div>
        </div>
      </div>

      <div className="mission-container">
        <div className="about-mission-reversed">
          <div className="image-mission"></div>
          <div className="text-mission">
            <div className="mission-title">OUR MISSION</div>
            <div className="mission-content">
              We are committed to providing oil and gas station owners and
              business managers with innovative software that enables them to
              oversee, track, and manage all aspects of their operations
              seamlessly. Our mission goes beyond mere transparency and
              accountability; it is about driving profitability, instilling
              trust, and fostering sustainability in our clients’ businesses.
              Through relentless innovation and unwavering integrity, we
              endeavor not only to redefine industry norms but to leave an
              indelible mark of positive transformation in the oil and gas
              sector. With a client-centric approach, we are committed to
              helping our clients thrive today and shape a prosperous future in
              the industry.
            </div>
          </div>
        </div>
      </div>

      <div className="service-container">
        <div className="about-services">
          <div className="service-title">OUR SERVICES</div>
          <div className="service-grids">
            <Grid spacing={6} container>
              {data.map((data, index) => {
                return <ServiceCard key={index} data={data} />;
              })}
            </Grid>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const ServiceCard = ({ key, data }) => {
  return (
    <React.Fragment>
      <Grid key={key} xs={12} sm={12} md={6} lg={6} xl={6} item>
        <div className="service-box">
          <div className="service-first">
            <img
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              src={data.image}
              alt={"icon"}
            />
          </div>
          <div className="service-second">
            <div style={{ width: "100%" }}>
              <div className="service-title">{data.title}</div>
              <div className="service-content">{data.content}</div>
            </div>
            <div style={more}>View more</div>
          </div>
        </div>
      </Grid>
    </React.Fragment>
  );
};

const more = {
  width: "100%",
  textAlign: "right",
  color: "green",
  fontFamily: "Poppins",
  userSelect: "none",
};

export default AboutHero;
