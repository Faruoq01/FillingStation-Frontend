import { Box, Button, Stack } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import CancelIcon from "@mui/icons-material/Cancel";

const ListItem = ({ cancel }) => {
  return (
    <Box sx={{ marginTop: "20px" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        {cancel && <CircleIcon sx={circle} />}
        {cancel || <CancelIcon sx={{ ...circle, color: "#DF0505" }} />}
        <span style={{ fontWeight: "400" }} className="text">
          Lorem Ipsium
        </span>
      </Stack>
    </Box>
  );
};

const CardItem = () => {
  return (
    <Box sx={container}>
      <p className="card-title">Start</p>
      <span className="text">
        On the other hand, we denounce with righteous indignation and dislike
      </span>
      <div className="dollar">
        50$ <span className="month">/month</span>
      </div>
      <ListItem cancel={true} />
      <ListItem cancel={true} />
      <ListItem cancel={false} />
      <ListItem cancel={false} />
      <ListItem cancel={false} />

      <Button sx={button}>Get Started</Button>
    </Box>
  );
};

const container = {
  width: "84%",
  height: "auto",
  marginTop: "8%",
  marginBottom: "8%",
};

const circle = {
  color: "#39DC98",
  width: "20px",
  height: "20px",
};

const button = {
  width: "130px",
  height: "40px",
  fontSize: "12px",
  marginTop: "40px",
  marginBottom: "10px",
  background: "#054834",
  borderRadius: "10px",
  textTransform: "capitalize",
  color: "#fff",
  "&:hover": {
    background: "#054834",
  },
};

export default CardItem;
