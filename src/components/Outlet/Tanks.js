import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/tanks.scss';
import me5 from '../../assets/me5.png';
import me6 from '../../assets/me6.png';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import { openModal, getAllOutletTanks, getOneTank } from '../../store/actions/outlet';
import { useDispatch } from 'react-redux';
import AddTank from '../Modals/AddTankModal';
import { useSelector } from 'react-redux';
import OutletService from '../../services/outletService';
import swal from 'sweetalert';
import AddPump from '../Modals/AddPumpModal';
import EditTank from '../Modals/EditTank';
import { ThreeDots } from 'react-loader-spinner';

const Tank = (props) => {

    const [tabs, setTabs] = useState(0);
    const [PMSTank, setPMSTank] = useState([]);
    const [AGOTank, setAGOTank] = useState([]);
    const [DPKTank, setDPKTank] = useState([]);
    const [activeTank, setActiveTank] = useState([]);
    const [inActiveTank, setInactiveTank] = useState([]);
    const open = useSelector(state => state.outletReducer.openModal);
    const tankList = useSelector(state => state.outletReducer.tankList);
    const oneStation = useSelector(state => state.outletReducer.adminOutlet);
    const dispatch = useDispatch();
    const [show, setShow] = useState("");
    const [openEditTank, setOpenEditTank] = useState(false);
    const [currentTank, setCurrentTank] = useState({});
    const [loading, setLoading] = useState(false);
    const user = useSelector(state => state.authReducer.user);

    const getPerm = (e) => {
        if(user.userType === "superAdmin"){
            return true;
        }
        return user.permission?.myStation[e];
    }

    const handleAddTanks = () => {
        if(!getPerm('2')) return swal("Warning!", "Permission denied", "info");
        dispatch(openModal(2));
    }

    const getAllStationTanks = useCallback(() => {
        setLoading(true);
        const payload = {
            organisationID: oneStation?.organisation,
            outletID: oneStation?._id
        }
        OutletService.getAllOutletTanks(payload).then(data => {
            dispatch(getAllOutletTanks(data.stations));
        }).then(()=>{
            setLoading(false);
        });
    }, [oneStation?._id, oneStation?.organisation, dispatch]);

    useEffect(()=>{
        getAllStationTanks();
    },[getAllStationTanks]);

    useEffect(()=>{
        getSeparateTanks(tankList);
    },[tankList]);

    const getSeparateTanks = (data) => {

        const PMS = [];
        const AGO = [];
        const DPK = [];
        const activeTank = [];
        const inActiveTank = [];

        for(let item of data){
            item.productType === 'PMS' && PMS.push(item);
            item.productType === 'AGO' && AGO.push(item);
            item.productType === 'DPK' && DPK.push(item);
            item.activeState === '0' || activeTank.push(item);
            item.activeState === '0' && inActiveTank.push(item);
        }

        setPMSTank(PMS);
        setAGOTank(AGO);
        setDPKTank(DPK);
        setActiveTank(activeTank.length);
        setInactiveTank(inActiveTank.length);
    }

    const activateTank = (e, data) => {
        const payload = {
            id: data._id,
            activeState: e.target.checked? '1': '0'
        }
        OutletService.activateTanks(payload).then((data) => {
            if(data.code === 200) swal("Success!", "Tank active state updated successfully", "success");
            getAllStationTanks();
        });
    }

    const deleteTanks = (data) => {
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
                    getAllStationTanks();
                })
            }
        });
    }

    const actionOnTanks = (data) => {
        if(show === data._id){
            setShow("");
        }else{
            setShow(data._id);
        }
    }

    const handleMenuItem = (e, data) => {
        if(e === "delete"){
            if(!getPerm('6')) return swal("Warning!", "Permission denied", "info");
            deleteTanks(data);
            setShow("");

        }else{
            if(!getPerm('5')) return swal("Warning!", "Permission denied", "info");
            setCurrentTank(data);
            setOpenEditTank(true);
            setShow("");
        }
    }

    const addNewPump = (data) => {
        if(!getPerm('3')) return swal("Warning!", "Permission denied", "info");
        dispatch(getOneTank(data));
        dispatch(openModal(3));
    }

    const CardItem = (props) => {
        return(
            <div style={{height:"400px"}} className='item'>
                <div className='inner'>
                    <div className='top'>
                        <div className='left'>
                            <img style={{width:'40px', height:'40px'}} src={me5} alt="icon" />
                            <div style={{fontWeight:'500'}}>{props.data.tankName} ({props.data.productType}) </div>
                        </div>
                        <div className='right'>
                            <div>{props.data.activeState === '0'? 'Inactive': 'Active'}</div>
                            <IOSSwitch onClick={(e)=>{activateTank(e, props.data)}} sx={{ m: 1 }} defaultChecked={props.data.activeState === '0'? false: true} />
                        </div>
                    </div>

                    <div className='out'>
                        <div style={{width:'40%', textAlign:'left', fontWeight:'400'}}>Dead Stock Level(Litres)</div>
                        <OutlinedInput 
                            placeholder="" 
                            sx={{
                                width:'60%',
                                height:'35px', 
                                fontSize:'12px',
                                background:'#F2F1F1',
                                color:'#000'
                            }} 
                            value={props.data.deadStockLevel}
                        />
                    </div>

                    <div className='out'>
                        <div style={{width:'40%', textAlign:'left', fontWeight:'400'}}>Tank Capacity (Litres)</div>
                        <OutlinedInput 
                            placeholder="" 
                            sx={{
                                width:'60%',
                                height:'35px', 
                                fontSize:'12px',
                                background:'#F2F1F1',
                                color:'#000'
                            }} 
                            value={props.data.tankCapacity}
                        />
                    </div>

                    <div className='out'>
                        <div style={{width:'40%', textAlign:'left', fontWeight:'400'}}>Tank ID</div>
                        <OutlinedInput 
                            placeholder="" 
                            sx={{
                                width:'60%',
                                height:'35px', 
                                fontSize:'12px',
                                background:'#F2F1F1',
                                color:'#000'
                            }} 
                            value={props.data._id}
                        />
                    </div>

                    <div className='out'>
                        <div style={{width:'40%', textAlign:'left', fontWeight:'400'}}>Current Stock Level (Litres)</div>
                        <OutlinedInput 
                            placeholder="" 
                            sx={{
                                width:'60%',
                                height:'35px', 
                                fontSize:'12px',
                                background:'#F2F1F1',
                                color:'#000'
                            }} 
                            value={props.data.currentLevel}
                        />
                    </div>

                    <div className='out'>
                        <div style={{width:'40%', textAlign:'left', fontWeight:'400'}}>Calibration Date</div>
                        <OutlinedInput 
                            placeholder="" 
                            sx={{
                                width:'60%',
                                height:'35px', 
                                fontSize:'12px',
                                background:'#F2F1F1',
                                color:'#000'
                            }}
                            value={props.data.calibrationDate} 
                        />
                    </div>

                    <div style={{marginTop:'20px'}} className='delete'>
                        <Button sx={{
                            width:'90px', 
                            height:'30px',  
                            background: '#06805B',
                            borderRadius: '3px',
                            fontSize:'10px',
                            color:'#fff',
                            '&:hover': {
                                backgroundColor: '#06805B'
                            }
                            }} 
                            onClick={()=>{addNewPump(props.data)}}
                            variant="contained"> Add Pump
                        </Button>
                        <Button sx={{
                            width:'70px', 
                            height:'30px',  
                            background: '#ff6347 ',
                            borderRadius: '3px',
                            fontSize:'10px',
                            color:'#fff',
                            marginLeft:'10px',
                            position:'relative',
                            '&:hover': {
                                backgroundColor: '#ff6347 '
                            }
                            }} 
                            onClick={()=>{actionOnTanks(props.data)}}
                            variant="contained"> Action
                        </Button>

                        {show === props.data._id &&
                            <div style={menus}>
                                <div onClick={()=>{handleMenuItem("edit", props.data)}} style={menuItem}>Edit</div>
                                <div onClick={()=>{handleMenuItem("delete", props.data)}} style={{
                                    ...menuItem, 
                                    border:'1px solid #d7d7d7', 
                                    borderLeft:'none', 
                                    borderRight:'none',
                                    borderBottom:'none',
                                }}>Delete</div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }

    const AllTabs = () => {
        return(
            <div className='space'>
                {
                    loading?
                    <div style={{width:'100%', display:'flex', flexDirection:'row', justifyContent:'center'}}>
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
                    tankList.length === 0?
                    <div style={place}>No records of tanks</div>:
                    tankList.map((item, index) => {
                        return(
                            <CardItem key={index} data={item} />
                        )
                    })
                }
            </div>
        )
    }

    const PMSTabs = () => {
        return(
            <div className='space'>
                {
                    PMSTank.length === 0?
                    <div style={place}>No records of tanks</div>:
                    PMSTank.map((item, index) => {
                        return(
                            <CardItem key={index} data={item} />
                        )
                    })
                }
            </div>
        )
    }

    const AGOTabs = () => {
        return(
            <div className='space'>
                {
                    AGOTank.length === 0?
                    <div style={place}>No records of tanks</div>:
                    AGOTank.map((item, index) => {
                        return(
                            <CardItem key={index} data={item} />
                        )
                    })
                }
            </div>
        )
    }

    const DPKTabs = () => {
        return(
            <div className='space'>
                {
                    DPKTank.length === 0?
                    <div style={place}>No records of tanks</div>:
                    DPKTank.map((item, index) => {
                        return(
                            <CardItem key={index} data={item} />
                        )
                    })
                }
            </div>
        )
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

    const DashboardImage = (props) => {
        return(
            <div className='first-image'>
                <div style={{marginRight:'10px'}} className='inner-first-image'>
                    <div className='top-first-image'>
                        <div className='top-icon'>
                            <img style={{width:'60px', height:'50px'}} src={props.image} alt="icon" />
                        </div>
                        <div style={{justifyContent:'flex-end'}} className='top-text'>
                            <div style={{fontSize:'14px'}}>{props.name}</div>
                            <div style={{fontSize:'18px', fontWeight:'bold', marginLeft:'20px'}}>{props.value}</div>
                        </div>
                    </div>
                    <div className='bottom-first-image'>
                        <img style={{width:'30px', height:'10px'}} src={me6} alt="icon" />
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div className='tanksContainer'>
            { open ===2 && <AddTank tabs={tabs} data={oneStation?.state} refresh={getAllStationTanks} outRefresh={props.refresh} /> }
            { open ===3 && <AddPump tabs={tabs} allTank={tankList} outRefresh={props.refresh} /> }
            { openEditTank && <EditTank tabs={tabs} open={openEditTank} close={setOpenEditTank} data = {currentTank} refresh={getAllStationTanks} outRefresh={props.refresh} /> }
            <div className='pump-container'>
                <div className='head'>
                    <div className='tabs'>
                        <div onClick={()=>{setTabs(0)}} style={tabs === 0? tab1 : tab2}>All</div>
                        <div onClick={()=>{setTabs(1)}} style={tabs === 1? tab1 : tab2}>PMS</div>
                        <div onClick={()=>{setTabs(2)}} style={tabs === 2? tab1 : tab2}>AGO</div>
                        <div onClick={()=>{setTabs(3)}} style={tabs === 3? tab1 : tab2}>DPK</div>
                    </div>
                </div>
                <div className='cont'>
                    {tabs === 0 && <AllTabs /> }
                    {tabs === 1 && <PMSTabs /> }
                    {tabs === 2 && <AGOTabs /> }
                    {tabs === 3 && <DPKTabs /> }
                </div>
            </div>

            <div className='create-pump'>
                <Button sx={{
                    width:'100%', 
                    height:'30px',  
                    background: '#3471B9',
                    borderRadius: '3px',
                    fontSize:'10px',
                    color:'#fff',
                    '&:hover': {
                        backgroundColor: '#3471B9'
                    }
                }} 
                    onClick={handleAddTanks}
                    variant="contained"> Add Tanks to Outlet
                </Button>
                <DashboardImage image={me5} name={'Active tank'} value={activeTank} />
                <DashboardImage image={me5} name={'Inactive tank'} value={inActiveTank} />
            </div>
        </div>
    )
}

const menus = {
    width:'100px',
    height: '70px',
    background:'#fff',
    position: 'absolute',
    zIndex:'20',
    marginTop:'40px',
    boxShadow: '0px 0px 3px 1px'
}

const menuItem = {
    width: '100%',
    height: '35px',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    fontSize:'14px',
    cursor: 'grab',
}

const tab1 = {
    width: '100%',
    height: '100%',
    background: '#E6F5F1',
    borderRadius: '5.20093px 5.20093px 0px 0px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}

const tab2 = {
    width: '100%',
    height: '100%',
    borderRadius: '5.20093px 5.20093px 0px 0px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color:'#fff'
}

const place = {
    width:'100%',
    textAlign:'center',
    fontSize:'16px',
    marginTop:'20px',
    color:'green'
}

export default Tank;