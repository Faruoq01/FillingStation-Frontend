import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import cross from "../../../assets/cross.png";
import {
  desselectedListPumps,
  selectedListPumps,
  updateAgoList,
  updateDpkList,
  updatePmsList,
} from "../../../storage/recordsales";

const PumpSelector = ({ data, index }) => {
  const dispatch = useDispatch();
  const tankListData = useSelector((state) => state.recordsales.tankList);
  const PMS = useSelector((state) => state.recordsales.PMS);
  const AGO = useSelector((state) => state.recordsales.AGO);
  const DPK = useSelector((state) => state.recordsales.DPK);

  const pumpItem = (e, index, pump) => {
    e.preventDefault();
    if (tankListData.lenth === 0)
      return swal("Alert", "Please refresh tanks not loaded!", "warning");
    const tankClone = JSON.parse(JSON.stringify(tankListData));
    const tankID = tankClone.findIndex((data) => data._id === pump.hostTank);

    switch (pump.productType) {
      case "PMS": {
        const newPms = [...PMS];
        newPms[index] = { ...newPms[index], identity: index };
        dispatch(updatePmsList(newPms));
        dispatch(
          selectedListPumps({
            selected: newPms[index],
            tank: tankClone[tankID],
          })
        );
        break;
      }

      case "AGO": {
        const newAgo = [...AGO];
        newAgo[index] = { ...newAgo[index], identity: index };
        dispatch(updateAgoList(newAgo));
        dispatch(
          selectedListPumps({
            selected: newAgo[index],
            tank: tankClone[tankID],
          })
        );
        break;
      }

      case "DPK": {
        const newDpk = [...DPK];
        newDpk[index] = { ...newDpk[index], identity: index };
        dispatch(updateDpkList(newDpk));
        dispatch(
          selectedListPumps({
            selected: newDpk[index],
            tank: tankClone[tankID],
          })
        );
        break;
      }
      default: {
      }
    }
  };

  const deselect = (index, pump) => {
    const tankClone = JSON.parse(JSON.stringify(tankListData));
    const tankID = tankClone.findIndex((data) => data._id === pump.hostTank);

    switch (pump.productType) {
      case "PMS": {
        const newPms = [...PMS];
        newPms[index] = { ...newPms[index], identity: null };
        dispatch(updatePmsList(newPms));
        dispatch(
          desselectedListPumps({
            selected: newPms[index],
            tank: tankClone[tankID],
          })
        );
        break;
      }

      case "AGO": {
        const newAgo = [...AGO];
        newAgo[index] = { ...newAgo[index], identity: null };
        dispatch(updateAgoList(newAgo));
        dispatch(
          desselectedListPumps({
            selected: newAgo[index],
            tank: tankClone[tankID],
          })
        );
        break;
      }

      case "DPK": {
        const newDpk = [...DPK];
        newDpk[index] = { ...newDpk[index], identity: null };
        dispatch(updateDpkList(newDpk));
        dispatch(
          desselectedListPumps({
            selected: newDpk[index],
            tank: tankClone[tankID],
          })
        );
        break;
      }
      default: {
      }
    }
  };

  return (
    <div key={index}>
      <div className={data.identity === index ? "box" : "box2"}>
        <p
          onClick={(e) => pumpItem(e, index, data)}
          style={{ marginRight: "10px" }}>
          {data.pumpName}
        </p>
        <img
          onClick={() => {
            deselect(index, data);
          }}
          style={{ width: "20px", height: "20px" }}
          src={cross}
          alt="icon"
        />
      </div>
    </div>
  );
};

export default PumpSelector;
