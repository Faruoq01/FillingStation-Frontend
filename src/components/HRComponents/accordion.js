import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import "../../styles/common/accordion.scss";
import { CreateButton } from "../common/buttons";
import { Switch } from "@mui/material";
import edit from "../../assets/comp/edit.png";
import del from "../../assets/comp/delete.png";
import AddShiftsModal from "../Modals/shifts";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import APIs from "../../services/connections/api";
import { adminOutlet, getAllStations } from "../../storage/outlet";
import EditShiftModal from "../Modals/editshift";

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  border: "1px solid rgba(0, 0, 0, .125)",
}));

const CustomArcodion = ({ mt, day }) => {
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [editShift, setEditShift] = useState("");
  const [currentShift, setCurrentShift] = useState({});

  const handleChange = () => {
    if (oneStationData === null)
      return swal("Warning!", "Please select a station", "info");
    setExpanded(!expanded);
  };

  const createShift = (day) => {
    setDate(day);
    setOpen(true);
  };

  const getShifts = () => {
    const currentDay = day.toLowerCase();
    if (oneStationData) {
      if ("shift" in oneStationData) {
        if (currentDay in oneStationData["shift"]) {
          const currentDayShift = oneStationData["shift"][currentDay];
          return Object.values(currentDayShift);
        }
        return [];
      }
      return [];
    }
    return [];
  };

  const openShiftModal = (data) => {
    setEditShift(true);
    setCurrentShift(data);
  };

  return (
    <React.Fragment>
      <Accordion
        sx={{ ...accord, marginTop: mt }}
        expanded={expanded}
        onChange={handleChange}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography sx={text}>{day}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={inner}>
          <div className="accordion-container">
            <CreateButton
              callback={() => {
                createShift(day);
              }}
              label={"Add Shifts"}
            />
            {getShifts().length === 0 && (
              <div style={placeholder}>No shift created for this day</div>
            )}
            {getShifts().map((item, index) => {
              return (
                <ShiftContainer
                  key={index}
                  data={item}
                  day={day}
                  edit={openShiftModal}
                />
              );
            })}
          </div>
        </AccordionDetails>
      </Accordion>
      {open && (
        <AddShiftsModal day={date.toLowerCase()} open={open} close={setOpen} />
      )}
      {editShift && (
        <EditShiftModal
          day={day.toLowerCase()}
          open={editShift}
          close={setEditShift}
          data={currentShift}
        />
      )}
    </React.Fragment>
  );
};

const ShiftContainer = ({ key, data, day, edit }) => {
  const dispatch = useDispatch();
  const station = useSelector((state) => state.outlet.adminOutlet);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const [active, setActive] = useState(data.activeState);

  const changeActiveState = (item) => {
    setActive(!active);
    const currentDay = day.toLowerCase();
    const shiftList = JSON.parse(JSON.stringify(station.shift));
    shiftList[currentDay][item.shiftname]["activeState"] = !active;

    const query = {
      id: station._id,
      shift: shiftList,
    };

    APIs.post("/station/shift", query)
      .then(({ data }) => {
        const stationCopy = JSON.parse(JSON.stringify(allOutlets));
        const findID = stationCopy.findIndex(
          (item) => item._id === data.outlet._id
        );
        stationCopy[findID] = data.outlet;
        if (findID !== -1) {
          dispatch(getAllStations(stationCopy));
          dispatch(adminOutlet(data.outlet));
        }
      })
      .then(() => {
        swal("Success!", "Shifts updated successfully!", "success");
      });
  };

  return (
    <div key={key} className="shift-container">
      <div className="shift-controls">
        <div className="shift-name">{data.shiftname}</div>
        <div className="shift-actions">
          <Icons data={data} day={day} editShift={edit} />
          <Android12Switch
            onChange={(e) => changeActiveState(data)}
            checked={active}
          />
        </div>
      </div>
      <div className="container-label">
        <div>Manager Assigned</div>
        <div>Shift Name</div>
        <div>Start time</div>
        <div>End time</div>
        <div>Shift Status</div>
      </div>
      <div className="container-details">
        <div>{data.manager}</div>
        <div>{data.shiftname}</div>
        <div>{data.startTime}</div>
        <div>{data.endTime}</div>
        <div>{data.status}</div>
      </div>
    </div>
  );
};

const Icons = ({ data, day, editShift }) => {
  const station = useSelector((state) => state.outlet.adminOutlet);
  const dispatch = useDispatch();

  return (
    <div className="cells">
      <img
        onClick={() => {
          editShift(data);
        }}
        style={{
          width: "20px",
          height: "20px",
          marginRight: "10px",
        }}
        src={edit}
        alt="icon"
      />
      <img
        onClick={() => {
          deleteRecord(data, station, day, dispatch);
        }}
        style={{ width: "20px", height: "20px" }}
        src={del}
        alt="icon"
      />
    </div>
  );
};

const deleteRecord = (data, station, day, dispatch) => {
  swal({
    title: "Alert!",
    text: "Are you sure you want to delete this shift?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      const shifts = JSON.parse(JSON.stringify(station.shift));
      delete shifts[day.toLowerCase()][data.shiftname];

      const query = {
        id: station._id,
        shift: shifts,
      };

      APIs.post("/station/shift", query)
        .then(({ data }) => {
          dispatch(adminOutlet(data.outlet));
        })
        .then(() => {
          swal("Success!", "Shift deleted successfully!", "success");
        });
    }
  });
};

const accord = {
  background: "#fff",
  border: "1px solid #ccc",
};

const inner = {
  backgroundColor: "#fff",
};

const text = {
  fontSize: "12px",
  fontFamily: "Poppins",
};

const placeholder = {
  fontSize: "12px",
  fontFamily: "Poppins",
  marginTop: "20px",
  width: "100%",
  textAlign: "left",
};

export default CustomArcodion;
