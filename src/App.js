import "./App.scss";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Homepage from "./components/LandingPage/Home";
import Connection from "./screens/Connection";
import AttendanceModule from "./screens/AttendantModule";
import Transactions from "./components/Home/Transactions";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Home/Dashboard";
import DailySales from "./components/Home/DailySales";
import Outlets from "./components/Home/Outlets";
import DailyRecordSales from "./components/Home/DailyRecordSales";
import Analysis from "./components/Home/Analysis";
import LPO from "./components/Home/LPO";
import ProductOrders from "./components/Home/ProductOrders";
import IncomingOrders from "./components/Home/IncomingOrders";
import Supply from "./components/Home/Supply";
import Regulatory from "./components/Home/Regulatory";
import TankUpdate from "./components/Home/TankUpdate";
import HumanResources from "./components/Home/HumanResource";
import Settings from "./components/Home/Settings";
import DashboardEmployee from "./components/DashboardComponents/DashboardEmp";
import OverageList from "./components/DashboardComponents/overagelist";
import SalesOverageList from "./components/DailySales/OverageList";
import StationTanks from "./components/Home/StationTanks";
import StationPumps from "./components/Home/StationPumps";
import ListAllTanks from "./components/Outlet/TankList";
import PMSDailySales from "./components/DailySales/PMSDailySales";
import AGODailySales from "./components/DailySales/AGODailySales";
import DPKDailySales from "./components/DailySales/DPKDailySales";
import ComprehensiveReport from "./components/DailySales/ComprehensiveReport";
import Sales from "./components/Outlet/Sales";
import Tank from "./components/Outlet/Tanks";
import Pump from "./components/Outlet/Pumps";
import Payments from "./components/Home/Payments";
import Expenses from "./components/Home/Expenses";
import AirBnBTotal from "./components/Home/AirBnBTotal";
import CreateSupply from "./components/Supply/CreateSupply";
import Employee from "./components/HRComponents/Employee";
import Salary from "./components/HRComponents/Salary";
import Query from "./components/HRComponents/Query";
import Attendance from "./components/HRComponents/Attendance";
import DashboardHome from "./components/DashboardComponents/dashboardhome";
import DailysalesHome from "./components/DailySales/dailysaleshome";
import SupplyHome from "./components/Supply/supplyhome";
import OutletHome from "./components/Outlet/outlethome";
import AnalysisHome from "./components/analysis/analysishome";
import LPOHome from "./components/AirBnBTotal/lpohome";
import HumanResourcesHome from "./components/HRComponents/hrhome";

function App() {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route index path="/" element={<Homepage />} />
        <Route path="login" element={<LoginScreen />} />
        <Route path="home" element={<HomeScreen />}>
          <Route path="dashboard" element={<Dashboard />}>
            <Route
              index
              path="dashboardhome/:index"
              element={<DashboardHome />}
            />
            <Route path="dashboardemployee" element={<DashboardEmployee />} />
            <Route path="dashboardoverage" element={<OverageList />} />
            <Route path="stationtanks" element={<StationTanks />} />
            <Route path="stationpumps" element={<StationPumps />} />
          </Route>
          <Route path="dailysales" element={<DailySales />}>
            <Route
              index
              path="dailysaleshome/:index"
              element={<DailysalesHome />}
            />
            <Route path="pmssales" element={<PMSDailySales />} />
            <Route path="agosales" element={<AGODailySales />} />
            <Route path="dpksales" element={<DPKDailySales />} />
            <Route path="comprehensive" element={<ComprehensiveReport />} />
            <Route path="tanklist" element={<ListAllTanks />} />
            <Route path="dailysalesoverage" element={<SalesOverageList />} />
          </Route>
          <Route path="mystation" element={<Outlets />}>
            <Route index path="mystationhome/:index" element={<OutletHome />} />
            <Route path="sales" element={<Sales />} />
            <Route path="tanks" element={<Tank />} />
            <Route path="pumps" element={<Pump />} />
          </Route>
          <Route path="recordsales" element={<DailyRecordSales />} />
          <Route path="analysis" element={<Analysis />}>
            <Route
              index
              path="analysishome/:index"
              element={<AnalysisHome />}
            />
            <Route path="payments" element={<Payments />} />
            <Route path="expenses" element={<Expenses />} />
          </Route>
          <Route path="lposales" element={<LPO />}>
            <Route index path="lposaleshome/:index" element={<LPOHome />} />
            <Route path="corporatecustomer" element={<AirBnBTotal />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>
          <Route path="productorder" element={<ProductOrders />} />
          <Route path="incomingorder" element={<IncomingOrders />} />
          <Route path="supply" element={<Supply />}>
            <Route index path="supplyhome/:index" element={<SupplyHome />} />
            <Route path="createsupply" element={<CreateSupply />} />
          </Route>
          <Route path="regulatory" element={<Regulatory />} />
          <Route path="tankupdate" element={<TankUpdate />} />
          <Route path="hr" element={<HumanResources />}>
            <Route
              index
              path="hrhome/:index"
              element={<HumanResourcesHome />}
            />
            <Route path="hremployees" element={<Employee />} />
            <Route path="salary" element={<Salary />} />
            <Route path="query" element={<Query />} />
            <Route path="attendance" element={<Attendance />} />
          </Route>
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="attendant" element={<AttendanceModule />} />
        <Route path="connection" element={<Connection />} />
        {/* <Route render={() => <h1>404 page not found</h1>} /> */}
      </Routes>
    </div>
  );
}

export default App;

// https://golden-peony-ca6360.netlify.app
