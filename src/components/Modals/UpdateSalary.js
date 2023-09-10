import React, { useState } from 'react';
import close from '../../assets/close.png';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Modal from '@mui/material/Modal';
import { ThreeDots } from  'react-loader-spinner';
import swal from 'sweetalert';
import '../../styles/lpo.scss';
import SalaryService from '../../services/360station/salary';

const UpdateSalary = (props) => {
    const [loading, setLoading] = useState(false);
    const [position, setPosition] = useState('');
    const [level, setLevel] = useState('');
    const [low, setLow] = useState('');
    const [high, setHigh] = useState('');

    const handleClose = () => props.close(false);

    const submit = () => {
        if(position === "") return swal("Warning!", "Position field cannot be empty", "info");
        if(level === "") return swal("Warning!", "Level field cannot be empty", "info");
        if(low === "") return swal("Warning!", "Low range field cannot be empty", "info");
        if(high === "") return swal("Warning!", "High range field cannot be empty", "info");

        setLoading(true);

        const payload = {
            id: props.id._id,
            position: position,
            level: level,
            low_range: low,
            high_range: high,
        }

        SalaryService.updateSalary(payload).then((data) => {
            swal("Success", "Salary created successfully!", "success");
        }).then(()=>{
            setLoading(false);
            props.refresh();
            handleClose();
        })
    }

    return(
        <Modal
            open={props.open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{display:'flex', justifyContent:'center', alignItems:'center'}}
        >
                <div style={{height:'auto'}} className='modalContainer2'>
                    <div style={{height:'auto', margin:'20px'}} className='inner'>
                        <div className='head'>
                            <div className='head-text'>Update Salary Structure</div>
                            <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                        </div>

                       <div className='middleDiv' style={inner}>
                            <div className='inputs'>
                                <div className='head-text2'>Position</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    onChange={e => setPosition(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Level</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    onChange={e => setLevel(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Salary range</div>
                                <div style={range}>
                                    <OutlinedInput 
                                        sx={{
                                            width:'49%',
                                            height: '35px', 
                                            marginTop:'5px', 
                                            background:'#EEF2F1', 
                                            border:'1px solid #777777',
                                            fontSize:'12px',
                                        }} placeholder="" 
                                        type='number'
                                        onChange={e => setLow(e.target.value)}
                                    />
                                    <OutlinedInput 
                                        sx={{
                                            width:'49%',
                                            height: '35px', 
                                            marginTop:'5px', 
                                            background:'#EEF2F1', 
                                            border:'1px solid #777777',
                                            fontSize:'12px',
                                        }} placeholder="" 
                                        type='number'
                                        onChange={e => setHigh(e.target.value)}
                                    />
                                </div>
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
    height:'270px',
}

const range = {
    width:'100%',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between'
}

export default UpdateSalary;