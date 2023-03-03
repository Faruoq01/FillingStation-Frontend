import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../store/actions/outlet';
import { useSelector } from 'react-redux';
import close from '../../assets/close.png';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Modal from '@mui/material/Modal';
import { ThreeDots } from  'react-loader-spinner';
import Radio from '@mui/material/Radio';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import swal from 'sweetalert';
import OutletService from '../../services/outletService';

const AddPump = (props) => {

    const dispatch = useDispatch();
    const open = useSelector(state => state.outletReducer.openModal);
    const oneTank = useSelector(state => state.outletReducer.oneTank);

    const [defaultState, setDefaultState] = useState(0);
    const [productType, setProduct] = useState('');
    const [pumpName, setPumpName] = useState('');
    const [totalizer, setTotalizer] = useState('');
    const [waiting, setWaiting] = useState(false);
    const [loadingSpinner, setLoadingSpinner] = useState(false);

    const handleClose = () => dispatch(closeModal(0));

    const handleOpen = () => {
        if(oneTank === null) return swal("Warning!", "Please create a station", "info");
        if(pumpName === "") return swal("Warning!", "Pump name field cannot be empty", "info");
        if(defaultState === "") return swal("Warning!", "Tank name field cannot be empty", "info");
        if(productType === "") return swal("Warning!", "Product type field cannot be empty", "info");
        if(totalizer === "") return swal("Warning!", "Totalizer field cannot be empty", "info");
        setWaiting(true);
        setLoadingSpinner(true);

        const payload = {
            pumpName: pumpName,
            hostTank: oneTank?._id,
            hostTankName: oneTank?.tankName,
            productType: productType,
            totalizerReading: totalizer,
            organisationID: oneTank?.organisationID,
            outletID: oneTank?.outletID
        }

        OutletService.registerPumps(payload).then(data => {
            if(data.status === "exist"){
                setWaiting(false);
                setLoadingSpinner(false);
                handleClose();
                swal("Warning!", data.message, "info");

            }else{
                setWaiting(false);
                setLoadingSpinner(false);
                handleClose();
                swal("Success!", "Pump created successfully!", "success");
            }
        }).then(()=>{
            props.refresh();
            handleClose();
            setWaiting(false);
            setLoadingSpinner(false);
            setTimeout(()=>{
                props.outRefresh();
            }, 2000);
        });
    }

    useEffect(()=>{
        setDefaultState(oneTank?.tankName);
        setProduct(oneTank?.productType);
    },[oneTank?.tankName, oneTank?.productType]);

    return(
        <Modal
            open={open === 3}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{display:'flex', justifyContent:'center', alignItems:'center'}}
        >
            <div style={{height:'430px'}} className='modalContainer2'>
                <div className='inner'>
                    <div className='head'>
                        <div className='head-text'>Add Pump</div>
                        <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                    </div>

                    <div style={{marginTop:'15px'}} className='inputs'>
                        <div className='head-text2'>Choose product type</div>
                        <div className='radio'>
                            {((props.tabs === 1 || props.tabs === 0) && productType === 'PMS') &&
                                <div className='rad-item'>
                                    <Radio checked={productType === 'PMS'? true: false} />
                                    <div className='head-text2' style={{marginRight:'5px'}}>PMS</div>
                                </div>
                            }
                            {((props.tabs === 2 || props.tabs === 0) && productType === 'AGO') &&
                                <div className='rad-item'>
                                    <Radio checked={productType === 'AGO'? true: false} />
                                    <div className='head-text2' style={{marginRight:'5px'}}>AGO</div>
                                </div>
                            }
                            {((props.tabs === 3 || props.tabs === 0) && productType === 'DPK') &&
                                <div className='rad-item'>
                                    <Radio checked={productType === 'DPK'? true: false} />
                                    <div className='head-text2' style={{marginRight:'5px'}}>DPK</div>
                                </div>
                            }
                        </div>
                    </div>

                    <div className='inputs'>
                        <div className='head-text2'>Pump Name</div>
                        <OutlinedInput 
                            sx={{
                                width:'100%',
                                height: '35px', 
                                marginTop:'5px', 
                                background:'#EEF2F1', 
                                fontSize:'12px',
                                borderRadius:'0px',
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    border:'1px solid #777777',
                                },
                            }} placeholder="" 
                            onChange={e => setPumpName(e.target.value)}
                        />
                    </div>

                    <div style={{marginTop:'15px'}} className='inputs'>
                        <div className='head-text2'>Tank Connected to pump</div>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={defaultState}
                            sx={{
                                width:'100%',
                                height: '35px', 
                                marginTop:'5px', 
                                background:'#EEF2F1', 
                                fontSize:'12px',
                                borderRadius:'0px',
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    border:'1px solid #777777',
                                },
                            }}
                        >
                            <MenuItem style={menu} value={oneTank?.tankName}>{oneTank?.productType} {oneTank?.tankName}</MenuItem>
                        </Select>
                    </div>

                    <div style={{marginTop:'15px'}} className='inputs'>
                        <div className='head-text2'>Totalizer Reading</div>
                        <OutlinedInput 
                            sx={{
                                width:'100%',
                                height: '35px', 
                                marginTop:'5px', 
                                background:'#EEF2F1', 
                                fontSize:'12px',
                                borderRadius:'0px',
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    border:'1px solid #777777',
                                },
                            }} placeholder="" 
                            onChange={e => setTotalizer(e.target.value)}
                        />
                    </div>

                    <div style={{height:'30px'}} className='butt'>
                        <Button disabled={waiting} sx={{
                            width:'100px', 
                            height:'30px',  
                            background: '#427BBE',
                            borderRadius: '3px',
                            fontSize:'10px',
                            marginTop:'00px',
                            '&:hover': {
                                backgroundColor: '#427BBE'
                            }
                            }} 
                            onClick={handleOpen} 
                            variant="contained"> Save
                        </Button>

                        {loadingSpinner &&
                            <ThreeDots 
                                height="60" 
                                width="50" 
                                radius="9"
                                color="#076146" 
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClassName=""
                                visible={true}
                            />
                        }
                    </div>
                </div>
            </div>
        </Modal>
    )
}

const menu = {
    fontSize:'14px',
}

export default AddPump;