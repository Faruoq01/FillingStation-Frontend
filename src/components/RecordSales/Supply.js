import React, { useState } from 'react';
import '../../styles/expenses.scss';
import hr8 from '../../assets/hr8.png';
import Button from '@mui/material/Button';
import { MenuItem, Select } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import SupplyService from '../../services/supplyService';
import swal from 'sweetalert';
import { ThreeDots } from 'react-loader-spinner';
import IncomingService from '../../services/IncomingService';
import { createIncomingOrder } from '../../store/actions/incomingOrder';
import OutletService from '../../services/outletService';
import { getAllOutletTanks } from '../../store/actions/outlet';

const Supply = (props) => {

    const [defaultState1, setDefaultState1] = useState(0);
    const [defaultState2, setDefaultState2] = useState(0);
    const dispatch = useDispatch();
    const oneOutletStation = useSelector(state => state.outletReducer.oneStation);
    const incomingOrder = useSelector(state => state.incomingOrderReducer.incomingOrder);
    const tankList = useSelector(state => state.outletReducer.tankList);
    const pendingSupplies = useSelector(state => state.supplyReducer.pendingSupply);

    const [defaults, setDefault] = useState(10);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [productType, setProductType] = useState('PMS');
    const [incoming, setIncoming] = useState({});
    const [tanks, setTanks] = useState({});
    const [transportationName, setTransportationName] = useState('');
    const [truckNo, setTruckNo] = useState('');
    const [wayBillNo, setWayBillNo] = useState('');
    const [quantity, setQuantity] = useState('');
    const [shortage, setShortage] = useState('');
    const [overage, setOverage] = useState('');
    const [date, setDate] = useState('');

    const setProduct = (value, data) => {
        setDefault(value);
        setProductType(data)

        const payload = {
            productType: data,
            outletID: oneOutletStation._id, 
            organisationID: oneOutletStation.organisation
        }
        
        IncomingService.getAllIncoming2(payload).then((data) => {
            dispatch(createIncomingOrder(data.incoming.incoming));
        });

        OutletService.getAllOutletTanks2(payload).then(data => {
            dispatch(getAllOutletTanks(data.stations));
        });
    }

    const submitSupply = () => {
        swal({
            title: "Alert!",
            text: "Are you sure you want to submit supply?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                if(pendingSupplies.length === 0){
                    return swal("Warning!", "Supply list is empty!", "info");
                }
                setLoading2(true);

                const payload = {
                    pendingSupplies: pendingSupplies,
                }

                SupplyService.createSupply(payload).then(data => {
                    return data;
                }).then(()=>{
                    props.refresh();
                    setLoading2(false);
                });
            }
        })
    }

    const changeMenu1 = (index, item) => {
        setDefaultState1(index);
        setIncoming(item);

        if('productType' in tanks){
            let room = Number(tanks.tankCapacity) - Number(tanks.currentLevel);
            if(room === 0){
                swal("Warning!", "This tank is full, please select another tank", "info");
            }else if(incoming.currentLevel <= room){
                setQuantity(incoming.currentLevel);
                setShortage(Number(room) - Number(incoming.currentLevel));
                setOverage("None");
                setTruckNo(item.truckNo);
                setWayBillNo(item.wayBillNo);
            }else{
                setQuantity(Number(room));
                setShortage("None");
                setOverage(Number(incoming.currentLevel) - Number(room));
                setTruckNo(item.truckNo);
                setWayBillNo(item.wayBillNo);
            }
        }
    }

    const changeMenu2 = (index, item) => {
        if('product' in incoming){
            setDefaultState2(index);
            setTanks(item);

            let room = Number(item.tankCapacity) - Number(item.currentLevel);
            if(room === 0){
                swal("Warning!", "This tank is full, please select another tank", "info");
            }else if(incoming.currentLevel <= room){
                setQuantity(incoming.currentLevel);
                setShortage(Number(room) - Number(incoming.currentLevel));
                setOverage("None");
                setTruckNo(incoming.truckNo);
                setWayBillNo(incoming.wayBillNo);
            }else{
                setQuantity(Number(room));
                setShortage("None");
                setOverage(Number(incoming.currentLevel) - Number(room));
                setTruckNo(incoming.truckNo);
                setWayBillNo(incoming.wayBillNo);
            }
        }else{
            swal("Warning!", "Please select an incoming order first", "info");
        }
    }

    const addSupplyToList = () => {

        if(transportationName === "") return swal("Warning!", "Transportation name field cannot be empty", "info");
        if(truckNo === "") return swal("Warning!", "Truck no field cannot be empty", "info");
        if(wayBillNo === "") return swal("Warning!", "Waybill no field cannot be empty", "info");
        if(quantity === "") return swal("Warning!", "Quantity field cannot be empty", "info");
        if(date === "") return swal("Warning!", "Date field cannot be empty", "info");
        setLoading(true);

        const incomingPayload = {
            id: incoming._id,
            currentLevel: shortage === "None"? overage: "0",
        }

        const tankPayload = {
            id: tanks._id,
            currentLevel: Number(tanks.currentLevel) + Number(quantity),
            quantityAdded: quantity,
            previousLevel: Number(tanks.currentLevel),
        }

        const pendingPayload = {
            'transportationName': transportationName,
            'wayBillNo': wayBillNo,
            'truckNo': truckNo,
            'quantity': quantity,
            'outletName': oneOutletStation.outletName,
            'productType': productType,
            'shortage': overage === "None"? (Number(tanks.tankCapacity) - Number(tanks.currentLevel) - Number(quantity)) : "None",
            'overage': shortage === "None"? overage: "None",
            'date': date,
            'incomingID': incoming._id,
            'tankID': tanks._id,
            'outletID': oneOutletStation._id,
            'organizationID': oneOutletStation.organisation,
        }

        IncomingService.updateIncoming(incomingPayload).then(data => {
            console.log('incoming update', data)
        }).then(() => {
            OutletService.updateTank(tankPayload).then(data =>{
                console.log('tank update', data);
            }).then(()=>{
                SupplyService.pendingSupply(pendingPayload).then(data => {
                    console.log('pending supply', data)
                }).then(()=>{
                    props.refresh();
                }).then(()=>{
                    setTransportationName("");
                    setTruckNo("");
                    setWayBillNo("");
                    setQuantity("");
                    setDate("");
                    setIncoming({});
                    setTanks({});
                    setDefault(10);
                    setLoading(false);
                });
            });
        })
    }

    const getOneIncomingData = async(data)=>{
        const payload = {
            id: data.incomingID
        }
        let result = await IncomingService.getOneIncoming(payload);
        return result;
    }

    const getOneTankData = async(data)=>{
        const payload = {
            id: data.tankID
        }
        let result = await OutletService.getOneTank(payload);
        return result;
    }

    const removePendingSupply = (item) => {
        Promise.all([getOneIncomingData(item), getOneTankData(item)]).then(data => {
            return data;
        }).then(data => {
            swal({
                title: "Alert!",
                text: "Are you sure you want to cancel this supply?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {

                    // const addedProduct = item.shortage === "None"? (Number(item.quantity) - Number(item.overage)) : Number(data[0].quantity);

                    const incomingPayload = {
                        id: data[0].stations._id,
                        currentLevel: Number(data[0].stations.currentLevel) + Number(item.quantity),
                    }
            
                    const tankPayload = {
                        id: data[1].stations._id,
                        currentLevel: Number(data[1].stations.currentLevel) - Number(item.quantity),
                        quantityAdded: "0",
                        previousLevel: "0",
                    }

                    const pendingPayload = {
                        id: item._id
                    }

                    IncomingService.updateIncoming(incomingPayload).then(data => {
                        console.log('incoming update', data)
                    }).then(() => {
                        OutletService.updateTank(tankPayload).then(data =>{
                            console.log('tank update', data);
                        }).then(()=>{
                            SupplyService.deletePendingSupply(pendingPayload).then(data => {
                                console.log('pending supply', data)
                            }).then(()=>{
                                props.refresh();
                            }).then(()=>{
                                setLoading(false);
                            });
                        });
                    })
                }
            });
        });
    }

    return(
        <div className='expensesContainer'>
            <div className='form-container'>
                <div className='twoInputs'>
                    <div className='inputs2'>
                        <div className='text'>Transporter</div>
                        <input style={{marginRight:'1%', background:'transparent'}} value={transportationName} onChange={e => setTransportationName(e.target.value)} className='date' type={'text'}  />
                    </div>

                    <div className='inputs2'>
                        <div className='text'>Truck No</div>
                        <input style={{marginLeft:'1%', background:'transparent'}} disabled={true} value={truckNo} onChange={e => setTruckNo(e.target.value)} className='date' type={'text'}  />
                    </div>
                </div>

                <div style={{marginTop: '30px'}} className='inputs'>
                    <div className='text'>Waybill No</div>
                    <input style={{width:'100%', background:'transparent'}} disabled={true} value={wayBillNo} onChange={e => setWayBillNo(e.target.value)} className='date' type={'text'}  />
                </div>

                <div style={{marginTop:'30px'}} className='inputs'>
                    <div className='text'>Product Type</div>
                    <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={defaults}
                        sx={{
                            width:'100%',
                            height:'40px',
                            marginTop:'10px',
                            fontSize:'12px',                                 
                            background:'transparent',
                            borderRadius: '5.63195px',
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                border: "1px solid #484850",
                            },
                        }}
                    >
                        <MenuItem style={menu} value={10}>Select product type</MenuItem>
                        <MenuItem onClick={()=>{setProduct(20, "PMS")}} style={menu} value={20}>PMS</MenuItem>
                        <MenuItem onClick={()=>{setProduct(30, "AGO")}} style={menu} value={30}>AGO</MenuItem>
                        <MenuItem onClick={()=>{setProduct(40, "DPK")}} style={menu} value={40}>DPK</MenuItem>
                    </Select>
                </div>

                <div style={{marginTop:'30px'}} className='inputs'>
                    <div className='text'>Incoming Order</div>
                    <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={defaultState1}
                        sx={selectStyle2}
                    >
                        <MenuItem style={menu} value={0}>Select Order</MenuItem>
                        {
                            incomingOrder.map((item, index) => {
                                return(
                                    <MenuItem key={index} style={menu} onClick={()=>{changeMenu1(index + 1, item)}} value={index + 1}>{item.depotStation}</MenuItem>
                                )
                            })  
                        }
                    </Select>
                </div>

                <div style={{marginTop:'30px'}} className='inputs'>
                    <div className='text'>Product Tanks</div>
                    <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={defaultState2}
                        sx={selectStyle2}
                    >
                        <MenuItem style={menu} value={0}>Select Host Tank</MenuItem>
                        {
                            tankList.map((item, index) => {
                                return(
                                    item.tankCapacity === item.currentLevel || <MenuItem key={index} style={menu} onClick={()=>{changeMenu2(index + 1, item)}} value={index + 1}>{item.tankName}</MenuItem>
                                )
                            })  
                        }
                    </Select>
                </div>

                <div className='twoInputs'>
                    <div className='inputs2'>
                        <div className='text'>Quantity Loaded</div>
                        <input style={{marginRight:'1%', background:'transparent'}} disabled={true} value={quantity} onChange={e => setQuantity(e.target.value)} className='date' type={'text'}  />
                    </div>

                    <div className='inputs2'>
                        <div className='text'>Date</div>
                        <input style={{marginLeft:'1%', background:'transparent'}} onChange={e => setDate(e.target.value)} className='date' type={'date'}  />
                    </div>
                </div>

                <div className='twoInputs'>
                    <div className='inputs2'>
                        <div className='text'>Shortage</div>
                        <input style={{marginRight:'1%', background:'transparent'}} disabled={true} value={shortage} onChange={e => setShortage(e.target.value)} className='date' type={'text'}  />
                    </div>

                    <div className='inputs2'>
                        <div className='text'>Overage</div>
                        <input style={{marginLeft:'1%', background:'transparent'}} disabled={true} value={overage} onChange={e => setOverage(e.target.value)} className='date' type={'text'}  />
                    </div>
                </div>

                <div style={{marginBottom:'0px'}} className='submit'>
                    <Button sx={{
                        width:'180px', 
                        height:'30px',  
                        background: '#427BBE',
                        borderRadius: '3px',
                        fontSize:'11px',
                        marginBottom:'20px',
                        '&:hover': {
                            backgroundColor: '#427BBE'
                        }
                        }}  
                        onClick={addSupplyToList}
                        variant="contained"> Add supply to list
                    </Button>
                </div>
            </div>

            <div className='right'>
                <div className='headers'>
                    <div className='headText'>S/N</div>
                    <div className='headText'>Transporter</div>
                    <div className='headText'>Product</div>
                    <div className='headText'>Quality</div>
                    <div className='headText'>Action</div>
                </div>

                {
                    pendingSupplies.length === 0?
                    loading? 
                    <div style={{width:'100%', height:'30px', display:'flex', justifyContent:'center'}}>
                        <ThreeDots 
                            height="60" 
                            width="50" 
                            radius="9"
                            color="#076146" 
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{position:'absolute', zIndex:'30'}}
                            wrapperClassName=""
                            visible={loading}
                        />
                    </div>:
                    <div style={{fontSize:'14px', marginTop:'20px', color:'green'}}>No pending supply record</div>:
                    pendingSupplies.map((data, index) => {
                        return(
                            <div className='rows'>
                                <div className='headText'>{index + 1}</div>
                                <div className='headText'>{data.transportationName}</div>
                                <div className='headText'>{data.productType}</div>
                                <div className='headText'>{data.quantity}</div>
                                <div className='headText'>
                                    <img onClick={()=>{removePendingSupply(data)}} style={{width:'22px', height:'22px'}} src={hr8} alt="icon" />
                                </div>
                            </div>
                        )
                    })
                }

                <div style={{marginBottom:'0px', width:'100%', height:'30px', justifyContent:'space-between'}} className='submit'>
                    <div>
                        <ThreeDots 
                            height="60" 
                            width="50" 
                            radius="9"
                            color="#076146" 
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{position:'absolute', zIndex:'30'}}
                            wrapperClassName=""
                            visible={loading2}
                        />
                    </div>
                    <Button sx={{
                        width:'120px', 
                        height:'30px',  
                        background: '#427BBE',
                        borderRadius: '3px',
                        fontSize:'11px',
                        '&:hover': {
                            backgroundColor: '#427BBE'
                        }
                        }}  
                        onClick={submitSupply}
                        variant="contained"> Submit
                    </Button>
                </div>
            </div>
        </div>
    )
}

const selectStyle2 = {
    width:'100%', 
    height:'35px', 
    borderRadius:'5px',
    color:'#000',
    fontSize:'14px',
    outline:'none',
    background:'transparent',
    borderColor: '#000',
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#000",
    },
}

const menu = {
    fontSize:'14px',
}

export default Supply;