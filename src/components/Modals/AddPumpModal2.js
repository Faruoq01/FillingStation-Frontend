import React, {useEffect, useState} from 'react';
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

    const [defaultState, setDefaultState] = useState(0);
    const [productType, setProduct] = useState("PMS");
    const [pumpName, setPumpName] = useState('');
    const [totalizer, setTotalizer] = useState('');
    const [currentTank, setCurrentTank] = useState(props.allTank[0]);
    const [loadingSpinner, setLoader] = useState(false);

    const handleClose = () => props.close(false);

    useEffect(()=>{
        setProduct(props.tabs === 1? "PMS": props.tabs === 2? "AGO": "DPK")
    }, [props.tabs])

    const handleOpen = () => {
        if(pumpName === "") return swal("Warning!", "Pump name field cannot be empty", "info");
        if(defaultState === "") return swal("Warning!", "Tank name field cannot be empty", "info");
        if(productType === "") return swal("Warning!", "Product type field cannot be empty", "info");
        if(totalizer === "") return swal("Warning!", "Totalizer field cannot be empty", "info");
        setLoader(true);

        const payload = {
            pumpName: pumpName,
            hostTank: currentTank._id,
            hostTankName: currentTank.tankName,
            productType: productType,
            totalizerReading: totalizer,
            organisationID: currentTank.organisationID,
            outletID: currentTank.outletID
        }

        OutletService.registerPumps(payload).then(data => {
            if(data.status === "exist"){
                swal("Warning!", data.message, "info");

            }else{
                swal("Success!", "Pump created successfully!", "success");
            }
        }).then(()=>{
            setLoader(false);
            props.close(false);
            props.refresh();
            setTimeout(()=>{
                props.outRefresh();
            }, 500);
        });
    }

    const selectMenu = (index, item) => {
        setDefaultState(index);
        setProduct(item.productType);
        setCurrentTank(item);
    }

    const changeType = (data) => {
        setProduct(data);
    }

    const getTanks = () => {
        return props.allTank.filter(data => data.productType === productType);
    }

    return(
        <Modal
            open={props.open}
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
                            {(props.tabs === 1 || props.tabs === 0) &&
                                <div className='rad-item'>
                                    <Radio onClick={()=>{changeType("PMS")}} checked={(productType === 'PMS' || props.tabs === 1)? true: false} />
                                    <div className='head-text2' style={{marginRight:'5px'}}>PMS</div>
                                </div>
                            }

                            {(props.tabs === 2 || props.tabs === 0) &&
                                <div className='rad-item'>
                                    <Radio onClick={()=>{changeType("AGO")}} checked={(productType === 'AGO' || props.tabs === 2)? true: false} />
                                    <div className='head-text2' style={{marginRight:'5px'}}>AGO</div>
                                </div>
                            }

                            {(props.tabs === 3 || props.tabs === 0) &&
                                <div className='rad-item'>
                                    <Radio onClick={()=>{changeType("DPK")}} checked={(productType === 'DPK' || props.tabs === 3)? true: false} />
                                    <div className='head-text2' style={{marginRight:'5px'}}>DPK</div>
                                </div>
                            }
                        </div>
                    </div>

                    <div className='inputs'>
                        <div className='head-text2'>Pump No/ Series</div>
                        <OutlinedInput 
                            sx={{
                                width:'100%',
                                height: '35px', 
                                marginTop:'5px', 
                                background:'#EEF2F1', 
                                fontSize:'12px',
                                borderRadius: '0px',
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    border:'1px solid #777777',
                                },
                            }} placeholder="" 
                            type="number"
                            onChange={e => setPumpName(e.target.value)}
                        />
                    </div>

                    <div style={{marginTop:'15px'}} className='inputs'>
                        <div className='head-text2'>Tank Connected to pump</div>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={props.allTank.length === 0? 0: defaultState}
                            sx={{
                                width:'100%',
                                height: '35px', 
                                marginTop:'5px', 
                                background:'#EEF2F1', 
                                fontSize:'12px',
                                borderRadius: '0px',
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    border:'1px solid #777777',
                                },
                            }}
                        >
                            {
                                getTanks().length === 0?
                                <MenuItem style={menu} value={0}>No tanks available</MenuItem>:
                                getTanks().map((item, index) => {
                                    return(
                                        <MenuItem onClick={()=>{selectMenu(index, item)}} style={menu} value={index}>{item.productType} {item.tankName}</MenuItem>
                                    )
                                })
                            }
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
                                borderRadius: '0px',
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    border:'1px solid #777777',
                                },
                            }} placeholder="" 
                            type="number"
                            onChange={e => setTotalizer(e.target.value)}
                        />
                    </div>

                    <div className='butt' style={{height:'30px'}}>
                        <Button disabled={loadingSpinner} sx={{
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