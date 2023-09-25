import { useDispatch, useSelector } from "react-redux";
import ModalBackground from "../controls/Modal/ModalBackground";
import React, { useEffect } from "react";
import { useState } from "react";
import { MenuItem, Select } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import OutletReport from "../../services/reports/outlet";
import PrintReportPage from "./showreportpane";
import { setPDFData } from "../../storage/outlet";
import ReportsAPI from "../../services/connections/reportsapi";
import { lpoColumns, stationColumns } from "../../modules/defaulttablecolumns";

const mobile = window.matchMedia("(max-width: 600px)");

const GenerateReports = ({ open, close, section, data }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const [headers, setHeaders] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [openReport, setOpen] = useState(false);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const processSection = () => {
    switch (section) {
      case "station": {
        DefaultColumns.getStation(allOutlets, setHeaders, setSelectedFields);
        break;
      }

      case "lpo": {
        DefaultColumns.getLPO(data, setHeaders, setSelectedFields);
        break;
      }

      default: {
      }
    }
  };

  useEffect(() => {
    processSection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToList = (field) => {
    setSelectedFields([...selectedFields, field]);
    setHeaders((prev) => prev.filter((data) => data !== field));
  };

  const removeFromList = (field) => {
    setSelectedFields((prev) => prev.filter((data) => data !== field));
    setHeaders([...headers, field]);
  };

  const printPayload = {
    type: "print",
    section: section,
    organizationID: resolveUserID().id,
    outletID: oneStationData?._id,
    columns: selectedFields,
  };

  const pdfPayload = {
    type: "pdf",
    section: section,
    organizationID: resolveUserID().id,
    outletID: oneStationData?._id,
    columns: selectedFields,
  };

  const downloadPDF = async () => {
    downloadByCategory(pdfPayload);
  };

  const printReport = async () => {
    const data = await printReportByCategory(printPayload);
    dispatch(setPDFData(data));
    setOpen(true);
  };

  return (
    <React.Fragment>
      <ModalBackground
        openModal={open}
        closeModal={close}
        ht={"400px"}
        report={true}
        pdf={downloadPDF}
        print={printReport}
        label={"Generate Reports Settings"}>
        <SelectList callback={addToList} menus={headers} />
        <div style={selectedFields.length === 0 ? container2 : container}>
          {selectedFields.map((data, index) => {
            return (
              <div style={keyStyle} key={index}>
                {data}
                <HighlightOffIcon
                  onClick={() => {
                    removeFromList(data);
                  }}
                  sx={cancelStyle}
                />
              </div>
            );
          })}
          {selectedFields.length === 0 && (
            <span>Select Field to be reported</span>
          )}
        </div>
      </ModalBackground>
      {openReport && <PrintReportPage open={openReport} close={setOpen} />}
    </React.Fragment>
  );
};

const SelectList = ({ callback, menus }) => {
  const setData = (item) => {
    callback(item);
  };
  return (
    <Select
      labelId="demo-select-small"
      id="demo-select-small"
      MenuProps={menuProps}
      value={0}
      sx={selectStyle2}>
      <MenuItem style={menu} value={0}>
        Select all fields that apply
      </MenuItem>
      {menus?.map((item, index) => {
        return (
          <MenuItem
            onClick={() => {
              setData(item);
            }}
            key={index}
            style={menu}
            value={index + 1}>
            {item}
          </MenuItem>
        );
      })}
    </Select>
  );
};

const DefaultColumns = {
  getStation: (allOutlets, setHeaders, setSelectedFields) => {
    const oneStation = allOutlets ? allOutlets[0] : [];
    let keys = Object.keys(oneStation);
    keys = keys.filter((data) => !stationColumns.includes(data));
    setHeaders(keys);
    setSelectedFields(stationColumns);
  },

  getLPO: (data, setHeaders, setSelectedFields) => {
    const lpo = data ? data[0] : [];
    let keys = Object.keys(lpo);
    keys = keys.filter((data) => !lpoColumns.includes(data));
    setHeaders(keys);
    setSelectedFields(lpoColumns);
  },
};

const selectStyle2 = {
  minWidth: mobile.matches ? "100%" : "120px",
  maxWidth: "300px",
  height: "30px",
  borderRadius: "0px",
  background: "#F2F1F1B2",
  color: "grey",
  fontSize: "12px",
  outline: "none",
  fontFamily: "Poppins",
  marginTop: "15px",
  position: "fixed",
  opacity: 1,
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

const menu = {
  fontSize: "12px",
  fontFamily: "Poppins",
  "& .MuiPaper-root": {
    maxHeight: "200px",
  },
};

const container = {
  marginTop: "50px",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  minHeight: "350px",
};

const container2 = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Poppins",
  fontSize: "12px",
  minHeight: "400px",
};

const keyStyle = {
  marginTop: "10px",
  minWidth: "10px",
  height: "30px",
  border: "1px solid #ccc",
  color: "#000",
  paddingLeft: "10px",
  paddingRight: "5px",
  borderRadius: "20px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
};

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: "200px",
    },
  },
};

const cancelStyle = {
  marginLeft: "10px",
  color: "grey",
};

async function printReportByCategory(payload) {
  switch (payload.section) {
    case "station": {
      const data = await OutletReport.getStationPrints(payload);
      return data;
    }
    case "lpo": {
      const data = await OutletReport.getLPOPrints(payload);
      return data;
    }
    default: {
    }
  }
}

async function downloadByCategory(payload) {
  switch (payload.section) {
    case "station": {
      const { data } = await ReportsAPI.post("/outlet", payload, {
        responseType: "blob",
      });
      downloadPDF(data);
      break;
    }
    case "lpo": {
      const { data } = await ReportsAPI.post("/lpo", payload, {
        responseType: "blob",
      });
      downloadPDF(data);
      break;
    }
    default: {
    }
  }
}

function downloadPDF(data) {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = "generated.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default GenerateReports;
