import React from "react";
import close from "../../assets/close.png";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import "../../styles/lpo.scss";
import { ThreeDots } from "react-loader-spinner";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import IncomingService from "../../services/360station/IncomingService";

const IncomingList = (props) => {
  const handleClose = () => props.close({ ...props.open2, trigger: false });
  const [load, setLoad] = useState(false);
  const [data, setData] = useState([]);

  const getIncomingList = useCallback(() => {
    setLoad(true);

    const payload = {
      productOrderID: props.open.id,
    };

    IncomingService.getAllIncoming4(payload)
      .then((data) => {
        setData(data.incoming);
      })
      .then(() => {
        setLoad(false);
      });
  }, [props.open.id]);

  useEffect(() => {
    getIncomingList();
  }, [getIncomingList]);

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ height: "450px" }} className="modalContainer2">
        <div className="inner">
          <div className="head">
            <div className="head-text">Incoming Order list</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={inner}>
            {load || (
              <>
                <div style={head}>
                  <div style={{ marginLeft: "10px" }}>S/N</div>
                  <div>Station</div>
                  <div>Quantity</div>
                  <div style={{ marginRight: "10px" }}>Status</div>
                </div>

                {data.length === 0 ? (
                  <div style={men}>No incoming order</div>
                ) : (
                  data.map((data, index) => {
                    return (
                      <div key={index} style={oneRow}>
                        <div style={{ marginLeft: "10px" }}>{index + 1}</div>
                        <div>{data.destination}</div>
                        <div>{data.quantity}</div>
                        <div style={{ marginRight: "10px" }}>
                          {data.deliveryStatus}
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}

            {load && (
              <div style={dive}>
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
              </div>
            )}
          </div>

          <div style={{ marginTop: "10px", height: "30px" }} className="butt">
            <Button
              sx={{
                width: "100px",
                height: "30px",
                background: "#054834",
                borderRadius: "3px",
                fontSize: "10px",
                marginTop: "0px",
                "&:hover": {
                  backgroundColor: "#054834",
                },
              }}
              onClick={handleClose}
              variant="contained">
              {" "}
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const inner = {
  width: "100%",
  height: "360px",
  overflowY: "scroll",
};

const dive = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const head = {
  width: "98%",
  height: "35px",
  background: "#525252",
  marginTop: "10px",
  borderRadius: "5px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "11px",
  color: "#fff",
};

const oneRow = {
  width: "98%",
  height: "35px",
  background: "#EDEDED99",
  marginTop: "5px",
  borderRadius: "5px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "11px",
  color: "#000",
};

const men = {
  width: "100%",
  textAlign: "center",
  fontSize: "12px",
  marginTop: "20px",
  color: "green",
};

export default IncomingList;
