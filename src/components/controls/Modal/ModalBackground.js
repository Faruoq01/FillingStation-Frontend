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
  report = false,
  pdf,
  print,
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
          <div style={{ marginTop: "10px" }} className="head">
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
            style={{
              ...footer,
              justifyContent: report ? "flex-start" : "space-between",
            }}
            className="butt">
            <Button
              sx={button}
              onClick={report ? pdf : submit}
              variant="contained">
              {report ? (
                loading === "pdf" ? (
                  <ThreeDots
                    height="60"
                    width="50"
                    radius="9"
                    color="#fff"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                ) : (
                  "Download PDF"
                )
              ) : (
                "Save"
              )}
            </Button>
            {report && (
              <Button sx={button2} onClick={print} variant="contained">
                {report ? (
                  loading === "print" ? (
                    <ThreeDots
                      height="60"
                      width="50"
                      radius="9"
                      color="#fff"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClassName=""
                      visible={true}
                    />
                  ) : (
                    "Print Report"
                  )
                ) : (
                  "Save"
                )}
              </Button>
            )}

            {loading && !report ? (
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
  minWidth: "100px",
  height: "30px",
  background: "#0040a0",
  borderRadius: "3px",
  fontSize: "10px",
  marginTop: "0px",
  "&:hover": {
    backgroundColor: "#0040a0",
  },
};

const button2 = {
  minWidth: "100px",
  height: "30px",
  background: "#001f3f",
  borderRadius: "3px",
  fontSize: "10px",
  marginTop: "0px",
  marginLeft: "10px",
  "&:hover": {
    backgroundColor: "#001f3f",
  },
};

const footer = {
  marginTop: "10px",
  height: "30px",
  marginBottom: "10px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
};

export default ModalBackground;
