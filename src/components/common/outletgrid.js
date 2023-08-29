import activeList from "../../assets/activeList.png";
import inactiveList from "../../assets/inactiveList.png";
import activeGrid from "../../assets/activeGrid.png";
import inactiveGrid from "../../assets/inactiveGrid.png";

const mobile = window.matchMedia("(max-width: 600px)");

const OutletGridSwitch = ({ switchTabs, callback }) => {
  return (
    <div style={style}>
      {switchTabs || (
        <img onClick={callback} style={icon} src={activeList} alt="icon" />
      )}
      {switchTabs && (
        <img onClick={callback} style={icon} src={inactiveList} alt="icon" />
      )}
      {switchTabs || (
        <img onClick={callback} style={icon} src={inactiveGrid} alt="icon" />
      )}
      {switchTabs && (
        <img onClick={callback} style={icon} src={activeGrid} alt="icon" />
      )}
    </div>
  );
};

const style = {
  display: "flex",
  flexDirection: "row",
  marginTop: mobile.matches ? "15px" : "0px",
};

const icon = {
  width: "30px",
  height: "30px",
  marginLeft: mobile.matches ? "0px" : "6px",
  marginRight: mobile.matches ? "6px" : "0px",
};

export default OutletGridSwitch;
