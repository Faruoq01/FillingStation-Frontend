import { Radio } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import pump1 from '../../assets/pump1.png';
import cross from '../../assets/cross.png';
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { desselectedListPumps, selectedListPumps, updateRecords, updateSelectedPumps } from "../../store/actions/records";

const mediaMatch = window.matchMedia('(max-width: 500px)');

const PumpUpdateComponent = (props) => {

    const [productType, setProductType] = useState("PMS");
    const pumpList = useSelector(state => state.outletReducer.pumpList);
    const tankList = useSelector(state => state.outletReducer.tankList);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const dispatch = useDispatch();

    //////////////////////////////////////////////////////////////
    // const records = useSelector(state => state.recordsReducer.load);
    const selectedPumps = useSelector(state => state.recordsReducer.selectedPumps);
    const selectedTanks = useSelector(state => state.recordsReducer.selectedTanks);
    const PMS = useSelector(state => state.recordsReducer.PMS);
    const AGO = useSelector(state => state.recordsReducer.AGO);
    const DPK = useSelector(state => state.recordsReducer.DPK);
    // console.log(selectedPumps, "selected pumps")
    // console.log(selectedTanks, "selected tanks")
    // console.log(records, "records")

    const getPMSPump = useCallback(() => {
        const newList = [...pumpList];
        const pms = newList.filter(data => data.productType === "PMS");
        return pms;
    }, [pumpList]);

    const getAGOPump = useCallback(() => {
        const newList = [...pumpList];
        const ago = newList.filter(data => data.productType === "AGO");
        return ago;
    }, [pumpList]);

    const getDPKPump = useCallback(() => {
        const newList = [...pumpList];
        const dpk = newList.filter(data => data.productType === "DPK");
        return dpk;
    }, [pumpList]);


    useEffect(()=>{
        dispatch(updateRecords({pms: getPMSPump(), ago: getAGOPump(), dpk: getDPKPump()}));
    }, [dispatch, getAGOPump, getDPKPump, getPMSPump]);

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

    const pumpItem = (e, index, pump) => {
        e.preventDefault();
        const tankClone = [...tankList];
        const tankID = tankClone.findIndex(data => data._id === pump.hostTank);

        if(pump.productType === "PMS"){
            const newPms = [...PMS];
            newPms[index].identity = index;
            dispatch(selectedListPumps({selected: pump, tank: tankClone[tankID], collection: newPms}));

        }else if(pump.productType === "AGO"){
            const newAgo = [...AGO];
            newAgo[index].identity = index;
            dispatch(selectedListPumps({selected: pump, tank: tankClone[tankID], collection: newAgo}));

        }else if(pump.productType === "DPK"){
            const newDpk = [...DPK];
            newDpk[index].identity = index;
            dispatch(selectedListPumps({selected: pump, tank: tankClone[tankID], collection: newDpk}));
        }
    }

    const deselect = (index, pump) => {

        const tankClone = [...tankList];
        const tankID = tankClone.findIndex(data => data._id === pump.hostTank);

        if(pump.productType === "PMS"){
            const newPms = [...PMS];
            newPms[index].identity = null;
            dispatch(desselectedListPumps({selected: pump, tank: tankClone[tankID], collection: newPms}));

        }else if(pump.productType === "AGO"){
            const newAgo = [...AGO];
            newAgo[index].identity = null;
            dispatch(desselectedListPumps({selected: pump, tank: tankClone[tankID], collection: newAgo}));

        }else if(pump.productType === "DPK"){
            const newDpk = [...DPK];
            newDpk[index].identity = null;
            dispatch(desselectedListPumps({selected: pump, tank: tankClone[tankID], collection: newDpk}));
        }
    }

    const updateTotalizer = (e, totalizerDiff, index, pump) => {
        
        if(productType === "PMS"){

            /*###########################################
                Update the pump readings for PMS
            ############################################*/

            const onlyPMS = [...tankList].filter(data => data.productType === "PMS");
            const totalPMSTankLevel = onlyPMS.reduce((accum, current) => {
                return Number(accum) + Number(current.currentLevel);
            }, 0);

            const newPms = [...PMS];
            newPms[index].sales = totalizerDiff;
            newPms[index].newTotalizer = e;
            newPms[index].totalTankLevel = totalPMSTankLevel;

            const selectedPMS = [...selectedPumps];
            const pumpID = selectedPMS.findIndex(data => data._id === pump._id);
            selectedPMS[pumpID].sales = totalizerDiff;
            selectedPMS[pumpID].newTotalizer = e;
            selectedPMS[pumpID].totalTankLevel = totalPMSTankLevel;


            dispatch(updateRecords({pms: newPms, ago: AGO, dpk: DPK}));
            dispatch(updateSelectedPumps(selectedPMS));

        }else if(productType === "AGO"){

            /*###########################################
                Update the pump readings for AGO
            ############################################*/

            const onlyAGO = [...tankList].filter(data => data.productType === "AGO");
            const totalAG0TankLevel = onlyAGO.reduce((accum, current) => {
                return Number(accum) + Number(current.currentLevel);
            }, 0);

            const newAgo = [...AGO];
            newAgo[index].sales = totalizerDiff;
            newAgo[index].newTotalizer = e;
            newAgo[index].totalTankLevel = totalAG0TankLevel;
            
            const selectedAGO = [...selectedPumps];
            const pumpID = selectedAGO.findIndex(data => data._id === pump._id);
            selectedAGO[pumpID].sales = totalizerDiff;
            selectedAGO[pumpID].newTotalizer = e;
            selectedAGO[pumpID].totalTankLevel = totalAG0TankLevel;


            dispatch(updateRecords({pms: PMS, ago: newAgo, dpk: DPK}));
            dispatch(updateSelectedPumps(selectedAGO));

        }else if(productType === "DPK"){

            /*###########################################
                Update the pump readings for DPK
            ############################################*/

            const onlyDPK = [...tankList].filter(data => data.productType === "DPK");
            const totalDPKTankLevel = onlyDPK.reduce((accum, current) => {
                return Number(accum) + Number(current.currentLevel);
            }, 0);

            const newDpk = [...DPK];
            newDpk[index].sales = totalizerDiff;
            newDpk[index].newTotalizer = e;
            newDpk[index].totalTankLevel = totalDPKTankLevel;
            
            const selectedDPK = [...selectedPumps];
            const pumpID = selectedDPK.findIndex(data => data._id === pump._id);
            selectedDPK[pumpID].sales = totalizerDiff;
            selectedDPK[pumpID].newTotalizer = e;
            selectedDPK[pumpID].totalTankLevel = totalDPKTankLevel;

            dispatch(updateRecords({pms: PMS, ago: AGO, dpk: newDpk}));
            dispatch(updateSelectedPumps(selectedDPK));

        }
    }

    const setTotalizer = (e, pump, index) => {
        
        if(selectedTanks.length !== 0){
            const clonedTanks = [...selectedTanks];
            const connectedTank = clonedTanks.filter(data => data._id === pump.hostTank);

            if(connectedTank.length !== 0){

                const totalizerDiff = Number(e.target.value) - Number(pump.totalizerReading);
                const quantity = Number(connectedTank[0].currentLevel) - Number(connectedTank[0].deadStockLevel);

                console.log(totalizerDiff, "difference")
                console.log(connectedTank[0].currentLevel, "current tank")

                if(oneStationData === null){
                    updateTotalizer("0", "0", index, pump);
                    swal("Warning!", "Please select a station", "info");
        
                }else if(pump.identity === null){
                    updateTotalizer("0", "0", index, pump);
                    swal("Warning!", "Please select a pump", "info");
        
                }else if(selectedPumps.length === 0){
                    updateTotalizer("0", "0", index, pump);
                    swal("Warning!", "Please select a pump", "info");
        
                }else{
                    if(totalizerDiff > quantity ){
                        updateTotalizer("0", "0", index, pump);
                        swal("Warning!", "Reading exceeded tank level", "info");
        
                    }else{
                        updateTotalizer(e.target.value, totalizerDiff, index, pump);
                    }
                }
            }else{
                updateTotalizer("0", "0", index, pump);
                swal("Warning!", "Please select a pump", "info");
            }

        }else{
            swal("Warning!", "Please select a pump", "info");
        }
    }

    const displaySelectedPumps = (data, type) => {
        if(selectedPumps.length === 0){
            return data;

        }else{
            const productPump = selectedPumps.filter(data => data.productType === type);
            return productPump;
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
            
            <div style={{marginTop:'10px', marginBottom:'10px', fontWeight:'400'}}>Select pump used for the day</div>
            <div style={{flexDirection:'row', justifyContent:'center'}} className='pump-list'>
                {
                    pumpList.length === 0?
                    <div style={{...box, width:'170px'}}>
                        <div style={{marginRight:'10px', fontWeight:'500'}}>No pump Created</div>
                        <img style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                    </div>:
                    productType === "PMS"?
                    PMS?.map((data, index) => {
                        return(
                            <div key={index}>
                                {data.identity === index &&
                                    <div className='box'>
                                        <p onClick={e => pumpItem(e, index, data)} style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={()=>{deselect(index, data)}} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                                {data.identity !== index &&
                                    <div className='box2'>
                                        <p onClick={e => pumpItem(e, index, data)} style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={()=>{deselect(index, data)}} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                            </div>
                        )
                    }):
                    productType === "AGO"?
                    AGO?.map((data, index) => {
                        return(
                            <div key={index} >
                                {data.identity === index &&
                                    <div className='box'>
                                        <p onClick={e => pumpItem(e, index, data)} style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={()=>{deselect(index, data)}} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                                {data.identity !== index &&
                                    <div className='box2'>
                                        <p onClick={e => pumpItem(e, index, data)} style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={()=>{deselect(index, data)}} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                            </div>
                        )
                    }):
                    productType === "DPK"?
                    DPK?.map((data, index) => {
                        return(
                            <div key={index} >
                                {data.identity === index &&
                                    <div className='box'>
                                        <p onClick={e => pumpItem(e, index, data)} style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={()=>{deselect(index, data)}} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                                {data.identity !== index &&
                                    <div className='box2'>
                                        <p onClick={e => pumpItem(e, index, data)} style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={()=>{deselect(index, data)}} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                            </div>
                        )
                    }): null
                }
            </div>

            <div style={{width:'100%', marginTop:'20px', justifyContent:'center'}} className='pumping'>
                {
                    pumpList.length === 0?
                    <div style={cap}>Please click to select a pump</div>:
                    productType === "PMS"?
                    displaySelectedPumps(PMS, 'PMS')?.map((item, index) => {
                        return(
                            <div style={{width: mediaMatch.matches? '100%': '270px', height:'300px'}} key={index} className='item'>
                                <img style={{width:'55px', height:'60px', marginTop:'10px'}} src={pump1}  alt="icon"/>
                                <div className='pop'>{item.pumpName} ({item.hostTankName})</div>
                                <div style={{marginTop:'10px'}}  className='label'>Date: {item.updatedAt.split('T')[0]}</div>
                                <div style={{width:'94%'}}>
                                    <div style={{marginTop:'10px'}} className='label'>Opening meter (Litres)</div>
                                    <input disabled={true} value={item.totalizerReading} style={{...imps, width: "94%"}} type="text" />

                                    <div style={{marginTop:'10px'}} className='label'>Closing meter (Litres)</div>
                                    <input 
                                        onChange={e => setTotalizer(e, item, index)} 
                                        style={{...imps, width:'94%', border: (Number(item.totalizerReading) > Number(item.newTotalizer)) && item.newTotalizer !== '0'? '1px solid red': '1px solid black'}} 
                                        type="number" 
                                        value={item.newTotalizer}
                                        placeholder={"Enter closing meter"}
                                    />
                                </div>
                            </div>
                        )
                    }):
                    productType === "AGO"?
                    displaySelectedPumps(AGO, 'AGO')?.map((item, index) => {
                        return(
                            <div style={{width: mediaMatch.matches? '100%': '270px', height:'300px'}} key={index} className='item'>
                                <img style={{width:'55px', height:'60px', marginTop:'10px'}} src={pump1}  alt="icon"/>
                                <div className='pop'>{item.pumpName} ({item.hostTankName})</div>
                                <div style={{marginTop:'10px'}}  className='label'>Date: {item.updatedAt.split('T')[0]}</div>
                                <div style={{width:'94%',}}>
                                    <div style={{ marginTop:'10px'}} className='label'>Opening meter (Litres)</div>
                                    <input disabled={true} value={item.totalizerReading} style={{...imps, width: "94%"}} type="text" />

                                    <div style={{width:'94%', marginTop:'10px'}} className='label'>Closing meter (Litres)</div>
                                    <input 
                                        onChange={e => setTotalizer(e, item, index)} 
                                        value={item.newTotalizer}
                                        style={{...imps, width:'94%', border: (Number(item.totalizerReading) > Number(item.newTotalizer)) && item.newTotalizer !== '0'? '1px solid red': '1px solid black'}} 
                                        type="number" 
                                        placeholder={"Enter closing meter"}
                                    />
                                </div>
                            </div>
                        )
                    }):
                    productType === "DPK"?
                    displaySelectedPumps(DPK, 'DPK')?.map((item, index) => {
                        return(
                            <div style={{width: mediaMatch.matches? '100%': '270px', height:'300px'}} key={index} className='item'>
                                <img style={{width:'55px', height:'60px', marginTop:'10px'}} src={pump1}  alt="icon"/>
                                <div className='pop'>{item.pumpName} ({item.hostTankName})</div>
                                <div style={{marginTop:'10px'}}  className='label'>Date: {item.updatedAt.split('T')[0]}</div>
                                <div style={{width: '94%',}}>
                                    <div style={{marginTop:'10px'}} className='label'>Opening meter (Litres)</div>
                                    <input disabled={true} value={item.totalizerReading} style={{...imps, width: '94%',}} type="text" />

                                    <div style={{marginTop:'10px'}} className='label'>Closing meter (Litres)</div>
                                    <input 
                                        onChange={e => setTotalizer(e, item, index)} 
                                        value={item.newTotalizer}
                                        style={{...imps, width: '94%', border: (Number(item.totalizerReading) > Number(item.newTotalizer)) && item.newTotalizer !== '0'? '1px solid red': '1px solid black'}} 
                                        type="number" 
                                        placeholder={"Enter closing meter"}
                                    />
                                </div>
                            </div>
                        )
                    }): null
                }
            </div>
        </div>
    )
}

const cap = {
    fontSize:'14px',
    marginBottom:'20px',
    fontWeight:'500'
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

export default PumpUpdateComponent;