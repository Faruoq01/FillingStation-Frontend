import React, { useEffect, useState, useCallback } from 'react';
import '../styles/home.scss';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import 'react-modern-drawer/dist/index.css';
import { useDispatch, useSelector } from 'react-redux';
import UserService from '../services/360station/user';
import { updateUser } from '../storage/auth';
import { socket } from '../services/connections/socket';
import OutletService from '../services/360station/outletService';
import NotificationDrawer from '../components/common/NotificationDrawer';
import { adminOutlet, getAllStations } from '../storage/outlet';
import TopNavBar from '../components/common/topnavbar';
import MobileNavBar from '../components/common/mobilenavbar';
import DesktopSideBar from '../components/common/desktopsidebar';
import MobileSideBar from '../components/common/mobilesidebar';
import TitleNavBar from '../components/common/titlebar';
import { Grid, Box, Hidden } from '@mui/material';
import MobileAppBar from '../components/common/appbar';
import AppBottomNavigation from '../components/common/appnavigation';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SimpleBarReact from 'simplebar-react';

const tabLinks = [
 '/home/dashboard/dashboardhome/0',
 '/home/dailysales/dailysaleshome/0',
 '/home/recordsales',
 '/home/settings',
];

const HomeScreen = () => {
const user = useSelector((state) => state.auth.user);
const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
const oneStationData = useSelector((state) => state.outlet.adminOutlet);
const allOutlets = useSelector((state) => state.outlet.allOutlets);
const online = useSelector((data) => data.auth.connection);
const dispatch = useDispatch();
const navigate = useNavigate();
const location = useLocation();
const theme = useTheme();

const barWidth = 270;
const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
const [calColumn, setCalColumn] = useState(0);

useEffect(() => {
    const handleResize = () => {
        const columns = barWidth/window.innerWidth * 12;
        setCalColumn(columns);
    };
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []); 

 const hideScrollbarOnMobile = () => {
  if (isSmallScreen) {
   document.body.style.overflow = 'hidden';
  }
 };

 const resolveUserID = () => {
  if (user.userType === 'superAdmin') {
   return { id: user._id };
  } else {
   return { id: user.organisationID };
  }
 };

 const getAllStationData = useCallback(() => {
  const payload = {
   organisation: resolveUserID().id,
  };

  OutletService.getAllOutletStations(payload).then((data) => {
   dispatch(getAllStations(data.station));
  });

  UserService.getOneUser({ id: user._id }).then((data) => {
   localStorage.setItem('user', JSON.stringify(data.user));
   dispatch(updateUser(data.user));
  });

  hideScrollbarOnMobile();

  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [user._id, user.userType, user.outletID, dispatch]);

 useEffect(() => {
  window?.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'home' }));
  getAllStationData();
 }, [getAllStationData]);

 useEffect(() => {
  if (!online) {
   navigate('/connection');
  }
  if (!isLoggedIn) {
   navigate('/login');
  }
 });

 useEffect(() => {
  socket.connect();

  return () => {
   socket.disconnect();
  };
 }, []);

 useEffect(() => {
  function onConnect() {
   // setIsConnected(true);
  }

  function onDisconnect() {
   // setIsConnected(false);
  }

  function updatePermission(data) {
   const findID = data.findIndex((item) => item._id === user._id);
   if (findID !== -1) {
    const userData = data[findID];
    if (resolveUserID().id === userData.organisationID) {
     dispatch(updateUser(userData));
     localStorage.setItem('user', JSON.stringify(userData));

     const outletID = allOutlets.findIndex(
      (item) => item._id === userData.outletID,
     );
     if (outletID !== -1) dispatch(adminOutlet(allOutlets[outletID]));
    }
   }
  }

  function updateHistory(data) {
   if (resolveUserID().id === data.orgID) {
    if (user.outletID === 'Admin Office') {
     const copyUser = { ...user };
     copyUser.noteCount = Number(copyUser.noteCount) + 1;
     dispatch(updateUser(copyUser));
     localStorage.setItem('user', JSON.stringify(copyUser));
     return;
    } else {
     if (user.outletID === data.to) {
      const copyUser = { ...user };
      copyUser.noteCount = Number(copyUser.noteCount) + 1;
      dispatch(updateUser(copyUser));
      localStorage.setItem('user', JSON.stringify(copyUser));
      return;
     }
    }
   }
  }

  function clearCount(data) {
   if (resolveUserID().id === data.orgID) {
    if (user._id === data.id) {
     const copyUser = JSON.parse(JSON.stringify(user));
     copyUser.noteCount = '0';
     dispatch(updateUser(copyUser));
     localStorage.setItem('user', JSON.stringify(copyUser));
     return;
    }
   }
  }

  function updatePrices(data) {
   if (resolveUserID().id === data.stations[0].organisation) {
    const status = data.stations.findIndex(
     (item) => item._id === oneStationData._id,
    );
    if (status !== -1) {
     const stationCopy = { ...oneStationData };
     stationCopy['PMSCost'] =
      'PMSCost' in data ? data.PMSCost : stationCopy['PMSCost'];
     stationCopy['PMSPrice'] =
      'PMSPrice' in data ? data.PMSPrice : stationCopy['PMSPrice'];
     stationCopy['AGOCost'] =
      'AGOCost' in data ? data.AGOCost : stationCopy['AGOCost'];
     stationCopy['AGOPrice'] =
      'AGOPrice' in data ? data.AGOPrice : stationCopy['AGOPrice'];
     stationCopy['DPKCost'] =
      'DPKCost' in data ? data.DPKCost : stationCopy['DPKCost'];
     stationCopy['DPKPrice'] =
      'DPKPrice' in data ? data.DPKPrice : stationCopy['DPKPrice'];

     dispatch(adminOutlet(stationCopy));
    }
   }
  }

  socket.on('connect', onConnect);
  socket.on('disconnect', onDisconnect);
  socket.on('permission', updatePermission);
  socket.on('history', updateHistory);
  socket.on('clearCount', clearCount);
  socket.on('prices', updatePrices);

  return () => {
   socket.off('connect', onConnect);
   socket.off('disconnect', onDisconnect);
   socket.off('permission', updatePermission);
   socket.off('history', updateHistory);
   socket.off('clearCount', clearCount);
   socket.off('prices', updatePrices);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [dispatch, user]);

 const [isOpen, setIsOpen] = useState(false);
 const [openRight, setOpenRight] = useState(false);

 const toggleDrawer = () => {
  setIsOpen((prevState) => !prevState);
 };

 const matchTabs = () => {
  return tabLinks.includes(location.pathname);
 };

 return (
  <React.Fragment>
   <Grid container>
    {openRight && <NotificationDrawer open={setOpenRight} />}
    {matchTabs() && (
     <Hidden mdUp>
      <Grid xs={12} sm={12} item>
       <Box sx={mobileTop}>
        <MobileAppBar notice={setOpenRight} toggle={toggleDrawer} open={isOpen} />
       </Box>
      </Grid>
     </Hidden>
    )}
    {matchTabs() || (
     <Hidden mdUp>
      <Grid xs={12} sm={12} item>
       <Box sx={mobileTop}>
        <MobileNavBar notice={setOpenRight} toggle={toggleDrawer} open={isOpen} />
       </Box>
      </Grid>
     </Hidden>
    )}
    <Hidden mdDown>
     <Grid sx={{background: "red"}} md={2} lg={2} xl={calColumn} item>
      <Box sx={sidebar}>
       <DesktopSideBar />
      </Box>
     </Grid>
    </Hidden>
    <Grid
     sx={{ marginTop: isSmallScreen ? '60px' : '0px' }}
     xs={12}
     sm={12}
     md={10}
     lg={10}
     xl={12 - calColumn}
     item
    >
     <Box sx={main}>
      <Grid container>
       <Grid xs={12} sm={12} md={12} lg={12} xl={12} item>
        <Box sx={mobileTop}>
         <TitleNavBar />
        </Box>
       </Grid>
       <Grid xs={12} sm={12} md={12} lg={12} xl={12} item>
        <SimpleBarReact
         style={{
          ...scrollBar,
          maxHeight: '77vh',
         }}
        >
         <div style={inner}>
          <div style={outmehn}>
            <TopNavBar open={setOpenRight} />
            <Outlet />
          </div>
         </div>
        </SimpleBarReact>
       </Grid>
      </Grid>
     </Box>
    </Grid>
    {matchTabs() && (
     <Hidden mdUp>
      <Grid xs={12} sm={12} item>
       <Box sx={mobileTop}>
        <AppBottomNavigation />
       </Box>
      </Grid>
     </Hidden>
    )}
   </Grid>
   {isOpen && <MobileSideBar isOpen={isOpen} toggleDrawer={toggleDrawer} />}
  </React.Fragment>
 );
};

const scrollBar = {
 marginTop: '10px',
 overflowX: 'hidden',
 paddingBottom: '100px',
};

const sidebar = {
 width: '100%',
 height: '100vh',
};

const main = {
 width: '100%',
 minHeight: '77vh',
};

const mobileTop = {
 width: '100%',
 background: 'yellow',
};

const inner = {
 width: '100%',
 height: "100%",
 display: 'flex',
 flexDirection: 'column',
 alignItems: 'center',
};

const outmehn = {
    maxWidth: "1440px",
    width: '100%',
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}

export default HomeScreen;
