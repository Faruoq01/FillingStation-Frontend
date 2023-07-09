import React, { useRef } from "react";
import Modal from "@mui/material/Modal";
import { useEffect } from "react";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import ComprehensiveReportPrintable from "../comprehensive_report/ComprehensiveReportPrintable";

const mediaMatch = window.matchMedia("(max-width: 1000px)");

const ComprehensiveReportModal = (props) => {
  const printTableDiv = React.useRef();
  const iframe = useRef();
  const [dom, setDom] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    props.close(false);
  };

  const setTheDomHere = () => {
    setDom(printTableDiv.current);
    setLoading(false);
  };

  useEffect(() => {
    // setLoading(true);
    setTimeout(() => {
      setTheDomHere();
    }, 5000);
  }, []);

  const handlePrint = () => {
    let wspFrame = iframe.current.contentWindow;
    wspFrame.focus();
    wspFrame.print();
  };
  const Table = () => (
    <div ref={printTableDiv} style={tableContainer}>
      <ComprehensiveReportPrintable />
    </div>
  );
  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <div style={contain}>
        <div
          style={{
            overflow: "scroll",
            position: "absolute",
            zIndex: "10",
            // width: "100%",
            // height: "100%",
          }}
        >
          <Table />
        </div>
        <div style={frame}>
          <iframe
            ref={iframe}
            srcDoc={dom.outerHTML}
            title="documents"
            height="100%"
            width="100%"
          />
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => {
                handlePrint();
              }}
              style={prints}
            >
              Print
            </button>
            <button onClick={handleClose} style={closes}>
              close
            </button>
          </div>
        </div>
        <ThreeDots
          height="60"
          width="50"
          radius="9"
          color="#076146"
          ariaLabel="three-dots-loading"
          wrapperStyle={{ position: "absolute", zIndex: "30" }}
          wrapperClassName=""
          visible={loading}
        />
      </div>
    </Modal>
  );
};

const prints = {
  width: "100px",
  height: "30px",
  background: "green",
  color: "#fff",
  marginRight: "20px",
};

const closes = {
  width: "100px",
  height: "30px",
  background: "red",
  color: "#fff",
};

const frame = {
  width: mediaMatch.matches ? "96%" : "1000px",
  height: "600px",
  background: "#fff",
  position: "absolute",
  zIndex: "20",
};

const contain = {
  width: "100%",
  height: "100vh",
  display: "flex",
  overflow: "none",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
};

const tableHead = {
  width: "100%",
  height: "35px",
  backgroundColor: "#525252",
  display: "flex",
  flexDirection: "row",
  borderRadius: "4px",
};

const tableHead2 = {
  width: "100%",
  height: "50px",
  backgroundColor: "#EDEDED",
  display: "flex",
  flexDirection: "row",
  borderRadius: "4px",
  marginTop: "5px",
};

const column = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontSize: "14px",
};

const column2 = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  color: "#000",
  fontSize: "14px",
};

const place = {
  width: "100%",
  textAlign: "center",
  fontSize: "14px",
  marginTop: "20px",
  color: "green",
};
const tableContainer = {
  width: "100%",
  minWidth: "980px",
  overFlow: "scroll",
  height: "auto",
  margintop: "20px",
};
export default ComprehensiveReportModal;
