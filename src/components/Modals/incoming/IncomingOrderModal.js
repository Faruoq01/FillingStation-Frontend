import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import "../../../styles/lpo.scss";
import IncomingService from "../../../services/360station/IncomingService";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ProductService from "../../../services/360station/productService";
import { setProductOrder } from "../../../storage/productOrder";
import { Radio } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ModalBackground from "../../controls/Modal/ModalBackground";
import ModalInputField from "../../controls/Modal/ModalInputField";

const baseForm = {
  depotStation: '',
  destination: '',
  product: '',
  quantity: '',
  dateCreated: '',
  productOrderID: '',
  truckNo: '',
  wayBillNo: '',
  driverName: '',
  phoneNo: '',
  transporter: '',
  customerName: '',
  customerAddress: '',
  customerPhone: '',
  customerDestination: '',
  status: '',
  deliveryStatus: '',
  shortage: '',
  overage: '',
  outletName: '',
  outletID: '',
  organizationID: '',
  createdAt: '',
  updatedAt: '',
}

const IncomingOrderModal = ({ open, closeup, skip, refresh }) => {
  const [loading, setLoading] = useState(false);
  const [defaultState, setDefault] = useState(0);
  const productOrder = useSelector((state) => state.productorder.productorder);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const dispatch = useDispatch();
  const [productType, setProductType] = useState("available");
  const [inhouse, setInhouse] = useState("available");
  const [quantityOrdered, setQuantityOrdered] = useState("");
  const [previousBalance, setPreviousBalance] = useState("");
  const [quantityLoaded, setQuantityLoaded] = useState("");
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);

  const [depotStation, setDepotStation] = useState("");
  const [product, setProduct] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [productOrderID, setProductOrderID] = useState("");
  const [truckNo, setTruckNo] = useState("");
  const [wayBillNo, setWayBillNo] = useState("");
  const [transporter, setTransporter] = useState("");
  const [driverName, setDriverName] = useState("");
  const [phoneNo, setPhoneNumber] = useState("");
  const [val, setVal] = useState(1);
  const [selected, setSelected] = useState([]);
  const [loadedQuantity, setLoadedQuantity] = useState("0");
  const [searchKey, setSearchKey] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerDestination, setCustomerDestination] = useState("");
  const [quantity, setQuantity] = useState("");
  const updateDate = useSelector((state) => state.dashboard.dateRange);
  const [form, setForm] = useState(baseForm);

  const handleClose = () => closeup(false);

  function removeSpecialCharacters(str) {
    return str.replace(/[^0-9.]/g, "");
  }

  const submit = async () => {
    if (transporter === "")
      return swal("Warning!", "Transporter cannot be empty", "info");
    if (depotStation === "")
      return swal("Warning!", "Depot station field cannot be empty", "info");
    if (product === "")
      return swal("Warning!", "Product field cannot be empty", "info");
    if (dateCreated === "")
      return swal("Warning!", "Date created field cannot be empty", "info");
    if (productOrderID === "" && productType === "available")
      return swal("Warning!", "Product order ID field cannot be empty", "info");
    if (customerName === "" && inhouse !== "available")
      return swal("Warning!", "Please provide customer name", "info");
    if (customerAddress === "" && inhouse !== "available")
      return swal("Warning!", "Please provide customer address", "info");
    if (customerPhone === "" && inhouse !== "available")
      return swal("Warning!", "Please provide customer phone", "info");
    if (customerDestination === "" && inhouse !== "available")
      return swal("Warning!", "Please provide customer destination", "info");
    if (truckNo === "")
      return swal("Warning!", "Truck No cannot be empty", "info");
    if (driverName === "")
      return swal("Warning!", "Driver name cannot be empty", "info");
    if (phoneNo === "")
      return swal("Warning!", "Phone no cannot be empty", "info");

    const totalLoadedQuantity = selected.reduce((accum, current) => {
      return Number(accum) + Number(current.incomingQuantity);
    }, 0);

    if (
      Number(totalLoadedQuantity) > Number(previousBalance) &&
      productType === "available"
    )
      return swal("Warning!", "Total quantity exceeds current balance", "info");

    setLoading(true);

    const selectedStations = [...selected];
    let previous = previousBalance;
    let loaded = quantityLoaded;

    if (inhouse !== "available") {
      if (quantity <= 0)
        return swal(
          "Warning!",
          `${oneStationData.alias} was assigned 0 litres, please add a quantity`,
          "info"
        );
      const currentBalanceUpdate = Number(previous) - Number(quantity);
      const loadedUpdate = Number(loaded) + Number(quantity);

      const payload = {
        depotStation: depotStation,
        destination: oneStationData.alias,
        product: product,
        quantity: quantity,
        updateCurrentBalance: currentBalanceUpdate,
        updateQantityLoaded: loadedUpdate,
        customerName: inhouse !== "available" ? customerName : "null",
        customerAddress: inhouse !== "available" ? customerAddress : "null",
        customerPhone: inhouse !== "available" ? customerPhone : "null",
        customerDestination:
          inhouse !== "available" ? customerDestination : "null",
        dateCreated: dateCreated,
        productOrderID: productOrderID,
        truckNo: truckNo,
        transporter: transporter,
        wayBillNo: wayBillNo,
        driverName: driverName,
        phoneNo: phoneNo,
        outletName: oneStationData.outletName,
        outletID: oneStationData._id,
        organizationID: oneStationData.organisation,
      };

      const res = await IncomingService.createIncoming(payload);
      if (res) previous = currentBalanceUpdate;
      loaded = loadedUpdate;
    } else {
      for (let station of selectedStations) {
        if (station.incomingQuantity <= 0)
          return swal(
            "Warning!",
            `${station.alias} was assigned 0 litres, please add a quantity`,
            "info"
          );
        const currentBalanceUpdate =
          Number(previous) - Number(station.incomingQuantity);
        const loadedUpdate = Number(loaded) + Number(station.incomingQuantity);

        const payload = {
          depotStation: depotStation,
          destination: station.alias,
          product: product,
          quantity: station.incomingQuantity,
          updateCurrentBalance: currentBalanceUpdate,
          updateQantityLoaded: loadedUpdate,
          customerName: inhouse !== "available" ? customerName : "null",
          customerAddress: inhouse !== "available" ? customerAddress : "null",
          customerPhone: inhouse !== "available" ? customerPhone : "null",
          customerDestination:
            inhouse !== "available" ? customerDestination : "null",
          dateCreated: dateCreated,
          productOrderID: productOrderID,
          truckNo: truckNo,
          transporter: transporter,
          wayBillNo: wayBillNo,
          driverName: driverName,
          phoneNo: phoneNo,
          outletName: station.outletName,
          outletID: station._id,
          organizationID: station.organisation,
        };

        const res = await IncomingService.createIncoming(payload);
        if (res) previous = currentBalanceUpdate;
        loaded = loadedUpdate;
      }
    }

    setLoading(false);
    setDepotStation("");
    setTransporter("");
    setTruckNo("");
    setWayBillNo("");
    setDriverName("");
    setPhoneNumber("");
    setLoadedQuantity("0");
    setProductOrderID("");
    setCustomerName("");
    setCustomerAddress("");
    setCustomerPhone("");
    setCustomerDestination("");
    setDefault(0);
    setVal(1);
    swal("Success", "Incoming order created successfully!", "success");
    refresh(oneStationData._id, updateDate, skip);
    handleClose();
  };

  const updateSelection = (e, data) => {
    const dataClone = { ...data, incomingQuantity: 0 };

    if (e.target.checked) {
      const cloneSelected = [...selected];
      const findID = cloneSelected.findIndex(
        (item) => dataClone._id === item._id
      );
      if (findID === -1) {
        setSelected((prev) => [...prev, dataClone]);
      }
    } else {
      const cloneSelected = [...selected];
      const findID = cloneSelected.findIndex(
        (item) => dataClone._id === item._id
      );
      cloneSelected.splice(findID, 1);
      setSelected(cloneSelected);
    }
  };

  const updateQantity = (e, data) => {
    const cloneSelected = [...selected];
    const findID = cloneSelected.findIndex((item) => item._id === data._id);
    if (findID === -1) {
      swal("Warning!", "Please select a field first to add quantity!", "info");
    } else {
      cloneSelected[findID] = {
        ...cloneSelected[findID],
        incomingQuantity: removeSpecialCharacters(e.target.value),
      };
      setSelected(cloneSelected);

      const totalLoadedQuantity = cloneSelected.reduce((accum, current) => {
        return Number(accum) + Number(current.incomingQuantity);
      }, 0);

      setLoadedQuantity(totalLoadedQuantity);
    }
  };

  const searchStationList = (data) => {
    setSearchKey(data);
  };

  const getStations = (data) => {
    const stationsCopy = [...data];

    if (searchKey === "") {
      return stationsCopy;
    } else {
      const search = stationsCopy.filter(
        (data) =>
          !data.outletName.toUpperCase().indexOf(searchKey.toUpperCase()) ||
          !data.alias.toUpperCase().indexOf(searchKey.toUpperCase()) ||
          !data.city.toUpperCase().indexOf(searchKey.toUpperCase())
      );
      return search;
    }
  };

  const RadioButtonComponent = ({
    productType,
    setProductType,
    labelOne,
    labelTwo,
    title,
    mt,
  }) => {
    return (
      <div style={{ marginTop: mt }} className="inputs">
        <div className="head-text2">{title}</div>
        <div className="radio">
          <div className="rad-item">
            <Radio
              onClick={() => {
                setProductType("available");
              }}
              checked={productType === "available" ? true : false}
            />
            <div className="head-text2" style={{ marginRight: "5px" }}>
              {labelOne}
            </div>
          </div>

          <div className="rad-item">
            <Radio
              onClick={() => {
                setProductType("new");
              }}
              checked={productType === "new" ? true : false}
            />
            <div className="head-text2" style={{ marginRight: "5px" }}>
              {labelTwo}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ModalBackground
      openModal={open}
      closeModal={closeup}
      submit={submit}
      loading={loading}
      label={"Allocate Incoming Order"}>

      <RadioButtonComponent
        productType={inhouse}
        setProductType={setInhouse}
        labelOne={"Inhouse Order"}
        labelTwo={"Others"}
        mt={"30px"}
      />

      <ModalInputField
        value={form.dateCreated}
        setValue={setDateCreated}
        type={"date"}
        label={"Date allocated"}
      />

      {inhouse === 'available' &&
        <ModalInputField
          value={form.quantity}
          setValue={setDateCreated}
          disabled={true}
          type={"text"}
          label={"Loaded Quantity"}
        />
      }

      {inhouse === "available" && (
        <div style={{ marginTop: "20px" }} className="inputs">
          <div className="head-text2">Select discharge stations</div>
          <div style={pop}>
            <input
              onChange={(e) => {
                searchStationList(e.target.value);
              }}
              style={searchBar}
              type={"text"}
              placeholder="Search"
            />
            {getStations(allOutlets).map((data, index) => {
              return (
                <div key={index} style={menus}>
                  <div style={{ width: "70%" }}>
                    <input
                      onChange={(e) => {
                        updateSelection(e, data);
                      }}
                      style={{ marginLeft: "10px" }}
                      type={"checkbox"}
                    />
                    <span style={{ marginLeft: "10px", fontSize: "11px" }}>
                      {data.outletName}
                    </span>
                  </div>
                  <input
                    placeholder="quantity"
                    onChange={(e) => updateQantity(e, data)}
                    style={{
                      width: "30%",
                      outline: "none",
                      fontSize: "11px",
                      marginRight: '10px'
                    }}
                    type={"text"}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {inhouse !== "available" && (
        <React.Fragment>
          <ModalInputField
            value={quantity}
            setValue={setQuantity}
            type={"text"}
            label={"Loaded quantity"}
          />
          <ModalInputField
            value={customerName}
            setValue={setCustomerName}
            type={"text"}
            label={"Customer Name"}
          />
          <ModalInputField
            value={customerAddress}
            setValue={setCustomerAddress}
            type={"text"}
            label={"Customer Address"}
          />
          <ModalInputField
            value={customerPhone}
            setValue={setCustomerPhone}
            type={"text"}
            label={"Customer Phone"}
          />
          <ModalInputField
            value={customerDestination}
            setValue={setCustomerDestination}
            type={"text"}
            label={"Customer Destination"}
          />
        </React.Fragment>
      )}
    </ModalBackground>
  );
};

const productSelect = {
  width: "100%",
  height: "35px",
  marginTop: "5px",
  background: "#EEF2F1",
  fontSize: "12px",
  borderRadius: "0px",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
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
  height: "auto",
  background: "#e2e2e2",
  zIndex: "20",
  marginTop: "5px",
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
  marginTop: "5px",
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #777777",
  },
};

export default IncomingOrderModal;
