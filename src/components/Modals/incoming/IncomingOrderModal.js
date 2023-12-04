import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import "../../../styles/lpo.scss";
import IncomingService from "../../../services/360station/IncomingService";
import { Radio } from "@mui/material";
import ModalBackground from "../../controls/Modal/ModalBackground";
import ModalInputField from "../../controls/Modal/ModalInputField";
import moment from "moment";

const baseForm = {
  depotStation: '',
  destination: '',
  product: '',
  quantity: 0,
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
  deliveryStatus: 'Not delivered',
  outletName: '',
  outletID: '',
  organizationID: '',
  createdAt: '',
  updatedAt: '',
}

const IncomingOrderModal = ({ open, closeup, skip, refresh }) => {
  const [loading, setLoading] = useState(false);
  const allOutlets = useSelector((state) => state.outlet.allOutlets);
  const [inhouse, setInhouse] = useState("available");
  const [loadedQuantity, setLoadedQuantity] = useState(0);
  const [searchKey, setSearchKey] = useState("");
  const updateDate = useSelector((state) => state.dashboard.dateRange);
  const today = moment().format('YYYY-MM-DD').split(" ")[0];
  const [selectedDate, setSelectedDate] = useState('');
  const [form, setForm] = useState(baseForm);
  const [orderList, setOrderList] = useState([]);
  const singleUnallocated = useSelector(state => state.incomingorder.singleUnallocated);

  function inhouseOrderSum(order) {
    const totalQuantity = order.reduce((accum, current) => {
      return accum + current.quantity;
    }, 0);

    const overage = totalQuantity - singleUnallocated.quantity;
    const shortage = singleUnallocated.quantity - totalQuantity;

    return {totalQuantity, shortage: shortage < 0? 0: shortage, overage:overage < 0? 0: overage};
  }

  function externalOrderSum(order) {
    const overage = form.quantity - singleUnallocated.quantity;
    const shortage = singleUnallocated.quantity - form.quantity;

    return {shortage: shortage < 0? 0: shortage, overage:overage < 0? 0: overage};
  }

  const inHouseOrder = async() => {
    for(const list of orderList){
      if(list.quantity === "") if(form.quantity === 0) return swal('Error!', `Loaded quantity field cannot be empty!`, 'error');
      if(list.outletID === "") return swal('Error!', `An error occured, please refresh!`, 'error');
      if(list.dateCreated === "") return swal('Error!', `Date field cannot be empty!`, 'error');
    }
    const order = JSON.parse(JSON.stringify(singleUnallocated));
    const totalQuantity = inhouseOrderSum(orderList).totalQuantity;

    if(totalQuantity > order.quantity){
      order.overage = totalQuantity - order.quantity;
    }

    if(totalQuantity < order.quantity){
      order.shortage = order.quantity - totalQuantity;
    }

    const payload = {
      allocated: orderList,
      order: order,
      type: 'inhouse'
    }
    try{
      const response = await IncomingService.createIncoming(payload);
      if(response){
        setLoading(false);
        refresh('None', updateDate, skip);
        swal("Success", "Incoming order created successfully!", "success");
        closeup();
      }
    }catch(e){
      console.log(e)
    }
  }

  const externalOrder = async() => {
    const order = JSON.parse(JSON.stringify(singleUnallocated));
    if(form.quantity === 0) return swal('Error!', `Loaded quantity field cannot be empty!`, 'error');
    if(form.customerName === "") return swal('Error!', `Customer name field cannot be empty!`, 'error');
    if(form.customerAddress === "") return swal('Error!', `Customer address field cannot be empty!`, 'error');
    if(form.customerPhone === "") return swal('Error!', `Customer phone field cannot be empty!`, 'error');
    if(form.customerDestination === "") return swal('Error!', `Destination field cannot be empty!`, 'error');
    if(form.dateCreated === "") return swal('Error!', `Date field cannot be empty!`, 'error');
    form.outletID = 'Others';
    form.outletName = form.customerName;
    form.deliveryStatus = 'Not delivered';
    setLoading(true);

    if(form.quantity > order.quantity){
      order.overage = form.quantity - order.quantity;
    }

    if(form.quantity < order.quantity){
      order.shortage = order.quantity - form.quantity;
    }

    const payload = {
      allocated: form,
      order: order,
      type: 'other'
    }

    try{
      const response = await IncomingService.createIncoming(payload);
      console.log(response, "respose")
      if(response){
        setLoading(false);
        refresh('None', updateDate, skip);
        swal("Success", "Incoming order created successfully!", "success");
        closeup();
      }
    }catch(e){
      console.log(e)
    }
  }

  const submit = async () => {
    if(inhouse === "available"){
      inHouseOrder()
    }else{
      externalOrder();
    }
  };

  const updateSelection = (e, data) => {
    const newOrder = {...form, outletID: data._id, outletName: data.outletName}

    if (e.target.checked) {
      const cloneOrderList = [...orderList];
      const findID = cloneOrderList.findIndex(
        (item) => newOrder.outletID === item._id
      );
      if (findID === -1) {
        setOrderList((prev) => [...prev, newOrder]);
      }
    } else {
      const cloneOrderList = [...orderList];
      const findID = cloneOrderList.findIndex(
        (item) => newOrder._id === item._id
      );
      cloneOrderList.splice(findID, 1);
      setOrderList(cloneOrderList);
    }
  };

  const updateQantity = (e, data) => {
    const payload = Number(e.target.value);
    const cloneOrderList = [...orderList];

    const findID = cloneOrderList.findIndex((item) => item.outletID === data._id);
    if (findID === -1) {
      swal("Warning!", "Please select a field first to add quantity!", "info");
    } else {
      
      cloneOrderList[findID].quantity = payload;
      setOrderList(cloneOrderList);
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
                setOrderList([])
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
                setForm(baseForm);
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

  useEffect(()=>{
    form.depotStation = singleUnallocated.depotStation;
    form.destination = singleUnallocated.destination;
    form.product = singleUnallocated.product;
    form.productOrderID = singleUnallocated.productOrderID;
    form.incomingOrderID = singleUnallocated._id;
    form.truckNo = singleUnallocated.truckNo;
    form.wayBillNo = singleUnallocated.wayBillNo;
    form.driverName = singleUnallocated.driverName;
    form.phoneNo = singleUnallocated.phoneNo;
    form.transporter = singleUnallocated.transporter;
    form.organizationID = singleUnallocated.organizationID;
    form.createdAt = today;
    form.updatedAt = today;
    setLoadedQuantity(singleUnallocated.quantity)
  }, []);

  const getDateFromInput = (data) => {
    if(orderList.length === 0){
      return swal("Error!", "Please add stations and supplies", 'error');
    }else{
      const cloneOrderList = [...orderList];
      cloneOrderList.map(item => item.dateCreated = data);
      setOrderList(cloneOrderList);
      setSelectedDate(data);
    }
  }

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

      {inhouse === 'available' &&
        <React.Fragment>
          <ModalInputField
            value={loadedQuantity}
            setValue={setLoadedQuantity}
            disabled={true}
            type={"text"}
            label={"Loaded Quantity"}
          />
          <ModalInputField
            value={inhouseOrderSum(orderList).shortage}
            setValue={()=>{}}
            disabled={true}
            type={"text"}
            label={"Shortage"}
          />
          <ModalInputField
            value={inhouseOrderSum(orderList).overage}
            setValue={()=>{}}
            disabled={true}
            type={"text"}
            label={"Overage"}
          />
        </React.Fragment>
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
                    type={"number"}
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
            value={externalOrderSum().shortage}
            setValue={()=>{}}
            disabled={true}
            type={"text"}
            label={"Shortage"}
          />
          <ModalInputField
            value={externalOrderSum().overage}
            setValue={()=>{}}
            disabled={true}
            type={"text"}
            label={"Overage"}
          />
          <ModalInputField
            value={form.quantity}
            setValue={data => {
              setForm(prev => ({...prev, quantity: data}))
            }}
            type={"number"}
            label={"Loaded quantity"}
          />
          <ModalInputField
            value={form.customerName}
            setValue={(data) => {
              setForm(prev => ({...prev, customerName: data }))
            }}
            type={"text"}
            label={"Customer Name"}
          />
          <ModalInputField
            value={form.customerAddress}
            setValue={(data) => {
              setForm(prev => ({...prev, customerAddress: data}))
            }}
            type={"text"}
            label={"Customer Address"}
          />
          <ModalInputField
            value={form.customerPhone}
            setValue={data => {
              setForm(prev => ({...prev, customerPhone: data}))
            }}
            type={"text"}
            label={"Customer Phone"}
          />
          <ModalInputField
            value={form.customerDestination}
            setValue={data => {
              setForm(prev => ({...prev, customerDestination: data}))
            }}
            type={"text"}
            label={"Customer Destination"}
          />
          <ModalInputField
            value={form.dateCreated}
            setValue={(data) => {
              setForm(prev => ({
                ...prev,
                createdAt: data,
                updatedAt: data,
                dateCreated: data
              }))
            }}
            type={"date"}
            label={"Date allocated"}
          />
        </React.Fragment>
      )}
      {inhouse === 'available' &&
        <ModalInputField
          value={selectedDate}
          setValue={getDateFromInput}
          type={"date"}
          label={"Date allocated"}
        />
      }
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
