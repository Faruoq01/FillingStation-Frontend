import { Button, Modal } from "@mui/material";
import { ThreeDots } from "react-loader-spinner";
import close from "../../../assets/close.png";

const ModalBackground = ({
  children,
  openModal,
  closeModal,
  submit,
  loading,
  label,
  ht = "500px",
}) => {
  const handleClose = () => closeModal(false);

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ height: "auto" }} className="modalContainer2">
        <div className="inner">
          <div className="head">
            <div className="head-text">{label}</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={{ ...inner, height: ht }}>
            {children}
          </div>

          <div
            style={{ marginTop: "10px", height: "30px", marginBottom: "10px" }}
            className="butt">
            <Button sx={button} onClick={submit} variant="contained">
              {" "}
              Save
            </Button>

            {loading ? (
              <ThreeDots
                height="60"
                width="50"
                radius="9"
                color="#076146"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
              />
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const inner = {
  width: "100%",
  overflowY: "scroll",
};

const button = {
  width: "100px",
  height: "30px",
  background: "#427BBE",
  borderRadius: "3px",
  fontSize: "10px",
  marginTop: "0px",
  "&:hover": {
    backgroundColor: "#427BBE",
  },
};

export default ModalBackground;
