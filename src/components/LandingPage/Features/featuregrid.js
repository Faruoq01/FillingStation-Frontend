import React from "react";
import FeatureData from "./data";
const { Box, Grid } = require("@mui/material");

const FeatureGrid = () => {
  return (
    <React.Fragment>
      <Box sx={container}>
        <Box sx={innercont}>
          <Grid spacing={2} container>
            {FeatureData.map((data, index) => {
              return (
                <Grid key={index} xs={12} sm={6} md={6} lg={3} xl={3} item>
                  <Box sx={box}>
                    <div style={bound}>
                      <img style={image} src={data.image} alt={"icon"} />
                      <p style={title}>{data.title}</p>
                      <div style={text}>{data.content}</div>
                      <div style={more}>View more</div>
                    </div>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </React.Fragment>
  );
};

const container = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
};

const innercont = {
  width: "90%",
};

const box = {
  width: "100%",
  height: "400px",
  display: "flex",
  justifyContent: "center",
  alignItem: "center",
  marginBottom: "20px",
};

const bound = {
  width: "90%",
  height: "90%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const image = {
  width: "150px",
  height: "140px",
};

const title = {
  width: "100%",
  fontFamily: "Poppins",
  fontSize: "15px",
  color: "#000000",
  textAlign: "left",
  fontWeight: "600",
};

const text = {
  width: "100%",
  maxHeight: "150px",
  fontFamily: "Poppins",
  fontSize: "12px",
  color: "#000000",
  textAlign: "left",
  lineHeight: "25px",
  overflow: "hidden",
};

const more = {
  width: "100%",
  textAlign: "right",
  marginTop: "20px",
};

export default FeatureGrid;
