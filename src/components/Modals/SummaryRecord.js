import React, { useEffect } from 'react';
import close from '../../assets/close.png';
import Modal from '@mui/material/Modal';
import '../../styles/lpo.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import RecordSalesService from '../../services/DailyRecordSales';
import swal from 'sweetalert';
import { changeStation, updatePayload } from '../../store/actions/records';
import OutletService from '../../services/outletService';
import { useHistory } from 'react-router-dom';

const SummaryRecord = (props) => {

    const handleClose = () => props.close(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const records = useSelector(state => state.recordsReducer.load);
    const selectedPumps = useSelector(state => state.recordsReducer.selectedPumps);
    const selectedTanks = useSelector(state => state.recordsReducer.selectedTanks);
    const currentDate = useSelector(state => state.recordsReducer.currentDate);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const tankList = useSelector(state => state.outletReducer.tankList);
    console.log(records, "summary")
    console.log(selectedPumps, "Pumps")
    console.log(selectedTanks, "Tanks")

    const updateTankDetails = (product, tank) => {
        const onlyPMS = [...tankList].filter(data => data.productType === product);
        const totalTankLevel = onlyPMS.reduce((accum, current) => {
            return Number(accum) + Number(current.currentLevel);
        }, 0);

        const allPumps = selectedPumps.filter(pump => pump.hostTank === tank._id);
        const allProductPumps = selectedPumps.filter(pump => pump.productType === product);

        const sales = allPumps.reduce((accum, current) => {
            return Number(accum) + Number(current.newTotalizer) - Number(current.totalizerReading);
        }, 0);

        const productSales = allProductPumps.reduce((accum, current) => {
            return Number(accum) + Number(current.newTotalizer) - Number(current.totalizerReading);
        }, 0);

        const finalUpdate = {
            ...tank,
            pumps: allPumps,
            totalSales: sales,
            afterSales: Number(tank.currentLevel) - sales,
            outlet: oneStationData,
            totalTankLevel: totalTankLevel,
            balanceCF: totalTankLevel - productSales,
        }

        return finalUpdate;
    }

    const updateAllTanks = () => {

        const updatedTanks = selectedTanks?.map(data => {
            let update;

            if(data.productType === "PMS"){
                update = updateTankDetails("PMS", data);

            }else if(data.productType === "AGO"){
                update = updateTankDetails("AGO", data);

            }else if(data.productType === "DPK"){
                update = updateTankDetails("DPK", data);

            }

            return update;
        });

        const tankFromPayload = {...records};
        tankFromPayload['1'] = updatedTanks;
        dispatch(updatePayload(tankFromPayload));
    };

    useEffect(()=>{
        updateAllTanks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveRecordSales = () => {
        const tankFromPayload = {...records};
        const tanksRecords = tankFromPayload['1'];
        props.close(false);
        props.clops(true);

        RecordSalesService.saveRecordSales({load: records, currentDate: currentDate}).then(data => {
            tanksRecords.forEach(async(item) => {
                const payload = {
                    id: item._id,
                    previousLevel: item.previousLevel,
                    currentLevel: item.afterSales
                };

                let res = await OutletService.updateTank(payload);
                console.log(res, "updates");
            });
            
            dispatch(changeStation());
            props.refresh();
            props.setPages([1, 0, 0, 0, 0, 0]);
            props.clops(false);
        }).then(()=>{
            
            history.push('/home/daily-sales')
            swal("Success!", "Daily sales recorded successfully!", "success");
        });
    }

    const getBackground = (type) => {
        if(type === "PMS"){
            return "#50C878";

        }else if(type === "AGO"){
            return "#FFA010";

        }else if(type === "DPK"){
            return "#35393E";
        }
    }

    const removeData = (index) => {
        swal({
            title: "Alert!",
            text: "Are you sure you want to delete this record?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                const pumpUpdate = [...records['1']];
                pumpUpdate.pop(index);
                const cloneRecords  = {...records};
                cloneRecords['1'] = pumpUpdate;
                dispatch(updatePayload(cloneRecords));
            }
        });
    }

    return(
        <Modal
            open={props.open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{display:'flex', justifyContent:'center', alignItems:'center'}}
        >
                <div className='modalContainer2'>
                    <div className='inner'>
                        <div className='head'>
                            <div className='head-text'>Summary Daily Sales</div>
                            <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                        </div>

                       <div className='middleDiv' style={inner}>
                            <div style={conts}>
                                <div style={nums}>1</div>
                                <div style={texts}>Pump updates and Sales</div>
                            </div>
                            {
                                records['1']?.length === 0?
                                <div style={men}>No records</div>:
                                records['1']?.map((data, index)=> {
                                    return(
                                        <div key={index} style={{...tankContainer, background: getBackground(data.productType)}}>
                                            <div style={tankProps}>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px', fontSize:'14px', fontWeight:'bold', color: getBackground(data.productType)}}>{data.productType} ({data.tankName})</span>
                                                    <span onClick={()=>{removeData(index)}} style={butt}>Delete</span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Tank Capacity: {data.tankCapacity} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Current Level: {data.currentLevel} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Total sales: {data.totalSales} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Level Before Sales: {data.beforeSales} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Level After Sales: {data.afterSales} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Balance Brought Forward: {data.totalTankLevel} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Balance Carried Forward: {data.balanceCF} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                            </div>

                                            {
                                                data?.pumps?.length === 0?
                                                <div style={men}>No records</div>:
                                                data?.pumps?.map((item, index) => {
                                                    return(
                                                        <div key={index} style={{...wide, width:'98%'}}>
                                                            <div style={secondBox}>&nbsp;&nbsp;&nbsp; {item.pumpName}</div>
                                                            <div style={secondBox}>&nbsp;&nbsp;&nbsp; {item.sales} Ltrs</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }

                            <div style={conts}>
                                <div style={nums}>2</div>
                                <div style={texts}>Return to Tank</div>
                            </div>
                            {
                                records['2']?.length === 0?
                                <div style={men}>No records</div>:
                                records['2']?.map((data, index)=> {
                                    return(
                                        <div key={index} style={{...tankContainer, background: getBackground(data.productType)}}>
                                            <div style={tankProps}>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px', fontSize:'14px', fontWeight:'bold', color: getBackground(data.productType)}}>{data.productType} ({data.tankName})</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Tank Capacity: {data.tankCapacity} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Current Level: {data.currentLevel} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Total sales: {data.sales} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Level Before Sales: {data.beforeSales} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Level After Sales: {data.afterSales} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Total Return to tank: {data.RTlitre} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                            </div>

                                            {
                                                data?.pumps?.length === 0?
                                                <div style={men}>No records</div>:
                                                data?.pumps?.map((item, index) => {
                                                    return(
                                                        <div key={index} style={{...wide, width:'98%'}}>
                                                            <div style={secondBox}>&nbsp;&nbsp;&nbsp; {item.pumpName}</div>
                                                            <div style={secondBox}>&nbsp;&nbsp;&nbsp; {item.RTlitre} Ltrs</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }

                            <div style={conts}>
                                <div style={nums}>3</div>
                                <div style={texts}>LPO (Corporate Sales)</div>
                            </div>
                            {
                                records['3']?.length === 0?
                                <div style={men}>No records</div>:
                                records['3']?.map((data, index) => {
                                    return(
                                        <div key={index} style={wide}>
                                            <div style={firstBox}>&nbsp;&nbsp;&nbsp; {data.truckNo}</div>
                                            <div style={secondBox}>&nbsp;&nbsp;&nbsp; {data.lpoLitre} Ltrs</div>
                                        </div>
                                    )
                                })
                            }

                            <div style={conts}>
                                <div style={nums}>4</div>
                                <div style={texts}>Expenses</div>
                            </div>
                            {
                                records['4']?.length === 0?
                                <div style={men}>No records</div>:
                                records['4']?.map((data, index) => {
                                    return(
                                        <div key={index} style={wide}>
                                            <div style={firstBox}>&nbsp;&nbsp;&nbsp; {data.expenseName}</div>
                                            <div style={secondBox}>&nbsp;&nbsp;&nbsp; {data.expenseAmount} Ltrs</div>
                                        </div>
                                    )
                                })
                            }

                            <div style={conts}>
                                <div style={nums}>5</div>
                                <div style={texts}>Payments</div>
                            </div>
                            {
                                records['5']?.length === 0?
                                <div style={men}>No records</div>:
                                records['5']?.map((data, index) => {
                                    return(
                                        <div key={index} style={wide}>
                                            <div style={firstBox}>&nbsp;&nbsp;&nbsp; {data.bankName === null? data.posName: data.bankName}</div>
                                            <div style={secondBox}>&nbsp;&nbsp;&nbsp; {data.amountPaid} Ltrs</div>
                                        </div>
                                    )
                                })
                            }

                            <div style={conts}>
                                <div style={nums}>6</div>
                                <div style={texts}>Dipping</div>
                            </div>
                            {
                                records['6']?.length === 0?
                                <div style={men}>No records</div>:
                                records['6']?.map((data, index) => {
                                    return(
                                        <div key={index} style={wide}>
                                            <div style={firstBox}>&nbsp;&nbsp;&nbsp; {data.tankName + "( "+ data.productType +" )"}</div>
                                            <div style={secondBox}>&nbsp;&nbsp;&nbsp; {data.dippingValue} Ltrs</div>
                                        </div>
                                    )
                                })
                            }
                       </div>

                       <div style={{...add, justifyContent:'flex-end'}}>
                            <Button sx={{
                                width:'100px', 
                                height:'30px',  
                                background: '#427BBE',
                                borderRadius: '3px',
                                fontSize:'11px',
                                marginTop:'10px',
                                '&:hover': {
                                    backgroundColor: '#427BBE'
                                }
                                }}  
                                onClick={saveRecordSales}
                                variant="contained"> 
                                Save
                            </Button>
                        </div>
                        
                    </div>
                </div>
        </Modal>
    )
}

const butt = {
    width:'50px',
    height:'25px',
    marginRight:'10px',
    marginTop:'10px',
    background:'red',
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
}

const line = {
    width:'100%',
    fontSize:'12px',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    height:'30px',
    background:'#525252',
    alignItems:'center',
    color:'#fff',
    fontWeight:'600'
}

const tankProps = {
    width:'98%',
    height:'auto',
    borderRadius:'5px',
    overflow:'hidden',
    background:'#525252'
}

const tankContainer = {
    width:'100%',
    height:'auto',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    paddingTop:'5px',
    paddingBottom:'5px',
    marginTop:'10px'
}

const add = {
    width:'100%',
    display: 'flex',
    flexDirection:'row',
    justifyContent:'flex-start',
}

const men ={
    fontSize:'12px',
    fontWeight:'bold',
    marginBottom:'20px'
}

const texts = {
    fontSize:'14px',
    color:'#06805B',
    fontWeight:'bold'
}

const firstBox = {
    width: '40%',
    height:'30px',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    background:'#d7d7d7',
    fontSize:'12px',
    color:'#000',
    fontWeight:'700'
}

const secondBox = {
    width: '60%',
    height:'30px',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    background:'#d7d7d7',
    fontSize:'12px',
    fontWeight:'bold'
}

const nums = {
    width: '20px',
    height: '20px',
    display:'flex',
    justifyContent:'center',
    alightItems:'center',
    background:'#525252',
    borderRadius:'20px',
    color:'#fff',
    fontSize:'12px',
    marginRight: '10px'
}

const conts = {
    width:'100%',
    display:'flex',
    flexDirection:'row',
    alightItems:'center',
    marginTop:'30px',
    marginBottom:'5px',
    justifyContent:'flex-start'
}

const wide = {
    width:'100%',
    height:'30px',
    display:'flex',
    marginTop:'5px',
    flexDirection:'row',
    alignItems:'center'
}

const inner = {
    width:'100%',
    height:'510px',
    overflowY: 'scroll',
    display:'flex',
    flexDirection:'column',
    alignItems:'center'
}

export default SummaryRecord;