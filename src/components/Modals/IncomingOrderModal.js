import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import close from "../../assets/close.png";
import swal from "sweetalert";
import "../../styles/lpo.scss";
import IncomingService from "../../services/360station/IncomingService";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ProductService from "../../services/360station/productService";
import { setProductOrder } from "../../storage/productOrder";
import { Radio } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ModalBackground from "../controls/Modal/ModalBackground";
import ModalInputField from "../controls/Modal/ModalInputField";

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
  const [stationSelect, setStationSelect] = useState(false);
  const [selected, setSelected] = useState([]);
  const [loadedQuantity, setLoadedQuantity] = useState("0");
  const [searchKey, setSearchKey] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerDestination, setCustomerDestination] = useState("");
  const [quantity, setQuantity] = useState("");

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
    refresh(oneStationData._id, "None", skip);
    handleClose();
  };

  const menuSelection = (e, item) => {
    if (e === 2) setProduct("PMS");
    if (e === 3) setProduct("AGO");
    if (e === 4) setProduct("DPK");
    setVal(e);

    const payload = {
      productType: item,
      outletID: oneStationData._id,
      organisationID: oneStationData.organisation,
    };

    ProductService.getAllProductOrder2(payload).then((data) => {
      dispatch(setProductOrder(data.product.product));
    });
  };

  const changeMenu = (index, item) => {
    setDefault(index);
    setDepotStation(item.depot);
    setPreviousBalance(item.currentBalance);
    setQuantityOrdered(item.quantity);
    setProductOrderID(item._id);
    setQuantityLoaded(item.quantityLoaded);
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

  const PRODUCT_ENUM = ["PMS", "AGO", "DPK"];

  return (
    <ModalBackground
      openModal={open}
      closeModal={closeup}
      submit={submit}
      loading={loading}
      label={"Create Incoming Order"}>
      <RadioButtonComponent
        productType={productType}
        setProductType={setProductType}
        labelOne={"Available Order"}
        labelTwo={"New Order"}
        title={"Choose Order Type"}
        mt={"20px"}
      />
      <div style={{ marginTop: "20px" }} className="inputs">
        <div className="head-text2">Product Type</div>
        <Select value={val} sx={productSelect}>
          <MenuItem style={menu} value={1}>
            Select Product
          </MenuItem>
          {PRODUCT_ENUM.map((item, index) => {
            return (
              <MenuItem
                onClick={() => {
                  menuSelection(index + 2, item);
                }}
                style={menu}
                value={index + 2}>
                {item}
              </MenuItem>
            );
          })}
        </Select>
      </div>

      {productType === "available" && (
        <div style={{ marginTop: "20px" }} className="inputs">
          <div className="head-text2">Product Order </div>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={defaultState}
            sx={selectStyle2}>
            <MenuItem style={menu} value={0}>
              Select Product Order
            </MenuItem>
            {productOrder.map((item, index) => {
              return (
                <MenuItem
                  key={index}
                  style={menu}
                  onClick={() => {
                    changeMenu(index + 1, item);
                  }}
                  value={index + 1}>
                  {item.depot}
                </MenuItem>
              );
            })}
          </Select>
        </div>
      )}

      <ModalInputField
        value={depotStation}
        setValue={setDepotStation}
        type={"text"}
        label={"Supplier"}
      />

      <ModalInputField
        value={transporter}
        setValue={setTransporter}
        type={"text"}
        label={"Transporter"}
      />

      {productType === "available" && (
        <ModalInputField
          value={quantityOrdered}
          type={"text"}
          label={"Quantity Orderd (ltr)"}
          disabled={true}
        />
      )}

      {productType === "available" && (
        <ModalInputField
          value={previousBalance}
          type={"text"}
          label={"Quantity Orderd (ltr)"}
          disabled={true}
        />
      )}

      <RadioButtonComponent
        productType={inhouse}
        setProductType={setInhouse}
        labelOne={"Inhouse Order"}
        labelTwo={"Others"}
        mt={"30px"}
      />

      {inhouse === "available" && (
        <div style={{ marginTop: "10px" }} className="inputs">
          <div className="head-text2">Select discharge stations</div>
          <div onClick={() => setStationSelect(!stationSelect)} style={drop}>
            <span style={{ marginLeft: "10px" }}>
              Select ({selected.length})
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Loaded
              Quantity ( &nbsp;
              <span style={{ color: "green", fontWeight: "600" }}>
                {loadedQuantity}
              </span>
              &nbsp; )
            </span>
            <KeyboardArrowDownIcon sx={{ marginRight: "10px" }} />
          </div>
          {stationSelect && (
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
                        {data.outletName}, {data.city}
                      </span>
                    </div>
                    <input
                      placeholder="quantity"
                      onChange={(e) => updateQantity(e, data)}
                      style={{
                        width: "30%",
                        outline: "none",
                        fontSize: "11px",
                      }}
                      type={"text"}
                    />
                  </div>
                );
              })}
            </div>
          )}
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

      <ModalInputField
        value={dateCreated}
        setValue={setDateCreated}
        type={"date"}
        label={"Date created"}
      />

      {productType === "available" && (
        <ModalInputField
          value={productOrderID}
          setValue={setProductOrderID}
          type={"text"}
          label={"Product Order ID"}
          disabled={true}
        />
      )}

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
