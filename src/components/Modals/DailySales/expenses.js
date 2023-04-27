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

const UpdateExpenses = (props) => {
    const user = useSelector(state => state.authReducer.user);
    const dispatch = useDispatch();
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const currentDate = useSelector(state => state.dailySalesReducer.currentDate);
    const [loading, setLoading] = useState(false);
    const [expenseName, setExpenseName] = useState("");
    const [expenseAmount, setExpenseAmount] = useState('');

    const resolveUserID = () => {
        if(user.userType === "superAdmin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
        }
    }

    const handleClose = () => props.close(false);

    useEffect(()=>{
        setExpenseName(props.data.expenseName);
        setExpenseAmount(props.data.expenseAmount);
    }, [props.data.expenseAmount, props.data.expenseName])

    const submit = () => {
        if(expenseName === "") return swal("Warning!", "Expense name cannot be empty", "info");
        if(expenseAmount === "") return swal("Warning!", "Expense amount cannot be empty", "info");
        setLoading(true);

        const payload = {
            type: "expenses",
            id: props.data._id,
            expenseName: expenseName,
            expenseAmount: expenseAmount
        }

        DailySalesService.updateSales(payload).then(data => {
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
                            <div className='head-text'>Edit Expenses</div>
                            <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                        </div>

                       <div className='middleDiv' style={inner}>

                       <div style={{marginTop:'15px'}} className='inputs'>

                            <div style={{marginTop:'10px'}} className='inputs'>
                                <div className='head-text2'>Expense Name</div>
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
                                    value={expenseName}
                                    onChange={e => setExpenseName(e.target.value)}
                                />
                            </div>

                            <div style={{marginTop:'15px'}} className='inputs'>
                                <div className='head-text2'>Expense Amount</div>
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
                                    value={expenseAmount}
                                    onChange={e => setExpenseAmount(e.target.value)}
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
    height:'170px',
}

export default UpdateExpenses;