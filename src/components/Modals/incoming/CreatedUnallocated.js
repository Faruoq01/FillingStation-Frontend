import React, { useState } from "react";
import { useSelector } from "react-redux";
import "../../../styles/lpo.scss";
import ModalBackground from "../../controls/Modal/ModalBackground";
import ModalInputField from "../../controls/Modal/ModalInputField";
import moment from "moment";
import { MenuItem, Radio, Select } from "@mui/material";
import ProductService from "../../../services/360station/productService";
import swal from "sweetalert";
import IncomingService from "../../../services/360station/IncomingService";

const baseForm = {
    depotStation: '',
    destination: '',
    transporter: '',
    product: '',
    productOrderID: '',
    quantity: '',
    dateCreated: '',
    truckNo: '',
    wayBillNo: '',
    driverName: '',
    phoneNo: '',
    shortage: '',
    overage: '',
    deliveryStatus: '',
    organizationID: '',
    createdAt: '',
    updatedAt: '',
}

const CreateUnallocated = ({ open, closeup, skip, refresh }) => {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const today = moment().format('YYYY-MM-DD').split(" ")[0];
  const [productOrder, setProductOrder] = useState([]);
  const [singleOrder, setSingleOrder] = useState({});
  const [productType, setProductType] = useState("available");

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const [form, setForm] = useState({...baseForm});

  const submit = async () => {
    const allKeys = Object.keys(form);
    for(const key of allKeys){
        if(form[key] === ''){
            return swal('Error!', `Field ${key.toLowerCase()} cannot be empty!`, 'error')
        }
    }

    setLoading(true);
    const incoming = await IncomingService.createUnallocated(form);
    const dateUpdated = [form.createdAt, form.createdAt];
    refresh("None", dateUpdated, skip);
    setLoading(false);
    if(incoming){
        swal('Success', 'Incoming order created successfully!', 'success');
    }
    closeup(false);
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
      label={"Create Incoming Order"}>
        <RadioButtonComponent
            productType={productType}
            setProductType={setProductType}
            labelOne={"Available Order"}
            labelTwo={"New Order"}
            title={"Choose Order Type"}
            mt={"20px"}
        />

        <ProductType setData={(list, type) => {
            setProductOrder(list);
            setForm(prev => ({
                ...prev,
                    product: type,
                }))
            }} 
            org={resolveUserID().id}
        />

        {productType === 'available' &&
            <ProductOrder 
                productOrder={productOrder} 
                setData = {(data) => {
                    setSingleOrder(data)
                    setForm(prev => ({
                        ...prev,
                        productOrderID: data._id
                    }))
                }}
            />
        }

        <ModalInputField
            value={form.depotStation}
            setValue={(data) => {
                setForm(prev => ({...prev, depotStation: data}));
            }}
            type={"text"}
            label={"Loading Depot"}
        />

        <ModalInputField
            value={form.destination}
            setValue={(data) => {
                setForm(prev => ({...prev, destination: data}));
            }}
            type={"text"}
            label={"Destination state"}
        />

        <ModalInputField
            value={form.transporter}
            setValue={(data) => {
                setForm(prev => ({...prev, transporter: data}));
            }}
            type={"text"}
            label={"Transporter"}
        />

        {productType === 'available' &&
            <ModalInputField
                value={singleOrder.quantity}
                setValue={()=>{}}
                disabled={true}
                type={"number"}
                label={"Product Ordered"}
            />
        }

        {productType === 'available' &&
            <ModalInputField
                value={singleOrder.currentBalance}
                setValue={()=>{}}
                disabled={true}
                type={"number"}
                label={"Current Product Balance"}
            />
        }

        <ModalInputField
            value={form.quantity}
            setValue={(data) => {
                setForm(prev => ({...prev, quantity: data}));
            }}
            type={"number"}
            label={"Loaded Quantity"}
        />

        <ModalInputField
            value={form.dateCreated}
            setValue={(data) => {
                setForm(prev => ({
                    ...prev, 
                    dateCreated: data,
                    deliveryStatus: 'pending',
                    organizationID: resolveUserID().id,
                    createdAt: today,
                    updatedAt: today
                }));
            }}
            type={"date"}
            label={"Date created"}
        />
        {productType === 'available' &&
            <ModalInputField
                value={form.productOrderID}
                setValue={()=>{}}
                disabled={true}
                type={"text"}
                label={"Product Order ID"}
            />
        }
        <ModalInputField
            value={form.truckNo}
            setValue={(data) => {
                setForm(prev => ({...prev, truckNo: data}));
            }}
            type={"text"}
            label={"Truck No"}
        />
        <ModalInputField
            value={form.wayBillNo}
            setValue={(data) => {
                setForm(prev => ({...prev, wayBillNo: data}));
            }}
            type={"text"}
            label={"Waybill no"}
        />
        <ModalInputField
            value={form.driverName}
            setValue={(data) => {
                setForm(prev => ({...prev, driverName: data}));
            }}
            type={"text"}
            label={"Driver name"}
        />
        <ModalInputField
            value={form.phoneNo}
            setValue={(data) => {
                setForm(prev => ({...prev, phoneNo: data}));
            }}
            type={"text"}
            label={"Phone number"}
        />
        
    </ModalBackground>
  );
};

const ProductType = ({setData, org}) => {
    const PRODUCT_ENUM = ["PMS", "AGO", "DPK"];
    const [value, setValue] = useState(0);

    const menuSelection = (index, item) => {
        setValue(index);
    
        const payload = {
          productType: item,
          organisationID: org,
        };
    
        ProductService.getAllProductOrder2(payload).then((data) => {
            const order = data.product.product;
            if (index === 1) setData(order, "PMS");
            if (index === 2) setData(order, "AGO");
            if (index === 3) setData(order, "DPK");
        });
    };

    return(
        <div style={{ marginTop: "20px" }} className="inputs">
        <div className="head-text2">Product Type</div>
        <Select value={value} sx={productSelect}>
          <MenuItem style={menu} value={value}>
            Select Product
          </MenuItem>
          {PRODUCT_ENUM.map((item, index) => {
            return (
              <MenuItem
                onClick={() => {
                  menuSelection(index + 1, item);
                }}
                style={menu}
                value={index + 1}>
                {item}
              </MenuItem>
            );
          })}
        </Select>
      </div>
    )
}

const ProductOrder = ({productOrder=[], setData}) => {
    const [value, setValue] = useState(0);

    const menuSelection = (index, item) => {
        setValue(index);
        setData(item);
    }

    return(
        <React.Fragment>
             <div style={{ marginTop: "20px" }} className="inputs">
                <div className="head-text2">Product Order </div>
                <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={value}
                    sx={selectStyle2}>
                    <MenuItem style={menu} value={value}>
                        Select Product Order
                    </MenuItem>
                    {productOrder.map((item, index) => {
                    return (
                        <MenuItem
                        key={index}
                        style={menu}
                        onClick={() => {
                            menuSelection(index + 1, item);
                        }}
                        value={index + 1}>
                        {item.depot}
                        </MenuItem>
                    );
                    })}
                </Select>
            </div>
        </React.Fragment>
    )
}

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

const menu = {
    fontSize: "12px",
};

export default CreateUnallocated;
