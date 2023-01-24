
import { MenuItem, Select, Switch } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OutletService from '../../services/outletService';
import { adminOutlet, getAllOutletTanks, getAllStations } from '../../store/actions/outlet';
import '../../styles/listTanks.scss';
import PMSTank from './PMSTank';
import AGOTank from './AGOTank';
import DPKTank from './DPKTank';
import { styled } from '@mui/material/styles';
import swal from 'sweetalert';
import Button from '@mui/material/Button';

const ListAllTanks = () => {

    const tankList = useSelector(state => state.outletReducer.tankList);
    const user = useSelector(state => state.authReducer.user);
    const dispatch = useDispatch();
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const [defaultState, setDefault] = useState(0);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const [list, setList] = useState({});
    const tankListType = useSelector(state => state.outletReducer.tankListType);
    console.log(tankList, 'all')

    const resolveUserID = () => {
        if(user.userType === "superAdmin" || user.userType === "admin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
        }
    }

    const getAllProductData = useCallback(() => {

        const payload = {
            organisation: resolveUserID().id, 
        }

        OutletService.getAllOutletStations(payload).then(data => {
            dispatch(getAllStations(data.station));
        }).then((data)=>{
            const payload = {
                organisationID: resolveUserID().id,
                outletID: oneStationData === null? "None": oneStationData?._id
            }
            OutletService.getAllOutletTanks(payload).then(data => {
                dispatch(getAllOutletTanks(data.stations));
            });
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getTanksLists = useCallback(() => {
        const PMS = tankList.filter(tank => tank.productType === "PMS");
        const AGO = tankList.filter(tank => tank.productType === "AGO");
        const DPK = tankList.filter(tank => tank.productType === "DPK");

        const payload = {
            PMS: PMS,
            AGO: AGO,
            DPK: DPK
        }

        setList(payload);

    }, [tankList]);

    useEffect(()=>{
        getAllProductData();
    },[getAllProductData])

    useEffect(()=>{
        getTanksLists();
    }, [getTanksLists]);

    const changeMenu = (index, item ) => {
        setDefault(index);
        dispatch(adminOutlet(item));

        const payload = {
            organisationID: resolveUserID().id,
            outletID: item === null? "None": item?._id
        }
        OutletService.getAllOutletTanks(payload).then(data => {console.log(data, 'all tanks')
            dispatch(getAllOutletTanks(data.stations));
        });
    }

    const refresh = () => {
        const payload = {
            organisationID: resolveUserID().id,
            outletID: oneStationData === null? "None": oneStationData?._id
        }
        OutletService.getAllOutletTanks(payload).then(data => {
            dispatch(getAllOutletTanks(data.stations));
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

    return(
        <React.Fragment>
            <div className='listContainer'>
                <div className='stat'>
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
                </div>

                <div className='mains'>
                    <div className='inner-main'>    
                        {
                            !("PMS" in list)?
                            <div>No data records</div>:
                            tankListType === "PMS"?
                            list.PMS.map((item, index) => {
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
                                        <PMSTank data={{PMSTankCapacity: Number(item.tankCapacity), totalPMS: Number(item.currentLevel), PMSDeadStock: Number(item.deadStockLevel)}} />
                                        <div className='foot'>
                                            <div className='tex'>
                                                <div><span style={{color:'#07956A'}}>Level: </span> {item.currentLevel} litres</div>
                                                <div><span style={{color:'#07956A'}}>Capacity: </span> {item.tankCapacity} litres</div>
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
                            })
                            : tankListType === "AGO"?
                            list.AGO.map((item, index) => {
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
                                        <AGOTank data={{AGOTankCapacity: Number(item.tankCapacity), totalAGO: Number(item.currentLevel), AGODeadStock: Number(item.deadStockLevel)}} />
                                        <div className='foot'>
                                            <div className='tex'>
                                                <div><span style={{color:'#07956A'}}>Level: </span> {item.currentLevel} litres</div>
                                                <div><span style={{color:'#07956A'}}>Capacity: </span> {item.tankCapacity} litres</div>
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
                            })
                            : tankListType === "AGO"?
                            list.DPK.map((item, index) => {
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
                                        <DPKTank data={{DPKTankCapacity: Number(item.tankCapacity), totalDPK: Number(item.currentLevel), DPKDeadStock: Number(item.deadStockLevel)}} />
                                        <div className='foot'>
                                            <div className='tex'>
                                                <div><span style={{color:'#07956A'}}>Level: </span> {item.currentLevel} litres</div>
                                                <div><span style={{color:'#07956A'}}>Capacity: </span> {item.tankCapacity} litres</div>
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
                            }): <div style={tankss}>No Tank Created</div>
                        }
                    </div>
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
    fontFamily:'Nunito-Regular',
    color:'green',
    fontWeight:'200'
}

const menu = {
    fontSize:'14px',
    fontFamily:'Nunito-Regular'
}

const selectStyle2 = {
    width:'200px', 
    height:'35px', 
    borderRadius:'5px',
    background: '#F2F1F1B2',
    color:'#000',
    fontFamily: 'Nunito-Regular',
    fontSize:'14px',
    outline:'none'
}

export default ListAllTanks;