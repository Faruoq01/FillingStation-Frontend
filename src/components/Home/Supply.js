import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/payments.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import SupplyModal from '../Modals/SupplyModal';
import { createSupply, searchSupply } from '../../store/actions/supply';
import SupplyService from '../../services/supplyService';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import OutletService from '../../services/outletService';
import { adminOutlet, getAllOutletTanks, getAllStations } from '../../store/actions/outlet';
import { OutlinedInput } from '@mui/material';
import PrintSupplyRecords from '../Reports/SupplyRecords';
import { Route, Switch, useHistory } from 'react-router-dom';
import CreateSupply from '../Supply/CreateSupply';
import swal from "sweetalert";
import IncomingService from '../../services/IncomingService';
import { createIncomingOrder } from '../../store/actions/incomingOrder';
import { ThreeDots } from 'react-loader-spinner';

const mediaMatch = window.matchMedia('(max-width: 530px)');
const mobile = window.matchMedia('(max-width: 600px)');

const Supply = (props) => {

    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const [defaultState, setDefault] = useState(0);
    const user = useSelector(state => state.authReducer.user);
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const supply = useSelector(state => state.supplyReducer.supply);
    const [prints, setPrints] = useState(false);
    const [entries, setEntries] = useState(10);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(15);
    const [total, setTotal] = useState(0);
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
        return user.permission?.supply[e];
    }

    const openPaymentModal = () => {
        if(!getPerm('2')) return swal("Warning!", "Permission denied", "info");
        
        if(oneStationData === null){
            return swal("Warning!", "Please select a station to proceed", "info");
        }
        history.push("/home/supply/create");
    }

    const getAllSupplyData = useCallback(() => {

        if(oneStationData !== null){
            if((getPerm('0') || getPerm('1') || user.userType === "superAdmin")){
                const findID = allOutlets.findIndex(data => data._id === oneStationData._id);
                setDefault(findID + 1);
                
                const payload = {
                    skip: skip * limit,
                    limit: limit,
                    outletID: oneStationData._id, 
                    organisationID: resolveUserID().id,
                }
    
                SupplyService.getAllSupply(payload).then((data) => {
                    setLoading(false);
                    setTotal(data.count);
                    dispatch(createSupply(data.supply));
                });
    
                const payload2 = {
                    organisationID: resolveUserID().id,
                    outletID: oneStationData._id
                }

                OutletService.getAllOutletTanks(payload2).then(data => {
                    dispatch(getAllOutletTanks(data.stations));
                });

                return
            }
        }

        const payload = {
            organisation: resolveUserID().id
        }

        setLoading(true);
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
                organisationID: resolveUserID().id,
            }

            SupplyService.getAllSupply(payload).then((data) => {
                setLoading(false);
                setTotal(data.count);
                dispatch(createSupply(data.supply));
            });

            const payload2 = {
                organisationID: resolveUserID().id,
                outletID: data
            }
            OutletService.getAllOutletTanks(payload2).then(data => {
                dispatch(getAllOutletTanks(data.stations));
            });
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        getAllSupplyData();
    },[getAllSupplyData])

    const refresh = () => {
        setLoading(true);
        const payload = {
            skip: skip * limit,
            limit: limit,
            outletID: oneStationData?._id, 
            organisationID: resolveUserID().id,
        }

        SupplyService.getAllSupply(payload).then((data) => {
            setTotal(data.count);
            dispatch(createSupply(data.supply));
        }).then(()=>{
            setLoading(false);
        });

        const income = {
            outletID: oneStationData === null? "None": oneStationData?._id,
            organisationID: resolveUserID().id
        }
 
        IncomingService.getAllIncoming3(income).then((data) => {
            setTotal(data.incoming.count);
            dispatch(createIncomingOrder(data.incoming.incoming));
        });

        OutletService.getAllOutletTanks(income).then(data => {
            dispatch(getAllOutletTanks(data.stations));
        });
    }

    const changeMenu = (index, item ) => {
        if(!getPerm('1') && item === null) return swal("Warning!", "Permission denied", "info");
        setLoading(true);
        setDefault(index);
        dispatch(adminOutlet(item));

        const payload = {
            skip: skip * limit,
            limit: limit,
            outletID: item._id, 
            organisationID: resolveUserID().id,
        }

        SupplyService.getAllSupply(payload).then((data) => {
            setTotal(data.count);
            dispatch(createSupply(data.supply));
        }).then(()=>{
            setLoading(false);
        });

        const income = {
            outletID: item._id,
            organisationID: resolveUserID().id
        }
 
        IncomingService.getAllIncoming3(income).then((data) => {
            setTotal(data.incoming.count);
            dispatch(createIncomingOrder(data.incoming.incoming));
        });

        OutletService.getAllOutletTanks(income).then(data => {
            dispatch(getAllOutletTanks(data.stations));
        });
    }

    const searchTable = (value) => {
        dispatch(searchSupply(value));
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

    const goToHistory = () => {
        history.push('/home/history');
    }

    return(
        <div data-aos="zoom-in-down" className='paymentsCaontainer'>
            { <SupplyModal station={oneStationData} open={open} close={setOpen} refresh={refresh} />}
            { prints && <PrintSupplyRecords allOutlets={supply} open={prints} close={setPrints}/>}

            {props.activeRoute.split('/').length === 3 &&
                <div className='inner-pay'>
                <div className='action'>
                    <div style={{width:'150px'}} className='butt2'>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={10}
                            sx={{...selectStyle2, backgroundColor:"#06805B", color:'#fff'}}
                        >
                            <MenuItem style={menu} value={10}>Action</MenuItem>
                            <MenuItem style={menu} onClick={openPaymentModal} value={20}>Add Supply</MenuItem>
                            <MenuItem style={menu} value={30}>History</MenuItem>
                            <MenuItem style={menu} onClick={printReport} value={40}>Print</MenuItem>
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
                    <div style={{width:'100px'}} className='butt'>
                        <Button sx={{
                            width:'100%', 
                            height:'30px',  
                            background: '#427BBE',
                            borderRadius: '0px',
                            fontSize:'11px',
                            textTransform:'capitalize',
                            '&:hover': {
                                backgroundColor: '#427BBE'
                            }
                            }}  
                            onClick={openPaymentModal}
                            variant="contained"> Add Supply
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
                            fontSize:'10px',
                            display: mediaMatch.matches && 'none',
                            marginTop: mediaMatch.matches? '10px': '0px',
                            '&:hover': {
                                backgroundColor: '#58A0DF'
                            }
                            }}  
                            onClick={goToHistory}
                            variant="contained"> History
                        </Button>
                        <Button sx={{
                            width: mediaMatch.matches? '100%': '80px', 
                            height:'30px',  
                            background: '#F36A4C',
                            borderRadius: '0px',
                            fontSize:'10px',
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
                    supply.length === 0?
                    <div style={place}>No data</div>:
                    supply.map((item, index) => {
                        return(
                            <div key={index} className='mobile-table-container'>
                                <div className="inner-container">
                                    <div className='row'>
                                        <div className='left-text'>
                                            <div className='heads'>{item.transportationName}</div>
                                            <div className='foots'>Transporter</div>
                                        </div>
                                        <div className='right-text'>
                                            <div className='heads'>{item.wayBillNo}</div>
                                            <div className='foots'>Waybill No</div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='left-text'>
                                            <div className='heads'>{item.truckNo}</div>
                                            <div className='foots'>Truck No</div>
                                        </div>
                                        <div className='right-text'>
                                            <div className='heads'>{item.productType}</div>
                                            <div className='foots'>Product</div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='left-text'>
                                            <div className='heads'>{item.outletName}</div>
                                            <div className='foots'>Station</div>
                                        </div>
                                        <div className='right-text'>
                                            <div className='heads'>{item.quantity}</div>
                                            <div className='foots'>Quantity</div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='left-text'>
                                            <div className='heads'>{item.shortage}</div>
                                            <div className='foots'>Shortage</div>
                                        </div>
                                        <div className='right-text'>
                                            <div className='heads'>{item.overage}</div>
                                            <div className='foots'>Overage</div>
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
                            <div className='column'>Date</div>
                            <div className='column'>Transporter</div>
                            <div className='column'>Truck No</div>
                            <div className='column'>Waybill No</div>
                            <div className='column'>Station</div>
                            <div className='column'>Product Supply</div>
                            <div className='column'>Quantity</div>
                            <div className='column'>Shortage</div>
                            <div className='column'>Overage</div>
                        </div>

                        <div className='row-container'>
                            {
                                !loading?
                                supply.length === 0?
                                <div style={place}>No supply data</div>:
                                supply.map((data, index) => {
                                    return(
                                        <div className='table-head2'>
                                            <div className='column'>{index + 1}</div>
                                            <div className='column'>{data.date}</div>
                                            <div className='column'>{data.transportationName}</div>
                                            <div className='column'>{data.truckNo}</div>
                                            <div className='column'>{data.wayBillNo}</div>
                                            <div className='column'>{data.outletName}</div>
                                            <div className='column'>{data.productType}</div>
                                            <div className='column'>{data.quantity}</div>
                                            <div className='column'>{data.shortage}</div>
                                            <div className='column'>{data.overage}</div>
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
            }

            { props.activeRoute.split('/').length === 4 &&
                <div style={{width:'100%', marginTop:'30px'}}>
                    <Switch>
                        <Route path='/home/supply/create'>
                            <CreateSupply refresh={refresh} history={props.history}/>
                        </Route>
                    </Switch>
                </div>
            }
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

export default Supply;