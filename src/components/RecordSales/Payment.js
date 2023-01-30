import React, { useRef, useState } from 'react';
import '../../styles/expenses.scss';
import photo from '../../assets/photo.png';
import hr8 from '../../assets/hr8.png';
import upload from '../../assets/upload.png';
import Button from '@mui/material/Button';
import swal from 'sweetalert';
import axios from 'axios';
import config from '../../constants';
import { useSelector } from 'react-redux';
import ReactCamera from '../Modals/ReactCamera';
import {ThreeDots} from 'react-loader-spinner'

const Payments = (props) => {

    const [switchTab, setSwitchTab] = useState(false);
    const [open, setOpen] = useState(false);
    const gallery1 = useRef();
    const oneOutletStation = useSelector(state => state.outletReducer.oneStation);
    const [listOfBankPayments, setListOfBankPayments] = useState([]);
    const [listOfPOSPayments, setListOfPOSPayments] = useState(null);

    const [bankName, setBankName] = useState('');
    const [tellerNumber, setTellerNumber] = useState('');
    const [posName, setPosName] = useState('');
    const [terminalID, setTerminalID] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [cam, setCam] = useState(null);
    const [gall, setGall] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSwitchTab = () => {
        setSwitchTab(false);
        setListOfPOSPayments(null);
        setListOfBankPayments([]);
    }

    const handleSwitchTab2 = () => {
        setSwitchTab(true);
        setListOfPOSPayments([]);
        setListOfBankPayments(null);
    }

    const pickFromGallery = () => {
        gallery1.current.click();
    }

    const takeFromCamera = () => {
        setOpen(true);
    }

    const getFileFromGallery = (e) => {
        let file = e.target.files[0];
        setGall(file);
    }

    const submitPayment = () => {

        if((typeof(cam) === "string")){
            if(date === "") return swal("Warning!", "Payment date field cannot be empty", "info");
            if(bankName === "") return swal("Warning!", "Bank name field cannot be empty", "info");
            if(tellerNumber === "") return swal("Warning!", "Teller Number field cannot be empty", "info");
            if(amount === "") return swal("Warning!", "Amount field cannot be empty", "info");
            if(cam === null) return swal("Warning!", "Please select a file", "info");

            const payload = {
                dateCreated: date,
                bankName: bankName,
                tellerNumber: tellerNumber,
                amountPaid: amount,
                paymentDate: date,
                attachApprovalCam: cam,
                outletID: oneOutletStation._id,
                organisationID: oneOutletStation.organisation,
            }

            setListOfBankPayments(prev => [...prev, payload]);

            setCam(null);
            setGall("");
            setBankName('');
            setTellerNumber('');
            setPosName('');
            setTerminalID('');
            setAmount('');
        }else{
            if(date === "") return swal("Warning!", "Payment date field cannot be empty", "info");
            if(bankName === "") return swal("Warning!", "Bank name field cannot be empty", "info");
            if(tellerNumber === "") return swal("Warning!", "Teller Number field cannot be empty", "info");
            if(amount === "") return swal("Warning!", "Amount field cannot be empty", "info");
            if(typeof(gall.name) === "undefined") return swal("Warning!", "Please select a file", "info");

            const payload = {
                dateCreated: date,
                bankName: bankName,
                tellerNumber: tellerNumber,
                amountPaid: amount,
                paymentDate: date,
                attachApprovalCam: gall,
                outletID: oneOutletStation._id,
                organisationID: oneOutletStation.organisation,
            }

            setListOfBankPayments(prev => [...prev, payload]);

            setCam(null);
            setGall("");
            setBankName('');
            setTellerNumber('');
            setPosName('');
            setTerminalID('');
            setAmount('');
        }
    }

    const addBankPayment = async(url, payload, httpConfig) => {
        let res = await axios.post(url, payload, httpConfig).then((data) => {
            return data;
        });
        return res;
    }

    const addBankGallPayment = async(url, formData, httpConfig) => {
        let res = await axios.post(url, formData, httpConfig).then((data) => {
            return data;
        });
        return res;
    }

    const submitAllPayment = async() => {

        setLoading(true);
        for(let i = 0, max = listOfBankPayments.length; i < max; i++){
            if((typeof(listOfBankPayments[i].attachApprovalCam) === "string")){
                const url = config.BASE_URL + "/360-station/api/payment/create";
                const httpConfig = {
                    headers: {
                        "content-type": "multipart/form-data",
                        "Authorization": "Bearer "+ localStorage.getItem('token'),
                    }
                };

                const bankPaid = await addBankPayment(url, listOfBankPayments[i], httpConfig);
                console.log(bankPaid, "bank payment is successful");
            }else{
                const formData = new FormData();
                formData.append("dateCreated", listOfBankPayments[i].dateCreated);
                formData.append("bankName", listOfBankPayments[i].bankName);
                formData.append("tellerNumber", listOfBankPayments[i].tellerNumber);
                formData.append("amountPaid", listOfBankPayments[i].amount);
                formData.append("paymentDate", listOfBankPayments[i].date);
                formData.append("attachApproval", listOfBankPayments[i].attachApprovalCam);
                formData.append("outletID", listOfBankPayments[i].outletID);
                formData.append("organisationID", listOfBankPayments[i].organisationID);
                const httpConfig = {
                    headers: {
                        "content-type": "multipart/form-data",
                        "Authorization": "Bearer "+ localStorage.getItem('token'),
                    }
                };

                const url = config.BASE_URL + "/360-station/api/payment/create";
                const addBankGall = await addBankGallPayment(url, formData, httpConfig);
                console.log(addBankGall, "bank payment is successfull");
            }
        }

        props.refresh();
        setListOfBankPayments([]);
        setLoading(false);
        swal("Sucess!", "Bank Payment Recorded Successfully!", "success");
    }

    const submitPOSpayment = () => {

        if((typeof(cam) === "string")){
            if(date === "") return swal("Warning!", "Payment date field cannot be empty", "info");
            if(posName === "") return swal("Warning!", "Bank name field cannot be empty", "info");
            if(terminalID === "") return swal("Warning!", "Teller Number field cannot be empty", "info");
            if(amount === "") return swal("Warning!", "Amount field cannot be empty", "info");
            if(cam === null) return swal("Warning!", "Please select a file", "info");

            const payload = {
                dateCreated: date,
                posName: posName,
                terminalID: terminalID,
                amountPaid: amount,
                paymentDate: date,
                attachApprovalCam: cam,
                outletID: oneOutletStation._id,
                organisationID: oneOutletStation.organisation,
            }

            setListOfPOSPayments(prev => [...prev, payload]);

            setCam(null);
            setGall("");
            setPosName('');
            setTerminalID('');
            setAmount('');
        }else{
            if(date === "") return swal("Warning!", "Payment date field cannot be empty", "info");
            if(posName === "") return swal("Warning!", "Bank name field cannot be empty", "info");
            if(terminalID === "") return swal("Warning!", "Teller Number field cannot be empty", "info");
            if(amount === "") return swal("Warning!", "Amount field cannot be empty", "info");
            if(typeof(gall.name) === "undefined") return swal("Warning!", "Please select a file", "info");

            const payload = {
                dateCreated: date,
                posName: posName,
                terminalID: terminalID,
                amountPaid: amount,
                paymentDate: date,
                attachApprovalCam: gall,
                outletID: oneOutletStation._id,
                organisationID: oneOutletStation.organisation,
            }

            setListOfPOSPayments(prev => [...prev, payload]);

            setCam(null);
            setGall("");
            setPosName('');
            setTerminalID('');
            setAmount('');
        }
    }

    const addPOSPayment = async(url, payload, httpConfig) => {
        let res = await axios.post(url, payload, httpConfig).then((data) => {
            return data;
        });
        return res;
    }

    const addPOSGallPayment = async(url, formData, httpConfig) => {
        let res = await axios.post(url, formData, httpConfig).then((data) => {
            return data;
        });
        return res;
    }

    const submitAllPOSpayment = async() => {

        setLoading(true);
        for(let i = 0, max = listOfPOSPayments.length; i < max; i++){
            if((typeof(listOfPOSPayments[i].attachApprovalCam) === "string")){
                const url = config.BASE_URL + "/360-station/api/pos-payment/create";
                const httpConfig = {
                    headers: {
                        "content-type": "multipart/form-data",
                        "Authorization": "Bearer "+ localStorage.getItem('token'),
                    }
                };

                const posPaid = await addPOSPayment(url, listOfPOSPayments[i], httpConfig);
                console.log(posPaid, "pos payment is successful");
            }else{
                const formData = new FormData();
                formData.append("dateCreated", listOfPOSPayments[i].dateCreated);
                formData.append("posName", listOfPOSPayments[i].posName);
                formData.append("terminalID", listOfPOSPayments[i].terminalID);
                formData.append("amountPaid", listOfPOSPayments[i].amountPaid);
                formData.append("paymentDate", listOfPOSPayments[i].paymentDate);
                formData.append("attachApproval", listOfPOSPayments[i].attachApprovalCam);
                formData.append("outletID", listOfPOSPayments[i].outletID);
                formData.append("organisationID", listOfPOSPayments[i].organisationID);
                const httpConfig = {
                    headers: {
                        "content-type": "multipart/form-data",
                        "Authorization": "Bearer "+ localStorage.getItem('token'),
                    }
                };

                const url = config.BASE_URL + "/360-station/api/pos-payment/create";
                const addPosGall = await addPOSGallPayment(url, formData, httpConfig);
                console.log(addPosGall, "pos payment is successfull");
            }
        }

        props.refresh();
        setListOfPOSPayments([]);
        setLoading(false);
        swal("Sucess!", "POS Payment Recorded Successfully!", "success");
    }

    const deleteFromList2 = (index) => {
        const newList = [...listOfPOSPayments];
        newList.pop(index);
        setListOfPOSPayments(newList);

        setCam(null);
        setGall("");
        setPosName('');
        setTerminalID('');
        setAmount('');
    }

    const deleteFromList1 = (index) => {
        const newList = [...listOfBankPayments];
        newList.pop(index);
        setListOfBankPayments(newList);

        setCam(null);
        setGall("");
        setBankName('');
        setTellerNumber('');
        setAmount('');
    }

    return(
        <div className='expensesContainer'>
            <ReactCamera open={open} close={setOpen} setDataUri={setCam} />
            <div style={{background:'#fff', marginTop:'20px'}} className='form-container'> 
                <div style={inner}> 
                    <div className='tabs'>
                        <Button sx={switchTab? inactive : active}
                            onClick={handleSwitchTab}  
                            variant="contained"> Bank Payment
                        </Button>
                        <Button sx={switchTab? active : inactive} 
                            onClick={handleSwitchTab2}  
                            variant="contained"> POS Payment
                        </Button>
                    </div>

                    {!switchTab?
                        <div className='cashPayment'>
                            <div style={{marginTop:'25px'}} className='inputs'>
                                <div className='text'>Date Created</div>
                                <input className='date' type={'date'}  />
                            </div>

                            <div className='twoInputs'>
                                <div className='inputs2'>
                                    <div className='text'>Bank Name</div>
                                    <input value={bankName} onChange={e => setBankName(e.target.value)} className='date' type={'text'}  />
                                </div>

                                <div className='inputs2'>
                                    <div className='text'>Teller Number</div>
                                    <input value={tellerNumber} onChange={e => setTellerNumber(e.target.value)} className='date' type={'text'}  />
                                </div>
                            </div>

                            <div className='twoInputs'>
                                <div className='inputs2'>
                                    <div className='text'>Amount Paid</div>
                                    <input value={amount} onChange={e => setAmount(e.target.value)} className='date' type={'text'}  />
                                </div>

                                <div className='inputs2'>
                                    <div className='text'>Payment Date</div>
                                    <input value={date} onChange={e => setDate(e.target.value)} className='date' type={'date'}  />
                                </div>
                            </div>

                            <div style={{marginTop:'20px'}} className='inputs'>
                                <div className='text'>Upload Teller slip</div>
                                <div className='button-container'>
                                    <Button onClick={takeFromCamera} style={{background:'#216DB2', textTransform:'capitalize'}} className='buttons'>
                                        <img style={{width:'22px', height:'18px', marginRight:'10px'}} src={photo} alt="icon" />
                                        <div>{typeof(cam) === "string"? "Image taken":<span>Take photo</span>}</div>
                                    </Button>
                                    <Button onClick={pickFromGallery} style={{background:'#087B36', textTransform:'capitalize'}} className='buttons'>
                                        <img style={{width:'22px', height:'18px', marginRight:'10px'}} src={upload} alt="icon" />
                                        <div>{typeof(gall) === "string"? "Upload":<span>File uploaded</span>}</div>
                                    </Button>
                                </div>
                            </div>
                            <input onChange={getFileFromGallery} ref={gallery1} type={'file'} style={{visibility:'hidden'}} />

                            <div className='submit'>
                                <Button sx={{
                                    width:'120px', 
                                    height:'30px',  
                                    background: '#427BBE',
                                    borderRadius: '3px',
                                    fontSize:'11px',
                                    '&:hover': {
                                        backgroundColor: '#427BBE'
                                    }
                                    }}  
                                    onClick={submitPayment}
                                    variant="contained"> Add to list
                                </Button>
                            </div>
                        </div>:
            
                        <div className='cashPayment'>
                        <div style={{marginTop:'25px'}} className='inputs'>
                            <div className='text'>Date Created</div>
                            <input className='date' type={'date'}  />
                        </div>

                        <div className='twoInputs'>
                            <div className='inputs2'>
                                <div className='text'>POS Name</div>
                                <input value={posName} onChange={e => setPosName(e.target.value)} className='date' type={'text'}  />
                            </div>

                            <div className='inputs2'>
                                <div className='text'>Terminal ID</div>
                                <input value={terminalID} onChange={e => setTerminalID(e.target.value)} className='date' type={'text'}  />
                            </div>
                        </div>

                        <div className='twoInputs'>
                            <div className='inputs2'>
                                <div className='text'>Amount Paid</div>
                                <input value={amount} onChange={e => setAmount(e.target.value)} className='date' type={'text'}  />
                            </div>

                            <div className='inputs2'>
                                <div className='text'>Payment Date</div>
                                <input value={date} onChange={e => setDate(e.target.value)} className='date' type={'date'}  />
                            </div>
                        </div>

                        <div style={{marginTop:'20px'}} className='inputs'>
                            <div className='text'>Upload Teller slip</div>
                            <div className='button-container'>
                                <Button onClick={takeFromCamera} style={{background:'#216DB2', textTransform:'capitalize'}} className='buttons'>
                                    <img style={{width:'22px', height:'18px', marginRight:'10px'}} src={photo} alt="icon" />
                                    <div>{typeof(cam) === "string"? "Image taken":<span>Take photo</span>}</div>
                                </Button>
                                <Button onClick={pickFromGallery} style={{background:'#087B36', textTransform:'capitalize'}} className='buttons'>
                                    <img style={{width:'22px', height:'18px', marginRight:'10px'}} src={upload} alt="icon" />
                                    <div>{typeof(gall) === "string"? "Upload":<span>File uploaded</span>}</div>
                                </Button>
                            </div>
                        </div>
                        <input onChange={getFileFromGallery} ref={gallery1} type={'file'} style={{visibility:'hidden'}} />

                        <div className='submit'>
                            <Button sx={{
                                width:'120px', 
                                height:'30px',  
                                background: '#427BBE',
                                borderRadius: '3px',
                                fontSize:'11px',
                                '&:hover': {
                                    backgroundColor: '#427BBE'
                                }
                                }}  
                                onClick={submitPOSpayment}
                                variant="contained"> Add to list
                            </Button>
                        </div>
                        </div>
                    }

                    <div style={{width:'100%', height:'5px'}}></div>
                </div>
            </div>
            <div style={{marginTop:'20px'}} className='right'>
                {listOfBankPayments === null ||
                    <div className='headers'>
                        <div className='headText'>S/N</div>
                        <div className='headText'>Bank Name</div>
                        <div className='headText'>Teller No</div>
                        <div className='headText'>Amount</div>
                        <div className='headText'>Action</div>
                    </div>
                }

                {listOfPOSPayments === null ||
                    <div className='headers'>
                        <div className='headText'>S/N</div>
                        <div className='headText'>Pos Name</div>
                        <div className='headText'>Terminal ID</div>
                        <div className='headText'>Amount</div>
                        <div className='headText'>Action</div>
                    </div>
                }

                {(listOfBankPayments === null) &&
                    listOfPOSPayments !== null && listOfPOSPayments.length === 0?
                    false? 
                    <div style={{width:'100%', height:'30px', display:'flex', justifyContent:'center'}}>
                        <ThreeDots 
                            height="60" 
                            width="50" 
                            radius="9"
                            color="#076146" 
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{position:'absolute', zIndex:'30'}}
                            wrapperClassName=""
                            visible={false}
                        />
                    </div>:
                    <div style={{fontSize:'14px', marginTop:'20px', color:'green'}}>No pending supply record</div>:
                    listOfPOSPayments !== null && listOfPOSPayments.map((data, index) => {
                        return(
                            <div className='rows'>
                                <div className='headText'>{index + 1}</div>
                                <div className='headText'>{data.hasOwnProperty('bankName')? data.bankName: data.posName}</div>
                                <div className='headText'>{data.hasOwnProperty('tellerNumber')? data.tellerNumber: data.terminalID}</div>
                                <div className='headText'>{data.amountPaid}</div>
                                <div className='headText'>
                                    <img 
                                        onClick={()=>{deleteFromList2(index)}} 
                                        style={{width:'22px', height:'22px'}} 
                                        src={hr8} 
                                        alt="icon" 
                                    />
                                </div>
                            </div>
                        )
                    })
                }

                {(listOfPOSPayments === null ) &&
                    listOfBankPayments !== null && listOfBankPayments.length === 0?
                    false? 
                    <div style={{width:'100%', height:'30px', display:'flex', justifyContent:'center'}}>
                        <ThreeDots 
                            height="60" 
                            width="50" 
                            radius="9"
                            color="#076146" 
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{position:'absolute', zIndex:'30'}}
                            wrapperClassName=""
                            visible={false}
                        />
                    </div>:
                    <div style={{fontSize:'14px', marginTop:'20px', color:'green'}}>No pending supply record</div>:
                    listOfBankPayments !== null && listOfBankPayments.map((data, index) => {
                        return(
                            <div className='rows'>
                                <div className='headText'>{index + 1}</div>
                                <div className='headText'>{data.hasOwnProperty('bankName')? data.bankName: data.posName}</div>
                                <div className='headText'>{data.hasOwnProperty('tellerNumber')? data.tellerNumber: data.terminalID}</div>
                                <div className='headText'>{data.amountPaid}</div>
                                <div className='headText'>
                                    <img 
                                        onClick={()=>{deleteFromList1(index)}} 
                                        style={{width:'22px', height:'22px'}} 
                                        src={hr8} 
                                        alt="icon" 
                                    />
                                </div>
                            </div>
                        )
                    })
                }


                <div style={{marginBottom:'0px', width:'100%', height:'30px', justifyContent:'space-between'}} className='submit'>
                    <div>
                        <ThreeDots 
                            height="60" 
                            width="50" 
                            radius="9"
                            color="#076146" 
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{position:'absolute', zIndex:'30'}}
                            wrapperClassName=""
                            visible={loading}
                        />
                    </div>
                    <Button sx={{
                        width:'120px', 
                        height:'30px',  
                        background: '#427BBE',
                        borderRadius: '3px',
                        fontSize:'11px',
                        '&:hover': {
                            backgroundColor: '#427BBE'
                        }
                        }}  
                        onClick={listOfBankPayments === null? submitAllPOSpayment: submitAllPayment}
                        variant="contained"> Submit
                    </Button>
                </div>
            </div>
        </div>
    )
}

const active = {
    width:'130px', 
    height:'30px',  
    background: '#06805B',
    borderRadius: '39px',
    fontSize:'11px',
    marginRight:'10px',
    marginTop:'20px',
    '&:hover': {
        backgroundColor: '#06805B'
    }
}

const inactive = {
    width:'130px', 
    height:'30px',  
    fontSize:'11px',
    background: '#F0F9F7',
    border: '1px solid #5B5B5B',
    borderRadius: '39px',
    color:'#000',
    marginTop:'20px',
    marginRight:'10px',
    '&:hover': {
        backgroundColor: '#F0F9F7'
    }
}

const textAreaStyle = {
    height:'150px',
    paddingTop:'10px',
}

const inner = {
    margin:'20px',
}

export default Payments;