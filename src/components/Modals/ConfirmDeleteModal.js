import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ThreeDots } from "react-loader-spinner";
import { Button } from "@mui/material";

const ConfirmDeleteModal = (props) => {
  const handleClose = () => props.close(false);
  const mobile = useMediaQuery("(max-width:900px)");

  return (
    <Modal
      open={props?.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <div style={styles(mobile).container}>
        <span style={styles(mobile).title}>Wish to Continue?</span>
        <div style={styles(mobile).buttonWrap}>
          <Button
            disabled={props.deleteStatus}
            onClick={props.handleDelete}
            style={{ ...styles(mobile).button, backgroundColor: "red" }}
            variant="contained"
          >
            {props.deleteStatus ? (
              <>
                <div style={styles().load}>
                  <ThreeDots
                    height="60"
                    width="50"
                    radius="9"
                    color="#ffffff"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                </div>
              </>
            ) : (
              <span style={{ marginLeft: 3, color: "white" }}>Continue</span>
            )}
          </Button>

          {/* ============ */}
          <Button
            disabled={props.deleteStatus}
            onClick={handleClose}
            style={{ ...styles(mobile).button, backgroundColor: "#06805B" }}
            variant="contained"
          >
            <span style={{ marginLeft: 3, color: "white" }}>Cancel</span>
          </Button>

          {/* ========== */}
        </div>
      </div>
    </Modal>
  );
};

const inner = {
  width: "100%",
  height: "500px",
  overflowY: "scroll",
};

const styles = (_mobile) => ({
  container: {
    height: _mobile ? 100 : 150,
    width: _mobile ? "80%" : "30%",
    backgroundColor: "white",

    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
  },
  buttonWrap: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: _mobile ? 10 : 20,
  },
  title: {
    textAlign: "center",
    margin: _mobile ? 10 : 20,
    fontFamily: "poppin",
    fontWeight: 600,
    fontSize: _mobile ? 18 : 21,
  },
  button: {
    width: "45%",
    height: 40,
    cursor: "pointer",
    border: "none",
    fontFamily: "poppin",
    fontSize: 18,
    color: "#ffffff",
    borderRadius: "3px",
  },
  load: {
    width: "100%",
    height: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ConfirmDeleteModal;
