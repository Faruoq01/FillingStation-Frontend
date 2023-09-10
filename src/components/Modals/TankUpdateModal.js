import React, { useState } from 'react';
import close from '../../assets/close.png';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Modal from '@mui/material/Modal';
import { ThreeDots } from  'react-loader-spinner';
import swal from 'sweetalert';
import '../../styles/lpo.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutletService from '../../services/360station/outletService';

const TankUpdateModal = (props) => {
    const [loading, setLoading] = useState(false);
    const [defaultState, setDefaultState] = useState(0);
    const [currentTank, setCurrentTank] = useState({});
    const [quantity, setQuantity] = useState('');
    const [date, setDate] = useState('');

    const handleClose = () => props.close(false);

    const handleMenuSelection = (e, data) => {
        setDefaultState(e.target.dataset.value);
        setCurrentTank(data);
    }

    const submit = () => {
        const fresh = Number(quantity) > Number(currentTank.tankCapacity);
        const prev = (Number(quantity) + Number(currentTank.currentLevel)) > Number(currentTank.tankCapacity)
        const detail = currentTank.currentLevel==="None"? fresh : prev;
        
        if(quantity === "") return swal("Warning!", "Quantity field cannot be empty", "info");
        if(date === "") return swal("Warning!", "Date field cannot be empty", "info");
        if(currentTank.activeState === '0') return swal("Warning!", "Tank is currently inactive, contact admin", "info");
        if((detail)) return swal("Warning!", "Tank capacity exceeded!", "info");

        setLoading(true);

        const payload = {
            id: currentTank._id,
            tankName: currentTank.tankName,
            tankHeight: currentTank.tankHeight,
            productType: currentTank.productType,
            tankCapacity: currentTank.tankCapacity,
            deadStockLevel: currentTank.deadStockLevel,
            calibrationDate: currentTank.calibrationDate,
            organisationID: currentTank.organisationID,
            outletID: currentTank.outletID,
            dateUpdated: date,
            station: currentTank.station,
            previousLevel: currentTank.currentLevel,
            quantityAdded: quantity,
            currentLevel: currentTank.currentLevel === "None"? quantity: String(Number(quantity) + Number(currentTank.currentLevel)),
            activeState: currentTank.activeState,
        }

        console.log(payload, 'tank payload')

        OutletService.updateTank(payload).then((data) => {
            swal("Success", data.message, "success");
        }).then(()=>{
            setLoading(false);
            props.refresh();
            setDefaultState(0)
            handleClose();
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
                <div style={{height:'580px'}} className='modalContainer2'>
                    <div className='inner'>
                        <div className='head'>
                            <div className='head-text'>Update Tank</div>
                            <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                        </div>

                       <div className='middleDiv' style={inner}>
                            <div className='inputs'>
                                <div className='head-text2'>Tank Name</div>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={defaultState}
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }}
                                >
                                    <MenuItem style={menu} value={0}>Select Tank</MenuItem>
                                    {
                                        props.data.map((item, index) => {
                                            return(
                                                <MenuItem style={menu} key={index} onClick={(e) => {handleMenuSelection(e, item)}} value={index + 1}>{item.tankName}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Current Level (Litre)</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    disabled
                                    value={currentTank.currentLevel}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Quantity Added</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    onChange={e => setQuantity(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Reference Code</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    disabled
                                    value={currentTank._id}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Date</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    type='date'
                                    onChange={e => setDate(e.target.value)}
                                />
                            </div>
                       </div>

                        <div style={{marginTop:'10px'}} className='butt'>
                            <Button sx={{
                                width:'100px', 
                                height:'30px',  
                                background: '#427BBE',
                                borderRadius: '3px',
                                fontSize:'10px',
                                marginTop:'0px',
                                '&:hover': {
                                    backgroundColor: '#427BBE'
                                }
                                }} 
                                onClick={submit}
                                variant="contained"> Save
                            </Button>

                            {loading?
                                <ThreeDots 
                                    height="60" 
                                    width="50" 
                                    radius="9"
                                    color="#076146" 
                                    ariaLabel="three-dots-loading"
                                    wrapperStyle={{}}
                                    wrapperClassName=""
                                    visible={true}
                                />: null
                            }
                        </div>
                        
                    </div>
                </div>
        </Modal>
    )
}

const inner = {
    width:'100%',
    height:'480px',
    overflowY: 'scroll',
}

const menu = {
    fontSize:'14px',
}

export default TankUpdateModal;