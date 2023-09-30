import { useDispatch, useSelector } from "react-redux";
import ModalBackground from "../controls/Modal/ModalBackground";
import React, { useEffect } from "react";
import { useState } from "react";
import { MenuItem, Select } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PrintReportPage from "./showreportpane";
import { setPDFData } from "../../storage/outlet";
import ReportsAPI from "../../services/connections/reportsapi";
import {
  attendanceColumns,
  bankColumns,
  creditColumns,
  deliveredOrderColumns,
  employeeColumns,
  expenseColumns,
  incomingOrderColumns,
  lpoColumns,
  lposalesColumns,
  outstandingColumns,
  overageColumns,
  posColumns,
  productColumns,
  queryColumns,
  regulatoryColumns,
  salaryColumns,
  stationColumns,
  supplyColumns,
} from "../../modules/defaulttablecolumns";
import swal from "sweetalert";

const mobile = window.matchMedia("(max-width: 600px)");

const GenerateReports = ({ open, close, section, data }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const station = useSelector((state) => state.outlet.adminOutlet);
  const updateDate = useSelector((state) => state.dashboard.dateRange);
  const [headers, setHeaders] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [openReport, setOpen] = useState(false);
  const [loading, setLoading] = useState(null);

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
        DefaultColumns.getColumns(
          data,
          setHeaders,
          setSelectedFields,
          stationColumns
        );
        break;
      }

      case "lpo": {
        DefaultColumns.getColumns(
          data,
          setHeaders,
          setSelectedFields,
          lpoColumns
        );
        break;
      }

      case "expenses": {
        DefaultColumns.getColumns(
          data,
          setHeaders,
          setSelectedFields,
          expenseColumns
        );
        break;
      }

      case "bank": {
        DefaultColumns.getColumns(
          data,
          setHeaders,
          setSelectedFields,
          bankColumns
        );
        break;
      }

      case "pos": {
        DefaultColumns.getColumns(
          data,
          setHeaders,
          setSelectedFields,
          posColumns
        );
        break;
      }

      case "overage": {
        DefaultColumns.getColumns(
          data,
          setHeaders,
          setSelectedFields,
          overageColumns
        );
        break;
      }

      case "transaction": {
        DefaultColumns.getColumns(
          data,
          setHeaders,
          setSelectedFields,
          creditColumns
        );
        break;
      }

      case "lposales": {
        DefaultColumns.getColumns(
          data,
          setHeaders,
          setSelectedFields,
          lposalesColumns
        );
        break;
      }

      case "product": {
        DefaultColumns.getColumns(
          data,
          setHeaders,
          setSelectedFields,
          productColumns
        );
        break;
      }

      case "deliveredOrder": {
        DefaultColumns.getColumns(
          data,
          setHeaders,
          setSelectedFields,
          deliveredOrderColumns
        );
        break;
      }

      case "incoming": {
        DefaultColumns.getColumns(
          data,
          setHeaders,
          setSelectedFields,
          incomingOrderColumns
        );
        break;
      }

      case "regulatory": {
        DefaultColumns.getColumns(
          data,
          setHeaders,
          setSelectedFields,
          regulatoryColumns
        );
        break;
      }

      case "supply": {
        DefaultColumns.getColumns(
          data,
          setHeaders,
          setSelectedFields,
          supplyColumns
        );
        break;
      }

      case "employee": {
        DefaultColumns.getColumns(
          data,
          setHeaders,
          setSelectedFields,
          employeeColumns
        );
        break;
      }

      case "salary": {
        DefaultColumns.getColumns(
          data,
          setHeaders,
          setSelectedFields,
          salaryColumns
        );
        break;
      }

      case "query": {
        DefaultColumns.getColumns(
          data,
          setHeaders,
          setSelectedFields,
          queryColumns
        );
        break;
      }

      case "attendance": {
        DefaultColumns.getColumns(
          data,
          setHeaders,
          setSelectedFields,
          attendanceColumns
        );
        break;
      }

      case "outstanding": {
        DefaultColumns.getColumns(
          data,
          setHeaders,
          setSelectedFields,
          outstandingColumns
        );
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
    outletID: station === null ? "None" : station?._id,
    columns: selectedFields,
    date: updateDate,
  };

  const pdfPayload = {
    type: "pdf",
    section: section,
    organizationID: resolveUserID().id,
    outletID: station === null ? "None" : station?._id,
    columns: selectedFields,
    date: updateDate,
  };

  const downloadPDF = async () => {
    if (data.length === 0)
      return swal("Warning", "There is no record in this date range", "info");
    setLoading("pdf");
    await downloadByCategory(pdfPayload);
    setLoading(null);
  };

  const printReport = async () => {
    if (data.length === 0)
      return swal("Warning", "There is no record in this date range", "info");
    setLoading("print");
    const result = await printReportByCategory(printPayload);
    dispatch(setPDFData(result));
    setLoading(null);
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
        loading={loading}
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
  getColumns: (Item, setHeaders, setSelectedFields, column) => {
    if (Item.length === 0) return;
    const fields = Item[0];
    let keys = Object.keys(fields);
    keys = keys.filter((data) => !column.includes(data));
    setHeaders(keys);
    setSelectedFields(column);
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
      const { data } = await ReportsAPI.post("/outlet", payload);
      return data;
    }
    case "lpo": {
      const { data } = await ReportsAPI.post("/lpo", payload);
      return data;
    }
    case "expenses": {
      const { data } = await ReportsAPI.post("/expenses", payload);
      return data;
    }
    case "bank": {
      const { data } = await ReportsAPI.post("/payment", payload);
      return data;
    }
    case "pos": {
      const { data } = await ReportsAPI.post("/pospayment", payload);
      return data;
    }
    case "overage": {
      const { data } = await ReportsAPI.post("/varience", payload);
      return data;
    }
    case "transaction": {
      const { data } = await ReportsAPI.post("/creditbalance", payload);
      return data;
    }
    case "lposales": {
      const { data } = await ReportsAPI.post("/lposales", payload);
      return data;
    }
    case "product": {
      const { data } = await ReportsAPI.post("/productorder", payload);
      return data;
    }
    case "deliveredOrder": {
      const { data } = await ReportsAPI.post("/deliveredorder", payload);
      return data;
    }
    case "incoming": {
      const { data } = await ReportsAPI.post("/incomingorder", payload);
      return data;
    }
    case "regulatory": {
      const { data } = await ReportsAPI.post("/regulatory", payload);
      return data;
    }
    case "supply": {
      const { data } = await ReportsAPI.post("/supply", payload);
      return data;
    }
    case "employee": {
      const { data } = await ReportsAPI.post("/employee", payload);
      return data;
    }
    case "salary": {
      const { data } = await ReportsAPI.post("/salary", payload);
      return data;
    }
    case "query": {
      const { data } = await ReportsAPI.post("/query", payload);
      return data;
    }
    case "attendance": {
      const { data } = await ReportsAPI.post("/attendance", payload);
      return data;
    }
    case "outstanding": {
      const { data } = await ReportsAPI.post("/outstanding", payload);
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
    case "expenses": {
      const { data } = await ReportsAPI.post("/expenses", payload, {
        responseType: "blob",
      });
      downloadPDF(data);
      break;
    }
    case "bank": {
      const { data } = await ReportsAPI.post("/payment", payload, {
        responseType: "blob",
      });
      downloadPDF(data);
      break;
    }
    case "pos": {
      const { data } = await ReportsAPI.post("/pospayment", payload, {
        responseType: "blob",
      });
      downloadPDF(data);
      break;
    }
    case "overage": {
      const { data } = await ReportsAPI.post("/varience", payload, {
        responseType: "blob",
      });
      downloadPDF(data);
      break;
    }
    case "transaction": {
      const { data } = await ReportsAPI.post("/creditbalance", payload, {
        responseType: "blob",
      });
      downloadPDF(data);
      break;
    }
    case "lposales": {
      const { data } = await ReportsAPI.post("/lposales", payload, {
        responseType: "blob",
      });
      downloadPDF(data);
      break;
    }
    case "product": {
      const { data } = await ReportsAPI.post("/productorder", payload, {
        responseType: "blob",
      });
      downloadPDF(data);
      break;
    }
    case "deliveredOrder": {
      const { data } = await ReportsAPI.post("/deliveredorder", payload, {
        responseType: "blob",
      });
      downloadPDF(data);
      break;
    }
    case "incoming": {
      const { data } = await ReportsAPI.post("/incomingorder", payload, {
        responseType: "blob",
      });
      downloadPDF(data);
      break;
    }
    case "regulatory": {
      const { data } = await ReportsAPI.post("/regulatory", payload, {
        responseType: "blob",
      });
      downloadPDF(data);
      break;
    }
    case "supply": {
      const { data } = await ReportsAPI.post("/supply", payload, {
        responseType: "blob",
      });
      downloadPDF(data);
      break;
    }
    case "employee": {
      const { data } = await ReportsAPI.post("/employee", payload, {
        responseType: "blob",
      });
      downloadPDF(data);
      break;
    }
    case "salary": {
      const { data } = await ReportsAPI.post("/salary", payload, {
        responseType: "blob",
      });
      downloadPDF(data);
      break;
    }
    case "query": {
      const { data } = await ReportsAPI.post("/query", payload, {
        responseType: "blob",
      });
      downloadPDF(data);
      break;
    }
    case "attendance": {
      const { data } = await ReportsAPI.post("/attendance", payload, {
        responseType: "blob",
      });
      downloadPDF(data);
      break;
    }
    case "outstanding": {
      const { data } = await ReportsAPI.post("/outstanding", payload, {
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
