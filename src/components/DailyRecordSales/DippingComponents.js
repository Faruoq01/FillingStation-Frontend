import { Radio } from "@mui/material"
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import me4 from '../../assets/me4.png';
import { updatePayload } from "../../store/actions/records";

const returnColor = (data, style) => {
    if(data === "PMS"){
        return {...style, background: "#054834", color: '#fff'};

    }else if(data === "AGO"){
        return {...style, background: "#FFA010"};

    }else if(data === "DPK"){
        return {...style, background: "#35393E", color: '#fff'};
    }
}

const DippingComponents = (props) => {

    const [productType, setProductType] = useState("PMS");
    const dispatch = useDispatch();

    /////////////////////////////////////////////////////////
    const records = useSelector(state => state.recordsReducer.load);
    const tankList = useSelector(state => state.outletReducer.tankList);

    const getPMSPump = useCallback(() => {
        const newList = [...tankList];
        const pms = newList.filter(data => data.productType === "PMS");
        const pmsCopy = pms.map(data => Object.assign({}, data));
        return pmsCopy;
    }, [tankList]);

    const getAGOPump = useCallback(() => {
        const newList = [...tankList];
        const ago = newList.filter(data => data.productType === "AGO");
        const agoCopy = ago.map(data => Object.assign({}, data));
        return agoCopy;
    }, [tankList]);

    const getDPKPump = useCallback(() => {
        const newList = [...tankList];
        const dpk = newList.filter(data => data.productType === "DPK");
        const dpkCopy = dpk.map(data => Object.assign({}, data));
        return dpkCopy;
    }, [tankList]);

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

    const setTotalizer = (e, item, index) => {

        if(item.productType === "PMS"){
            let clonedPMS = {...item};
            clonedPMS = {...clonedPMS, dippingValue: e.target.value};
            const newPMSList = [...pms];
            newPMSList[index] = clonedPMS;
            setPMS(newPMSList);

            const tankFromPayload = {...records};
            const indices = tankFromPayload['6'].findIndex(data => data._id === item._id);
            if(indices === -1){
                tankFromPayload['6'].push(clonedPMS);
                dispatch(updatePayload(tankFromPayload));

            }else{
                tankFromPayload['6'][indices] = clonedPMS;
                dispatch(updatePayload(tankFromPayload));

            }

        }else if(item.productType === "AGO"){
            let clonedAGO = {...item};
            clonedAGO = {...clonedAGO, dippingValue: e.target.value};
            const newAGOList = [...ago]
            newAGOList[index] = clonedAGO;
            setAGO(newAGOList);

            const tankFromPayload = {...records};
            const indices = tankFromPayload['6'].findIndex(data => data._id === item._id);
            if(indices === -1){
                tankFromPayload['6'].push(clonedAGO);
                dispatch(updatePayload(tankFromPayload));

            }else{
                tankFromPayload['6'][indices] = clonedAGO;
                dispatch(updatePayload(tankFromPayload));

            }

        }else if(item.productType === "DPK"){
            let clonedDPK = {...item};
            clonedDPK = {...clonedDPK, dippingValue: e.target.value};
            const newDPKList = [...dpk]
            newDPKList[index] = clonedDPK;
            setDPK(newDPKList);

            const tankFromPayload = {...records};
            const indices = tankFromPayload['6'].findIndex(data => data._id === item._id);
            if(indices === -1){
                tankFromPayload['6'].push(clonedDPK);
                dispatch(updatePayload(tankFromPayload));

            }else{
                tankFromPayload['6'][indices] = clonedDPK;
                dispatch(updatePayload(tankFromPayload));

            }
        }
    }

    return(
        <div style={{flexDirection: 'column', alignItems:'flex-start'}} className='inner-body'>

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
            
            <div style={returnColor(productType, pro)}>
                <span style={{marginLeft:'15px'}}>{productType}</span>
            </div>

            <div style={{width:'100%',}} className='pumping'>
                {
                    tankList.length === 0?
                    <div style={created}>No PMS tank created</div>:
                    productType === "PMS"?
                    pms.map((item, index) => {
                        return(
                            <div style={{justifyContent:'flex-start', height:'210px', marginLeft:'20px', marginRight:'0px'}} key={index} className='item'>
                                <img style={{width:'80px', height:'65px', marginTop:'15px'}} src={me4}  alt="icon"/>
                                <div style={{marginTop:'0px'}} className='pop'>{item.tankName+"( "+ item.productType +" )"}</div>
                                <div style={{marginTop:'0px', color:'green'}} className='pop'>{`Tank capacity: ${item.tankCapacity}`}</div>
                                <div style={{marginTop:'10px'}} className='label'>Dipping (Litres)</div>

                                <input value={item.dippingValue} onChange={e => setTotalizer(e, item, index)} style={imps} type="text" />
                            </div>
                        )
                    }):
                    productType === "AGO"?
                    ago.map((item, index) => {
                        return(
                            <div style={{justifyContent:'flex-start', height:'210px', marginLeft:'20px', marginRight:'0px'}} key={index} className='item'>
                                <img style={{width:'80px', height:'65px', marginTop:'15px'}} src={me4}  alt="icon"/>
                                <div style={{marginTop:'0px'}} className='pop'>{item.tankName+"( "+ item.productType +" )"}</div>
                                <div style={{marginTop:'0px', color:'green'}} className='pop'>{`Tank capacity: ${item.tankCapacity}`}</div>
                                <div style={{marginTop:'10px'}} className='label'>Dipping (Litres)</div>

                                <input value={item.dippingValue} onChange={e => setTotalizer(e, item, index)} style={imps} type="text" />
                            </div>
                        )
                    }):
                    productType === "DPK"?
                    dpk.map((item, index) => {
                        return(
                            <div style={{justifyContent:'flex-start', height:'210px', marginLeft:'20px', marginRight:'0px'}} key={index} className='item'>
                                <img style={{width:'80px', height:'65px', marginTop:'15px'}} src={me4}  alt="icon"/>
                                <div style={{marginTop:'0px'}} className='pop'>{item.tankName+"( "+ item.productType +" )"}</div>
                                <div style={{marginTop:'0px', color:'green'}} className='pop'>{`Tank capacity: ${item.tankCapacity}`}</div>
                                <div style={{marginTop:'10px'}} className='label'>Dipping (Litres)</div>

                                <input value={item.dippingValue} onChange={e => setTotalizer(e, item, index)} style={imps} type="text" />
                            </div>
                        )
                    }): null
                }
            </div>
        </div>
    )
}

const pro = {
    width:'98%',
    height: "35px",
    borderRadius:'20px',
    display:'flex',
    alignItems:'center',
    justifyContent:'flex-start',
    fontWeight:'bold',
    marginTop:'20px',
    marginLeft:'1%',
}

const rad = {
    display: 'flex',
    flexDirection:'row',
    justifyContent:'center'
}

const created = {
    width:'100%',
    fontSize:'14px',
    marginLeft:'10px',
    marginTop:'20px',
    marginBottom: '20px',
    fontWeight:'bold',
    textAlign:'center',
}

const imps = {
    height:'30px', 
    width:'170px', 
    background:'#D7D7D799',
    outline:'none',
    border:'1px solid #000',
    paddingLeft:'10px',
    marginTop:'10px'
}

export default DippingComponents;