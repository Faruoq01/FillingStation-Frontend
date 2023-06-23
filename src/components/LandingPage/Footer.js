import React from "react";
import twitter from "../../assets/landing/tweeter.png";
import facebook from "../../assets/landing/facebook.png";
import linkedin from "../../assets/landing/linkedin.png";
import googlePlus from "../../assets/landing/googlePlus.png";

const Footer = () => {
  return (
    <React.Fragment>
      <div className="footers">
        <div className="innerfoot">
          <div style={{ textAlign: "left" }} className="detail">
            <span className="fir" style={{ width: "100%" }}>
              360-Station
            </span>
            <span className="fuel" style={{ width: "100%" }}>
              Digitized Fueling Management
            </span>

            <p className="write">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus mi
              vulputate pharetra, sit. Sagittis nulla at diam sagittis enim nunc
              a lacinia scelerisque. Leo semper nunc pellentesque nascetur amet
              adipiscing elit. Cursus mi vulputate pharetra, sit lacinia
              scelerisque. Leo semper nunc pellentesque nascetur amet adipiscing
              elit. Cursus mi vulputate pharetra, sit
            </p>

            <span className="write" style={{ width: "100%" }}>
              &#169; {new Date().getFullYear()} 360Station International Limited
            </span>
          </div>

          <div className="detail">
            <div className="links">
              <span
                style={{
                  marginTop: "20px",
                  marginBottom: "10px",
                  color: "#399A19",
                  fontWeight: "600",
                }}
              >
                Useful Links
              </span>
              <span>Home</span>
              <span>How it works</span>
              <span>Features</span>
              <span>Pricing</span>
              <span>Login</span>
              <span>Contact Us</span>
            </div>
          </div>

          <div className="detail">
            <div className="links">
              <span
                style={{
                  marginTop: "20px",
                  marginBottom: "10px",
                  color: "#399A19",
                  fontWeight: "600",
                }}
              >
                Contact Us
              </span>
              <span style={{ color: "#399A19", fontWeight: "600" }}>Email</span>
              <span style={{ fontSize: "12px" }}>
                EMAIL: 360station@gmail.com
              </span>

              <span style={{ color: "#399A19", fontWeight: "600" }}>
                TELL:{" "}
              </span>
              <span style={{ fontSize: "12px" }}>+234-91835473</span>
              <span style={{ fontSize: "12px" }}>+234-91835473</span>
              <span style={{ fontSize: "12px" }}>+234-91835473</span>

              <span style={{ color: "#399A19", fontWeight: "600" }}>
                Social Links{" "}
              </span>
              <div className="media">
                <img
                  style={{
                    width: "25px",
                    height: "25px",
                    marginRight: "10px",
                  }}
                  src={twitter}
                  alt="icon"
                />
                <img
                  style={{
                    width: "25px",
                    height: "25px",
                    marginRight: "10px",
                  }}
                  src={facebook}
                  alt="icon"
                />
                <img
                  style={{
                    width: "25px",
                    height: "25px",
                    marginRight: "10px",
                  }}
                  src={linkedin}
                  alt="icon"
                />
                <img
                  style={{
                    width: "25px",
                    height: "25px",
                    marginRight: "10px",
                  }}
                  src={googlePlus}
                  alt="icon"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Footer;
