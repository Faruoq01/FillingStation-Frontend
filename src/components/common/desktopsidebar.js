import SideItems from "./sidebarmenu";
import stationlogo from "../../assets/stationlogo.png";
import dashboard from "../../assets/dashboard.png";
import dashboard2 from "../../assets/dashboard2.png";
import dailySales from "../../assets/dailySales.png";
import expenses from "../../assets/expenses.png";
import hr from "../../assets/hr.png";
import incOrders from "../../assets/incOrders.png";
import outlet from "../../assets/outlet.png";
import analysis from "../../assets/analysis.png";
import lpo from "../../assets/lpo.png";
import productOrders from "../../assets/productOrders.png";
import analysis22 from "../../assets/analysis22.png";
import lpo2 from "../../assets/lpo2.png";
import recordSales from "../../assets/recordSales.png";
import regulatory from "../../assets/regulatory.png";
import settings from "../../assets/settings.png";
import tank from "../../assets/tank.png";
import dailySales2 from "../../assets/dailySales2.png";
import expenses2 from "../../assets/expenses2.png";
import hr2 from "../../assets/hr2.png";
import incOrders2 from "../../assets/incOrders2.png";
import outlet2 from "../../assets/outlet2.png";
import productOrders2 from "../../assets/productOrders2.png";
import recordSales2 from "../../assets/recordSales2.png";
import regulatory2 from "../../assets/regulatory2.png";
import settings2 from "../../assets/settings2.png";
import tank2 from "../../assets/tank2.png";
import { useSelector } from "react-redux";
import "../../styles/sidebar.scss";

const DesktopSideBar = (props) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div style={{ background: user.sideBarMode }} className="side-bar">
      <div className="inner-side-bar">
        <img className="home-logo" src={stationlogo} alt="icon" />
        <SideItems
          marginT={"0px"}
          link={"/home/dashboard/dashboardhome/0"}
          name={"Dashboard"}
          icon={dashboard}
          icon2={dashboard2}
          close={props.close}
        />
        <SideItems
          marginT={"45px"}
          link={"/home/dailysales/dailysaleshome/0"}
          name={"Daily Sales"}
          icon={dailySales2}
          icon2={dailySales}
          close={props.close}
        />
        <SideItems
          marginT={"90px"}
          link={"/home/mystation/mystationhome/0"}
          name={"My Stations"}
          icon={outlet2}
          icon2={outlet}
          close={props.close}
        />
        <SideItems
          marginT={"135px"}
          link={"/home/recordsales/pumpupdate/0"}
          name={"Record Sales"}
          icon={recordSales2}
          icon2={recordSales}
          close={props.close}
        />
        <SideItems
          marginT={"180px"}
          link={"/home/analysis/analysishome/0"}
          name={"Analysis"}
          icon={analysis22}
          icon2={analysis}
          close={props.close}
        />
        <SideItems
          marginT={"225px"}
          link={"/home/lposales/lposaleshome/0"}
          name={"Corporate Sales"}
          icon={lpo2}
          icon2={lpo}
          close={props.close}
        />
        <SideItems
          marginT={"270px"}
          link={"/home/productorder/productorderhome/0"}
          name={"Product Orders"}
          icon={productOrders2}
          icon2={productOrders}
          close={props.close}
        />
        <SideItems
          marginT={"315px"}
          link={"/home/unallocatedorder/unallocatedorderhome/0"}
          name={"Incoming Orders"}
          icon={incOrders2}
          icon2={incOrders}
          close={props.close}
        />
        <SideItems
          marginT={"360px"}
          link={"/home/supply/supplyhome/0"}
          name={"Supply"}
          icon={expenses2}
          icon2={expenses}
          close={props.close}
        />
        <SideItems
          marginT={"405px"}
          link={"/home/regulatory"}
          name={"Regulatory Pay"}
          icon={regulatory2}
          icon2={regulatory}
          close={props.close}
        />
        <SideItems
          marginT={"450px"}
          link={"/home/tankupdate"}
          name={"Tank Update"}
          icon={tank2}
          icon2={tank}
          close={props.close}
        />
        <SideItems
          marginT={"495px"}
          link={"/home/hr/hrhome/0"}
          name={"Human Resources"}
          icon={hr2}
          icon2={hr}
          close={props.close}
        />
        <SideItems
          marginT={"540px"}
          link={"/home/settings"}
          name={"Settings"}
          icon={settings2}
          icon2={settings}
          close={props.close}
        />
      </div>
    </div>
  );
};

export default DesktopSideBar;
