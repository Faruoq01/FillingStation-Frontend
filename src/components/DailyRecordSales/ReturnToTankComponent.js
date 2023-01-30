import { Radio } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import pump1 from '../../assets/pump1.png';
import cross from '../../assets/cross.png';
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { updatePayload, updateRecords } from "../../store/actions/records";

const mediaMatch = window.matchMedia('(max-width: 450px)');

const ReturnToTank = (props) => {

    const [productType, setProductType] = useState("PMS");
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);

    ////////////////////////////////////////////////////////////
    const dispatch = useDispatch();
    const records = useSelector(state => state.recordsReducer.load);
    const selectedPumps = useSelector(state => state.recordsReducer.selectedPumps);
    const selectedTanks = useSelector(state => state.recordsReducer.selectedTanks);

    console.log(selectedPumps, "selected pumps")
    console.log(selectedTanks, "selected tanks")
    console.log(records, "records")

    const getPMSPump = useCallback(() => {
        const newList = [...selectedPumps];
        const pms = newList.filter(data => data.productType === "PMS");
        return pms;
    }, [selectedPumps]);

    const getAGOPump = useCallback(() => {
        const newList = [...selectedPumps];
        const ago = newList.filter(data => data.productType === "AGO");
        return ago;
    }, [selectedPumps]);

    const getDPKPump = useCallback(() => {
        const newList = [...selectedPumps];
        const dpk = newList.filter(data => data.productType === "DPK");
        return dpk;
    }, [selectedPumps]);

    const [pms, setPMS] = useState([]);
    const [ago, setAGO] = useState([]);
    const [dpk, setDPK] = useState([]);
   
    useEffect(()=>{
        setPMS(getPMSPump());
        setAGO(getAGOPump());
        setDPK(getDPKPump());
        
    }, [getAGOPump, getDPKPump, getPMSPump]);

    const onRadioClick = (data) => {
        if(data === "PMS"){
            setProductType('PMS');
        }
        
        if(data === "AGO"){
            setProductType('AGO');
        }

        if(data === "DPK"){
            setProductType('DPK');
        }
    }

    const pumpItem = () => {
        swal("Warning!", "These pumps cannot be deselected here go to pump update!", "info");
    }

    const deselect = () => {
        swal("Warning!", "These pumps cannot be deselected here go to pump update!", "info");
    }

    const updateTotalizer = (e, pump) => {

        if(productType === "PMS"){

            /*###########################################
                Update the pump readings for PMS
            ############################################*/

            const newPms = [...pms];
            const findID = newPms.findIndex(data => data._id === pump._id);
            newPms[findID].RTlitre = e;
            newPms[findID].outlet = oneStationData;
            setPMS(newPms);
            dispatch(updateRecords({pms: newPms, ago: ago, dpk: dpk}));

            /*###########################################
                Update the tank readings for PMS
            ############################################*/

            const tankFromPayload = {...records};
            const connectedPumps = newPms.filter(data => data.hostTank === pump.hostTank);
            const totalRT = connectedPumps.reduce((accum, current) => {
                return Number(accum) + Number(current.RTlitre);
            }, 0);

            const totalSales = connectedPumps.reduce((accum, current) => {
                return Number(accum) + Number(current.sales);
            }, 0);

            const cloneSelectedTanks = [...selectedTanks];
            const tankID = cloneSelectedTanks.findIndex(data => data._id === pump.hostTank);
            cloneSelectedTanks[tankID].pumps = connectedPumps;
            cloneSelectedTanks[tankID].RTlitre = totalRT;
            cloneSelectedTanks[tankID].sales = totalSales;
            cloneSelectedTanks[tankID].outlet = oneStationData;
            cloneSelectedTanks[tankID].afterSales = Number(cloneSelectedTanks[tankID].currentLevel) - Number(cloneSelectedTanks[tankID].sales) + totalRT;
            tankFromPayload['2'] = cloneSelectedTanks;
            dispatch(updatePayload(tankFromPayload));

        }else if(productType === "AGO"){

            /*###########################################
                Update the pump readings for AGO
            ############################################*/

            const newAgo = [...ago];
            const findID = newAgo.findIndex(data => data._id === pump._id);
            newAgo[findID].RTlitre = e;
            newAgo[findID].outlet = oneStationData;
            setAGO(newAgo);
            dispatch(updateRecords({pms: pms, ago: newAgo, dpk: dpk}));

            /*###########################################
                Update the tank readings for AGO
            ############################################*/

            const tankFromPayload = {...records};
            const connectedPumps = newAgo.filter(data => data.hostTank === pump.hostTank);
            const totalRT = connectedPumps.reduce((accum, current) => {
                return Number(accum) + Number(current.RTlitre);
            }, 0);

            const totalSales = connectedPumps.reduce((accum, current) => {
                return Number(accum) + Number(current.sales);
            }, 0);

            const cloneSelectedTanks = [...selectedTanks];
            const tankID = cloneSelectedTanks.findIndex(data => data._id === pump.hostTank);
            cloneSelectedTanks[tankID].pumps = connectedPumps;
            cloneSelectedTanks[tankID].RTlitre = totalRT;
            cloneSelectedTanks[tankID].sales = totalSales;
            cloneSelectedTanks[tankID].outlet = oneStationData;
            cloneSelectedTanks[tankID].afterSales = Number(cloneSelectedTanks[tankID].currentLevel) - Number(cloneSelectedTanks[tankID].sales) + totalRT;
            tankFromPayload['2'] = cloneSelectedTanks;
            dispatch(updatePayload(tankFromPayload));

        }else if(productType === "DPK"){

            /*###########################################
                Update the pump readings for DPK
            ############################################*/

            const newDpk = [...dpk];
            const findID = newDpk.findIndex(data => data._id === pump._id);
            newDpk[findID].RTlitre = e;
            newDpk[findID].outlet = oneStationData;
            setDPK(newDpk);
            dispatch(updateRecords({pms: pms, ago: ago, dpk: newDpk}));

            /*###########################################
                Update the tank readings for DPK
            ############################################*/

            const tankFromPayload = {...records};
            const connectedPumps = newDpk.filter(data => data.hostTank === pump.hostTank);
            const totalRT = connectedPumps.reduce((accum, current) => {
                return Number(accum) + Number(current.RTlitre);
            }, 0);

            const totalSales = connectedPumps.reduce((accum, current) => {
                return Number(accum) + Number(current.sales);
            }, 0);

            const cloneSelectedTanks = [...selectedTanks];
            const tankID = cloneSelectedTanks.findIndex(data => data._id === pump.hostTank);
            cloneSelectedTanks[tankID].pumps = connectedPumps;
            cloneSelectedTanks[tankID].RTlitre = totalRT;
            cloneSelectedTanks[tankID].sales = totalSales;
            cloneSelectedTanks[tankID].outlet = oneStationData;
            cloneSelectedTanks[tankID].afterSales = Number(cloneSelectedTanks[tankID].currentLevel) - Number(cloneSelectedTanks[tankID].sales) + totalRT;
            tankFromPayload['2'] = cloneSelectedTanks;
            dispatch(updatePayload(tankFromPayload));

        }
    }

    const setTotalizer = (e, item) => {
        if(selectedTanks.length !== 0){
            const clonedTanks = [...selectedTanks];
            const currentTank = clonedTanks.filter(data => data._id === item.hostTank);

            if(currentTank.length !== 0){
                const quantity = Number(currentTank[0].currentLevel) + Number(e.target.value);

                if(oneStationData === null){
                    swal("Warning!", "Please select a station", "info");

                }else if(item.identity === null){
                    updateTotalizer("0", item);
                    swal("Warning!", "Please select a pump", "info");

                }else if(selectedPumps.length === 0){
                    updateTotalizer("0", item);
                    swal("Warning!", "Please select a pump", "info");

                }else{
                    if(quantity > Number(currentTank[0].tankCapacity)){
                        updateTotalizer("0", item);
                        swal("Warning!", "Reading exceeded tank level", "info");

                    }else{
                        updateTotalizer(e.target.value, item, currentTank);
                    }
                }
            }else{
                updateTotalizer("0", "0", item);
                swal("Warning!", "Please select a pump", "info");
            }

        }else{
            swal("Warning!", "Please select a pump", "info");
        }
    }

    return(
        <div style={{flexDirection: 'column', alignItems:'center'}} className='inner-body'>

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
            
            <div style={{marginTop:'10px', marginBottom:'10px'}}>Select Pump used for the day</div>
            <div style={{flexDirection:'row', justifyContent:'center'}} className='pump-list'>
                {
                    selectedPumps?.length === 0?
                    <div style={{...box, width:'170px'}}>
                        <div style={{marginRight:'10px'}}>No pump Created</div>
                        <img style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                    </div>:
                    productType === "PMS"?
                    pms.map((data, index) => {
                        return(
                            <div key={index}>
                                {data.identity === index &&
                                    <div className='box'>
                                        <p onClick={e => pumpItem(e, index, data)} style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={()=>{deselect(data)}} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                                {data.identity !== index &&
                                    <div className='box2'>
                                        <p onClick={e => pumpItem(e, index, data)} style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={()=>{deselect(data)}} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                            </div>
                        )
                    }):
                    productType === "AGO"?
                    ago.map((data, index) => {
                        return(
                            <div key={index} >
                                {data.identity === index &&
                                    <div className='box'>
                                        <p onClick={e => pumpItem(e, index, data)} style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={()=>{deselect(data)}} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                                {data.identity !== index &&
                                    <div className='box2'>
                                        <p onClick={e => pumpItem(e, index, data)} style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={()=>{deselect(data)}} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                            </div>
                        )
                    }):
                    dpk.map((data, index) => {
                        return(
                            <div key={index} >
                                {data.identity === index &&
                                    <div className='box'>
                                        <p onClick={e => pumpItem(e, index, data)} style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={()=>{deselect(data)}} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                                {data.identity !== index &&
                                    <div className='box2'>
                                        <p onClick={e => pumpItem(e, index, data)} style={{marginRight:'10px'}}>{data.pumpName}</p>
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
                    selectedPumps.length === 0?
                    <div>Please click to select a pump</div>:
                    productType === "PMS"?
                    pms.map((item, index) => {
                        return(
                            <div style={{width: mediaMatch.matches? '100%': '270px', height:'230px'}} key={index} className='item'>
                                <img style={{width:'55px', height:'60px', marginTop:'10px'}} src={pump1}  alt="icon"/>
                                <div className='pop'>{item.pumpName}</div>
                                <div style={{marginTop:'10px'}}  className='label'>Date: {item.updatedAt.split('T')[0]}</div>
                                <div style={{width: '94%',}}>

                                    <div style={{marginTop:'10px'}} className='label'>Quantity (Litres)</div>
                                    <input 
                                        onChange={e => setTotalizer(e, item)} 
                                        style={{...imps, width:'94%', border: (Number(item.totalizerReading) > Number(item.newTotalizer)) && item.newTotalizer !== '0'? '1px solid red': '1px solid black'}} 
                                        type="number" 
                                        value={item.RTlitre}
                                    />
                                </div>
                            </div>
                        )
                    }):
                    productType === "AGO"?
                    ago.map((item, index) => {
                        return(
                            <div style={{width: mediaMatch.matches? '100%': '300px', height:'230px'}} key={index} className='item'>
                                <img style={{width:'55px', height:'60px', marginTop:'10px'}} src={pump1}  alt="icon"/>
                                <div className='pop'>{item.pumpName}</div>
                                <div style={{marginTop:'10px'}}  className='label'>Date: {item.updatedAt.split('T')[0]}</div>
                                <div style={{width: '94%',}}>

                                    <div style={{marginTop:'10px'}} className='label'>Quantity (Litres)</div>
                                    <input 
                                        onChange={e => setTotalizer(e, item)}
                                        value={item.RTlitre}
                                        style={{...imps, width: '94%', border: (Number(item.totalizerReading) > Number(item.newTotalizer)) && item.newTotalizer !== '0'? '1px solid red': '1px solid black'}} 
                                        type="number" 
                                    />
                                </div>
                            </div>
                        )
                    }):
                    dpk.map((item, index) => {
                        return(
                            <div style={{width: mediaMatch.matches? '100%': '300px', height:'230px'}} key={index} className='item'>
                                <img style={{width:'55px', height:'60px', marginTop:'10px'}} src={pump1}  alt="icon"/>
                                <div className='pop'>{item.pumpName}</div>
                                <div style={{marginTop:'10px'}}  className='label'>Date: {item.updatedAt.split('T')[0]}</div>
                                <div style={{width:'94%',}}>

                                    <div style={{marginTop:'10px'}} className='label'>Quantity (Litres)</div>
                                    <input 
                                        onChange={e => setTotalizer(e, item)} 
                                        value={item.RTlitre}
                                        style={{...imps, width: '94%', border: (Number(item.totalizerReading) > Number(item.newTotalizer)) && item.newTotalizer !== '0'? '1px solid red': '1px solid black'}} 
                                        type="number" 
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

const rad = {
    display: 'flex',
    flexDirection:'row',
    justifyContent:'center'
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
    marginRight: '10px',
    marginTop: '10px',
}

const imps = {
    height:'30px', 
    width:'160px', 
    background:'#D7D7D799',
    outline:'none',
    border:'1px solid #000',
    paddingLeft:'10px'
}

export default ReturnToTank;