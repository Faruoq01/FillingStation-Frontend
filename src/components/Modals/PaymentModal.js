/* eslint-disable no-unused-expressions */
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import close from '../../assets/close.png';
import upload from '../../assets/upload.png';
import photo from '../../assets/photo.png';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Modal from '@mui/material/Modal';
import { ThreeDots } from  'react-loader-spinner';
import swal from 'sweetalert';
import '../../styles/lpo.scss';
import axios from 'axios';
import '../../styles/lpo.scss';
import { certificate, reciepts } from '../../store/actions/payment';
import config from '../../constants';
import ReactCamera from './ReactCamera';

const PaymentModal = (props) => {
    const [loading, setLoading] = useState(false);
    const cert = useSelector(state => state.paymentReducer.certificate);
    const reciept = useSelector(state => state.paymentReducer.receipt);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const dispatch = useDispatch();

    const [organisation, setOrganisation] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [contact, setContact] = useState('');
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [phone, setPhone] = useState("");

    const attach = useRef();
    const attach2 = useRef();

    const handleClose = () => props.close(false);

    function removeSpecialCharacters(str) {
        return str.replace(/[^0-9.]/g, '');
    }

    const submit = () => { 
        if((typeof(cert) === "string") || (typeof(reciept) === "string")){
            if(oneStationData === null) return swal("Warning!", "Please create a station", "info");
            if(organisation === "") return swal("Warning!", "Organisation field cannot be empty", "info");
            if(description === "") return swal("Warning!", "Description field cannot be empty", "info");
            if(amount === "") return swal("Warning!", "Amount field cannot be empty", "info");
            if(contact === "") return swal("Warning!", "Contact field cannot be empty", "info");
            if(phone === "") return swal("Warning!", "Contact phone field cannot be empty", "info");
            if(typeof(cert) !== "string") return swal("Warning!", "Please select a certificate", "info");
            if(typeof(reciept) !== "string") return swal("Warning!", "Please use the camera instead", "info");
            setLoading(true);

            const payload = {
                organisationalName: organisation,
                description: description,
                amount: removeSpecialCharacters(amount),
                contactPerson: contact,
                phone: phone,
                attachCertificate: cert,
                paymentReceipt: reciept,
                outletID: oneStationData?._id,
                organizationID: oneStationData?.organisation
            }
           
            const url = config.BASE_URL + "/360-station/api/register-payment/createBase64";
            const httpConfig = {
                headers: {
                    "content-type": "multipart/form-data",
                    "Authorization": "Bearer "+ localStorage.getItem('token'),
                }
            };
            axios.post(url, payload, httpConfig).then((data) => {
                console.log('form data', data);
            }).then(()=>{
                setLoading(false);
                props.refresh();
                swal("Success!", "Payment created successfully", "success");
                handleClose();
            });

        }else{
            if(oneStationData === null) return swal("Warning!", "Please create a station", "info");
            if(organisation === "") return swal("Warning!", "Organisation field cannot be empty", "info");
            if(description === "") return swal("Warning!", "Description field cannot be empty", "info");
            if(amount === "") return swal("Warning!", "Amount field cannot be empty", "info");
            if(contact === "") return swal("Warning!", "Contact field cannot be empty", "info");
            if(phone === "") return swal("Warning!", "Contact phone field cannot be empty", "info");
            if(typeof(cert.name) === "undefined") return swal("Warning!", "Please select a certificate", "info");
            if(typeof(reciept.name) === "undefined") return swal("Warning!", "Please select a reciept", "info");

            setLoading(true);

            const formData = new FormData();
            formData.append("organisationalName", organisation);
            formData.append("description", description);
            formData.append("amount", removeSpecialCharacters(amount));
            formData.append("contactPerson", contact);
            formData.append("phone", phone);
            formData.append("attachCertificate", cert);
            formData.append("paymentReceipt", reciept);
            formData.append("outletID", oneStationData?._id);
            formData.append("organizationID", oneStationData?.organisation);
            const httpConfig = {
                headers: {
                    "content-type": "multipart/form-data",
                    "Authorization": "Bearer "+ localStorage.getItem('token'),
                }
            };
            const url = config.BASE_URL + "/360-station/api/register-payment/create";
            axios.post(url, formData, httpConfig).then((data) => {
                console.log('form data', data);
            }).then(()=>{
                setLoading(false);
                props.refresh();
                swal("Success!", "Payment created successfully", "success");
                handleClose();
            });
        }
    }

    const uploadProductOrders = () => {
        attach.current.click();
    }

    const uploadProductOrders2 = () => {
        attach2.current.click();
    }

    const selectedFile = (e) => {
        let file = e.target.files[0];
        dispatch(certificate(file));
    }

    const selectedFile2 = (e) => {
        let file = e.target.files[0];
        dispatch(reciepts(file));
    }

    const handleTakePhoto = (data) => {
        dispatch(certificate(data));
    }

    const takePicFromCamera = () => {
        setOpen(true);
    }

    const handleTakePhoto2 = (data) => {
        dispatch(reciepts(data));
    }

    const takePicFromCamera2 = () => {
        setOpen2(true);
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
                    <ReactCamera open={open} close={setOpen} setDataUri={handleTakePhoto} />
                    <ReactCamera open={open2} close={setOpen2} setDataUri={handleTakePhoto2} />
                    <div className='inner'>
                        <div className='head'>
                            <div className='head-text'>Register Payment</div>
                            <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                        </div>

                       <div className='middleDiv' style={inner}>
                            <div className='inputs'>
                                <div className='head-text2'>Organisation Name</div>
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
                                    type='text'
                                    onChange={e => setOrganisation(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Description</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        padding:'10px',
                                        borderRadius: '0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} 
                                    placeholder="" 
                                    multiline
                                    rows={5}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Amount</div>
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
                                    type="text"
                                    onChange={e => setAmount(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Contact person</div>
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
                                    onChange={e => setContact(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Contact phone</div>
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
                                    onChange={e => setPhone(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Attachment (Certificate)</div>
                                <div style={photos}>
                                    <Button sx={{
                                        width:'49%', 
                                        height:'35px',  
                                        background: '#427BBE',
                                        borderRadius: '3px',
                                        fontSize:'10px',
                                        '&:hover': {
                                            backgroundColor: '#427BBE'
                                        }
                                        }} 
                                        onClick={takePicFromCamera}
                                        variant="contained"> 
                                        <img style={{width:'25px', height:'18px', marginRight:'10px'}} src={photo} alt={'icon'} />
                                        {typeof(cert) === "string" && <div>Image Taken</div>}
                                        {typeof(cert) === "string" || <div>Take Photo</div>}
                                    </Button>
                                    <Button sx={{
                                        width:'49%', 
                                        height:'35px',  
                                        background: '#087B36',
                                        borderRadius: '3px',
                                        fontSize:'10px',
                                        '&:hover': {
                                            backgroundColor: '#087B36'
                                        }
                                        }} 
                                        onClick={uploadProductOrders}
                                        variant="contained"> 
                                        <img style={{width:'25px', height:'18px', marginRight:'10px'}} src={upload} alt={'icon'} />
                                        {typeof(cert.name) === "undefined" && <div>Upload Image</div>}
                                        {typeof(cert.name) === "undefined" || <div>{cert.name}</div>}
                                    </Button>
                                </div>
                            </div>

                            <div style={{marginBottom:'30px'}} className='inputs'>
                                <div className='head-text2'>Payment reciept</div>
                                <div style={photos}>
                                    <Button sx={{
                                        width:'49%', 
                                        height:'35px',  
                                        background: '#427BBE',
                                        borderRadius: '3px',
                                        fontSize:'10px',
                                        '&:hover': {
                                            backgroundColor: '#427BBE'
                                        }
                                        }} 
                                        onClick={takePicFromCamera2}
                                        variant="contained"> 
                                        <img style={{width:'25px', height:'18px', marginRight:'10px'}} src={photo} alt={'icon'} />
                                        {typeof(reciept) === "string" && <div>Image Taken</div>}
                                        {typeof(reciept) === "string" || <div>Take Photo</div>}
                                    </Button>
                                    <Button sx={{
                                        width:'49%', 
                                        height:'35px',  
                                        background: '#087B36',
                                        borderRadius: '3px',
                                        fontSize:'10px',
                                        '&:hover': {
                                            backgroundColor: '#087B36'
                                        }
                                        }} 
                                        onClick={uploadProductOrders2}
                                        variant="contained"> 
                                        <img style={{width:'25px', height:'18px', marginRight:'10px'}} src={upload} alt={'icon'} />
                                        {typeof(reciept.name) === "undefined" && <div>Upload Image</div>}
                                        {typeof(reciept.name) === "undefined" || <div>{reciept.name}</div>}
                                    </Button>
                                </div>
                            </div>
                            <input style={{visibility:'hidden'}} onChange={selectedFile} type="file" ref={attach} />
                            <input style={{visibility:'hidden'}} onChange={selectedFile2} type="file" ref={attach2} />
                       </div>

                        <div style={{marginTop:'10px', height: '30px'}} className='butt'>
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
    height:'500px',
    overflowY: 'scroll'
}

const photos = {
    width:'100%',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:'10px'
}

export default PaymentModal;