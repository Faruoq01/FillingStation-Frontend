import React, { useState } from "react";
import close from "../../assets/close.png";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import "../../styles/lpo.scss";
import Webcam from "react-webcam";
import config from "../../constants";
import APIs from "../../services/connections/api";

const ReactCamera = (props) => {
  const [loading, setLoading] = useState(false);

  const handleClose = () => props.close(false);
  const [face, setFace] = useState(true);

  const selfie = {
    facingMode: "user",
  };

  const backCam = {
    facingMode: { exact: "environment" },
  };

  const switchFace = () => {
    setFace(!face);
  };

  const getImageLink = (getScreenshot) => {
    setLoading(true);
    const imageSrc = getScreenshot();
    const url = `${config.BASE_URL}/360-station/api/uploadFromCamera`;
    APIs.post(url, { image: imageSrc })
      .then(({ data }) => {
        props.setDataUri(data.path);
      })
      .then(() => {
        setLoading(false);
        handleClose();
      });
  };

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ height: "500px" }} className="modalContainer2">
        <div style={{ height: "450px", margin: "20px" }} className="inner">
          <div className="head">
            <div className="head-text">Capture image from camera</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={inner}>
            <div style={cam}>
              <Webcam
                height={400}
                screenshotFormat="image/jpg"
                width={370}
                videoConstraints={face ? selfie : backCam}>
                {({ getScreenshot }) => (
                  <div style={cams}>
                    <Button
                      sx={{
                        width: "140px",
                        height: "30px",
                        background: "#054834",
                        borderRadius: "20px",
                        fontSize: "11px",
                        color: "#fff",
                        textTransform: "capitalize",
                        "&:hover": {
                          backgroundColor: "#054834",
                        },
                      }}
                      onClick={() => {
                        getImageLink(getScreenshot);
                      }}>
                      Capture photo
                    </Button>
                    <Button
                      onClick={switchFace}
                      sx={{
                        width: "100px",
                        height: "30px",
                        background: "#054834",
                        borderRadius: "20px",
                        fontSize: "11px",
                        color: "#fff",
                        textTransform: "capitalize",
                        "&:hover": {
                          backgroundColor: "#054834",
                        },
                      }}>
                      Flip
                    </Button>
                  </div>
                )}
              </Webcam>
            </div>
          </div>

          <div style={{ marginTop: "40px" }} className="butt">
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
  height: "300px",
};

const cam = {
  width: "100%",
  height: "300px",
};

const cams = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
};

export default ReactCamera;
