import React from "react";
import "../../../styles/landing/contact.scss";
import { Button, Grid } from "@mui/material";

const ContactHero = () => {
  return (
    <React.Fragment>
      <div className="contact-container">
        <div className="header">Contact US</div>
        <div className="sec-header">
          Our Expansive network of licensed specialist offers wide range of
          service
        </div>
      </div>

      <div className="conversation">
        <div className="contact-inner">
          <div className="contact-title">Lets Start a conversation</div>
          <div style={style}>
            <Grid spacing={2} container>
              <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                <div className="contact-row">
                  <div className="left-contact-title">
                    Ask How we can help you.
                  </div>
                  <Group />
                  <Group />
                  <Group />
                </div>
              </Grid>
              <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                <div className="contact-row">
                  <div className="left-contact-title3">
                    Note all field are required.
                  </div>
                  <div className="contact-form">
                    <Grid container>
                      <Grid xs={12} sm={12} md={12} lg={12} xl={12} item>
                        <div className="left-contact-title3">Name*</div>
                      </Grid>
                      <Grid xs={12} sm={12} md={12} lg={12} xl={12} item>
                        <div className="contact-input-container">
                          <input className="contact-input" type="text" />
                        </div>
                      </Grid>
                      <Grid xs={12} sm={12} md={12} lg={12} xl={12} item>
                        <div
                          style={{ marginTop: "20px" }}
                          className="left-contact-title3">
                          Email*
                        </div>
                      </Grid>
                      <Grid xs={12} sm={12} md={12} lg={12} xl={12} item>
                        <div className="contact-input-container">
                          <input className="contact-input" type="email" />
                        </div>
                      </Grid>
                      <Grid xs={12} sm={12} md={12} lg={12} xl={12} item>
                        <div
                          style={{ marginTop: "20px" }}
                          className="left-contact-title3">
                          Enter your message*
                        </div>
                      </Grid>
                      <Grid xs={12} sm={12} md={12} lg={12} xl={12} item>
                        <div className="contact-input-container">
                          <textarea
                            style={{ height: "100px", paddingTop: "10px" }}
                            className="contact-input"
                            type="text"
                          />
                        </div>
                      </Grid>
                      <Grid xs={12} sm={12} md={12} lg={12} xl={12} item>
                        <div className="contact-input-container">
                          <Button sx={button}>Send</Button>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const style = {
  width: "100%",
  marginTop: "40px",
};

const button = {
  width: "100px",
  height: "30px",
  fontSize: "12px",
  marginTop: "20px",
  marginBottom: "10px",
  background: "#054834",
  textTransform: "capitalize",
  color: "#fff",
  "&:hover": {
    background: "#054834",
  },
};

const Group = () => {
  return (
    <div className="form-group">
      <div className="left-contact-title1">Ask How we can help you.</div>
      <div className="left-contact-title2">
        Lorem ipsum dolor sit amet consectetur. Quis eget platea nunc mi varius
        congue nibh. Sapien eget convallis aliquam mi tellus leo etiam neque
        tincidunt.
      </div>
    </div>
  );
};

export default ContactHero;
