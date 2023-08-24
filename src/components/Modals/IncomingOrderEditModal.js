import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import close from "../../assets/close.png";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import "../../styles/lpo.scss";
import IncomingService from "../../services/IncomingService";
import ModalNumberInput from "../controls/ModalNumberInput";

const IncomingOrderEditModal = (props) => {
  const incomingOrder = useSelector(
    (state) => state?.incomingorder.singleIncomingOrder
  );
  const [loading, setLoading] = useState(false);
  const [productType, setProductType] = useState("available");
  const [previousBalance, setPreviousBalance] = useState("");
  const [quantityLoaded, setQuantityLoaded] = useState("");
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);

  const [depotStation, setDepotStation] = useState(
    incomingOrder.depotStation ?? ""
  );
  const [destination, setDestination] = useState(
    incomingOrder.destination ?? ""
  );
  const [product, setProduct] = useState(incomingOrder.product ?? "");
  const [dateCreated, setDateCreated] = useState(
    incomingOrder.dateCreated ?? ""
  );
  const [productOrderID, setProductOrderID] = useState(
    incomingOrder.productOrderID ?? ""
  );
  const [truckNo, setTruckNo] = useState(incomingOrder.truckNo ?? "");
  const [wayBillNo, setWayBillNo] = useState(incomingOrder.wayBillNo ?? "");
  const [transporter, setTransporter] = useState(
    incomingOrder.transporter ?? ""
  );
  const [driverName, setDriverName] = useState(incomingOrder.driverName ?? "");
  const [phoneNo, setPhoneNumber] = useState(incomingOrder.phoneNo);
  const [quantity, setQuantity] = useState("");

  const handleClose = () => props.close(false);

  const submit = async () => {
    // save updated data
    if (transporter === "")
      return swal("Warning!", "Transporter cannot be empty", "info");
    if (depotStation === "")
      return swal("Warning!", "Depot station field cannot be empty", "info");
    if (destination === "")
      return swal("Warning!", "Destination field cannot be empty", "info");
    if (product === "")
      return swal("Warning!", "Product field cannot be empty", "info");
    if (dateCreated === "")
      return swal("Warning!", "Date created field cannot be empty", "info");
    if (productOrderID === "" && productType === "available")
      return swal("Warning!", "Product order ID field cannot be empty", "info");
    if (truckNo === "")
      return swal("Warning!", "Truck No cannot be empty", "info");
    if (driverName === "")
      return swal("Warning!", "Driver name cannot be empty", "info");
    if (phoneNo === "")
      return swal("Warning!", "Phone no cannot be empty", "info");
    if (quantity === "")
      return swal("Warning!", "Quantity cannot be empty", "info");

    setLoading(true);

    let previousQuantityInLitres = incomingOrder.quantity;
    let currentQuantityInLitres = quantity;
    let quantityMarginInLitres =
      currentQuantityInLitres - previousQuantityInLitres;

    const payload = {
      id: incomingOrder._id,
      depotStation: depotStation,
      destination: destination,
      product: product,
      quantity: currentQuantityInLitres,
      dateCreated: dateCreated,
      productOrderID: productOrderID,
      truckNo: truckNo,
      wayBillNo: wayBillNo,
      driverName: driverName,
      phoneNo: phoneNo,
      transporter: transporter,
      organizationID: oneStationData.organisation,
      quantityMarginInLitres: quantityMarginInLitres,
    };

    IncomingService.updateIncoming(payload)
      .then(() => {
        props.refresh();
        handleClose();
      })
      .then(() => {
        swal("Success", "Incoming order updated successfully!", "success");
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
            <div className="head-text">Edit Incoming Order</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div className="middleDiv" style={inner}>
            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">Loading Depot</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                value={depotStation}
                type="text"
                onChange={(e) => setDepotStation(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Transporter</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  fontSize: "12px",
                  background: "#EEF2F1",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                value={transporter}
                type="text"
                onChange={(e) => setTransporter(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Destination</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <ModalNumberInput value={quantity} setValue={setQuantity} />

            <div className="inputs">
              <div className="head-text2">Date created</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type="date"
                value={dateCreated}
                onChange={(e) => setDateCreated(e.target.value)}
              />
            </div>

            {productType === "available" && (
              <div className="inputs">
                <div className="head-text2">Product Order ID</div>
                <OutlinedInput
                  sx={{
                    width: "100%",
                    height: "35px",
                    marginTop: "5px",
                    background: "#EEF2F1",
                    fontSize: "12px",
                    borderRadius: "0px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #777777",
                    },
                  }}
                  placeholder=""
                  type="text"
                  disabled
                  value={productOrderID}
                  onChange={(e) => setProductOrderID(e.target.value)}
                />
              </div>
            )}

            <div className="inputs">
              <div className="head-text2">Truck No</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type="text"
                value={truckNo}
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
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type="text"
                value={wayBillNo}
                onChange={(e) => setWayBillNo(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Driver's Name</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
              />
            </div>

            <div className="inputs">
              <div className="head-text2">Phone Number</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type="text"
                value={phoneNo}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: "10px", height: "30px" }} className="butt">
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

const searchBar = {
  width: "91%",
  height: "30px",
  margin: "10px",
  outline: "none",
  paddingLeft: "2%",
  border: "none",
  boxShadow: "0px 0px 2px 0.5px #888888",
};

const drop = {
  width: "98%",
  height: "35px",
  marginTop: "5px",
  background: "#EEF2F1",
  border: "1px solid #777777",
  fontSize: "12px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};

const pop = {
  width: "98%",
  height: "200px",
  background: "#e2e2e2",
  zIndex: "20",
  marginTop: "5px",
  overflowY: "scroll",
};

const menus = {
  width: "100%",
  height: "35px",
  border: "1px solid #fff",
  borderTop: "none",
  borderLeft: "none",
  borderRight: "none",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
};

const inner = {
  width: "100%",
  height: "500px",
  overflowY: "scroll",
};

const menu = {
  fontSize: "12px",
};

const selectStyle2 = {
  width: "100%",
  height: "35px",
  background: "#EEF2F1",
  color: "#000",
  fontSize: "12px",
  outline: "none",
  borderRadius: "0px",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

export default IncomingOrderEditModal;
