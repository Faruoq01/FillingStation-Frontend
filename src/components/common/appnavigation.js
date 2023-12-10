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
import { useLocation, useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "#e2e2e2",
  },
  selected: {
    // Customize the selected icon highlight color here
    color: "#06805B", // Change this to your desired color
  },
}));

const paths = {
  dashboard: "/home/dashboard/dashboardhome/0",
  dailysales: "/home/dailysales/dailysaleshome/0",
  recordsales: "/home/recordsales/pumpupdate/0",
  settings: "/home/settings"
}

export default function AppBottomNavigation() {
  const ref = React.useRef(null);
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const classes = useStyles();

  const navigateToPages = (page) => {
    switch (page) {
      case "dashboard": {
        navigate(paths.dashboard);
        break;
      }
      case "dailysales": {
        navigate(paths.dailysales);
        break;
      }
      case "recordsales": {
        navigate(paths.recordsales);
        break;
      }
      case "settings": {
        navigate(paths.settings);
        break;
      }
      default: {
      }
    }
  };

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <Paper
        sx={{ position: "fixed", zIndex: "100", bottom: 0, left: 0, right: 0 }}
        elevation={3}>
        <BottomNavigation
          className={classes.root}
          showLabels>
          <BottomNavigationAction
            classes={{ selected: classes.selected }}
            label="Dashboard"
            icon={
              <DashboardCustomizeIcon
                style={{ color: pathname === paths.dashboard ? "#06805B" : "inherit" }}
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
                style={{ color: pathname === paths.dailysales ? "#06805B" : "inherit" }}
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
                style={{ color: pathname === paths.recordsales ? "#06805B" : "inherit" }}
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
                style={{ color: pathname === paths.settings ? "#06805B" : "inherit" }}
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
