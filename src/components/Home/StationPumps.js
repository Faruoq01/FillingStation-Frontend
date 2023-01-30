import { Button, MenuItem, OutlinedInput, Select, Switch } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { styled } from '@mui/material/styles';
import me5 from '../../assets/me5.png';
import "../../styles/stationTanks.scss";

const StationPumps = () => {

    const [tabs, setTabs] = useState(0);
    const [PMSPump, setPMSPump] = useState([]);
    const [AGOPump, setAGOPump] = useState([]);
    const [DPKPump, setDPKPump] = useState([]);
    const [allPumps, setAllPumps] = useState([]);
    const [defaultState] = useState(0);
    const dashboardData = useSelector(state => state.dashboardReducer.dashboardData);
    const utils = useSelector(state => state.dashboardReducer.utils);

    useEffect(()=>{
        if(utils?.state === "activeTank"){
            getSeparateTanks(dashboardData.tanks.activeTank.list);
        }else if(utils?.state === "inActiveTank"){
            getSeparateTanks(dashboardData.tanks.inActiveTank.list);
        }else if(utils?.state === "activePump"){
            getSeparateTanks(dashboardData.pumps.activePumps.list);
        }else if(utils?.state === "inActivePump"){
            getSeparateTanks(dashboardData.pumps.inActivePumps.list);
        }
    },[dashboardData.pumps.activePumps.list, dashboardData.pumps.inActivePumps.list, dashboardData.tanks.activeTank.list, dashboardData.tanks.inActiveTank.list, utils?.state]);

    const getSeparateTanks = (data) => {

        const PMS = data.filter(item => item.productType === "PMS");
        const AGO = data.filter(item => item.productType === "AGO");
        const DPK = data.filter(item => item.productType === "DPK");

        setPMSPump(PMS);
        setAGOPump(AGO);
        setDPKPump(DPK);
        setAllPumps(data);
    }

    const CardItem = (props) => {
        return(
            <div className='item'>
                <div className='inner'>
                        <div className='top'>
                            <div className='left'>
                                <img style={{width:'40px', height:'40px'}} src={me5} alt="icon" />
                                <div>{props.data.pumpName} ({props.data.productType})</div>
                            </div>
                            <div className='right'>
                                <div>{props.data.activeState === '0'? 'Inactive': 'Active'}</div>
                                <IOSSwitch sx={{ m: 1 }} defaultChecked={props.data.activeState === '0'? false: true} />
                            </div>
                        </div>

                        <div className='out'>
                            <div style={{width:'40%', textAlign:'left'}}>Pump ID</div>
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
                            <div style={{width:'40%', textAlign:'left'}}>Tank Connecting to pump</div>
                            <OutlinedInput 
                                placeholder="" 
                                sx={{
                                    width:'60%',
                                    height:'35px', 
                                    fontSize:'12px',
                                    background:'#F2F1F1',
                                    color:'#000'
                                }} 
                                value={props.data.hostTankName}
                            />
                        </div>

                        <div className='out'>
                            <div style={{width:'40%', textAlign:'left'}}>Total Reading</div>
                            <OutlinedInput 
                                placeholder="" 
                                sx={{
                                    width:'60%',
                                    height:'35px', 
                                    fontSize:'12px',
                                    background:'#F2F1F1',
                                    color:'#000'
                                }} 
                                value={props.data.totalizerReading}
                            />
                        </div>

                        <div className='delete'>
                            <Button sx={{
                                width:'120px', 
                                height:'30px',  
                                background: '#06805B',
                                borderRadius: '3px',
                                fontSize:'10px',
                                color:'#fff',
                                '&:hover': {
                                    backgroundColor: '#06805B'
                                }
                                }} 
                                disabled
                                variant="contained"> Delete
                            </Button>
                        </div>
                </div>
            </div>
        )
    }

    const AllTabs = () => {
        return(
            <div className='space'>
                {
                    allPumps.length === 0?
                    <div style={place}>No records of tanks</div>:
                    allPumps.map((item, index) => {
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
                    PMSPump.length === 0?
                    <div style={place}>No records of tanks</div>:
                    PMSPump.map((item, index) => {
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
                    AGOPump.length === 0?
                    <div style={place}>No records of tanks</div>:
                    AGOPump.map((item, index) => {
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
                    DPKPump.length === 0?
                    <div style={place}>No records of tanks</div>:
                    DPKPump.map((item, index) => {
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

    return(
        <div className="stationTanksContainer">
            <div style={{marginRight:'10px'}} className="left-form">
                <div className="inner-tanks">
                    <div className="inpt" style={{width:'100%'}}>
                        <div style={{width:'100%', textAlign:'left'}}>State</div>
                        <OutlinedInput 
                            sx={{
                                width:'100%',
                                height: '35px', 
                                marginTop:'5px', 
                                background:'#EEF2F1', 
                                border:'1px solid #777777',
                                fontSize:'12px',
                            }} placeholder="" 
                            disabled
                            value={utils?.station?.state}
                        />
                    </div>

                    <div className="inpt" style={{width:'100%'}}>
                        <div style={{width:'100%', textAlign:'left'}}>Station Name</div>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={defaultState}
                            sx={selectStyle2}
                            disabled
                        >
                            <MenuItem style={menu} value={0}>{utils?.station?.outletName+ ', ' +utils?.station?.city}</MenuItem>
                        </Select>
                    </div>

                    <div className="inpt" style={{width:'100%'}}>
                        <div style={{width:'100%', textAlign:'left'}}>City/Town</div>
                        <OutlinedInput 
                            sx={{
                                width:'100%',
                                height: '35px', 
                                marginTop:'5px', 
                                background:'#EEF2F1', 
                                border:'1px solid #777777',
                                fontSize:'12px',
                            }} placeholder="" 
                            disabled
                            value={utils?.station?.city}
                        />
                    </div>

                    <div className="inpt" style={{width:'100%'}}>
                        <div style={{width:'100%', textAlign:'left'}}>Tank ID</div>
                        <OutlinedInput 
                            sx={{
                                width:'100%',
                                height: '35px', 
                                marginTop:'5px', 
                                background:'#EEF2F1', 
                                border:'1px solid #777777',
                                fontSize:'12px',
                            }} placeholder="" 
                            disabled
                            value={utils?.station?._id}
                        />
                    </div>

                    <div className="inpt" style={{width:'100%'}}>
                        <div style={{width:'100%', textAlign:'left'}}>LGA</div>
                        <OutlinedInput 
                            sx={{
                                width:'100%',
                                height: '35px', 
                                marginTop:'5px', 
                                background:'#EEF2F1', 
                                border:'1px solid #777777',
                                fontSize:'12px',
                            }} placeholder="" 
                            disabled
                            value={utils?.station?.lga}
                        />
                    </div>

                    <div className="inpt" style={{width:'100%'}}>
                        <div style={{width:'100%', textAlign:'left'}}>Street</div>
                        <OutlinedInput 
                            sx={{
                                width:'100%',
                                height: '35px', 
                                marginTop:'5px', 
                                background:'#EEF2F1', 
                                border:'1px solid #777777',
                                fontSize:'12px',
                            }} placeholder="" 
                            disabled
                            value={utils?.station?.area}
                        />
                    </div>
                </div>
            </div>
            <div className="pump-container">
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
        </div>
    )
}

const menu = {
    fontSize:'14px',
}

const selectStyle2 = {
    width:'100%', 
    height:'35px', 
    borderRadius:'5px',
    background: '#F2F1F1B2',
    color:'#000',
    fontSize:'14px',
    outline:'none'
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

export default StationPumps;