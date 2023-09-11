import { useSelector } from "react-redux";

const { Modal, Button } = require("@mui/material");

const PrintReportPage = ({ open, close }) => {
  const pdfData = useSelector((state) => state.outlet.pdfData);
  const handleClose = () => close(false);
  return (
    <Modal open={open} onClose={handleClose}>
      <div style={style}>
        <div style={closeButton}>
          <Button onClick={handleClose} sx={button}>
            Close
          </Button>
        </div>
        <div style={page}>
          {pdfData === "" ? (
            <div>No content to load</div>
          ) : (
            <iframe
              src={pdfData}
              title="PDF Viewer"
              width="100%"
              height="100%"></iframe>
          )}
        </div>
      </div>
    </Modal>
  );
};

const style = {
  width: "100%",
  height: "100%",
  background: "#333333",
};

const closeButton = {
  width: "100%",
  height: "40px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
};

const button = {
  background: "tomato",
  textTransform: "capitalize",
  fontSize: "12px",
  color: "#fff",
  marginRight: "10px",
  width: "80px",
  height: "30px",
  "&:hover": {
    background: "tomato",
  },
};

const page = {
  width: "100%",
  height: "94%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Poppins",
  fontSize: "14px",
  background: "#f7f7f7",
};

export default PrintReportPage;
