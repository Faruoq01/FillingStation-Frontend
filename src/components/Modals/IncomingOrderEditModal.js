import React, { useState } from "react";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import "../../styles/lpo.scss";
import IncomingService from "../../services/IncomingService";
import ModalBackground from "../controls/Modal/ModalBackground";
import ModalInputField from "../controls/Modal/ModalInputField";

const IncomingOrderEditModal = ({ open, close, skip, refresh }) => {
  const incomingOrder = useSelector(
    (state) => state?.incomingorder.singleIncomingOrder
  );
  const [loading, setLoading] = useState(false);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);

  const [depotStation, setDepotStation] = useState(
    incomingOrder.depotStation ?? ""
  );
  const [destination, setDestination] = useState(
    incomingOrder.destination ?? ""
  );
  const [product] = useState(incomingOrder.product ?? "");
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

  const handleClose = () => close(false);

  const submit = async () => {
    // save updated data
    checkIfAllInputValidationPassed();
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
        refresh(oneStationData._id, "None", skip);
        handleClose();
      })
      .then(() => {
        swal("Success", "Incoming order updated successfully!", "success");
      });
  };

  const checkIfAllInputValidationPassed = () => {
    if (oneStationData === null)
      return swal(
        "Warning!",
        "Please select a station before you proceed",
        "info"
      );
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
    if (productOrderID === "")
      return swal("Warning!", "Product order ID field cannot be empty", "info");
    if (truckNo === "")
      return swal("Warning!", "Truck No cannot be empty", "info");
    if (driverName === "")
      return swal("Warning!", "Driver name cannot be empty", "info");
    if (phoneNo === "")
      return swal("Warning!", "Phone no cannot be empty", "info");
    if (quantity === "")
      return swal("Warning!", "Quantity cannot be empty", "info");
  };

  return (
    <ModalBackground
      openModal={open}
      closeModal={close}
      submit={submit}
      loading={loading}
      label={"Edit Incoming Order"}>
      <ModalInputField
        value={depotStation}
        setValue={setDepotStation}
        type={"text"}
        label={"Loading Depot"}
      />

      <ModalInputField
        value={transporter}
        setValue={setTransporter}
        type={"text"}
        label={"Transporter"}
      />

      <ModalInputField
        value={destination}
        setValue={setDestination}
        type={"text"}
        label={"Destination"}
      />

      <ModalInputField
        value={quantity}
        setValue={setQuantity}
        type={"number"}
        label={"Quantity"}
      />

      <ModalInputField
        value={dateCreated}
        setValue={setDateCreated}
        type={"date"}
        label={"Date created"}
      />

      <ModalInputField
        value={productOrderID}
        setValue={setProductOrderID}
        type={"text"}
        label={"Product Order ID"}
        disabled={true}
      />

      <ModalInputField
        value={truckNo}
        setValue={setTruckNo}
        type={"text"}
        label={"Truck No"}
      />

      <ModalInputField
        value={wayBillNo}
        setValue={setWayBillNo}
        type={"text"}
        label={"Waybill No"}
      />

      <ModalInputField
        value={driverName}
        setValue={setDriverName}
        type={"text"}
        label={"Driver's Name"}
      />

      <ModalInputField
        value={phoneNo}
        setValue={setPhoneNumber}
        type={"text"}
        label={"Phone Number"}
      />
    </ModalBackground>
  );
};

export default IncomingOrderEditModal;
