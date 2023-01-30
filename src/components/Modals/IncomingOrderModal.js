import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import close from '../../assets/close.png';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Modal from '@mui/material/Modal';
import { ThreeDots } from  'react-loader-spinner';
import swal from 'sweetalert';
import '../../styles/lpo.scss';
import IncomingService from '../../services/IncomingService';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ProductService from '../../services/productService';
import { createProductOrder } from '../../store/actions/productOrder';
import { Radio } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const IncomingOrderModal = (props) => {
    const [loading, setLoading] = useState(false);
    const [defaultState, setDefault] = useState(0);
    const productOrder = useSelector(state => state.productOrderReducer.productOrder);
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    
    const dispatch = useDispatch();
    const [productType, setProductType] = useState('available');
    const [quantityOrdered, setQuantityOrdered] = useState("");
    const [previousBalance, setPreviousBalance] = useState("");
    const [quantityLoaded, setQuantityLoaded] = useState("");

    const [depotStation, setDepotStation] = useState('');
    const [destination, setDestination] = useState('');
    const [product, setProduct] = useState('');
    const [dateCreated, setDateCreated] = useState('');
    const [productOrderID, setProductOrderID] = useState('');
    const [truckNo, setTruckNo] = useState('');
    const [wayBillNo, setWayBillNo] = useState('');
    const [transporter, setTransporter] = useState('');
    const [driverName, setDriverName] = useState('');
    const [phoneNo, setPhoneNumber] = useState('');
    const [val, setVal] = useState(1);
    const [stationSelect, setStationSelect] = useState(false);
    const [selected, setSelected] = useState([]);

    const handleClose = () => props.close(false);

    const submit = async() => {
        if(transporter === "") return swal("Warning!", "Transporter cannot be empty", "info");
        if(depotStation === "") return swal("Warning!", "Depot station field cannot be empty", "info");
        if(destination === "") return swal("Warning!", "Destination field cannot be empty", "info");
        if(product === "") return swal("Warning!", "Product field cannot be empty", "info");
        if(dateCreated === "") return swal("Warning!", "Date created field cannot be empty", "info");
        if(productOrderID === "") return swal("Warning!", "Product order ID field cannot be empty", "info");
        if(truckNo === "") return swal("Warning!", "Truck No cannot be empty", "info");
        if(driverName === "") return swal("Warning!", "Driver name cannot be empty", "info");
        if(phoneNo === "") return swal("Warning!", "Phone no cannot be empty", "info");

        const totalLoadedQuantity = selected.reduce((accum, current) => {
            return Number(accum) + Number(current.incomingQuantity);
        }, 0)

        if(Number(totalLoadedQuantity) > Number(previousBalance)) return swal("Warning!", "Total quantity exceeds current balance", "info");

        setLoading(true);

        const selectedStations = [...selected];
        let previous = previousBalance;
        let loaded = quantityLoaded;

        for(let station of selectedStations){

            const currentBalanceUpdate = Number(previous) - Number(station.incomingQuantity);
            const loadedUpdate = Number(loaded) + Number(station.incomingQuantity);

            const payload = {
                depotStation: depotStation,
                destination: station.alias,
                product: product,
                quantity: station.incomingQuantity,
                updateCurrentBalance: currentBalanceUpdate,
                updateQantityLoaded: loadedUpdate,
                dateCreated: dateCreated,
                productOrderID: productOrderID,
                truckNo: truckNo,
                transporter: transporter,
                wayBillNo: wayBillNo,
                driverName: driverName,
                phoneNo: phoneNo,
                outletName: station.outletName,
                outletID: station._id,
                organizationID: station.organisation
            }

            const res = await IncomingService.createIncoming(payload);
            if(res)
            previous = currentBalanceUpdate;
            loaded = loadedUpdate;
        }

        setLoading(false);
        swal("Success", "Product order created successfully!", "success");
        props.refresh();
        handleClose();
    }

    const menuSelection = (e, item) => {
        if(e === 2) setProduct('PMS');
        if(e === 3) setProduct('AGO');
        if(e === 4) setProduct('DPK');
        setVal(e);
        
        const payload = {
            productType: item,
            outletID: props.station._id,
            organisationID: props.station.organisation
        }

        ProductService.getAllProductOrder2(payload).then((data) => {
            dispatch(createProductOrder(data.product.product));
        });
    }

    const changeMenu = (index, item) => {
        setDefault(index);
        setDepotStation(item.depot);
        setPreviousBalance(item.currentBalance);
        setQuantityOrdered(item.quantity);
        setProductOrderID(item._id);
        setQuantityLoaded(item.quantityLoaded);
    }

    const updateSelection = (e, data) => {
        const dataClone = {...data, incomingQuantity: 0};
        
        if(e.target.checked){
            const cloneSelected = [...selected];
            const findID = cloneSelected.findIndex(item => dataClone._id === item._id);
            if(findID === -1){
                setSelected(prev => [...prev, dataClone]);
            }
        }else{
            const cloneSelected = [...selected];
            const findID = cloneSelected.findIndex(item => dataClone._id === item._id);
            cloneSelected.pop(findID);
            setSelected(cloneSelected);
        }
    }

    const updateQantity = (e, data) => {
        const cloneSelected = [...selected];
        const findID = cloneSelected.findIndex(item => item._id === data._id);
        if(findID === -1){
            swal("Warning!", "Please select a field first to add quantity!", "info");
        }else{
            cloneSelected[findID] = {...cloneSelected[findID], incomingQuantity: e.target.value}
            setSelected(cloneSelected);
        }
    }

    return(
        <Modal
            open={props.open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{display:'flex', justifyContent:'center', alignItems:'center'}}
        >
                <div className='modalContainer2'>
                    <div className='inner'>
                        <div className='head'>
                            <div className='head-text'>Create Incoming Order</div>
                            <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                        </div>

                       <div className='middleDiv' style={inner}>
                            <div style={{marginTop:'15px'}} className='inputs'>
                                    <div className='head-text2'>Choose Order Type</div>
                                    <div className='radio'>
                                        <div className='rad-item'>
                                            <Radio onClick={()=>{setProductType('available')}} checked={productType === 'available'? true: false} />
                                            <div className='head-text2' style={{marginRight:'5px'}}>Available Order</div>
                                        </div>

                                        <div className='rad-item'>
                                            <Radio onClick={()=>{setProductType('new')}} checked={productType === 'new'? true: false} />
                                            <div className='head-text2' style={{marginRight:'5px'}}>New Order</div>
                                        </div>
                                    </div>
                                </div>
                            <div style={{marginTop:'15px'}} className='inputs'>
                                <div className='head-text2'>Product Type</div>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={val}
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }}
                                >
                                    <MenuItem style={menu} value={1}>Select Product</MenuItem>
                                    <MenuItem onClick={() => {menuSelection(2, "PMS")}} style={menu} value={2}>PMS</MenuItem>
                                    <MenuItem onClick={() => {menuSelection(3, "AGO")}} style={menu} value={3}>AGO</MenuItem>
                                    <MenuItem onClick={() => {menuSelection(4, "DPK")}} style={menu} value={4}>DPK</MenuItem>
                                </Select>
                            </div>

                            {productType === 'available' &&
                                <div className='inputs'>
                                    <div className='head-text2'>Product Order </div>
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={defaultState}
                                        sx={selectStyle2}
                                    >
                                        <MenuItem style={menu} value={0}>Select Product Order</MenuItem>
                                        {
                                            productOrder.map((item, index) => {
                                                return(
                                                    <MenuItem key={index} style={menu} onClick={()=>{changeMenu(index + 1, item)}} value={index + 1}>{item.depot}</MenuItem>
                                                )
                                            })  
                                        }
                                    </Select>
                                </div>
                            }

                            <div className='inputs'>
                                <div className='head-text2'>Loading Depot</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    value={depotStation}
                                    type='text'
                                    onChange={e => setDepotStation(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Transporter</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px',  
                                        fontSize:'12px',
                                        background:'#EEF2F1',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    value={transporter}
                                    type='text'
                                    onChange={e => setTransporter(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Destination</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    value={destination}
                                    onChange={e => setDestination(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Quantity Orderd (ltr)</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    type='text'
                                    disabled
                                    value={quantityOrdered}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Current Balance (ltr)</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    type='text'
                                    disabled
                                    value={previousBalance}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Select discharge stations</div>
                                <div onClick={()=>setStationSelect(!stationSelect)} style={drop} >
                                    <span style={{marginLeft:'10px'}}>Select ({selected.length})</span>
                                    <KeyboardArrowDownIcon sx={{marginRight:'10px'}} />
                                </div>
                                {stationSelect &&
                                    <div style={pop}>
                                        {
                                            allOutlets.map((data, index) => {
                                                return(
                                                    <div key = {index} style={menus}>
                                                        <div style={{width:'70%'}}>
                                                            <input onChange={(e)=>{updateSelection(e, data)}} style={{marginLeft:'10px'}} type={'checkbox'} />
                                                            <span style={{marginLeft:'10px', fontSize:'11px'}}>{data.outletName}, {data.city}</span>
                                                        </div>
                                                        <input placeholder='quantity' onChange={(e)=>updateQantity(e, data)} style={{width:'30%', outline:'none', fontSize:'11px'}} type={'text'} />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                }
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Date created</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    type='date'
                                    value={dateCreated}
                                    onChange={e => setDateCreated(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Product Order ID</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    type='text'
                                    disabled
                                    value={productOrderID}
                                    onChange={e => setProductOrderID(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Truck No</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    type='text'
                                    value={truckNo}
                                    onChange={e => setTruckNo(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Waybill No</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    type='text'
                                    value={wayBillNo}
                                    onChange={e => setWayBillNo(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Driver's Name</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    type='text'
                                    value={driverName}
                                    onChange={e => setDriverName(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Phone Number</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    type='text'
                                    value={phoneNo}
                                    onChange={e => setPhoneNumber(e.target.value)}
                                />
                            </div>
                       </div>

                        <div style={{marginTop:'10px', height:'30px'}} className='butt'>
                            <Button sx={{
                                width:'100px', 
                                height:'30px',  
                                background: '#427BBE',
                                borderRadius: '3px',
                                fontSize:'10px',
                                marginTop:'0px',
                                '&:hover': {
                                    backgroundColor: '#427BBE'
                                }
                                }} 
                                onClick={submit}
                                variant="contained"> Save
                            </Button>

                            {loading?
                                <ThreeDots 
                                    height="60" 
                                    width="50" 
                                    radius="9"
                                    color="#076146" 
                                    ariaLabel="three-dots-loading"
                                    wrapperStyle={{}}
                                    wrapperClassName=""
                                    visible={true}
                                />: null
                            }
                        </div>
                        
                    </div>
                </div>
        </Modal>
    )
}

const drop = {
    width:'98%',
    height: '35px', 
    marginTop:'5px', 
    background:'#EEF2F1', 
    border:'1px solid #777777',
    fontSize:'12px',
    display: 'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
}

const pop = {
    width: '98%',
    height: '200px',
    background:'#e2e2e2',
    zIndex: '20',
    marginTop:'5px',
    overflowY: 'scroll'
}

const menus = {
    width: '100%',
    height:'35px',
    border: '1px solid #fff',
    borderTop: 'none',
    borderLeft:'none', 
    borderRight: 'none',
    display:'flex',
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between'
}

const inner = {
    width:'100%',
    height:'500px',
    overflowY: 'scroll'
}


const menu = {
    fontSize:'12px',
}

const selectStyle2 = {
    width:'100%', 
    height:'35px', 
    background:'#EEF2F1',
    color:'#000',
    fontSize:'14px',
    outline:'none',
    borderRadius:'0px',
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border:'1px solid #777777',
    },
}

export default IncomingOrderModal;