import React, {useState, useCallback, useEffect} from 'react';
import '../../styles/payments.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import IncomingOrderModal from '../Modals/IncomingOrderModal';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {createIncomingOrder, searchIncoming} from '../../store/actions/incomingOrder';
import IncomingService from '../../services/IncomingService';
import OutletService from '../../services/outletService';
import { adminOutlet, getAllStations } from '../../store/actions/outlet';
import IncomingReport from '../Reports/IncomingReport';
import swal from 'sweetalert';
import { ThreeDots } from 'react-loader-spinner';

const mediaMatch = window.matchMedia('(max-width: 530px)');
const mobile = window.matchMedia('(max-width: 600px)');

const IncomingOrder = () => {

    const user = useSelector(state => state.authReducer.user);
    const incomingOrder = useSelector(state => state.incomingOrderReducer.incomingOrder);
    const dispatch = useDispatch();
    const [defaultState, setDefault] = useState(0);
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const [entries, setEntries] = useState(10);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(15);
    const [total, setTotal] = useState(0);
    const [prints, setPrints] = useState(false);
    const [loading, setLoading] = useState(false);

    const resolveUserID = () => {
        if(user.userType === "superAdmin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
        }
    }

    const getPerm = (e) => {
        if(user.userType === "superAdmin"){
            return true;
        }
        return user.permission?.incomingOrder[e];
    }

    const [open, setOpen] = useState(false);

    const openCreateModal = () => {
        if(!getPerm('2')) return swal("Warning!", "Permission denied", "info");
        setOpen(true);
    }

    const getAllIncomingOrder = useCallback(() => {

        if(oneStationData !== null){
            if((getPerm('0') || getPerm('1') || user.userType === "superAdmin")){
                const findID = allOutlets.findIndex(data => data._id === oneStationData._id);
                setDefault(findID + 1);

                const payload = {
                    skip: skip * limit,
                    limit: limit,
                    outletID: oneStationData._id, 
                    organisationID: resolveUserID().id
                }
    
                IncomingService.getAllIncoming(payload).then((data) => {
                    setLoading(false);
                    setTotal(data.incoming.count);
                    dispatch(createIncomingOrder(data.incoming.incoming));
                });

                return
            }
        }

        setLoading(true);
        const payload = {
            organisation: resolveUserID().id
        }

        OutletService.getAllOutletStations(payload).then(data => {
            dispatch(getAllStations(data.station));
            if((getPerm('0') || user.userType === "superAdmin") && oneStationData === null){
                if(!getPerm('1')) setDefault(1);
                dispatch(adminOutlet(null));
                return "None";
            }else{

                OutletService.getOneOutletStation({outletID: user.outletID}).then(data => {
                    dispatch(adminOutlet(data.station));
                });
                
                return user.outletID;
            }
        }).then((data)=>{
            const payload = {
                skip: skip * limit,
                limit: limit,
                outletID: data, 
                organisationID: resolveUserID().id
            }

            IncomingService.getAllIncoming(payload).then((data) => {
                setLoading(false);
                setTotal(data.incoming.count);
                dispatch(createIncomingOrder(data.incoming.incoming));
            });
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        getAllIncomingOrder();
    },[getAllIncomingOrder])

    const refresh = () => {
        setLoading(true);
        const payload = {
            skip: skip * limit,
            limit: limit,
            outletID: oneStationData === null? "None": oneStationData?._id,
            organisationID: resolveUserID().id
        }
 
        IncomingService.getAllIncoming(payload).then((data) => {
            setTotal(data.incoming.count);
            dispatch(createIncomingOrder(data.incoming.incoming));
        }).then(()=>{
            setLoading(false);
        })
    }

    const changeMenu = (index, item ) => {
        if(!getPerm('1') && item === null) return swal("Warning!", "Permission denied", "info");
        setLoading(true);
        setDefault(index);
        dispatch(adminOutlet(item));

        const payload = {
            skip: skip * limit,
            limit: limit,
            outletID: item === null? "None": item?._id,
            organisationID: resolveUserID().id
        }
        
        IncomingService.getAllIncoming(payload).then((data) => {console.log(data, "incoming")
            setTotal(data.incoming.count);
            dispatch(createIncomingOrder(data.incoming.incoming));
        }).then(()=>{
            setLoading(false);
        })
    }

    const searchTable = (value) => {
        dispatch(searchIncoming(value));
    }

    const printReport = () => {
        if(!getPerm('3')) return swal("Warning!", "Permission denied", "info");
        setPrints(true);
    }

    const entriesMenu = (value, limit) => {
        setEntries(value);
        setLimit(limit);
        refresh();
    }

    const nextPage = () => {
        if(!(skip < 0)){
            setSkip(prev => prev + 1)
        }
        refresh();
    }

    const prevPage = () => {
        if(!(skip <= 0)){
            setSkip(prev => prev - 1)
        } 
        refresh();
    }

    return(
        <div data-aos="zoom-in-down" className='paymentsCaontainer'>
            { <IncomingOrderModal station={oneStationData} open={open} close={setOpen} refresh={refresh} />}
            { prints && <IncomingReport allOutlets={incomingOrder} open={prints} close={setPrints}/>}
            <div className='inner-pay'>
                <div className='action'>
                    <div style={{width:'150px'}} className='butt2'>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={10}
                            sx={{...selectStyle2, backgroundColor:"#06805B", color:'#fff'}}
                        >
                            <MenuItem value={10}>Action</MenuItem>
                            <MenuItem onClick={openCreateModal} value={20}>Create Incoming Order</MenuItem>
                            <MenuItem value={30}>Download PDF</MenuItem>
                            <MenuItem value={40}>Print</MenuItem>
                        </Select>
                    </div>
                </div>

                <div className='search'>
                    <div className='input-cont'>
                        <div className='second-select'>
                            {getPerm('0') &&
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={defaultState}
                                    sx={selectStyle2}
                                >
                                    <MenuItem onClick={()=>{changeMenu(0, null)}} style={menu} value={0}>All Stations</MenuItem>
                                    {
                                        allOutlets.map((item, index) => {
                                            return(
                                                <MenuItem key={index} style={menu} onClick={()=>{changeMenu(index + 1, item)}} value={index + 1}>{item.outletName+ ', ' +item.alias}</MenuItem>
                                            )
                                        })  
                                    }
                                </Select>
                            }
                            {getPerm('0') ||
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={0}
                                    sx={selectStyle2}
                                    disabled
                                >
                                    <MenuItem style={menu} value={0}>{!getPerm('0')? oneStationData?.outletName+", "+oneStationData?.alias: "No station created"}</MenuItem>
                                </Select>
                            }
                        </div>
                        <div className='second-select'>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px',  
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} 
                                    type='text'
                                    placeholder="Search" 
                                    onChange={(e) => {searchTable(e.target.value)}}
                                />
                        </div>
                    </div>
                    <div style={{width:'180px'}} className='butt'>
                        <Button sx={{
                            width:'100%', 
                            height:'30px',  
                            background: '#427BBE',
                            borderRadius: '0px',
                            fontSize:'12px',
                            textTransform:'capitalize',
                            '&:hover': {
                                backgroundColor: '#427BBE'
                            }
                            }}  
                            onClick={openCreateModal}
                            variant="contained"> Create Incoming Order
                        </Button>
                    </div>
                </div>

                <div className='search2'>
                    <div className='butt2'>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={entries}
                            sx={selectStyle2}
                        >
                            <MenuItem style={menu} value={10}>Show entries</MenuItem>
                            <MenuItem onClick={()=>{entriesMenu(20, 15)}} style={menu} value={20}>15 entries</MenuItem>
                            <MenuItem onClick={()=>{entriesMenu(30, 30)}} style={menu} value={30}>30 entries</MenuItem>
                            <MenuItem onClick={()=>{entriesMenu(40, 100)}} style={menu} value={40}>100 entries</MenuItem>
                        </Select>
                    </div>
                    <div style={{width: mediaMatch.matches? '100%': '190px'}} className='input-cont2'>
                        <Button sx={{
                            width: mediaMatch.matches? '100%': '100px', 
                            height:'30px',  
                            background: '#58A0DF',
                            borderRadius: '0px',
                            fontSize:'12px',
                            textTransform:'capitalize',
                            display: mediaMatch.matches && 'none',
                            marginTop: mediaMatch.matches? '10px': '0px',
                            '&:hover': {
                                backgroundColor: '#58A0DF'
                            }
                            }}  variant="contained"> History
                        </Button>
                        <Button sx={{
                            width: mediaMatch.matches? '100%': '80px', 
                            height:'30px',  
                            textTransform:'capitalize',
                            background: '#F36A4C',
                            borderRadius: '3px',
                            fontSize:'12px',
                            display: mediaMatch.matches && 'none',
                            marginTop: mediaMatch.matches? '10px': '0px',
                            '&:hover': {
                                backgroundColor: '#F36A4C'
                            }
                            }}  
                            onClick={printReport}
                            variant="contained"> Print
                        </Button>
                    </div>
                </div>

                {
                    mobile.matches?
                    !loading?
                    incomingOrder.length === 0?
                    <div style={place}>No data</div>:
                    incomingOrder.map((item, index) => {
                        return(
                            <div key={index} className='mobile-table-container'>
                                <div className="inner-container">
                                    <div className='row'>
                                        <div className='left-text'>
                                            <div className='heads'>{item.depotStation}</div>
                                            <div className='foots'>Depot Station</div>
                                        </div>
                                        <div className='right-text'>
                                            <div className='heads'>{item.destination}</div>
                                            <div className='foots'>Discharge Station</div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='left-text'>
                                            <div className='heads'>{item.product}</div>
                                            <div className='foots'>Product</div>
                                        </div>
                                        <div className='right-text'>
                                            <div className='heads'>{item.quantity}</div>
                                            <div className='foots'>Loaded Quantity</div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='left-text'>
                                            <div className='heads'>{item.truckNo}</div>
                                            <div className='foots'>Truck No</div>
                                        </div>
                                        <div className='right-text'>
                                            <div className='heads'>{item.wayBillNo}</div>
                                            <div className='foots'>Waybill No</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }):<div style={load}>
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
                    </div>:

                    <div className='table-container'>
                        <div className='table-head'>
                            <div className='column'>S/N</div>
                            <div className='column'>Date Created</div>
                            <div className='column'>Depot Station</div>
                            <div className='column'>Discharge Station</div>
                            <div className='column'>Products</div>
                            <div className='column'>Quantity</div>
                            <div className='column'>Truck No</div>
                            <div className='column'>Waybill No</div>
                            <div className='column'>Delivery Status</div>
                        </div>

                        <div className='row-container'>

                            {
                                !loading?
                                incomingOrder.length === 0?
                                <div style={place}>No Incoming Data</div>:
                                incomingOrder.map((data, index) => {
                                    return(
                                        <div key={index} className='table-head2'>
                                            <div className='column'>{index + 1}</div>
                                            <div className='column'>{data.dateCreated}</div>
                                            <div className='column'>{data.depotStation}</div>
                                            <div className='column'>{data.destination}</div>
                                            <div className='column'>{data.product}</div>
                                            <div className='column'>{data.quantity}</div>
                                            <div className='column'>{data.truckNo}</div>
                                            <div className='column'>{data.wayBillNo}</div>
                                            <div className='column'>{data.deliveryStatus}</div>
                                        </div>
                                    )
                                }):<div style={load}>
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
                                </div>
                            }
                        </div>
                    </div>
                }

                <div className='footer'>
                    <div style={{fontSize:'12px'}}>
                        Showing {((skip + 1) * limit) - (limit-1)} to {(skip + 1) * limit} of {total} entries
                    </div>
                    <div className='nav'>
                        <button onClick={prevPage} className='but'>Previous</button>
                        <div className='num'>{skip + 1}</div>
                        <button onClick={nextPage} className='but2'>Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const selectStyle2 = {
    width:'100%', 
    height:'35px', 
    borderRadius:'0px',
    background: '#F2F1F1B2',
    color:'#000',
    fontSize:'12px',
    outline:'none',
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border:'1px solid #777777',
    },
}

const place = {
    width:'100%',
    textAlign:'center',
    fontSize:'12px',
    marginTop:'20px',
    color:'green'
}

const menu = {
    fontSize:'12px',
}

const load = {
    width: '100%',
    height:'30px',
    display:'flex',
    justifyContent:'center',
}

export default IncomingOrder;