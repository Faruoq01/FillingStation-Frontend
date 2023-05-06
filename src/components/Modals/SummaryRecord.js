import React, { useEffect } from 'react';
import close from '../../assets/close.png';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import RecordSalesService from '../../services/DailyRecordSales';
import swal from 'sweetalert';
import { changeStation, updatePayload } from '../../store/actions/records';
import OutletService from '../../services/outletService';
import { useHistory } from 'react-router-dom';
import '../../styles/summary.scss';
import { useState } from 'react';
import ApproximateDecimal from '../common/approx';

const FuelCard = (props) => {

    const dispatch = useDispatch();
    const records = useSelector(state => state.recordsReducer.load);

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
                pumpUpdate.splice(index, 1);
                const cloneRecords  = {...records};
                cloneRecords['1'] = pumpUpdate;
                dispatch(updatePayload(cloneRecords));
            }
        });
    }

    return(
        <div style={{border:'1px solid #ccc'}} className="fuel_card">
            <div className='inner_fuel_card'>
                <div className='fuel_card_header'>
                    <span style={{fontSize:'14px', fontWeight:'bold', color: props.getBackground(props.data.productType)}}>{props.data.productType.concat(" ", props.data.tankName)} ({ApproximateDecimal(props.data.tankCapacity)+" ltrs"})</span>
                    <div onClick={()=>{removeData(props.index)}} className='fuel_delete'>Delete</div>
                </div>

                <div className='fuel_card_items'>
                    <div className='fuel_card_items_left'>
                        <div className='volum'>{ApproximateDecimal(props.data.currentLevel)} ltrs</div>
                        <div className='vol_label'>Current stock</div>
                    </div>
                    <div className='fuel_card_items_right'>
                        <div className='volum'>{ApproximateDecimal(props.data.afterSales)} ltrs</div>
                        <div className='vol_label'>Level after sales</div>
                    </div>
                </div>

                <div className='fuel_card_items'>
                    <div className='fuel_card_items_left'>
                        <div className='volum'>{ApproximateDecimal(props.data.totalSales)}</div>
                        <div className='vol_label'>Total Sales</div>
                    </div>
                    <div className='fuel_card_items_right'>
                        <div className='volum'></div>
                        <div className='vol_label'></div>
                    </div>
                </div>

                <div className='fuel_card_items'>
                    <div className='fuel_card_items_left'>
                        <div className='volum'>{ApproximateDecimal(props.data.totalTankLevel)} ltrs</div>
                        <div className='vol_label'>Balance brought forward</div>
                    </div>
                    <div className='fuel_card_items_right'>
                        <div className='volum'>{ApproximateDecimal(props.data.balanceCF)} ltrs</div>
                        <div className='vol_label'>Balance carried forward</div>
                    </div>
                </div>

                {
                    props.data?.pumps?.length === 0?
                    <div style={men}>No records</div>:
                    props.data?.pumps?.map((item, index) => {
                        return(
                            <div style={{background:'#F5F5F5', marginTop:'5px', borderRadius:'10px'}} className='fuel_card_items'>
                                <div style={{display:'flex', flexDirection:'row', alignItems:'center'}} className='fuel_card_items_left'>
                                    <div style={{marginLeft:'10px', fontSize:'14px'}} className='volum'>{item.pumpName}</div>
                                </div>
                                <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}} className='fuel_card_items_right'>
                                    <div style={{marginRight:'10px', fontSize:'14px'}} className='volum'>{ApproximateDecimal(item.sales)} ltrs</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

const ReturnToTank = (props) => {

    const dispatch = useDispatch();
    const records = useSelector(state => state.recordsReducer.load);

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
                pumpUpdate.splice(index, 1);
                const cloneRecords  = {...records};
                cloneRecords['1'] = pumpUpdate;
                dispatch(updatePayload(cloneRecords));
            }
        });
    }

    return(
        <div style={{border:'1px solid #ccc'}} className="fuel_card">
            <div className='inner_fuel_card'>
                <div className='fuel_card_header'>
                    <span style={{fontSize:'14px', fontWeight:'bold', color: props.getBackground(props.data.productType)}}>{props.data.productType.concat(" ", props.data.tankName)} ({ApproximateDecimal(props.data.tankCapacity)+ " ltrs"})</span>
                    <div onClick={()=>{removeData(props.index)}} className='fuel_delete'>Delete</div>
                </div>

                <div className='fuel_card_items'>
                    <div className='fuel_card_items_left'>
                        <div className='volum'>{ApproximateDecimal(props.data.RTlitre)} ltrs</div>
                        <div className='vol_label'>Return to tank</div>
                    </div>
                    <div className='fuel_card_items_right'>
                        <div className='volum'></div>
                        <div className='vol_label'></div>
                    </div>
                </div>

                {
                    props.data?.pumps?.length === 0?
                    <div style={men}>No records</div>:
                    props.data?.pumps?.map((item, index) => {
                        return(
                            <div style={{background:'#F5F5F5', marginTop:'5px', borderRadius:'10px'}} className='fuel_card_items'>
                                <div style={{display:'flex', flexDirection:'row', alignItems:'center'}} className='fuel_card_items_left'>
                                    <div style={{marginLeft:'10px', fontSize:'14px'}} className='volum'>{item.pumpName}</div>
                                </div>
                                <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'flex-end'}} className='fuel_card_items_right'>
                                    <div style={{marginRight:'10px', fontSize:'14px'}} className='volum'>{ApproximateDecimal(item.RTlitre)} ltrs</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

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
    const [stop, setStop] = useState(false);
    // console.log(records, "summary")
    // console.log(selectedPumps, "Pumps")
    // console.log(selectedTanks, "Tanks")

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
            productSales: productSales,
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
        setStop(true);
        const tankFromPayload = {...records};
        const tanksRecords = tankFromPayload['1'];
        props.close(false);
        props.clops(true);

        RecordSalesService.saveRecordSales({load: records, currentDate: currentDate}).then(data => {
            tanksRecords.forEach(async(item) => {
                const payload = {
                    id: item._id,
                    tankName: item.tankName.split(' ')[1],
                    previousLevel: item.previousLevel,
                    currentLevel: Number(item.RTlitre) > 0? Number(item.RTlitre) + Number(item.afterSales): Number(item.afterSales),
                };

                await OutletService.updateTank(payload);
            });
            
            dispatch(changeStation());
            props.refresh();
            props.setPages([1, 0, 0, 0, 0, 0]);
            props.clops(false);
        }).then(()=>{
            setStop(false);
            history.push('/home/daily-record-sales')
            swal("Success!", "Daily sales recorded successfully!", "success");
        });
    }

    const getBackground = (type) => {
        if(type === "PMS"){
            return "#06805B";

        }else if(type === "AGO"){
            return "#FFA010";

        }else if(type === "DPK"){
            return "#35393E";
        }
    }

    return(
        <Modal
            open={props.open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{display:'flex', justifyContent:'center', alignItems:'center'}}
        >
            <div style={{background:'#F5F5F5', flexDirection:'column'}} className='modalContainer2'>
                <div style={topStyle} className='head'>
                    <div className='head-text'>Summary Daily Sales</div>
                    <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                </div>

                <div style={inner} className='inner'>

                    <div className='tank_label'>
                        <div style={conts}>
                            <div style={nums}>1</div>
                            <div style={texts}>Pump updates and Sales</div>
                        </div>

                        {
                            records['1']?.length === 0?
                            <div style={men}>No records</div>:
                            records['1']?.map((data, index)=> {
                                return(
                                    <FuelCard index={index} key={index} data={data} getBackground={getBackground} />
                                )
                            })
                        }
                    </div>

                    <div className='tank_label'>
                        <div style={conts}>
                            <div style={nums}>2</div>
                            <div style={texts}>Return To Tank</div>
                        </div>

                        {
                            records['2']?.length === 0?
                            <div style={men}>No records</div>:
                            records['2']?.map((data, index)=> {
                                return(
                                    <ReturnToTank index={index} key={index} data={data} getBackground={getBackground} />
                                )
                            })
                        }
                    </div>

                    <div className='tank_label'>
                        <div style={conts}>
                            <div style={nums}>3</div>
                            <div style={texts}>LPO (Corporate Sales)</div>
                        </div>

                        {
                            records['3']?.length === 0?
                            <div style={men}>No records</div>:
                            records['3']?.map((data, index)=> {
                                return(
                                    <div className="other_label">
                                        <div className="other_inner">
                                            <div className='fuel_card_items'>
                                                <div className='fuel_card_items_left'>
                                                    <div className='volum'>{data.truckNo}</div>
                                                    <div className='vol_label'>Truck No</div>
                                                </div>
                                                <div className='fuel_card_items_right'>
                                                    <div className='volum'>{ApproximateDecimal(data.lpoLitre)} ltrs</div>
                                                    <div className='vol_label'>LPO Volume</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className='tank_label'>
                        <div style={conts}>
                            <div style={nums}>4</div>
                            <div style={texts}>Expenses</div>
                        </div>

                        {
                            records['4']?.length === 0?
                            <div style={men}>No records</div>:
                            records['4']?.map((data, index) => {
                                return(
                                    <div className="other_label">
                                        <div className="other_inner">
                                            <div className='fuel_card_items'>
                                                <div className='fuel_card_items_left'>
                                                    <div className='volum'>{data.expenseName}</div>
                                                    <div className='vol_label'>Expense Name</div>
                                                </div>
                                                <div className='fuel_card_items_right'>
                                                    <div className='volum'>NGN {ApproximateDecimal(data.expenseAmount)}</div>
                                                    <div className='vol_label'>Expense Amount</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className='tank_label'>
                        <div style={conts}>
                            <div style={nums}>5</div>
                            <div style={texts}>Payments</div>
                        </div>

                        {
                            records['5']?.length === 0?
                            <div style={men}>No records</div>:
                            records['5']?.map((data, index) => {
                                return(
                                    <div className="other_label">
                                        <div className="other_inner">
                                            <div className='fuel_card_items'>
                                                <div className='fuel_card_items_left'>
                                                    <div className='volum'>{data.bankName === null? data.posName: data.bankName}</div>
                                                    <div className='vol_label'>Payment Type</div>
                                                </div>
                                                <div className='fuel_card_items_right'>
                                                    <div className='volum'> NGN {ApproximateDecimal(data.amountPaid)}</div>
                                                    <div className='vol_label'>Amount Paid</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className='tank_label'>
                        <div style={conts}>
                            <div style={nums}>6</div>
                            <div style={texts}>Dipping</div>
                        </div>

                        {
                            records['6']?.length === 0?
                            <div style={men}>No records</div>:
                            records['6']?.map((data, index) => {
                                return(
                                    <div className="other_label">
                                        <div className="other_inner">
                                            <div className='fuel_card_items'>
                                                <div className='fuel_card_items_left'>
                                                    <div className='volum'>{data.tankName + "( "+ data.productType +" )"}</div>
                                                    <div className='vol_label'>Product</div>
                                                </div>
                                                <div className='fuel_card_items_right'>
                                                    <div className='volum'>{ApproximateDecimal(data.dippingValue)} Ltrs</div>
                                                    <div className='vol_label'>Stock level</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <div style={{...add, justifyContent:'flex-end'}}>
                    <Button disabled={stop} sx={{
                        width:'100px', 
                        height:'30px',  
                        background: '#427BBE',
                        borderRadius: '3px',
                        fontSize:'11px',
                        marginRight:'10px',
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
        </Modal>
    )
}

const add = {
    width:'100%',
    height:'auto',
    display: 'flex',
    flexDirection:'row',
    justifyContent:'flex-start',
    alightItems:'center',
    marginBottom:'10px',
    marginTop:'10px'
}

const men ={
    width:'100%',
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    fontSize:'12px',
    fontWeight:'bold',
    marginBottom:'20px'
}

const texts = {
    fontSize:'14px',
    color:'#000',
    fontWeight:'bold'
}

const nums = {
    width: '20px',
    height: '20px',
    display:'flex',
    justifyContent:'center',
    alightItems:'center',
    background:'#454343',
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
    justifyContent:'flex-start',
    color:'#000'
}

const inner = {
    width:'94%',
    height:'500px',
    overflowY: 'scroll',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
}

const topStyle = {
    width:'94%',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    fontWeight:'bold',
    fontSize:'16px',
    marginBottom:'10px'
}

export default SummaryRecord;