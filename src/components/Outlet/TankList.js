
import { MenuItem, Select, Stack, Switch } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OutletService from '../../services/outletService';
import { adminOutlet, getAllOutletTanks, getAllStations } from '../../store/actions/outlet';
import '../../styles/listTanks.scss';
import PMSTank from './TankSingleList/PMSTank.js';
import AGOTank from './TankSingleList/AGOTank.js';
import DPKTank from './TankSingleList/DPKTank.js';
import { styled } from '@mui/material/styles';
import swal from 'sweetalert';
import Button from '@mui/material/Button';
import { ThreeDots } from 'react-loader-spinner';
import ApproximateDecimal from '../common/approx';
import DailySalesService from '../../services/DailySales';
import {currentDateValue, overages } from '../../store/actions/dailySales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ButtonDatePicker from '../common/CustomDatePicker';
import { dateRange } from '../../store/actions/dashboard';

const ListAllTanks = () => {

    const date = new Date();
    const toString = date.toDateString();
    const [day, year, month] = toString.split(' ');
    const date2 = `${day} ${month} ${year}`;
    const [value, setValue] = React.useState(null);

    const moment = require('moment-timezone');
    const currentDate2 = useSelector(state => state.dailySalesReducer.currentDate);

    const tankList = useSelector(state => state.outletReducer.tankList);
    const {balances} = useSelector(state => state.dailySalesReducer.bulkReports);
    const user = useSelector(state => state.authReducer.user);
    const dispatch = useDispatch();
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const [defaultState, setDefault] = useState(0);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const [list, setList] = useState({
        PMS: [],
        AGO: [],
        DPK: []
    });
    const [supply, setSupply] = useState([]);
    const tankListType = useSelector(state => state.outletReducer.tankListType);
    const [loader, setLoader] = useState(false);
    
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
        return user.permission?.dailySales[e];
    }

    const getAllProductData = useCallback(() => {

        if(oneStationData !== null){
            if((getPerm('0') || getPerm('1') || user.userType === "superAdmin")){
                const findID = allOutlets.findIndex(data => data._id === oneStationData._id);
                setDefault(findID + 1);

                const payload = {
                    organisationID: resolveUserID().id,
                    outletID: oneStationData._id
                }

                OutletService.getAllOutletTanks(payload).then(data => {
                    dispatch(getAllOutletTanks(data.stations));
                    setLoader(false);
                });

                return
            }
        }

        setLoader(true);
        const payload = {
            organisation: resolveUserID().id, 
        }

        OutletService.getAllOutletStations(payload).then(data => {
            dispatch(getAllStations(data.station));
        }).then(()=>{
            const payload = {
                organisationID: resolveUserID().id,
                outletID: oneStationData === null? "None": oneStationData._id
            }
            OutletService.getAllOutletTanks(payload).then(data => {
                dispatch(getAllOutletTanks(data.stations));
                setLoader(false);
            });
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const getTanksLists = useCallback(() => {
        const PMS = tankList.filter(tank => tank.productType === "PMS");
        const AGO = tankList.filter(tank => tank.productType === "AGO");
        const DPK = tankList.filter(tank => tank.productType === "DPK");

        const today = moment().format('YYYY-MM-DD HH:mm:ss').split(' ')[0];
        if((today === currentDate2) || (currentDate2 === "")){
            const payload = {
                PMS: PMS,
                AGO: AGO,
                DPK: DPK
            }
    
            setList(payload);
        }else{

            getAndAnalyzeDailySales(oneStationData, false, currentDate2);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        setValue(currentDate2);
        getAllProductData();
    },[currentDate2, getAllProductData])

    useEffect(()=>{
        getTanksLists();
    }, [getTanksLists]);

    const changeMenu = (index, item ) => {
        setDefault(index);
        dispatch(adminOutlet(item));
        setLoader(true);

        const payload = {
            organisationID: resolveUserID().id,
            outletID: item === null? "None": item?._id
        }
        OutletService.getAllOutletTanks(payload).then(data => {
            dispatch(getAllOutletTanks(data.stations));
        }).then(()=>{
            setLoader(false);
        });

        const PMS = tankList.filter(tank => tank.productType === "PMS");
        const AGO = tankList.filter(tank => tank.productType === "AGO");
        const DPK = tankList.filter(tank => tank.productType === "DPK");

        const today = moment().format('YYYY-MM-DD HH:mm:ss').split(' ')[0];
        if((today === currentDate2) || (currentDate2 === "")){
            const payload = {
                PMS: PMS,
                AGO: AGO,
                DPK: DPK
            }
    
            setList(payload);
        }else{

            getAndAnalyzeDailySales(item, false, currentDate2);
        }
    }

    const refresh = () => {
        setLoader(true);
        const payload = {
            organisationID: resolveUserID().id,
            outletID: oneStationData === null? "None": oneStationData?._id
        }
        OutletService.getAllOutletTanks(payload).then(data => {
            dispatch(getAllOutletTanks(data.stations));
        }).then(()=>{
            setLoader(false);
        });
    }

    const IOSSwitch = styled((props) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
      ))(({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
          padding: 0,
          margin: 2,
          transitionDuration: '300ms',
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
              opacity: 1,
              border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.5,
            },
          },
          '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
          },
          '&.Mui-disabled .MuiSwitch-thumb': {
            color:
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[600],
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
          },
        },
        '& .MuiSwitch-thumb': {
          boxSizing: 'border-box',
          width: 22,
          height: 22,
        },
        '& .MuiSwitch-track': {
          borderRadius: 26 / 2,
          backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
          opacity: 1,
          transition: theme.transitions.create(['background-color'], {
            duration: 500,
          }),
        },
    }));

    const activateTank = (e, data) => {
        const payload = {
            id: data._id,
            activeState: e.target.checked? '1': '0'
        }
        OutletService.activateTanks(payload).then((data) => {
            if(data.code === 200) swal("Success!", "Tank active state updated successfully", "success");
            refresh();
        });
    }

    const deleteTank = (data) => {
        swal({
            title: "Alert!",
            text: `Are you sure you want to delete ${data.tankName}?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                const payload = {
                    id: data._id,
                }
                OutletService.deleteTanks(payload).then(data => {
                    if(data.code === 200) swal("Success!", "Tank deleted successfully", "success");
                    refresh();
                })
            }
        });
    }

    const getAndAnalyzeDailySales = async(data, status, value) => {
        setLoader(true);
        const salesPayload = {
            organisationID: resolveUserID().id,
            outletID: data === null? "None": data._id,
            onLoad: status,
            selectedDate: value
        }

        DailySalesService.getDailySalesDataAndAnalyze(salesPayload).then(async data => {
            dispatch(overages(data.dailyRecords.dipping));
            setSupply(data.dailyRecords.supply);
            const dipp = data.dailyRecords.dipping;

            let newDate;

            if(dipp.length === 0){
                if(balances.pms !== 0){
                    newDate = balances?.pms?.createdAt;
    
                }
                
                if(balances.ago !== 0){
                    newDate = balances?.ago?.createdAt;
    
                }
                
                if(balances.dpk !== 0){
                    newDate = balances?.dpk?.createdAt
                }

                const load = {
                    organisationID: resolveUserID().id,
                    outletID: oneStationData === null? "None": oneStationData._id,
                    onLoad: status,
                    selectedDate: newDate
                }

                await DailySalesService.getDailySalesDataAndAnalyze(load).then(data => {
                    dispatch(overages(data.dailyRecords.dipping));
                    setSupply(data.dailyRecords.supply);
                    const dipp = data.dailyRecords.dipping;

                    const payload = {
                        PMS: dipp.filter(data => data.productType === "PMS"),
                        AGO: dipp.filter(data => data.productType === "AGO"),
                        DPK: dipp.filter(data => data.productType === "DPK"),
                    }
                    
                    setList(payload);
                }).then(()=>{
                    setLoader(false);
                });

            }else{

                const payload = {
                    PMS: dipp.filter(data => data.productType === "PMS"),
                    AGO: dipp.filter(data => data.productType === "AGO"),
                    DPK: dipp.filter(data => data.productType === "DPK"),
                }
                
                setList(payload);
                setLoader(false);
            }
        });
    }

    const convertDate = (newValue) => {
        const getDate = newValue === ""? date2: newValue.format('MM/DD/YYYY');
        const date = new Date(getDate);
        const toString = date.toDateString();
        const [day, year, month] = toString.split(' ');
        const finalDate = `${day} ${month} ${year}`;

        return finalDate;
    }

    const updateDate = (newValue) => {
        // if(!getPerm('4')) return swal("Warning!", "Permission denied", "info");
        setValue(newValue);

        const getDate = newValue === ""? date2: newValue.format('YYYY-MM-DD');
        dispatch(currentDateValue(newValue));
        dispatch(dateRange([new Date(getDate), new Date(getDate)]));

        const PMS = tankList.filter(tank => tank.productType === "PMS");
        const AGO = tankList.filter(tank => tank.productType === "AGO");
        const DPK = tankList.filter(tank => tank.productType === "DPK");
        
        const today = moment().format('YYYY-MM-DD HH:mm:ss').split(' ')[0];
        
        if((today === getDate)){console.log(PMS, "ppppp")
            const payload = {
                PMS: PMS,
                AGO: AGO,
                DPK: DPK
            }
    
            setList(payload);
        }else{

            getAndAnalyzeDailySales(oneStationData, false, getDate);
        }
    }

    const checkSupply = (item) => {
        const filterSupply = supply.filter(data => item.tankID in data.recipientTanks);
        const supplyStatus = filterSupply.filter(data => data.priority === "0");

        const totalSupply = supplyStatus.reduce((accum, current) => {
            return Number(accum) + Number(current.recipientTanks[item.tankID]);
        }, 0);

        const today = moment().format('YYYY-MM-DD HH:mm:ss').split(' ')[0];
        
        if((today === currentDate2)){
            return Number(item.currentLevel);

        }else{

            return Number(item.afterSales) + totalSupply;
        }
    }

    return(
        <React.Fragment>
            <div className='listContainer'>
                <div style={{flexDirection: 'row', justifyContent: 'space-between'}} className='stat'>
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
                                    <MenuItem key={index} style={menu} onClick={()=>{changeMenu(index + 1, item)}} value={index + 1}>{item.outletName+ ', ' +item.city}</MenuItem>
                                )
                            })  
                        }
                    </Select>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={1}>
                            <ButtonDatePicker
                                label={`${
                                    value == null || "" ? date2 : convertDate(value)
                                }`}
                                value={value}
                                onChange={(newValue) => updateDate(newValue)}
                            />
                        </Stack>
                    </LocalizationProvider>
                </div>

                <div className='mains'>
                    {
                        loader?
                        <div style={tankss}>
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
                        <div className='inner-main'>    
                            {
                                tankListType === "PMS" &&
                                (list?.PMS.length === 0?
                                <div style={cover}>No Tank Record</div>:
                                list?.PMS?.map((item, index) => {
                                    return(
                                        <div key={index} className='item'>
                                            <div className='tank-cont'>
                                                <div className='top'>
                                                    <div className='left'>
                                                        <div>{item.tankName}</div>
                                                    </div>
                                                    <div className='right'>
                                                        <div>{item.activeState === '0'? 'Inactive': 'Active'}</div>
                                                        <IOSSwitch onClick={(e)=>{activateTank(e, item)}} sx={{ m: 1 }} defaultChecked={item.activeState === '0'? false: true} />
                                                    </div>
                                                </div>
                                                <PMSTank margin={'80px'} data={{PMSTankCapacity: Number(item.tankCapacity), totalPMS: Number(checkSupply(item)), PMSDeadStock: Number(item.deadStockLevel)}} />
                                                <div className='foot'>
                                                    <div className='tex'>
                                                        <div><span style={{color:'#07956A'}}>Level: </span> {ApproximateDecimal(checkSupply(item))} litres</div>
                                                        <div><span style={{color:'#07956A'}}>Capacity: </span> {ApproximateDecimal(item.tankCapacity)} litres</div>
                                                    </div>
                                                    <Button sx={{
                                                        width:'70px', 
                                                        height:'30px',  
                                                        background: '#D53620',
                                                        borderRadius: '3.11063px',
                                                        fontSize:'10px',
                                                        color:'#fff',
                                                        '&:hover': {
                                                            backgroundColor: '#D53620'
                                                        }
                                                        }} 
                                                        onClick={()=>{deleteTank(item)}}
                                                        variant="contained"> Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }))
                            }
                            {
                                tankListType === "AGO" &&
                                (list?.AGO.length === 0?
                                <div style={cover}>No Tank Record</div>:
                                list?.AGO?.map((item, index) => {
                                    return(
                                        <div className='item'>
                                        <div key={index} className='tank-cont'>
                                            <div className='top'>
                                                <div className='left'>
                                                    <div>{item.tankName}</div>
                                                </div>
                                                <div className='right'>
                                                    <div>{item.activeState === '0'? 'Inactive': 'Active'}</div>
                                                    <IOSSwitch onClick={(e)=>{activateTank(e, item)}} sx={{ m: 1 }} defaultChecked={item.activeState === '0'? false: true} />
                                                </div>
                                            </div>
                                            <AGOTank margin={'80px'} data={{AGOTankCapacity: Number(item.tankCapacity), totalAGO: Number(item.afterSales), AGODeadStock: Number(item.deadStockLevel)}} />
                                            <div className='foot'>
                                                <div className='tex'>
                                                    <div><span style={{color:'#07956A'}}>Level: </span> {ApproximateDecimal(item.afterSales)} litres</div>
                                                    <div><span style={{color:'#07956A'}}>Capacity: </span> {ApproximateDecimal(item.tankCapacity)} litres</div>
                                                </div>
                                                <Button sx={{
                                                    width:'70px', 
                                                    height:'30px',  
                                                    background: '#D53620',
                                                    borderRadius: '3.11063px',
                                                    fontSize:'10px',
                                                    color:'#fff',
                                                    '&:hover': {
                                                        backgroundColor: '#D53620'
                                                    }
                                                    }} 
                                                    onClick={()=>{deleteTank(item)}}
                                                    variant="contained"> Delete
                                                </Button>
                                            </div>
                                        </div>
                                        </div>
                                    )
                                }))
                            }
                            {
                                tankListType === "DPK" &&
                                (list?.DPK.length === 0?
                                <div style={cover}>No Tank Record</div>:
                                list?.DPK?.map((item, index) => {
                                    return(
                                        <div className='item'>
                                        <div key={index} className='tank-cont'>
                                            <div className='top'>
                                                <div className='left'>
                                                    <div>{item.tankName}</div>
                                                </div>
                                                <div className='right'>
                                                    <div>{item.activeState === '0'? 'Inactive': 'Active'}</div>
                                                    <IOSSwitch onClick={(e)=>{activateTank(e, item)}} sx={{ m: 1 }} defaultChecked={item.activeState === '0'? false: true} />
                                                </div>
                                            </div>
                                            <DPKTank margin={'80px'} data={{DPKTankCapacity: Number(item.tankCapacity), totalDPK: Number(item.afterSales), DPKDeadStock: Number(item.deadStockLevel)}} />
                                            <div className='foot'>
                                                <div className='tex'>
                                                    <div><span style={{color:'#07956A'}}>Level: </span> {ApproximateDecimal(item.afterSales)} litres</div>
                                                    <div><span style={{color:'#07956A'}}>Capacity: </span> {ApproximateDecimal(item.tankCapacity)} litres</div>
                                                </div>
                                                <Button sx={{
                                                    width:'70px', 
                                                    height:'30px',  
                                                    background: '#D53620',
                                                    borderRadius: '3.11063px',
                                                    fontSize:'10px',
                                                    color:'#fff',
                                                    '&:hover': {
                                                        backgroundColor: '#D53620'
                                                    }
                                                    }} 
                                                    onClick={()=>{deleteTank(item)}}
                                                    variant="contained"> Delete
                                                </Button>
                                            </div>
                                        </div>
                                        </div>
                                    )
                                }))
                            }
                        </div>
                        
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

const tankss = {
    width:'100%',
    height:'500px',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    fontSize:'16px',
    color:'green',
    fontWeight:'200'
}

const menu = {
    fontSize:'12px',
}

const selectStyle2 = {
    width:'200px', 
    height:'30px', 
    borderRadius:'0px',
    background: '#F2F1F1B2',
    color:'#000',
    fontSize:'12px',
    outline:'none',
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border:'1px solid #777777',
    },
}

const cover = {
    width:'100px',
    height: '20px',
    fontSize:'12px',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    marginTop:'5px',
    color:'green',
    fontWeight: '700'
}

export default ListAllTanks;