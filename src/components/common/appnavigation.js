import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import PollIcon from "@mui/icons-material/Poll";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    // Add your custom styles for the Bottom Navigation component here
  },
  selected: {
    // Customize the selected icon highlight color here
    color: "#06805B", // Change this to your desired color
  },
}));

export default function AppBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const ref = React.useRef(null);
  const navigate = useNavigate();
  const classes = useStyles();

  const navigateToPages = (page) => {
    switch (page) {
      case "dashboard": {
        navigate("/home/dashboard/dashboardhome/0");
        break;
      }
      case "dailysales": {
        navigate("/home/dailysales/dailysaleshome/0");
        break;
      }
      case "recordsales": {
        navigate("/home/recordsales");
        break;
      }
      case "settings": {
        navigate("/home/settings");
        break;
      }
      default: {
      }
    }
  };

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}>
        <BottomNavigation
          className={classes.root}
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}>
          <BottomNavigationAction
            classes={{ selected: classes.selected }}
            label="Dashboard"
            icon={
              <DashboardCustomizeIcon
                style={{ color: value === 0 ? "#06805B" : "inherit" }}
              />
            }
            onClick={() => {
              navigateToPages("dashboard");
            }}
          />
          <BottomNavigationAction
            classes={{ selected: classes.selected }}
            label="Dailysales"
            icon={
              <PollIcon
                style={{ color: value === 1 ? "#06805B" : "inherit" }}
              />
            }
            onClick={() => {
              navigateToPages("dailysales");
            }}
          />
          <BottomNavigationAction
            classes={{ selected: classes.selected }}
            label="Recordsales"
            icon={
              <FolderIcon
                style={{ color: value === 2 ? "#06805B" : "inherit" }}
              />
            }
            onClick={() => {
              navigateToPages("recordsales");
            }}
          />
          <BottomNavigationAction
            classes={{ selected: classes.selected }}
            label="Settings"
            icon={
              <SettingsIcon
                style={{ color: value === 3 ? "#06805B" : "inherit" }}
              />
            }
            onClick={() => {
              navigateToPages("settings");
            }}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
