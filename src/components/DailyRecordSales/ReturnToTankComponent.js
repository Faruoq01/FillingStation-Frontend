import { Radio } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import pump1 from '../../assets/pump1.png';
import cross from '../../assets/cross.png';
import { useSelector } from "react-redux";
import swal from "sweetalert";

const mediaMatch = window.matchMedia('(max-width: 450px)');

const ReturnToTank = (props) => {

    const [productType, setProductType] = useState("PMS");
    const [selectedPumps, setSelected] = useState([]);
    const [selectedTanks, setSelectedTanks] = useState([]);
    const tankList = useSelector(state => state.outletReducer.tankList);
    const linkedData = useSelector(state => state.dailySalesReducer.linkedData);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    console.log(linkedData, 'kslfhbfdkjbhfdbjhfdbjhkfvbjv')

    const getPMSPump = useCallback(() => {
        if(linkedData?.head?.prev?.data?.selectedPumps?.length === 0){
            return []
        }else{
            const newList = [...linkedData?.head?.prev?.data?.selectedPumps];
            const pms = newList.filter(data => data.productType === "PMS");
            const pmsCopy = pms.map(data => Object.assign({}, data));
            return pmsCopy;
        }
    }, [linkedData?.head?.prev?.data?.selectedPumps]);

    const getAGOPump = useCallback(() => {
        if(linkedData?.head?.prev?.data?.selectedPumps?.length === 0){
            return []
        }else{
            const newList = [...linkedData?.head?.prev?.data?.selectedPumps];
            const ago = newList.filter(data => data.productType === "AGO");
            const agoCopy = ago.map(data => Object.assign({}, data));
            return agoCopy;
        }
    }, [linkedData?.head?.prev?.data?.selectedPumps]);

    const getDPKPump = useCallback(() => {
        if(linkedData?.head?.prev?.data?.selectedPumps?.length === 0){
            return []
        }else{
            const newList = [...linkedData?.head?.prev?.data?.selectedPumps];
            const dpk = newList.filter(data => data.productType === "DPK");
            const dpkCopy = dpk.map(data => Object.assign({}, data));
            return dpkCopy;
        }
    }, [linkedData?.head?.prev?.data?.selectedPumps]);

    const [pms, setPMS] = useState(getPMSPump());
    const [ago, setAGO] = useState(getAGOPump());
    const [dpk, setDPK] = useState(getDPKPump());
   
    useEffect(()=>{
        if(linkedData?.head?.data?.pms.length === 0){
            setSelected(linkedData?.head?.prev?.data?.selectedPumps);
            setSelectedTanks(linkedData?.head?.prev?.data?.selectedTanks);
            setPMS(getPMSPump());
        }else{
            setPMS(linkedData?.head?.data?.pms);
            setSelected(linkedData?.head?.data?.selectedPumps);
            setSelectedTanks(linkedData?.head?.data?.selectedTanks);
        }

        if(linkedData?.head?.data?.ago.length === 0){
            setSelected(linkedData?.head?.prev?.data?.selectedPumps);
            setSelectedTanks(linkedData?.head?.prev?.data?.selectedTanks);
            setAGO(getAGOPump());
        }else{
            setAGO(linkedData?.head?.data?.ago);
            setSelected(linkedData?.head?.data?.selectedPumps);
            setSelectedTanks(linkedData?.head?.data?.selectedTanks);
        }
        
        if(linkedData?.head?.data?.dpk.length === 0){
            setSelected(linkedData?.head?.prev?.data?.selectedPumps);
            setSelectedTanks(linkedData?.head?.prev?.data?.selectedTanks);
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
        const cloneTanks = [...linkedData?.head?.prev?.data?.selectedTanks];
        const tank = cloneTanks.filter(data => data._id === item.hostTank)[0];

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

    const updateTotalizer = (e, item) => {
        
        if(productType === "PMS"){
            const newPms = [...pms];
            const findID = newPms.findIndex(data => data._id === item._id);
            newPms[findID].RTlitre = e;
            setPMS(newPms);

        }else if(productType === "AGO"){
            const newAgo = [...ago];
            const findID = newAgo.findIndex(data => data._id === item._id);
            newAgo[findID].RTlitre = e;
            setAGO(newAgo);

        }else{
            const newDpk = [...dpk];
            const findID = newDpk.findIndex(data => data._id === item._id);
            newDpk[findID].RTlitre = e;
            setDPK(newDpk);
        }

        // update tank payload
        const newTankList = [...linkedData?.head?.prev?.data?.selectedTanks];
        const tankID = newTankList.findIndex(data => data._id === item.hostTank);
        console.log(Number(newTankList[tankID].fakeLevelOne), "fake tanks rt")
        if(tankID !== -1){
            newTankList[tankID] = {
                ...newTankList[tankID], 
                pumps: selectedPumps.filter(data => data.hostTank === newTankList[tankID]._id),
                outlet: oneStationData,
                fakeLevelTwo: Number(newTankList[tankID].fakeLevelOne) + Number(Number(e) < 0? 0: Number(e)),
                fakeLevelThree: Number(newTankList[tankID].fakeLevelOne) + Number(Number(e) < 0? 0: Number(e))
            }
            setSelectedTanks(newTankList);
        }
        saveReturnToTank(newTankList);
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
                        updateTotalizer(e.target.value, item);
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

    const saveReturnToTank = (newTankList) => {
        
        for(let tank of newTankList){

            const totalSales = tank.pumps.reduce((accum, current) => {
                return Number(accum) + Number(current.RTlitre);
            }, 0);
            
            const findID = newTankList.findIndex(data => data._id === tank._id);
            newTankList[findID].RTlitre = totalSales;
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
                    linkedData?.head?.prev?.data?.selectedPumps?.length === 0?
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
                    linkedData?.head?.prev?.data?.selectedPumps.length === 0?
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

const add = {
    width:'100%',
    display: 'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop:'30px'
}

export default ReturnToTank;