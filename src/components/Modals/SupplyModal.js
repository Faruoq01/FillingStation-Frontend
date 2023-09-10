import React, { useState } from "react";
import { useSelector } from "react-redux";
import close from "../../assets/close.png";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import "../../styles/lpo.scss";
import Radio from "@mui/material/Radio";
import "../../styles/lpo.scss";
import SupplyService from "../../services/360station/supplyService";

const SupplyModal = (props) => {
  const [loading, setLoading] = useState(false);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [productType, setProductType] = useState("PMS");

  const [transportationName, setTransportationName] = useState("");
  const [truckNo, setTruckNo] = useState("");
  const [wayBillNo, setWayBillNo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shortage, setShortage] = useState("");
  const [date, setDate] = useState("");

  const handleClose = () => props.close(false);

  const submit = () => {
    if (oneStationData === null)
      return swal("Warning!", "Please create a station", "info");
    if (transportationName === "")
      return swal(
        "Warning!",
        "Transportation name field cannot be empty",
        "info"
      );
    if (truckNo === "")
      return swal("Warning!", "Truck no field cannot be empty", "info");
    if (wayBillNo === "")
      return swal("Warning!", "Waybill no field cannot be empty", "info");
    if (quantity === "")
      return swal("Warning!", "Quantity field cannot be empty", "info");
    if (shortage === "")
      return swal("Warning!", "Shortage field cannot be empty", "info");
    if (date === "")
      return swal("Warning!", "Date field cannot be empty", "info");

    setLoading(true);

    const payload = {
      transportationName: transportationName,
      wayBillNo: wayBillNo,
      truckNo: truckNo,
      quantity: quantity,
      productType: productType,
      shortage: shortage,
      date: date,
      outletID: oneStationData?._id,
      organizationID: oneStationData?.organisation,
    };

    SupplyService.createSupply(payload)
      .then((data) => {
        swal("Success", "Product order created successfully!", "success");
      })
      .then(() => {
        setLoading(false);
        props.refresh();
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
      <div className="modalContainer2">
        <div className="inner">
          <div className="head">
            <div className="head-text">Register Supply</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={inner}>
            <div className="inputs">
              <div className="head-text2">Transportation Name</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                type="text"
                onChange={(e) => setTransportationName(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Truck No</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                onChange={(e) => setTruckNo(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Waybill No</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                onChange={(e) => setWayBillNo(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Choose product type</div>
              <div className="radio">
                <div className="rad-item">
                  <Radio
                    onClick={() => {
                      setProductType("PMS");
                    }}
                    checked={productType === "PMS" ? true : false}
                  />
                  <div className="head-text2" style={{ marginRight: "5px" }}>
                    PMS
                  </div>
                </div>
                <div className="rad-item">
                  <Radio
                    onClick={() => {
                      setProductType("AGO");
                    }}
                    checked={productType === "AGO" ? true : false}
                  />
                  <div className="head-text2" style={{ marginRight: "5px" }}>
                    AGO
                  </div>
                </div>
                <div className="rad-item">
                  <Radio
                    onClick={() => {
                      setProductType("DPK");
                    }}
                    checked={productType === "DPK" ? true : false}
                  />
                  <div className="head-text2" style={{ marginRight: "5px" }}>
                    DPK
                  </div>
                </div>
              </div>
            </div>

            <div className="inputs">
              <div className="head-text2">Quantity (litre)</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                type="number"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Shortage/Offrage</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                type="number"
                onChange={(e) => setShortage(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Date</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  border: "1px solid #777777",
                  fontSize: "12px",
                }}
                placeholder=""
                type="date"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: "10px" }} className="butt">
            <Button
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
  height: "500px",
  overflowY: "scroll",
};

export default SupplyModal;
