import { useState } from "react";
import ModalBackground from "../controls/Modal/ModalBackground";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import APIs from "../../services/connections/api";
import { settingsEmployee } from "../../storage/settings";
import ModalInputField from "../controls/Modal/ModalInputField";
import { MenuItem, Select } from "@mui/material";
import swal from "sweetalert";
import { adminOutlet } from "../../storage/outlet";

const defaultShift = {
  sunday: {},
  monday: {},
  tuesday: {},
  wednesday: {},
  thursday: {},
  friday: {},
  saturday: {},
};

const AddShiftsModal = ({ day, open, close }) => {
  const user = useSelector((state) => state.auth.user);
  const employees = useSelector((state) => state.settings.orgEmployee);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const dispatch = useDispatch();
  const [defaultState, setDefaultState] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shiftname, setShiftname] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [manager, setManager] = useState("");

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  useEffect(() => {
    const payload = {
      organisationID: resolveUserID().id,
      outletID: "None",
    };

    APIs.post("/dashboard/employee", payload)
      .then(({ data }) => {
        dispatch(settingsEmployee(data.employee));
      })
      .then(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateManager = (item, index) => {
    setDefaultState(index);
    setManager(item.staffName);
  };

  const getManagers = () => {
    const managers = employees.filter((data) => data.role === "Manager");
    return managers;
  };

  const submit = () => {
    if (shiftname === "")
      return swal("Warning!", "Shift name field cannot be empty", "info");
    if (startTime === "")
      return swal("Warning!", "Start time field cannot be empty", "info");
    if (endTime === "")
      return swal("Warning!", "End time field cannot be empty", "info");
    if (manager === "")
      return swal("Warning!", "Manager name field cannot be empty", "info");

    const currentStation = JSON.parse(JSON.stringify(oneStationData));
    const payload = {
      manager: manager,
      shiftname: shiftname,
      startTime: startTime,
      endTime: endTime,
      status: "Scheduled",
      activeState: true,
    };

    if (oneStationData) {
      setLoading(true);
      let shiftLoad = {};
      if ("shift" in oneStationData) {
        const shiftList = currentStation.shift;
        if (day in shiftList) {
          const currentDay = shiftList[day];
          if (payload.shiftname in currentDay) {
            shiftList[day][payload.shiftname] = payload;
            shiftLoad = shiftList;
          } else {
            shiftList[day][payload.shiftname] = {};
            shiftList[day][payload.shiftname] = payload;
            shiftLoad = shiftList;
          }
        } else {
          shiftList[day] = {};
          shiftList[day][payload.shiftname] = {};
          shiftList[day][payload.shiftname] = payload;
          shiftLoad = shiftList;
        }
        shiftLoad = shiftList;
      } else {
        const initShift = { ...defaultShift };
        initShift[day] = {};
        initShift[day][payload.shiftname] = payload;
        shiftLoad = initShift;
      }

      const query = {
        id: oneStationData._id,
        shift: shiftLoad,
      };

      APIs.post("/station/shift", query)
        .then(({ data }) => {
          dispatch(adminOutlet(data.outlet));
        })
        .then(() => {
          setLoading(false);
          close(false);
          swal("Success!", "Shifts updated successfully!", "success");
        });
    } else {
      return swal("Warning!", "Please select a station", "info");
    }
  };

  return (
    <ModalBackground
      openModal={open}
      closeModal={close}
      submit={submit}
      loading={loading}
      ht={"330px"}
      label={"Create a new shift"}>
      <ModalInputField
        value={shiftname}
        setValue={setShiftname}
        type={"text"}
        label={"Shift name"}
      />

      <ModalInputField
        value={startTime}
        setValue={setStartTime}
        type={"time"}
        label={"Start time"}
      />

      <ModalInputField
        value={endTime}
        setValue={setEndTime}
        type={"time"}
        label={"End time"}
      />

      <div style={{ marginTop: "20px" }} className="inputs">
        <div className="head-text2">Select station manager</div>
        <Select MenuProps={menuProps} value={defaultState} sx={style}>
          <MenuItem sx={menu} value={0}>
            Select manager
          </MenuItem>
          {getManagers().map((item, index) => {
            return (
              <MenuItem
                sx={menu}
                value={index + 1}
                onClick={() => {
                  updateManager(item, index + 1);
                }}
                key={index}>
                {item.staffName}
              </MenuItem>
            );
          })}
        </Select>
      </div>
    </ModalBackground>
  );
};

const style = {
  width: "100%",
  height: "35px",
  background: "#EEF2F1",
  fontSize: "12px",
  borderRadius: "0px",
  marginTop: "5px",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: "200px",
    },
  },
};

const menu = {
  fontSize: "12px",
  fontFamily: "Poppins",
};

export default AddShiftsModal;
