import React, { useCallback, useEffect, useState } from 'react';
import '../../styles/pump.scss';
import me4 from '../../assets/me4.png';
import { Button, Radio } from '@mui/material';
import OutletService from '../../services/outletService';
import { useDispatch, useSelector } from 'react-redux';
import PumpUpdate from '../Modals/PumpUpdate';
import { filterTanksRecordSales, getOneTank } from '../../store/actions/outlet';
import swal from 'sweetalert';
import DailySalesService from '../../services/DailySales';

const Dipping = (props) => {

    const [currentPump, setCurrentPump] = useState({});
    const dispatch = useDispatch();
    const mainTankList = useSelector(state => state.outletReducer.mainTankList);
    const [open, setOpen] = useState(false);
    const [PMSPumps, setPMSPumps] = useState([]);
    const [AGOPumps, setAGOPumps] = useState([]);
    const [DPKPumps, setDPKPumps] = useState([]);
    const [dipping, setDipping] = useState("");
    const oneOutletStation = useSelector(state => state.outletReducer.oneStation);
    const [productType, setProductType] = useState("PMS");

    // const getAllPumps = useCallback(() => {
    //     const PMS = mainTankList.filter(data => data.productType === "PMS");
    //     const AGO = mainTankList.filter(data => data.productType === "AGO");
    //     const DPK = mainTankList.filter(data => data.productType === "DPK");

    //     setPMSPumps(PMS);
    //     setAGOPumps(AGO);
    //     setDPKPumps(DPK);
    // }, [tankList])

    // useEffect(()=>{
    //     getAllPumps();
    // }, [getAllPumps])

    const openSalesModal = (item) => {
        setOpen(true);
        setCurrentPump(item);
        console.log(item)

        const payload = {
            id: item.hostTank
        }

        OutletService.getOneTank(payload).then((data) => {
            dispatch(getOneTank(data.stations));
        })
    }

    const dippingValue = (item) => {
        if(dipping === "") return swal("Warning!", "Please update dipping field!", "info");

        const payload = {
            id: item._id,
            dipping: dipping,
        }

        const Dipping = {
            tankID: item._id,
            productType: item.productType,
            currentLevel: item.currentLevel,
            tankName: item.tankName,
            outletID : item.outletID,
            organizationID: item.organisationID,
        }

        OutletService.updateTank(payload).then((data) => {
            return data;
        }).then(()=>{

            DailySalesService.createDipping(Dipping).then(data => {
                swal("Success!", "Dipping value updated successfully!", "success");
                console.log(data)
            }).then(()=>{
                setDipping("");
            });
        });
    }

    const onRadioClick = (data) => {
        if(data === "PMS"){
            setProductType('PMS');
            dispatch(filterTanksRecordSales("PMS"));
        }
        
        if(data === "AGO"){
            setProductType('AGO');
            dispatch(filterTanksRecordSales("AGO"));
        }

        if(data === "DPK"){
            setProductType('DPK');
            dispatch(filterTanksRecordSales("DPK"));
        }
    }

    return(
        <div className='pumpContainer'>
            {open && <PumpUpdate open={open} close={setOpen} currentStation={oneOutletStation} current={currentPump} />}

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
            
            <div style={{marginLeft:'20px'}} className='pmscont'>{productType}</div>

            <div className='pumping'>
                {
                    mainTankList.length === 0?
                    <div style={created}>No PMS tank created</div>:
                    mainTankList.map((item, index) => {
                        return(
                            <div style={{justifyContent:'flex-start', height:'260px', marginLeft:'20px', marginRight:'0px'}} key={index} className='item'>
                                <img style={{width:'80px', height:'65px', marginTop:'15px'}} src={me4}  alt="icon"/>
                                <div style={{marginTop:'0px'}} className='pop'>{item.tankName}</div>
                                <div style={{marginTop:'0px', color:'green'}} className='pop'>{`Tank capacity: ${item.tankCapacity}`}</div>
                                <div style={{marginTop:'10px'}} className='label'>Dipping (Litres)</div>
                                <Button sx={{
                                    width:'140px', 
                                    height:'30px',  
                                    background: '#06805B',
                                    borderRadius: '3px',
                                    fontSize:'12px',
                                    marginTop:'10px',
                                    textTransform: 'capitalize',
                                    '&:hover': {
                                        backgroundColor: '#06805B'
                                    }
                                    }}  
                                    onClick={()=>{dippingValue(item)}}
                                    variant="contained"> Record Sales
                                </Button>
                                <input onChange={(e)=>setDipping(e.target.value)} defaultValue={item.dipping} style={imps} type="text" />
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
    marginLeft:'10px'
}

const imps = {
    height:'30px', 
    width:'160px', 
    marginTop:'10px',
    background:'#D7D7D799',
    outline:'none',
    border:'1px solid #000',
    paddingLeft:'10px'
}

export default Dipping;