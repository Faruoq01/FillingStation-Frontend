import { Button } from "@mui/material";
import { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { searchIncoming } from "../../store/actions/incomingOrder";
import AddIcon from '@mui/icons-material/Add';
import hr8 from '../../assets/hr8.png';
import { passRecordSales } from "../../store/actions/dailySales";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const SupplyComponent = () => {

    const [selected, setSelected] = useState([]);
    const [menus, setMenus] = useState(false);
    const dispatch = useDispatch();
    const linkedData = useSelector(state => state.dailySalesReducer.linkedData);
    const incomingOrder = useSelector(state => state.incomingOrderReducer.incomingOrder);
    const tankList = useSelector(state => state.outletReducer.tankList);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const [selectedIncomingOrders, setSelectedIncomingOrder] = useState("");
    console.log(tankList, 'tanklist')

    console.log(linkedData.head.prev.prev.prev.data.payload, "here is the tank update list")

    // payload data
    const [transporter, setTransporter] = useState('');
    const [waybillNo, setWaybillNo] = useState('Select waybill no');
    const [truckNo, setTruckNo] = useState('');
    const [productSupply, setProductSupply] = useState('');
    const [quantityLoaded, setQuantityLoaded] = useState('');
    const [overage, setOverage] = useState('');
    const [shortage, setShortage] = useState('');

    const selectedIncomingOrder = (data) => {

        setTransporter(data.transporter);
        setWaybillNo(data.wayBillNo);
        setProductSupply(data.product);
        setQuantityLoaded(data.quantity);
        setTruckNo(data.truckNo);

        setMenus(!menus);
        setSelectedIncomingOrder(data);
    }


    const incomingTanks = (e, data) => {
        const room = Number(data.tankCapacity) - Number(data.currentLevel);
        let addedQuantity = Number(e.target.value);

        if(addedQuantity > room){
            swal("Warning!", `This tank doesn't have the capacity, can only accommodate ${room} litres extra. `, "info");
        }else{
            const cloneSelectedTanks = [...selected];
            const findID = cloneSelectedTanks.findIndex(item => item._id === data._id);
            const total = String(Number(cloneSelectedTanks[findID].currentLevel) + addedQuantity);
            cloneSelectedTanks[findID].newLevel = total;
            cloneSelectedTanks[findID].addedQuantity = addedQuantity;

            const sumOfQuantity = cloneSelectedTanks.reduce((accum, current) => {
                return Number(accum) + Number(current.addedQuantity);
            }, 0);

            if(sumOfQuantity > Number(quantityLoaded)){
                const shortage = sumOfQuantity - Number(quantityLoaded);
                setShortage("None");
                setOverage(shortage);
            }else if(sumOfQuantity < Number(quantityLoaded)){
                const overage = Number(quantityLoaded) - sumOfQuantity;
                setOverage("None");
                setShortage(overage);
            }else if(Number(quantityLoaded) === sumOfQuantity){
                setOverage("None");
                setShortage("None");
            }
        } 
    }

    const addDetailsToList = () => {
        if(transporter === "") return swal("Warning!", "Transporter field cannot be empty", "info");
        if(waybillNo === "") return swal("Warning!", "waybill no field cannot be empty", "info");
        if(truckNo === "") return swal("Warning!", "Truck no field cannot be empty", "info");
        if(oneStationData === null) return swal("Warning!", "Outlet field cannot be empty", "info");
        if(productSupply === "") return swal("Warning!", "Product type field cannot be empty", "info");
        if(selectedIncomingOrders === "") return swal("Warning!", "Incoming order field cannot be empty", "info");

        let discharged = 0;
        for(let data of selected){
            discharged = discharged + Number(data.addedQuantity);
        }

        if(typeof discharged === 'number' && discharged !== 0){

            const payload = {
                transportationName: transporter,
                wayBillNo: waybillNo,
                truckNo: truckNo,
                quantity: String(discharged),
                outletName: oneStationData?.outletName,
                productType: productSupply,
                shortage: shortage,
                overage: overage,
                incomingID: selectedIncomingOrders._id,
                date: "None",
                tankUpdate: selected,
                outletID: oneStationData?._id,
                organizationID: oneStationData?.organisation,
            }

            const newList = {...linkedData};
            newList.head.data.payload.push(payload);
            dispatch(passRecordSales(newList));

            setTransporter("");
            setWaybillNo("");
            setTruckNo("");
            setQuantityLoaded("");
            setProductSupply("");
            setSelected([]);
        
        }else{
            swal("Warning!", `Please add quantity to each tank. `, "info");
        }
    }

    const deleteFromList = (index) => {
        const newList = {...linkedData};
        newList.head.data.payload.pop(index);
        dispatch(passRecordSales(newList));
    }

    const searchWayBill = (e) => {
        dispatch(searchIncoming(e.target.value));
    }

    const getFilteredTanks = () => {
        const currentTankList = linkedData?.head?.prev?.data?.selectedTanks;
        const clonedTanks = [...tankList];

        for(let tank of currentTankList){
            const findID = clonedTanks.findIndex(data => data._id === tank._id);
            clonedTanks[findID] = tank;
        }

        console.log(clonedTanks, 'donee')

        const PMS = clonedTanks?.filter(data => data.productType === productSupply);
        const AGO = clonedTanks?.filter(data => data.productType === productSupply);
        const DPK = clonedTanks?.filter(data => data.productType === productSupply);

        if(productSupply === "PMS"){
            return PMS?.map(data => {
                return {...data, newLevel: 0, addedQuantity: 0}
            });
        }else if(productSupply === "AGO"){
            return AGO?.map(data => {
                return {...data, newLevel: 0, addedQuantity: 0}
            });
        }else{
            return DPK?.map(data => {
                return {...data, newLevel: 0, addedQuantity: 0}
            });
        }
    }

    const updatedTankSupply = (e) => {
        setQuantityLoaded(e.target.value);
        console.log(e.target.value, 'details')
    }

    return(
        <div className='inner-body'>
            <div className='left-supply'>

                <div style={{marginTop:'20px'}} className='double-form'>
                    <div className='input-d'>
                        <span style={{color:'green'}}>Waybill No</span>
                        <div style={{width: '95%', position:'relative'}}>
                            <div onClick={()=>setMenus(!menus)} className='text-field2'>
                                <span>{waybillNo}</span>
                                <KeyboardArrowDownIcon />
                            </div>
                            {menus &&
                                <div className="drop">
                                    <input onChange={(e => searchWayBill(e))} className="searches" type={'text'} placeholder="Search" />
                                    <div className="cons">
                                        {
                                            incomingOrder.map((data, index) => {
                                                return(
                                                    <span key={index} onClick={()=>{selectedIncomingOrder(data)}} className="ids">&nbsp;&nbsp;&nbsp;{`${data.wayBillNo}`}</span>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                    <div className='input-d'>
                        <span style={{color:'green'}}>Transporter</span>
                        <input disabled value={transporter} onChange={e => setTransporter(e.target.value)} className='text-field' type={'text'} />
                    </div>
                </div>

                <div style={{marginTop:'20px'}} className='single-form'>
                    <div className='input-d'>
                        <span style={{color:'green'}}>Truck No</span>
                        <input disabled value={truckNo} onChange={e => setTruckNo(e.target.value)} className='text-field' type={'text'} />
                    </div>
                </div>

                <div style={{marginTop:'20px'}} className='double-form'>
                    <div className='input-d'>
                        <span style={{color:'green'}}>Product Supply</span>
                        <input disabled value={productSupply} onChange={e => setProductSupply(e.target.value)} className='text-field' type={'text'} />
                    </div>

                    <div className='input-d'>
                        <span style={{color:'green'}}>Quantity Loaded</span>
                        <input disabled value={quantityLoaded} onChange={e => {updatedTankSupply(e)}} className='text-field' type={'text'} />
                    </div>
                </div>

                <div className='single-form'>
                    <div className='input-d'>
                        <span style={{color:'green'}}>Select tanks</span>
                        <MultiSelect
                            options={getFilteredTanks()}
                            value = {selected}
                            onChange = {setSelected}
                            className="multiple"
                        />
                    </div>
                </div>

                <div className="tanks">
                    {
                        selected.map((data, index) => {
                            return(
                                <div key={index} className="items">
                                    <span>{data.label}<span style={label}>(capacity: {data.tankCapacity})</span></span>
                                    <input 
                                        onChange={(e)=>{incomingTanks(e, data)}} 
                                        className="tank-input" type={'number'} 
                                        style={{width:'98%'}}
                                        placeholder={`Current level: ${data.fakeLevelThree}`}
                                    />
                                </div>
                            )
                        })
                    }
                </div>

                <div style={{marginTop:'20px'}} className='double-form'>
                    <div className='input-d'>
                        <span style={{color:'green'}}>Shortage</span>
                        <input value={shortage} disabled className='text-field' type={'text'} />
                    </div>

                    <div className='input-d'>
                        <span style={{color:'green'}}>Overage</span>
                        <input value={overage} disabled className='text-field' type={'text'} />
                    </div>
                </div>

                <div style={add}>
                    <Button sx={{
                        width:'140px', 
                        height:'30px',  
                        background: '#427BBE',
                        borderRadius: '3px',
                        fontSize:'11px',
                        '&:hover': {
                            backgroundColor: '#427BBE'
                        }
                        }}  
                        onClick={addDetailsToList}
                        variant="contained"> 
                        <AddIcon sx={{marginRight:'10px'}} /> Add to List
                    </Button>
                </div>
            </div>

            <div className='right-supply'>
                <div className="table-head">
                    <div className="col">S/N</div>
                    <div className="col">Transporter</div>
                    <div className="col">Product</div>
                    <div className="col">Quantity</div>
                    <div className="col">Action</div>
                </div>

                {
                    linkedData.head?.data?.payload?.length === 0?
                    <div style={{marginTop:'10px'}}>No data</div>:
                    linkedData.head?.data?.payload.map((data, index) => {
                        return(
                            <div key={index} style={{background: '#fff', marginTop:'5px'}} className="table-head">
                                <div style={{color:'#000'}} className="col">{index + 1}</div>
                                <div style={{color:'#000'}} className="col">{data?.transportationName}</div>
                                <div style={{color:'#000'}} className="col">{data?.productType}</div>
                                <div style={{color:'#000'}} className="col">{data?.quantity}</div>
                                <div style={{color:'#000'}} className="col">
                                    <img 
                                        onClick={()=>{deleteFromList(index)}} 
                                        style={{width:'22px', height:'22px'}} 
                                        src={hr8} 
                                        alt="icon" 
                                    />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

const label = {
    fontSize: '12px',
    marginLeft: '5px',
    fontWeight: '500',
    color: 'red'
}

const add = {
    width:'100%',
    display: 'flex',
    flexDirection:'row',
    justifyContent:'flex-start',
    marginTop:'30px'
}

export default SupplyComponent;