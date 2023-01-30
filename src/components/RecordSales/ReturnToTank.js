import React, { useState } from 'react';
import '../../styles/pump.scss';
import pump1 from '../../assets/pump1.png';
import cross from '../../assets/cross.png';
import { Button, Radio } from '@mui/material';
import OutletService from '../../services/outletService';
import { useDispatch, useSelector } from 'react-redux';
import { deselectPumps, filterPumpsRecordSales, getAllPumps, selectPumps } from '../../store/actions/outlet';
import PumpUpdate from '../Modals/PumpUpdate';
import swal from 'sweetalert';
import { ThreeDots } from 'react-loader-spinner';
import DailySalesService from '../../services/DailySales';

const ReturnToTank = (props) => {

    const [currentPump, setCurrentPump] = useState({});
    const [selected, setSelected] = useState(null);
    const dispatch = useDispatch();
    const mainPumpList = useSelector(state => state.outletReducer.mainPumpList);
    const tankList = useSelector(state => state.outletReducer.tankList);
    const [open, setOpen] = useState(false);
    const oneOutletStation = useSelector(state => state.outletReducer.oneStation);
    const [activePumps, setActivePumps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [trigger, setTrigger] = useState(false);
    const [productType, setProductType] = useState("PMS");

    const getOneOutletTank = async(payload) => {
        let res = await OutletService.getOneTank(payload)
        return res;
    }

    const updateCurrentTank = async(payload) => {
        let res = await OutletService.updateTank(payload)
        return res;
    }

    const updateCurrentPump = async(activePumps, i, totalizer) => {
        let res = await OutletService.pumpUpdate({id: activePumps[i]._id, totalizerReading: totalizer});
        return res;
    }

    const returnToTankService = async(RTPayload) => {
        let res = await DailySalesService.createRT(RTPayload);
        return res;
    }

    const addSupplyToList = async() => {
        if(activePumps.length === 0){
            return swal("Warning!", "Please select a pump to add readings!", "info");
        }

        for(let pump of activePumps){
            const currentTank = tankList.filter(tank => tank._id === pump.hostTank);
            const Tank = {...currentTank[0]};
            const canTankServe = Number(Tank.tankCapacity) - Number(Tank.currentLevel);

            if(canTankServe <= 0){
                return swal("Warning!", `${Tank.tankName} connected to ${pump.pumpName} is full!`, "info");
            }
        }

        for(let i = 0, max = activePumps.length; i < max; i++){
            const payload = {
                id: activePumps[i].hostTank
            }
            setLoading(true);
            let data = await getOneOutletTank(payload);
            // console.log('one tank', data)

            const difference = Number(activePumps[i].closingMeter);
            const canTankServe = Number(data.stations.currentLevel) + difference;
            const totalizer = Number(activePumps[i].totalizerReading - Number(activePumps[i].closingMeter));

            if(totalizer < 0){
                swal("Warning!", "Return to tank must not be greater than opening meter!", "info");
            }else{
                if(payload.currentLevel !== null){
                    const TankPayload = {
                        id: data.stations._id,
                        previousLevel: data.stations.currentLevel,
                        totalizer:  totalizer,
                        currentLevel: data.stations.currentLevel === "None"? null: String(canTankServe),
                    }

                    const RTPayload = {
                        litre: difference,
                        productType: activePumps[i].productType,
                        pumpID: activePumps[i]._id,
                        tankID: data.stations._id,
                        PMSCost: oneOutletStation.PMSCost,
                        AGOCost: oneOutletStation.AGOCost,
                        DPKCost: oneOutletStation.DPKCost,
                        PMSPrice: oneOutletStation.PMSPrice,
                        AGOPrice: oneOutletStation.AGOPrice,
                        DPKPrice: oneOutletStation.DPKPrice,
                        pumpName: activePumps[i].pumpName,
                        tankName: data.stations.tankName,
                        outletID : activePumps[i].outletID,
                        organizationID: activePumps[i].organisationID,
                    }
    
                    let updateOneTank = await updateCurrentTank(TankPayload);
                    // console.log('taks update', updateOneTank)
        
                    let updatePumpTotalizer = await updateCurrentPump(activePumps, i, totalizer);
                    // console.log('pumps update', updatePumpTotalizer)

                    let returnToTankData = await returnToTankService(RTPayload);
                    console.log('Return to tank', returnToTankData)
    
                    if(updateOneTank.code === 200 && updatePumpTotalizer.code === 200){
                        setLoading(false);
                    }else{
                        return;
                    }
                }else{
                    swal("Warning!", "This is an empty tank!", "info");
                }
            }

        }

        OutletService.getAllStationPumps({outletID: oneOutletStation._id, organisationID: oneOutletStation.organisation}).then(data => {
            dispatch(getAllPumps(data));
        }).then(()=>{
            swal("Success!", "Pump update is successful!", "success");
            setTrigger(!trigger);
        })
    }

    const pumpItem = (e, index, item) => {
        e.preventDefault();

        setSelected(index);

        if(activePumps.length === 0){
            setActivePumps(prev => [...prev, item]);
        }else{
            let available = activePumps.findIndex(data => data._id === item._id);
            if(available === -1){
                setActivePumps(prev => [...prev, item]);
            }
        }

        dispatch(selectPumps(item));
    }

    const deselect = (item) => {
        let available = activePumps.findIndex(data => data._id === item._id);
        if(available !== -1){
            let newList = activePumps.filter(data => data._id !== item._id);
            setActivePumps(newList);
        }
        dispatch(deselectPumps(item));
    }

    const setTotalizer = (e, item) => {
        const list = [...activePumps];
        const pump = {...item};
        const index = activePumps.findIndex(data => data._id === pump._id);
        item['closingMeter'] = e.target.value;
        list[index] = item;
        setActivePumps(list);
    }

    const onRadioClick = (data) => {
        if(data === "PMS"){
            setProductType('PMS');
            dispatch(filterPumpsRecordSales("PMS"));
        }
        
        if(data === "AGO"){
            setProductType('AGO');
            dispatch(filterPumpsRecordSales("AGO"));
        }

        if(data === "DPK"){
            setProductType('DPK');
            dispatch(filterPumpsRecordSales("DPK"));
        }
    }

    return(
        <div style={{flexDirection:'column', alignItems:'center'}} className='pumpContainer'>
            {open && <PumpUpdate open={open} close={setOpen} currentStation={oneOutletStation} current={currentPump} refresh={props.refresh} />}
            
            <div style={rad} className='radio'>
                <div className='rad-item'>
                    <Radio {...props}
                        sx={{
                            '&, &.Mui-checked': {
                            color: '#054834',
                            },
                        }} 
                        onClick={()=>onRadioClick("PMS")} 
                        checked={productType === 'PMS'? true: false} 
                    />
                    <div className='head-text2' style={{marginRight:'5px', fontSize:'12px'}}>PMS</div>
                </div>
                <div className='rad-item'>
                    <Radio {...props}
                        sx={{
                            '&, &.Mui-checked': {
                            color: '#054834',
                            },
                        }}
                        onClick={()=>onRadioClick("AGO")} 
                        checked={productType === 'AGO'? true: false} 
                    />
                    <div className='head-text2' style={{marginRight:'5px', fontSize:'12px'}}>AGO</div>
                </div>
                <div className='rad-item'>
                    <Radio {...props}
                        sx={{
                            '&, &.Mui-checked': {
                            color: '#054834',
                            },
                        }} 
                        onClick={()=>onRadioClick("DPK")} 
                        checked={productType === 'DPK'? true: false} 
                    />
                    <div className='head-text2' style={{marginRight:'5px', fontSize:'12px'}}>DPK</div>
                </div>
            </div>

            <div>Select Pump used for the day</div>
            <div style={{flexDirection:'row', justifyContent:'center'}} className='pump-list'>
                {
                    mainPumpList.length === 0?
                    <div style={{...box, width:'170px'}}>
                        <div style={{marginRight:'10px'}}>No pump Created</div>
                        <img style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                    </div>:
                    mainPumpList.map((data, index) => {
                        return(
                            <div key={index} onClick={e => pumpItem(e, index, data)}>
                                {data.identity === index &&
                                    <div className='box'>
                                        <p style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={()=>{deselect(data)}} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                                {data.identity !== index &&
                                    <div className='box2'>
                                        <p style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={()=>{deselect(data)}} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </div>

            <div style={{width:'100%', marginTop:'20px', justifyContent:'center'}} className='pumping'>
                {
                    mainPumpList.length === 0?
                    <div>Please click to select a pump</div>:
                    mainPumpList.map((item, index) => {
                        return(
                            <div style={{height:'230px'}} key={index} className='item'>
                                <img style={{width:'55px', height:'60px', marginTop:'10px'}} src={pump1}  alt="icon"/>
                                <div className='pop'>{item.pumpName}</div>
                                <div style={{marginTop:'10px'}}  className='label'>Date: {item.updatedAt.split('T')[0]}</div>
                                <div style={{width:'88%'}}>
                                    <div style={{marginTop:'10px'}} className='label'>Quantity (Litres)</div>
                                    <input 
                                        onChange={e => setTotalizer(e, item)} 
                                        defaultValue={0} 
                                        style={imps} 
                                        type="text" 
                                    />
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <div style={{marginBottom:'0px', height:'30px', width:'90%', justifyContent:'space-between', alignItems:'center'}} className='submit'>
                <div>
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
                    onClick={addSupplyToList}
                    variant="contained"> Record Update
                </Button>
            </div>
        </div>
    )
}


const rad = {
    display: 'flex',
    flexDirection:'row',
    justifyContent:'center'
}

const imps = {
    height:'30px', 
    width:'100%', 
    background:'#D7D7D799',
    outline:'none',
    border:'1px solid #000',
    paddingLeft:'10px'
}

const box = {
    width: '100px',
    height: '35px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#06805B',
    borderRadius: '30px',
    color: '#fff',
    fontFamily: 'Nunito-Regular',
    marginRight: '10px',
    marginTop: '10px',
}

export default ReturnToTank;