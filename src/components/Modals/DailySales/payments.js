import React, { useState } from 'react';
import close from '../../../assets/close.png';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Modal from '@mui/material/Modal';
import { ThreeDots } from  'react-loader-spinner';
import swal from 'sweetalert';
import '../../../styles/lpo.scss';
import { useEffect } from 'react';
import DailySalesService from '../../../services/DailySales';
import { useDispatch, useSelector } from 'react-redux';
import { bulkReports } from '../../../store/actions/dailySales';

const UpdatePayments = (props) => {
    const user = useSelector(state => state.authReducer.user);
    const dispatch = useDispatch();
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const currentDate = useSelector(state => state.dailySalesReducer.currentDate);
    const [loading, setLoading] = useState(false);

    const [bankName, setBankName] = useState("");
    const [tellerID, setTellerID] = useState('');
    const [bankAmount, setBankAmount] = useState("");

    const [type, setType] = useState('');

    const resolveUserID = () => {
        if(user.userType === "superAdmin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
        }
    }

    const handleClose = () => props.close(false);

    useEffect(()=>{
        setType(props.data.bank)
        setBankName(props.data.bank === "bank"? props.data.data.bankName: props.data.data.posName);
        setTellerID(props.data.bank === "bank"? props.data.data.tellerNumber: props.data.data.terminalID);
        setBankAmount(props.data.data.amountPaid)
    }, [props.data.bank, props.data.data.amountPaid, props.data.data.anountPaid, props.data.data.bankName, props.data.data.posName, props.data.data.tellerNumber, props.data.data.terminalID])

    const submit = () => {
        if(bankName === "") return swal("Warning!", "Bank name cannot be empty", "info");
        if(tellerID === "") return swal("Warning!", "Teller or ID cannot be empty", "info");
        if(bankAmount === "") return swal("Warning!", "Amount paid cannot be empty", "info");
        setLoading(true);

        const payload = {
            type: "bank",
            id: props.data.data._id,
            bankName: bankName,
            tellerNumber: tellerID,
            amountPaid: bankAmount
        }

        const payload2 = {
            type: "pos",
            id: props.data.data._id,
            posName: bankName,
            terminalID: tellerID,
            amountPaid: bankAmount
        }

        DailySalesService.updateSales(type === "bank"? payload: payload2).then(data => {
            setLoading(false);
            handleClose();
        }).then(()=>{
            getAndAnalyzeDailySales();
        }).then(()=>{
            swal("Success", "Record updated successfully", "success");
        });
    }

    const getAndAnalyzeDailySales = () => {
        const salesPayload = {
            organisationID: resolveUserID().id,
            outletID: oneStationData._id,
            onLoad: currentDate === ""? true: false,
            selectedDate: currentDate
        }

        DailySalesService.getDailySalesDataAndAnalyze(salesPayload).then(data => {
            dispatch(bulkReports(data.dailyRecords));
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
                <div data-aos="zoom-out-up" style={{height:'auto'}} className='modalContainer2'>
                    <div style={{height:'auto', margin:'20px'}} className='inner'>
                        <div className='head'>
                            <div className='head-text'>Edit {type === "bank"? "Bank Payment": "POS Payment"}</div>
                            <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                        </div>

                       <div className='middleDiv' style={inner}>

                       <div style={{marginTop:'15px'}} className='inputs'>

                            <div style={{marginTop:'10px'}} className='inputs'>
                                <div className='head-text2'>{type === "bank"? "Bank Name": "POS Name"}</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        borderRadius:"0px",
                                        fontSize:'12px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    type="text"
                                    value={bankName}
                                    onChange={e => setBankName(e.target.value)}
                                />
                            </div>

                            <div style={{marginTop:'15px'}} className='inputs'>
                                <div className='head-text2'>{type === "bank"? "Teller ID": "Terminal ID"}</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        borderRadius:"0px",
                                        fontSize:'12px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    type="text"
                                    value={tellerID}
                                    onChange={e => setTellerID(e.target.value)}
                                />
                            </div>

                            <div style={{marginTop:'15px'}} className='inputs'>
                                <div className='head-text2'>Amount Paid</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        borderRadius:"0px",
                                        fontSize:'12px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    type="text"
                                    value={bankAmount}
                                    onChange={e => setBankAmount(e.target.value)}
                                />
                            </div>

                        </div>
                    </div>

                    <div style={{marginTop:'10px', height:"30px"}} className='butt'>
                        <Button disabled={loading} sx={{
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
    height:'250px',
}

export default UpdatePayments;