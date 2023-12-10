import React, { useState } from "react";
import close from "../../../assets/close.png";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import "../../../styles/lpo.scss";
import { useEffect } from "react";
import APIs from "../../../services/connections/api";

const UpdateReturnToTank = (props) => {
  const [loading, setLoading] = useState(false);
  const [pumpName, setPumpName] = useState("");
  const [producType, setProductType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");

  const handleClose = () => props.close(false);

  useEffect(() => {
    setPumpName(props.data.pumpName);
    setProductType(props.data.productType);
    setQuantity(props.data.rtLitre);
    setRate(
      props.data.producType === "PMS"
        ? props.data.PMSPrice
        : props.data.producType === "AGO"
        ? props.data.AGOPrice
        : props.data.DPKPrice
    );
  }, [
    props.data.AGOPrice,
    props.data.DPKPrice,
    props.data.PMSPrice,
    props.data.producType,
    props.data.productType,
    props.data.pumpName,
    props.data.rtLitre,
  ]);

  const submit = () => {
    if (pumpName === "")
      return swal("Warning!", "Pump name cannot be empty", "info");
    if (producType === "")
      return swal("Warning!", "Product type cannot be empty", "info");
    if (quantity === "")
      return swal("Warning!", "Opening meter cannot be empty", "info");
    if (rate === "") return swal("Warning!", "Rate cannot be empty", "info");
    setLoading(true);

    APIs.post("/comprehensive/update-rt", {
      rtData: props.data,
      rtLitre: quantity,
      rate: rate
    }).then(({ data }) => {
      if (data.status === "none") {
        props.update((prev) => !prev);
        setLoading(false);
        handleClose();
        swal(
          "Warning!",
          "The pump this sales was returned does not exist",
          "info"
        );
      } else if (data.status === "notPossible") {
        props.update((prev) => !prev);
        setLoading(false);
        handleClose();
        swal(
          "Warning!",
          "The sales returned has exceeded the total sold by this pump",
          "info"
        );
      } else {
        props.update((prev) => !prev);
        setLoading(false);
        handleClose();
        swal("Success!", "Record updated successfully!", "success");
      }
    });
  };

  return (
    <Modal
      open={props.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div
        data-aos="zoom-out-up"
        style={{ height: "auto" }}
        className="modalContainer2">
        <div style={{ height: "auto", margin: "20px" }} className="inner">
          <div className="head">
            <div className="head-text">Edit Return to tank</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={inner}>
            <div style={{ marginTop: "15px" }} className="inputs">
              <div style={{ marginTop: "10px" }} className="inputs">
                <div className="head-text2">Pump Name</div>
                <OutlinedInput
                  disabled
                  sx={{
                    width: "100%",
                    height: "35px",
                    marginTop: "5px",
                    background: "#EEF2F1",
                    borderRadius: "0px",
                    fontSize: "12px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #777777",
                    },
                  }}
                  placeholder=""
                  type="text"
                  value={pumpName}
                  onChange={(e) => setPumpName(e.target.value)}
                />
              </div>

              <div style={{ marginTop: "15px" }} className="inputs">
                <div className="head-text2">ProductType</div>
                <OutlinedInput
                  disabled
                  sx={{
                    width: "100%",
                    height: "35px",
                    marginTop: "5px",
                    background: "#EEF2F1",
                    borderRadius: "0px",
                    fontSize: "12px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #777777",
                    },
                  }}
                  placeholder=""
                  type="text"
                  value={producType}
                  onChange={(e) => setProductType(e.target.value)}
                />
              </div>

              <div style={{ marginTop: "15px" }} className="inputs">
                <div className="head-text2">Quantity</div>
                <OutlinedInput
                  sx={{
                    width: "100%",
                    height: "35px",
                    marginTop: "5px",
                    background: "#EEF2F1",
                    borderRadius: "0px",
                    fontSize: "12px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #777777",
                    },
                  }}
                  placeholder=""
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div style={{ marginTop: "10px" }} className="head-text2">
                Rate
              </div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  borderRadius: "0px",
                  fontSize: "12px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type="text"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: "10px", height: "30px" }} className="butt">
            <Button
              disabled={loading}
              sx={{
                width: "100px",
                height: "30px",
                background: "#427BBE",
                borderRadius: "3px",
                fontSize: "10px",
                marginTop: "0px",
                "&:hover": {
                  backgroundColor: "#427BBE",
                },
              }}
              onClick={submit}
              variant="contained">
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
  height: "320px",
};

export default UpdateReturnToTank;
