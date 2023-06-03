import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import close from '../../assets/close.png';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Modal from '@mui/material/Modal';
import { ThreeDots } from  'react-loader-spinner';
import swal from 'sweetalert';
import '../../styles/lpo.scss';
import { useEffect } from 'react';
import SalesMachine from '../../modules/salesMachine';
import { updatePayload } from '../../store/actions/records';
import { useHistory } from 'react-router-dom';

const PendingSales = (props) => {
    const { Buffer } = require('buffer');
    const dispatch = useDispatch();
    const history = useHistory();
    
    const [decode, setDecode] = useState(null);
    const [machine, setMachine] = useState(null);

    const handleClose = () => props.close(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState('Loading...');

    useEffect(()=>{
        const getData = localStorage.getItem('machine');
        const getString = Buffer.from(getData, 'base64').toString('ascii');
        const metaData = JSON.parse(getString);
        
        const createMachine = new SalesMachine(metaData.data);
        setDecode(metaData);
        setMachine(createMachine);

    }, [Buffer, dispatch]);

    const submit = () => {
        setLoading(true);
        machine.onStateChange(({label, mch, error}) => {
            if(error){
                const info = {
                    date: decode.date,
                    data: mch.data,
                    label: label,
                    error: JSON.stringify(error.message),
                    org: decode.org, 
                    outletID: decode.outletID
                }

                setDecode(info);
                setMachine(new SalesMachine(info));
                localStorage.setItem('machine', Buffer.from(JSON.stringify(info)).toString('base64'));
                handleClose();

            }else{
                setProgress(label);
                if(label === 'done'){
                    setLoading(false);
                    localStorage.removeItem('machine');
                    setMachine(null);
                    handleClose();
                    history.push('/home/daily-sales')
                    swal("Success!", "Record saved successfully!", "success");

                }else if(label === "exist"){
                    setMachine(null);
                    localStorage.removeItem('machine');
                    handleClose();
                    history.push('/home/daily-sales')
                    swal("Error!", "Today's record has already been submitted!", "error");
                }
            }
        });
        machine.changeState(decode.label, machine, true);
    }

    const clearProcess = () => {
        swal({
            title: "Alert!",
            text: "Are you sure you want to abort this process? all data will be lost!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                localStorage.removeItem('machine');
                handleClose();
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
                <div style={{height:'auto', background:'#f7f7f7'}} className='modalContainer2'>
                    <div style={{height:'auto', margin:'20px'}} className='inner'>
                        <div className='head'>
                            <div className='head-text'>Pending Record Sales</div>
                            <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                        </div>

                       <div className='middleDiv' style={inner}>

                            <div style={row}>
                                <div style={left}>Pending date from </div>
                                <div style={right}>{decode?.date}</div>
                            </div>

                            <div style={row}>
                                <div style={left}>Failed to save from </div>
                                <div style={right}>{decode?.label}</div>
                            </div>

                            <p style={{marginTop: '30px', fontWeight:'600'}}>Retry or contact admin with the error log!</p>
                            <div style={row2}>
                                <div>
                                    Please review your internet settings and 
                                    try again or contact admin with the description 
                                    of your error!.
                                </div>
                            </div>

                            <div style={{marginTop:'10px', height: '30px'}} className='butt'>
                                <div >
                                    {loading || <div onClick={clearProcess} style={prog}>click here to abort the process</div>}
                                    {loading && <div style={prog}>{progress}</div>}
                                    {loading?
                                        <ThreeDots 
                                            height="30" 
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
                            </div>
                        </div>
                    </div>
                </div>
        </Modal>
    )
}

const inner = {
    width:'100%',
    height:'auto',
}

const row = {
    width: '100%',
    height: '50px',
    background: '#fff',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
    marginBottom: '10px'
}

const row2 = {
    width: '98%',
    height: 'auto',
    minHeight: '50px',
    background: '#fff',
    borderRadius: '5px',
    marginTop: '10px',
    marginBottom: '30px',
    paddingLeft: '2%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
}

const left = {
    fontSize: '16px',
    fontWeight: 'bold',
    marginLeft: '15px'
}

const right = {
    fontSize: '15px',
    fontWeight: 'bold',
    marginRight: '15px'
}

const prog = {
    fontSize: '12px',
    color: 'green',
    fontFamily: 'Poppins',
    fontWeight: '600'
}

export default PendingSales;