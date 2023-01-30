import { Radio } from "@mui/material"
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import me4 from '../../assets/me4.png';
import { updatePayload } from "../../store/actions/records";

const DippingComponents = (props) => {

    const [productType, setProductType] = useState("PMS");
    const tankList = useSelector(state => state.outletReducer.tankList);
    const dispatch = useDispatch();

    /////////////////////////////////////////////////////////
    const records = useSelector(state => state.recordsReducer.load);
    const selectedPumps = useSelector(state => state.recordsReducer.selectedPumps);
    const selectedTanks = useSelector(state => state.recordsReducer.selectedTanks);

    console.log(selectedPumps, "selected pumps")
    console.log(selectedTanks, "selected tanks")
    console.log(records, "records")

    const getPMSPump = useCallback(() => {
        const newList = [...selectedTanks];
        const pms = newList.filter(data => data.productType === "PMS");
        const pmsCopy = pms.map(data => Object.assign({}, data));
        return pmsCopy;
    }, [selectedTanks]);

    const getAGOPump = useCallback(() => {
        const newList = [...selectedTanks];
        const ago = newList.filter(data => data.productType === "AGO");
        const agoCopy = ago.map(data => Object.assign({}, data));
        return agoCopy;
    }, [selectedTanks]);

    const getDPKPump = useCallback(() => {
        const newList = [...selectedTanks];
        const dpk = newList.filter(data => data.productType === "DPK");
        const dpkCopy = dpk.map(data => Object.assign({}, data));
        return dpkCopy;
    }, [selectedTanks]);

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

    const setTotalizer = (e, item) => {
        let clonedPMS = {...item};
        clonedPMS = {...clonedPMS, dippingValue: e.target.value};
        const allTanks = selectedTanks.filter(data => data.productType === item.productType);
        const findID = allTanks.findIndex(data => data._id === item._id);

        if(findID === -1){
            swal("Warning!", "This was not used for sales today!", "info");

        }else{

            if(item.productType === "PMS"){
                const newList = [...allTanks]
                newList[findID] = clonedPMS;
                setPMS(newList);

            }else if(item.productType === "AGO"){
                const newList = [...allTanks]
                newList[findID] = clonedPMS;
                setAGO(newList);

            }else{
                const newList = [...allTanks]
                newList[findID] = clonedPMS;
                setDPK(newList);
            }

            const tankFromPayload = {...records};
            const indices = tankFromPayload['6'].findIndex(data => data._id === item._id);
            if(indices === -1){
                tankFromPayload['6'].push(clonedPMS);
                dispatch(updatePayload(tankFromPayload));

            }else{
                tankFromPayload['6'][indices] = clonedPMS;
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
            
            <div style={{width:'100%'}} className='pmscont'>{productType}</div>

            <div className='pumping'>
                {
                    tankList.length === 0?
                    <div style={created}>No PMS tank created</div>:
                    productType === "PMS"?
                    pms.map((item, index) => {
                        return(
                            <div style={{justifyContent:'flex-start', height:'210px', marginLeft:'20px', marginRight:'0px'}} key={index} className='item'>
                                <img style={{width:'80px', height:'65px', marginTop:'15px'}} src={me4}  alt="icon"/>
                                <div style={{marginTop:'0px'}} className='pop'>{item.tankName}</div>
                                <div style={{marginTop:'0px', color:'green'}} className='pop'>{`Tank capacity: ${item.tankCapacity}`}</div>
                                <div style={{marginTop:'10px'}} className='label'>Dipping (Litres)</div>

                                <input onChange={e => setTotalizer(e, item)} defaultValue={"0"} style={imps} type="text" />
                            </div>
                        )
                    }):
                    productType === "AGO"?
                    ago.map((item, index) => {
                        return(
                            <div style={{justifyContent:'flex-start', height:'210px', marginLeft:'20px', marginRight:'0px'}} key={index} className='item'>
                                <img style={{width:'80px', height:'65px', marginTop:'15px'}} src={me4}  alt="icon"/>
                                <div style={{marginTop:'0px'}} className='pop'>{item.tankName}</div>
                                <div style={{marginTop:'0px', color:'green'}} className='pop'>{`Tank capacity: ${item.tankCapacity}`}</div>
                                <div style={{marginTop:'10px'}} className='label'>Dipping (Litres)</div>

                                <input onChange={e => setTotalizer(e, item)} defaultValue={"0"} style={imps} type="text" />
                            </div>
                        )
                    }):
                    dpk.map((item, index) => {
                        return(
                            <div style={{justifyContent:'flex-start', height:'210px', marginLeft:'20px', marginRight:'0px'}} key={index} className='item'>
                                <img style={{width:'80px', height:'65px', marginTop:'15px'}} src={me4}  alt="icon"/>
                                <div style={{marginTop:'0px'}} className='pop'>{item.tankName}</div>
                                <div style={{marginTop:'0px', color:'green'}} className='pop'>{`Tank capacity: ${item.tankCapacity}`}</div>
                                <div style={{marginTop:'10px'}} className='label'>Dipping (Litres)</div>

                                <input onChange={e => setTotalizer(e, item)} defaultValue={"0"} style={imps} type="text" />
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

const created = {
    fontSize:'12px',
    marginLeft:'10px',
    marginTop:'20px',
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