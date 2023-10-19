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

export default function AppBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const ref = React.useRef(null);
  const navigate = useNavigate();

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
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}>
          <BottomNavigationAction
            label="Dashboard"
            icon={<DashboardCustomizeIcon />}
            onClick={() => {
              navigateToPages("dashboard");
            }}
          />
          <BottomNavigationAction
            label="Daily sales"
            icon={<PollIcon />}
            onClick={() => {
              navigateToPages("dailysales");
            }}
          />
          <BottomNavigationAction
            label="Record sales"
            icon={<FolderIcon />}
            onClick={() => {
              navigateToPages("recordsales");
            }}
          />
          <BottomNavigationAction
            label="Settings"
            icon={<SettingsIcon />}
            onClick={() => {
              navigateToPages("settings");
            }}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
