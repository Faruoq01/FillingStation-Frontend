import { useDispatch, useSelector } from "react-redux";
import pump1 from "../../../assets/pump1.png";
import { updateSelectedPumps } from "../../../storage/recordsales";
import swal from "sweetalert";
const mediaMatch = window.matchMedia("(max-width: 500px)");

const PumpCard = ({ item, index }) => {
  const dispatch = useDispatch();
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const selectedTanks = useSelector((state) => state.recordsales.selectedTanks);
  const currentDate = useSelector((state) => state.recordsales.currentDate);
  const tankListData = useSelector((state) => state.recordsales.tankList);
  const productType = useSelector((state) => state.recordsales.productType);
  const selectedPumps = useSelector((state) => state.recordsales.selectedPumps);

  function removeSpecialCharacters(str) {
    return str.replace(/[^0-9.]/g, "");
  }

  const updateTotalizer = (e, totalizerDiff, index, pump) => {
    if (productType === "PMS") {
      /*###########################################
                    Update the pump readings for PMS
                ############################################*/

      const onlyPMS = [...tankListData].filter(
        (data) => data.productType === "PMS"
      );
      const totalPMSTankLevel = onlyPMS.reduce((accum, current) => {
        return Number(accum) + Number(current.currentLevel);
      }, 0);

      const selectedPMS = [...selectedPumps];
      const pumpID = selectedPMS.findIndex((data) => data._id === pump._id);
      selectedPMS[pumpID] = { ...selectedPMS[pumpID], sales: totalizerDiff };
      selectedPMS[pumpID] = { ...selectedPMS[pumpID], newTotalizer: e };
      selectedPMS[pumpID] = { ...selectedPMS[pumpID], outlet: oneStationData };
      selectedPMS[pumpID] = {
        ...selectedPMS[pumpID],
        totalTankLevel: totalPMSTankLevel,
      };

      dispatch(updateSelectedPumps(selectedPMS));
    } else if (productType === "AGO") {
      /*###########################################
                    Update the pump readings for AGO
                ############################################*/

      const onlyAGO = [...tankListData].filter(
        (data) => data.productType === "AGO"
      );
      const totalAG0TankLevel = onlyAGO.reduce((accum, current) => {
        return Number(accum) + Number(current.currentLevel);
      }, 0);

      const selectedAGO = [...selectedPumps];
      const pumpID = selectedAGO.findIndex((data) => data._id === pump._id);
      selectedAGO[pumpID] = { ...selectedAGO[pumpID], sales: totalizerDiff };
      selectedAGO[pumpID] = { ...selectedAGO[pumpID], newTotalizer: e };
      selectedAGO[pumpID] = { ...selectedAGO[pumpID], outlet: oneStationData };
      selectedAGO[pumpID] = {
        ...selectedAGO[pumpID],
        totalTankLevel: totalAG0TankLevel,
      };

      dispatch(updateSelectedPumps(selectedAGO));
    } else if (productType === "DPK") {
      /*###########################################
                    Update the pump readings for DPK
                ############################################*/

      const onlyDPK = [...tankListData].filter(
        (data) => data.productType === "DPK"
      );
      const totalDPKTankLevel = onlyDPK.reduce((accum, current) => {
        return Number(accum) + Number(current.currentLevel);
      }, 0);

      const selectedDPK = [...selectedPumps];
      const pumpID = selectedDPK.findIndex((data) => data._id === pump._id);
      selectedDPK[pumpID] = { ...selectedDPK[pumpID], sales: totalizerDiff };
      selectedDPK[pumpID] = { ...selectedDPK[pumpID], newTotalizer: e };
      selectedDPK[pumpID] = { ...selectedDPK[pumpID], outlet: oneStationData };
      selectedDPK[pumpID] = {
        ...selectedDPK[pumpID],
        totalTankLevel: totalDPKTankLevel,
      };

      dispatch(updateSelectedPumps(selectedDPK));
    }
  };

  const setTotalizer = (e, pump, index) => {
    if (typeof currentDate !== "string")
      return swal("Error", "Please select record date", "error");
    if (selectedTanks.length !== 0) {
      const clonedTanks = JSON.parse(JSON.stringify(selectedTanks));
      const connectedTank = clonedTanks.filter(
        (data) => data._id === pump.hostTank
      );

      if (connectedTank.length !== 0) {
        const totalizerDiff =
          Number(e.target.value) - Number(pump.totalizerReading);
        const quantity =
          Number(connectedTank[0].currentLevel) -
          Number(connectedTank[0].deadStockLevel);

        if (oneStationData === null) {
          updateTotalizer("0", "0", index, pump);
          swal("Warning!", "Please select a station", "info");
        } else if (pump.identity === null) {
          updateTotalizer("0", "0", index, pump);
          swal("Warning!", "Please select a pump", "info");
        } else if (selectedPumps.length === 0) {
          updateTotalizer("0", "0", index, pump);
          swal("Warning!", "Please select a pump", "info");
        } else {
          if (totalizerDiff > quantity) {
            updateTotalizer("0", "0", index, pump);
            swal("Warning!", "Reading exceeded tank level", "info");
          } else {
            updateTotalizer(
              removeSpecialCharacters(e.target.value),
              totalizerDiff,
              index,
              pump
            );
          }
        }
      } else {
        updateTotalizer("0", "0", index, pump);
        swal("Warning!", "Please select a pump", "info");
      }
    } else {
      swal("Warning!", "Please select a pump", "info");
    }
  };

  return (
    <div
      style={{
        width: mediaMatch.matches ? "100%" : "270px",
        height: "300px",
      }}
      key={index}
      className="item">
      <img
        style={{ width: "55px", height: "60px", marginTop: "10px" }}
        src={pump1}
        alt="icon"
      />
      <div className="pop">
        {item.pumpName} ({item.hostTankName})
      </div>
      <div style={{ marginTop: "10px" }} className="label">
        Date: {item.updatedAt.split("T")[0]}
      </div>
      <div style={{ width: "94%" }}>
        <div style={{ marginTop: "10px" }} className="label">
          Opening meter (Litres)
        </div>
        <input
          disabled={true}
          value={item.totalizerReading}
          style={{ ...imps, width: "94%" }}
          type="text"
        />

        <div style={{ marginTop: "10px" }} className="label">
          Closing meter (Litres)
        </div>
        <input
          onChange={(e) => setTotalizer(e, item, index)}
          style={{
            ...imps,
            width: "94%",
            border:
              Number(item.totalizerReading) > Number(item.newTotalizer) &&
              item.newTotalizer !== "0"
                ? "1px solid red"
                : "1px solid black",
          }}
          type="number"
          value={item.newTotalizer}
          placeholder={"Enter closing meter"}
        />
      </div>
    </div>
  );
};

const imps = {
  height: "30px",
  width: "160px",
  background: "#D7D7D799",
  outline: "none",
  border: "1px solid #000",
  paddingLeft: "10px",
};

export default PumpCard;
