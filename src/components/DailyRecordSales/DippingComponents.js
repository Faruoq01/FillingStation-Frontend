import { Radio } from "@mui/material"
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import me4 from '../../assets/me4.png';
import { updatePayload } from "../../store/actions/records";
import ApproximateDecimal from "../common/approx";
import OutletService from "../../services/outletService";
import { ThreeDots } from "react-loader-spinner";

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
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    /////////////////////////////////////////////////////////
    const records = useSelector(state => state.recordsReducer.load);
    const user = useSelector(state => state.authReducer.user);
    const [pms, setPMS] = useState([]);
    const [ago, setAGO] = useState([]);
    const [dpk, setDPK] = useState([]);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const selectedPumps = useSelector(state => state.recordsReducer.selectedPumps);

    const resolveUserID = () => {
        if(user.userType === "superAdmin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
        }
    }

    const getStationTanks = useCallback(()=>{
        setLoading(true);
        const payload = {
            outletID: oneStationData._id, 
            organisationID: resolveUserID().id
        }

        OutletService.getAllOutletTanks(payload).then(data => {
            const outletTanks = data.stations.map(data => {
                const newData = {...data, label: data.tankName, value: data._id};
                return newData;
            });
            
            setPMS(getPMSPump(outletTanks));
            setAGO(getAGOPump(outletTanks));
            setDPK(getDPKPump(outletTanks));
        }).then(()=>{
            setLoading(false);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oneStationData._id]);

    useEffect(()=>{
        getStationTanks();
    }, [getStationTanks])

    const getPMSPump = (tankList) => {
        const newList = [...tankList];
        const pms = newList.filter(data => data.productType === "PMS");
        const pmsCopy = pms.map(data => Object.assign({}, data));
        return pmsCopy;
    }

    const getAGOPump = (tankList) => {
        const newList = [...tankList];
        const ago = newList.filter(data => data.productType === "AGO");
        const agoCopy = ago.map(data => Object.assign({}, data));
        return agoCopy;
    }

    const getDPKPump = (tankList) => {
        const newList = [...tankList];
        const dpk = newList.filter(data => data.productType === "DPK");
        const dpkCopy = dpk.map(data => Object.assign({}, data));
        return dpkCopy;
    }

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

    function removeSpecialCharacters(str) {
        return str.replace(/[^0-9.]/g, '');
    }

    const setTotalizer = (e, item, index) => {

        if(item.productType === "PMS"){
            const connectedPumps = selectedPumps.filter(data => data.hostTank === item._id);
            const totalSales = connectedPumps.reduce((accum, current) => {
                return Number(accum) + Number(current.sales);
            }, 0);

            const levelAfterSales = Number(item.currentLevel) - totalSales;
            let clonedPMS = {...item};
            clonedPMS = {...clonedPMS, dippingValue: removeSpecialCharacters(e.target.value), afterSales: levelAfterSales};
            const newPMSList = [...pms];
            newPMSList[index] = clonedPMS;
            setPMS(newPMSList);

            const tankFromPayload = {...records};
            const indices = tankFromPayload['7'].findIndex(data => data._id === item._id);
            if(indices === -1){
                tankFromPayload['7'].push(clonedPMS);
                dispatch(updatePayload(tankFromPayload));

            }else{
                tankFromPayload['7'][indices] = clonedPMS;
                dispatch(updatePayload(tankFromPayload));

            }

        }else if(item.productType === "AGO"){
            const connectedPumps = selectedPumps.filter(data => data.hostTank === item._id);
            const totalSales = connectedPumps.reduce((accum, current) => {
                return Number(accum) + Number(current.sales);
            }, 0);

            const levelAfterSales = Number(item.currentLevel) - totalSales;
            let clonedAGO = {...item};
            clonedAGO = {...clonedAGO, dippingValue: removeSpecialCharacters(e.target.value), afterSales: levelAfterSales};
            const newAGOList = [...ago]
            newAGOList[index] = clonedAGO;
            setAGO(newAGOList);

            const tankFromPayload = {...records};
            const indices = tankFromPayload['7'].findIndex(data => data._id === item._id);
            if(indices === -1){
                tankFromPayload['7'].push(clonedAGO);
                dispatch(updatePayload(tankFromPayload));

            }else{
                tankFromPayload['7'][indices] = clonedAGO;
                dispatch(updatePayload(tankFromPayload));

            }

        }else if(item.productType === "DPK"){
            const connectedPumps = selectedPumps.filter(data => data.hostTank === item._id);
            const totalSales = connectedPumps.reduce((accum, current) => {
                return Number(accum) + Number(current.sales);
            }, 0);

            const totalSalesRT = connectedPumps.reduce((accum, current) => {
                return Number(accum) + Number(current.RTlitre);
            }, 0);

            const levelAfterSales = Number(item.currentLevel) - totalSales + totalSalesRT;
            let clonedDPK = {...item};
            clonedDPK = {...clonedDPK, dippingValue: removeSpecialCharacters(e.target.value), afterSales: levelAfterSales};
            const newDPKList = [...dpk]
            newDPKList[index] = clonedDPK;
            setDPK(newDPKList);

            const tankFromPayload = {...records};
            const indices = tankFromPayload['7'].findIndex(data => data._id === item._id);
            if(indices === -1){
                tankFromPayload['7'].push(clonedDPK);
                dispatch(updatePayload(tankFromPayload));

            }else{
                tankFromPayload['7'][indices] = clonedDPK;
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
                    pms.length === 0?
                    <div style={created}>
                        {
                            loading?
                            <ThreeDots 
                                height="60" 
                                width="50" 
                                radius="9"
                                color="#076146" 
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClassName=""
                                visible={true}
                            />:
                            <span>No tanks loaded</span>
                        }
                    </div>:
                    productType === "PMS"?
                    pms.map((item, index) => {
                        return(
                            <div style={{justifyContent:'flex-start', height:'230px', marginLeft:'20px', marginRight:'0px'}} key={index} className='item'>
                                <img style={{width:'80px', height:'65px', marginTop:'15px'}} src={me4}  alt="icon"/>
                                <div style={{marginTop:'0px'}} className='pop'>{item.tankName+"( "+ item.productType +" )"}</div>
                                <div style={{marginTop:'5px', color:'green'}} className='pop'>{`Tank capacity: ${item.tankCapacity}`}</div>
                                <div style={{marginTop:'5px', color:'green'}} className='pop'>{`Opening stock: ${ApproximateDecimal(item.currentLevel)}`}</div>
                                <div style={{marginTop:'10px'}} className='label'>Dipping (Litres)</div>

                                <input value={item.dippingValue} onChange={e => setTotalizer(e, item, index)} style={imps} type="text" />
                            </div>
                        )
                    }):
                    productType === "AGO"?
                    ago.map((item, index) => {
                        return(
                            <div style={{justifyContent:'flex-start', height:'230px', marginLeft:'20px', marginRight:'0px'}} key={index} className='item'>
                                <img style={{width:'80px', height:'65px', marginTop:'15px'}} src={me4}  alt="icon"/>
                                <div style={{marginTop:'0px'}} className='pop'>{item.tankName+"( "+ item.productType +" )"}</div>
                                <div style={{marginTop:'5px', color:'green'}} className='pop'>{`Tank capacity: ${item.tankCapacity}`}</div>
                                <div style={{marginTop:'5px', color:'green'}} className='pop'>{`Opening stock: ${ApproximateDecimal(item.currentLevel)}`}</div>
                                <div style={{marginTop:'10px'}} className='label'>Dipping (Litres)</div>

                                <input value={item.dippingValue} onChange={e => setTotalizer(e, item, index)} style={imps} type="text" />
                            </div>
                        )
                    }):
                    productType === "DPK"?
                    dpk.map((item, index) => {
                        return(
                            <div style={{justifyContent:'flex-start', height:'230px', marginLeft:'20px', marginRight:'0px'}} key={index} className='item'>
                                <img style={{width:'80px', height:'65px', marginTop:'15px'}} src={me4}  alt="icon"/>
                                <div style={{marginTop:'0px'}} className='pop'>{item.tankName+"( "+ item.productType +" )"}</div>
                                <div style={{marginTop:'5px', color:'green'}} className='pop'>{`Tank capacity: ${item.tankCapacity}`}</div>
                                <div style={{marginTop:'5px', color:'green'}} className='pop'>{`Opening stock: ${ApproximateDecimal(item.currentLevel)}`}</div>
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
    display:'flex',
    flexDirection:'row',
    justifyContent:'center'
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