import "./App.scss";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import ProtectedRoute from "./screens/ProtectedRoute";
import { HashRouter, Route, Switch } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Homepage from "./components/LandingPage/Home";
import Connection from "./screens/Connection";
import CustomerLPO from "./screens/LPOCustomers";

function App() {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  return (
    <HashRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Homepage} />
          <ProtectedRoute path="/home" component={HomeScreen} />
          <Route path="/home/overage" component={HomeScreen} />
          <Route path="/home/daily-sales" component={HomeScreen} />
          <Route path="/home/daily-sales/overage" component={HomeScreen} />
          <Route path="/home/tank-list" component={HomeScreen} />
          <Route path="/home/pump-list" component={HomeScreen} />
          <Route path="/home/analysis/expenses" component={HomeScreen} />
          <Route path="/home/hr" component={HomeScreen} />
          <Route path="/home/inc-orders" component={HomeScreen} />
          <Route path="/home/outlets" component={HomeScreen} />
          <Route path="/home/outlets/tanks" component={HomeScreen} />
          <Route path="/home/outlets/pumps" component={HomeScreen} />
          <Route path="/home/outlets/sales" component={HomeScreen} />
          <Route path="/home/outlets/sales/list" component={HomeScreen} />
          <Route path="/home/analysis/payments" component={HomeScreen} />
          <Route path="/home/product-orders" component={HomeScreen} />
          <Route path="/home/daily-record-sales" component={HomeScreen} />
          <Route path="/home/daily-record-sales/lpo" component={HomeScreen} />
          <Route
            path="/home/estation-corporate-orders"
            component={HomeScreen}
          />
          <Route
            path="/home/daily-record-sales/expenses"
            component={HomeScreen}
          />
          <Route
            path="/home/daily-record-sales/payment"
            component={HomeScreen}
          />
          <Route path="/home/estation-incoming-orders" component={HomeScreen} />
          <Route
            path="/home/daily-record-sales/dipping"
            component={HomeScreen}
          />
          <Route path="/home/daily-record-sales/pump" component={HomeScreen} />
          <Route path="/home/daily-record-sales/rt" component={HomeScreen} />
          <Route path="/home/regulatory" component={HomeScreen} />
          <Route path="/home/analysis" component={HomeScreen} />
          <Route path="/home/lpo" component={HomeScreen} />
          <Route path="/home/lpo/list" component={HomeScreen} />
          <Route path="/home/lpo/company" component={HomeScreen} />
          <Route path="/home/estation" component={HomeScreen} />
          <Route path="/home/estation-corporate-sales" component={HomeScreen} />
          <Route
            path="/home/estation/corporate/customer"
            component={HomeScreen}
          />
          <Route path="/home/estation/payments" component={HomeScreen} />
          <Route path="/home/estation/sales" component={HomeScreen} />
          <Route
            path="/home/estation-individual-sales"
            component={HomeScreen}
          />
          <Route
            path="/home/estation/individual/customer"
            component={HomeScreen}
          />

          <Route path="/home/supply" component={HomeScreen} />
          <Route path="/home/supply/create" component={HomeScreen} />
          <Route path="/home/tank" component={HomeScreen} />
          <Route path="/home/history" component={HomeScreen} />
          <Route path="/home/settings" component={HomeScreen} />
          <Route path="/home/hr/manager" component={HomeScreen} />
          <Route path="/home/hr/employee" component={HomeScreen} />
          <Route path="/home/dashEmp" component={HomeScreen} />
          <Route path="/home/hr/salary" component={HomeScreen} />
          <Route path="/home/hr/query" component={HomeScreen} />
          <Route path="/home/hr/recruitment" component={HomeScreen} />
          <Route path="/home/hr/attendance" component={HomeScreen} />
          <Route path="/login" component={LoginScreen} />
          <Route path="/lpo-customers" component={CustomerLPO} />
          <Route path="/connection" component={Connection} />
          <Route render={() => <h1>404 page not found</h1>} />
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;

// https://golden-peony-ca6360.netlify.app
