import activeList from "../../assets/activeList.png";
import inactiveList from "../../assets/inactiveList.png";
import activeGrid from "../../assets/activeGrid.png";
import inactiveGrid from "../../assets/inactiveGrid.png";

const OutletGridSwitch = ({ switchTabs, callback }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {switchTabs || (
        <img
          onClick={callback}
          style={{
            width: "30px",
            height: "30px",
            marginLeft: "6px",
          }}
          src={activeList}
          alt="icon"
        />
      )}
      {switchTabs && (
        <img
          onClick={callback}
          style={{
            width: "30px",
            height: "30px",
            marginLeft: "6px",
          }}
          src={inactiveList}
          alt="icon"
        />
      )}
      {switchTabs || (
        <img
          onClick={callback}
          style={{
            width: "30px",
            height: "30px",
            marginLeft: "6px",
          }}
          src={inactiveGrid}
          alt="icon"
        />
      )}
      {switchTabs && (
        <img
          onClick={callback}
          style={{
            width: "30px",
            height: "30px",
            marginLeft: "6px",
          }}
          src={activeGrid}
          alt="icon"
        />
      )}
    </div>
  );
};

export default OutletGridSwitch;
