import { Box, Grid } from "@mui/material";
import "../../../styles/landing/pricing.scss";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import CardItem from "./pricecards";

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#399A19" : "#399A19",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

const PricingComponent = () => {
  return (
    <Box sx={container}>
      <div className="price-container">
        <p className="price-header">Here are all our plans</p>
        <p className="price-text">
          Begin with our three-month Plan, which offers the flexibility to
          address short-term goals while enjoying complete access to premium
          features. For a balanced approach, our six-month Plan combines
          stability with cost-effectiveness. And, for those committed to
          long-term success, our yearly plan ensures uninterrupted premium
          features throughout the year, maximizing your savings.
        </p>

        <FormGroup>
          <Stack direction="row" spacing={1} alignItems="center">
            <span style={{ fontWeight: "600" }} className="price-text">
              Quarterly
            </span>
            <AntSwitch
              defaultChecked
              inputProps={{ "aria-label": "ant design" }}
            />
            <span style={{ fontWeight: "600" }} className="price-text">
              Annually
            </span>
          </Stack>
        </FormGroup>

        <div className="price-list">
          <Grid spacing={3} container>
            <Grid xs={12} sm={6} md={6} lg={4} xl={4} item>
              <Box sx={priceCard}>
                <CardItem />
              </Box>
            </Grid>
            <Grid xs={12} sm={6} md={6} lg={4} xl={4} item>
              <Box sx={priceCard}>
                <CardItem />
              </Box>
            </Grid>
            <Grid xs={12} sm={6} md={6} lg={4} xl={4} item>
              <Box sx={priceCard}>
                <CardItem />
              </Box>
            </Grid>
          </Grid>
        </div>
      </div>
    </Box>
  );
};

const container = {
  width: "100%",
  minHeight: "600px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
};

const priceCard = {
  width: "100%",
  minHeight: "500px",
  borderRadius: "48px",
  boxShadow: "0px 4px 20px 0px #3399AA",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export default PricingComponent;
