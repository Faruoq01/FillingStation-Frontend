import { Radio } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import pump1 from '../../assets/pump1.png';
import cross from '../../assets/cross.png';
import { useSelector } from "react-redux";
import swal from "sweetalert";

const mediaMatch = window.matchMedia('(max-width: 500px)');

const PumpUpdateComponent = (props) => {

    const [productType, setProductType] = useState("PMS");
    const [selectedPumps, setSelected] = useState([]);
    const [selectedTanks, setSelectedTanks] = useState([]);
    const pumpList = useSelector(state => state.outletReducer.pumpList);
    const tankList = useSelector(state => state.outletReducer.tankList);
    const linkedData = useSelector(state => state.dailySalesReducer.linkedData);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    console.log(linkedData, "helloooooo")

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

    const [pms, setPMS] = useState([]);
    const [ago, setAGO] = useState([]);
    const [dpk, setDPK] = useState([]);

    useEffect(()=>{
        if(linkedData?.head?.data?.pms?.length === 0){
            setSelected([]);
            setSelectedTanks([]);
            setPMS(getPMSPump());
        }else{
            setPMS(linkedData?.head?.data?.pms);
            setSelected(linkedData?.head?.data?.selectedPumps);
            setSelectedTanks(linkedData?.head?.data?.selectedTanks);
        }

        if(linkedData?.head?.data?.ago?.length === 0){
            setSelected([]);
            setSelectedTanks([]);
            setAGO(getAGOPump());
        }else{
            setAGO(linkedData?.head?.data?.ago);
            setSelected(linkedData?.head?.data?.selectedPumps);
            setSelectedTanks(linkedData?.head?.data?.selectedTanks);
        }
        
        if(linkedData?.head?.data?.dpk?.length === 0){
            setSelected([]);
            setSelectedTanks([]);
            setDPK(getDPKPump());
        }else{
            setDPK(linkedData?.head?.data?.dpk);
            setSelected(linkedData?.head?.data?.selectedPumps);
            setSelectedTanks(linkedData?.head?.data?.selectedTanks);
        }
     
    }, [
        getAGOPump, 
        getDPKPump, 
        getPMSPump, 
        linkedData?.head?.data?.ago, 
        linkedData?.head?.data?.dpk, 
        linkedData?.head?.data?.pms, 
        linkedData?.head?.data?.selectedPumps, 
        linkedData?.head?.data?.selectedTanks
    ]);

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

    const pumpItem = (e, index, item) => {
        e.preventDefault();
        const tankClone = [...tankList];
        const tank = tankClone.filter(data => data._id === item.hostTank)[0];
        
        const findID = selectedPumps.findIndex(data => data._id === item._id);
        if(findID === -1){
            setSelected(prev => [...prev, item]);

        }else{
            const newList = [...selectedPumps]
            newList[findID] = {...item};
            setSelected(newList);
        }

        const tankID = selectedTanks.findIndex(data => data._id === tank._id);
        if(tankID === -1){
            setSelectedTanks(prev => [...prev, tank]);

        }else{
            const newList = [...selectedTanks]
            newList[tankID] = {...tank};
            setSelectedTanks(newList);
        }

        if(productType === "PMS"){
            const newPms = [...pms];
            const findID = newPms.findIndex(data => data._id === item._id);
            newPms[findID].identity = index;
            setPMS(newPms);
        }else if(productType === "AGO"){
            const newAgo = [...ago];
            const findID = newAgo.findIndex(data => data._id === item._id);
            newAgo[findID].identity = index;
            setAGO(newAgo);
        }else{
            const newDpk = [...dpk];
            const findID = newDpk.findIndex(data => data._id === item._id);
            newDpk[findID].identity = index;
            setDPK(newDpk);
        }
    }

    const deselect = (payload) => {
        if(productType === "PMS"){
            const list = [...pms];
            const index = list.indexOf(payload);
            list[index] = {...payload, identity: null}
            setPMS(list);

            const deleted = selectedPumps.filter(data => data._id !== payload._id);
            const removeTank = selectedTanks.filter(data => data._id !== payload.hostTank);

            setSelected(deleted);
            setSelectedTanks(removeTank);
        }else if(productType === "AGO"){
            const list = [...ago];
            const index = list.indexOf(payload);
            list[index] = {...payload, identity: null}
            setAGO(list);

            const deleted = selectedPumps.filter(data => data._id !== payload._id);
            const removeTank = selectedTanks.filter(data => data._id !== payload.hostTank);

            setSelected(deleted);
            setSelectedTanks(removeTank);
        }else{
            const list = [...dpk];
            const index = list.indexOf(payload);
            list[index] = {...payload, identity: null}
            setDPK(list);

            const deleted = selectedPumps.filter(data => data._id !== payload._id);
            const removeTank = selectedTanks.filter(data => data._id !== payload.hostTank);

            setSelected(deleted);
            setSelectedTanks(removeTank);
        }
        
    }

    const updateTotalizer = (e, totalizerDiff, item) => {

        const differenceT = Math.round((totalizerDiff + Number.EPSILON)*100)/100;
        
        if(productType === "PMS"){
            const newPms = [...pms];
            const findID = newPms.findIndex(data => data._id === item._id);
            newPms[findID].sales = differenceT < 0? 0: differenceT;
            newPms[findID].newTotalizer = e;
            setPMS(newPms);

            // const newList = {...linkedData};
            // newList.head.data.payload = selected;
            // dispatch(passRecordSales(newList));
        }else if(productType === "AGO"){
            const newAgo = [...ago];
            const findID = newAgo.findIndex(data => data._id === item._id);
            newAgo[findID].sales = differenceT < 0? 0: differenceT;
            newAgo[findID].newTotalizer = e;
            setAGO(newAgo);

            // const newList = {...linkedData};
            // newList.head.data.payload = selected;
            // dispatch(passRecordSales(newList));
        }else{
            const newDpk = [...dpk];
            const findID = newDpk.findIndex(data => data._id === item._id);
            newDpk[findID].sales = differenceT < 0? 0: differenceT;
            newDpk[findID].newTotalizer = e;
            setDPK(newDpk);

            // const newList = {...linkedData};
            // newList.head.data.payload = selected;
            // dispatch(passRecordSales(newList));
        }

        // update tank payload
        const newTankList = [...selectedTanks];
        const tankID = newTankList.findIndex(data => data._id === item.hostTank);
        if(tankID !== -1){
            newTankList[tankID] = {
                ...newTankList[tankID], 
                pumps: selectedPumps.filter(data => data.hostTank === newTankList[tankID]._id),
                outlet: oneStationData,
                fakeLevelOne: Number(newTankList[tankID].currentLevel) - Number(differenceT < 0? 0: differenceT),
                fakeLevelTwo: Number(newTankList[tankID].currentLevel) - Number(differenceT < 0? 0: differenceT),
                fakeLevelThree: Number(newTankList[tankID].currentLevel) - Number(differenceT < 0? 0: differenceT)
            }
            setSelectedTanks(newTankList);
        }
        savePumpUpdate(newTankList);
    }

    const setTotalizer = (e, item) => {
        
        if(selectedTanks.length !== 0){
            const clonedTanks = [...selectedTanks];
            const currentTank = clonedTanks.filter(data => data._id === item.hostTank);

            if(currentTank.length !== 0){

                const totalizerDiff = Number(e.target.value) - Number(item.totalizerReading);
                const quantity = Number(currentTank[0].currentLevel) - Number(currentTank[0].deadStockLevel);

                if(oneStationData === null){
                    swal("Warning!", "Please select a station", "info");
        
                }else if(item.identity === null){
                    updateTotalizer("0", "0", item);
                    swal("Warning!", "Please select a pump", "info");
        
                }else if(selectedPumps.length === 0){
                    updateTotalizer("0", "0", item);
                    swal("Warning!", "Please select a pump", "info");
        
                }else{
                    if(totalizerDiff > quantity){
                        updateTotalizer("0", "0", item);
                        swal("Warning!", "Reading exceeded tank level", "info");
        
                    }else{
                        updateTotalizer(e.target.value, totalizerDiff, item);
                    }
                }
            }else{
                updateTotalizer("0", "0", item);
                swal("Warning!", "Please select a pump", "info");
            }

        }else{
            updateTotalizer("0", "0", item);
            swal("Warning!", "Please select a pump", "info");
        }
    }

    const savePumpUpdate = (newTankList) => {
        
        for(let tank of newTankList){

            const totalSales = tank.pumps.reduce((accum, current) => {
                return Number(accum) + Number(current.newTotalizer) - Number(current.totalizerReading);
            }, 0);

            const findID = newTankList.findIndex(data => data._id === tank._id);
            newTankList[findID].sales = Math.round((totalSales + Number.EPSILON)*100)/100;
            setSelectedTanks(newTankList);
        }

        const newUpdate = {
            pms: pms,
            ago: ago,
            dpk: dpk,
            selectedTanks: newTankList,
            selectedPumps: selectedPumps,
            payload: newTankList
        }
        props.update(newUpdate);
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
                    pumpList.length === 0?
                    <div style={{...box, width:'170px'}}>
                        <div style={{marginRight:'10px'}}>No pump Created</div>
                        <img style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                    </div>:
                    productType === "PMS"?
                    pms?.map((data, index) => {
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
                    ago?.map((data, index) => {
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
                    dpk?.map((data, index) => {
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
                    pumpList.length === 0?
                    <div>Please click to select a pump</div>:
                    productType === "PMS"?
                    pms?.map((item, index) => {
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
                                        onChange={e => setTotalizer(e, item)} 
                                        style={{...imps, width:'94%', border: (Number(item.totalizerReading) > Number(item.newTotalizer)) && item.newTotalizer !== '0'? '1px solid red': '1px solid black'}} 
                                        type="number" 
                                        value={item.newTotalizer}
                                    />
                                </div>
                            </div>
                        )
                    }):
                    productType === "AGO"?
                    ago?.map((item, index) => {
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
                                        onChange={e => setTotalizer(e, item)} 
                                        value={item.newTotalizer}
                                        style={{...imps, width:'94%', border: (Number(item.totalizerReading) > Number(item.newTotalizer)) && item.newTotalizer !== '0'? '1px solid red': '1px solid black'}} 
                                        type="number" 
                                    />
                                </div>
                            </div>
                        )
                    }):
                    dpk?.map((item, index) => {
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
                                        onChange={e => setTotalizer(e, item)} 
                                        value={item.newTotalizer}
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
    fontFamily: 'Nunito-Regular',
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