import React, { useRef, useState } from 'react';
import '../../styles/recordSales.scss';
import Button from '@mui/material/Button';
import { Switch, Route } from 'react-router-dom';
import Pumps from '../RecordSales/Pumps';
import LPO from '../RecordSales/LPO';
import Expenses from '../RecordSales/Expenses';
import Payments from '../RecordSales/Payment';
import OutletService from '../../services/outletService';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOutletTanks, getAllPumps, getAllStations, oneStation, adminOutlet } from '../../store/actions/outlet';
import Dipping from '../RecordSales/Dipping';
import { MenuItem, Select } from '@mui/material';
import { useCallback } from 'react';
import LPOService from '../../services/lpo';
import { createLPO } from '../../store/actions/lpo';
import { useEffect } from 'react';
import Supply from '../RecordSales/Supply';
import SupplyService from '../../services/supplyService';
import { pendingSupply } from '../../store/actions/supply';
import ReturnToTank from '../RecordSales/ReturnToTank';
import calendar from '../../assets/calendar.png';

const months = {
    '01' : 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
}

const RecordSales = (props) => {
    const date = new Date();
    const toString = date.toDateString();
    const [month, day, year] = toString.split(' ');
    const date2 = `${day} ${month} ${year}`;

    const dispatch = useDispatch();
    const dateHandle = useRef();
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const oneAdminOutlet = useSelector(state => state.outletReducer.adminOutlet);
    const user = useSelector(state => state.authReducer.user);
    const [defaultState, setDefault] = useState(0);
    const [currentDate, setCurrentDate] = useState(date2);

    const handleTabs = (data) => {
        if(data === 'pump'){
            props.history.push('/home/record-sales/pump');
        }else if(data === 'lpo'){
            props.history.push('/home/record-sales/lpo');
        }else if(data === 'expenses'){
            props.history.push('/home/record-sales/expenses');
        }else if(data === 'payment'){
            props.history.push('/home/record-sales/payment');
        }else if(data === 'dipping'){
            props.history.push('/home/record-sales/dipping');
        }else if(data === 'supply'){
            props.history.push('/home/record-sales/');
        }else if(data === 'rt'){
            props.history.push('/home/record-sales/rt');
        }
    }

    const getAllStationData = useCallback(() => {
        if(user.userType === "superAdmin"){
            OutletService.getAllOutletStations({organisation: user._id}).then(data => {
                dispatch(getAllStations(data.station));
                dispatch(oneStation(data.station[0]));
                setDefault(1);
                return data.station[0]
            }).then((data)=>{
                const payload = {
                    outletID: data._id, 
                    organisationID: data.organisation
                }
                
                OutletService.getAllStationPumps(payload).then(data => {
                    dispatch(getAllPumps(data));
                });
    
                OutletService.getAllOutletTanks(payload).then(data => {
                    dispatch(dispatch(getAllOutletTanks(data.stations)))
                });
    
                LPOService.getAllLPO(payload).then((data) => {
                    dispatch(createLPO(data.lpo.lpo));
                });
    
                SupplyService.getAllPendingSupply(payload).then(data => {
                    dispatch(pendingSupply(data.supply));
                });
            })
        }else{
            OutletService.getOneOutletStation({outletID: user.outletID}).then(data => {
                dispatch(adminOutlet(data.station));
                dispatch(oneStation(data.station));
                return data.station;
            }).then(data => {
                const payload = {
                    outletID: data._id, 
                    organisationID: data.organisation
                }
                
                OutletService.getAllStationPumps(payload).then(data => {
                    dispatch(getAllPumps(data));
                });
    
                OutletService.getAllOutletTanks(payload).then(data => {
                    dispatch(dispatch(getAllOutletTanks(data.stations)))
                });
    
                LPOService.getAllLPO(payload).then((data) => {
                    dispatch(createLPO(data.lpo.lpo));
                });
    
                SupplyService.getAllPendingSupply(payload).then(data => {
                    dispatch(pendingSupply(data.supply));
                });
            });
        }
        
    }, [user.userType, user._id, user.outletID, dispatch]);

    const refresh = () => {
        getAllStationData();
    }

    useEffect(()=>{
        getAllStationData()
    }, [getAllStationData])

    const changeMenu = (index, item ) => {
        setDefault(index);
        dispatch(oneStation(item));

        const payload = {
            outletID: item._id, 
            organisationID: item.organisation
        }

        OutletService.getAllStationPumps(payload).then(data => {
            dispatch(getAllPumps(data));
        });

        OutletService.getAllOutletTanks(payload).then(data => {
            dispatch(dispatch(getAllOutletTanks(data.stations)))
        })

        LPOService.getAllLPO(payload).then((data) => {
            dispatch(createLPO(data.lpo.lpo));
        });
    }

    const dateHandleInputDate = () => {
        dateHandle.current.showPicker();
    }

    const updateDate = (e) => {
        const date = e.target.value.split('-');
        const format = `${date[2]} ${months[date[1]]} ${date[0]}`;
        setCurrentDate(format);
    }

    return(
        <div className='salesContainer2'>
            <div className='inner'>
                <div style={{background:'green'}} className='second-select'>
                    <div>
                        {oneAdminOutlet.hasOwnProperty("outletName") ||
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={defaultState}
                                sx={selectStyle2}
                            >
                                <MenuItem style={menu} value={0}>Select Station</MenuItem>
                                {
                                    allOutlets.map((item, index) => {
                                        return(
                                            <MenuItem key={index} style={menu} onClick={()=>{changeMenu(index + 1, item)}} value={index + 1}>{item.outletName+ ', ' +item.city}</MenuItem>
                                        )
                                    })  
                                }
                            </Select>
                        }
                        {oneAdminOutlet.hasOwnProperty("outletName") &&
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={0}
                                sx={selectStyle2}
                                disabled
                            >
                                <MenuItem style={menu} value={0}>{oneAdminOutlet.hasOwnProperty("outletName")?oneAdminOutlet.outletName+", "+oneAdminOutlet.city: "No station created"}</MenuItem>
                            </Select>
                        }
                    </div>
                    <div>
                        <div style={{width:'100%', display:'flex', flexDirection:'row', justifyContent:'flex-end'}}>
                            <input onChange={updateDate} ref={dateHandle} style={{position:"absolute", marginTop:'10px', visibility:'hidden'}} type="date" />
                            <Button 
                                variant="contained" 
                                sx={{
                                    width:'170px',
                                    height:'30px',
                                    background:'#06805B',
                                    fontSize:'12px',
                                    borderRadius:'0px',
                                    textTransform:'capitalize',
                                    display:'flex',
                                    flexDirection:'row',
                                    alignItems:'center',
                                    '&:hover': {
                                        backgroundColor: '#06805B'
                                    }
                                }}
                                onClick={dateHandleInputDate}
                            >
                                <div style={{marginRight:'10px'}}>{currentDate}</div>
                                <img style={{width:'20px', height:'20px'}} src={calendar} alt="icon"/>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className='leftContainer'>
                    <div className='tabContainer'>
                        <div className='butContain'>
                            <Button sx={{
                                height:'35px',  
                                background: '#06805B',
                                borderRadius: '39px',
                                fontSize:'12px',
                                textTransform:'capitalize',
                                marginLeft:'10px',
                                marginTop:'10px',
                                '&:hover': {
                                    backgroundColor: '#06805B'
                                },
                                }}  
                                onClick={()=>{handleTabs('supply')}}
                                variant="contained"> Supply
                            </Button>
                            <Button sx={{
                                height:'35px',  
                                background: '#06805B',
                                borderRadius: '39px',
                                fontSize:'12px',
                                textTransform:'capitalize',
                                marginLeft:'10px',
                                marginTop:'10px',
                                '&:hover': {
                                    backgroundColor: '#06805B'
                                },
                                }}  
                                onClick={()=>{handleTabs('pump')}}
                                variant="contained"> Pump update
                            </Button>
                            <Button sx={{
                                height:'35px',  
                                background: '#06805B',
                                borderRadius: '39px',
                                fontSize:'12px',
                                textTransform:'capitalize',
                                marginLeft:'10px',
                                marginTop:'10px',
                                '&:hover': {
                                    backgroundColor: '#06805B'
                                },
                                }}  
                                onClick={()=>{handleTabs('rt')}}
                                variant="contained"> Return to Tank
                            </Button>
                            <Button sx={{
                                height:'35px',  
                                background: '#06805B',
                                borderRadius: '39px',
                                fontSize:'12px',
                                textTransform:'capitalize',
                                marginLeft:'10px',
                                marginTop:'10px',
                                '&:hover': {
                                    backgroundColor: '#06805B'
                                }
                                }}  
                                onClick={()=>{handleTabs('lpo')}}
                                variant="contained"> LPO
                            </Button>
                            <Button sx={{ 
                                height:'35px',  
                                background: '#06805B',
                                borderRadius: '39px',
                                fontSize:'12px',
                                textTransform:'capitalize',
                                marginLeft:'10px',
                                marginTop:'10px',
                                '&:hover': {
                                    backgroundColor: '#06805B'
                                }
                                }} 
                                onClick={()=>{handleTabs('expenses')}} 
                                variant="contained"> Expenses
                            </Button>
                            <Button sx={{ 
                                height:'35px',  
                                background: '#06805B',
                                borderRadius: '39px',
                                fontSize:'12px',
                                textTransform:'capitalize',
                                marginLeft:'10px',
                                marginTop:'10px',
                                '&:hover': {
                                    backgroundColor: '#06805B'
                                }
                                }} 
                                onClick={()=>{handleTabs('payment')}} 
                                variant="contained"> Payments
                            </Button>
                            <Button sx={{ 
                                height:'35px',  
                                background: '#06805B',
                                borderRadius: '39px',
                                fontSize:'12px',
                                textTransform:'capitalize',
                                marginLeft:'10px',
                                marginTop:'10px',
                                '&:hover': {
                                    backgroundColor: '#06805B'
                                }
                                }} 
                                onClick={()=>{handleTabs('dipping')}} 
                                variant="contained"> Dipping
                            </Button>
                        </div>
                    </div>

                    <div className='tabs-content'>
                        <Switch>
                            <Route exact path='/home/record-sales/'>
                                <Supply refresh = {refresh}/>
                            </Route>
                            <Route exact path='/home/record-sales/pump'>
                                <Pumps refresh = {refresh}/>
                            </Route>
                            <Route exact path='/home/record-sales/rt'>
                                <ReturnToTank refresh = {refresh}/>
                            </Route>
                            <Route path='/home/record-sales/lpo'>
                                <LPO refresh = {refresh}/>
                            </Route>
                            <Route path='/home/record-sales/expenses'>
                                <Expenses refresh = {refresh}/>
                            </Route>
                            <Route path='/home/record-sales/payment'>
                                <Payments refresh = {refresh}/>
                            </Route>
                            <Route path='/home/record-sales/dipping'>
                                <Dipping refresh = {refresh}/>
                            </Route>
                        </Switch>
                    </div>
                </div>
            </div>
        </div>
    )
}

const selectStyle2 = {
    width:'200px', 
    height:'35px', 
    borderRadius:'5px',
    background: '#F2F1F1B2',
    color:'#000',
    fontSize:'14px',
    outline:'none',
    marginTop:'10px',
    marginBottom:'20px',
    marginLeft:'10px',
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border: "1px solid #484850",
    },
}

const menu = {
    fontSize:'14px',
}

export default RecordSales;