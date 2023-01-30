import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../../styles/expenses.scss';
import hr8 from '../../assets/hr8.png';
import photo from '../../assets/photo.png';
import upload from '../../assets/upload.png';
import Button from '@mui/material/Button';
import { MenuItem, Modal, Select } from '@mui/material';
import Camera, { IMAGE_TYPES } from 'react-html5-camera-photo';
import swal from 'sweetalert';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import config from '../../constants';
import ReactCamera from '../Modals/ReactCamera';
import {ThreeDots} from 'react-loader-spinner'

const Expenses = (props) => {

    const gallery = useRef();
    const [open, setOpen] = useState(false);
    const [cam, setCam] = useState(null);
    const [gall, setGall] = useState({});
    const oneOutletStation = useSelector(state => state.outletReducer.oneStation);
    const [listOfExpenses, setListOfExpenses] = useState([]);
    const [loading, setLoading] = useState(false);

    const [date, setDate] = useState('');
    const [expenseName, setExpenseName] = useState('');
    const [description, setDescription] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');

    const uploadFromGallery = () => {
        gallery.current.click();
    }

    const getPictureFromCam = () => {
        setOpen(true);
    }

    const pickFromGallery = (e) => {
        let file = e.target.files[0];
        setGall(file);
    }

    const submitExpenses = () => {

        if((typeof(cam) === "string")){
            if(date === "") return swal("Warning!", "Expense date field cannot be empty", "info");
            if(expenseName === "") return swal("Warning!", "Expense name field cannot be empty", "info");
            if(description === "") return swal("Warning!", "Description field cannot be empty", "info");
            if(expenseAmount === "") return swal("Warning!", "Expense amount field cannot be empty", "info");
            if(cam === null) return swal("Warning!", "Please select a file", "info");

            const payload = {
                dateCreated: date,
                expenseName: expenseName,
                description: description,
                expenseAmount: expenseAmount,
                attachApprovalCam: cam,
                outletID: oneOutletStation._id,
                organisationID: oneOutletStation.organisation,
            }

            setListOfExpenses(prev => [...prev, payload]);

            setDate("");
            setExpenseName("");
            setDescription("");
            setExpenseAmount(null);
            setCam(null);
            setGall("");
        }else{
            if(date === "") return swal("Warning!", "Expense date field cannot be empty", "info");
            if(expenseName === "") return swal("Warning!", "Expense name field cannot be empty", "info");
            if(description === "") return swal("Warning!", "Description field cannot be empty", "info");
            if(expenseAmount === "") return swal("Warning!", "Expense amount field cannot be empty", "info");
            if(typeof(gall.name) === "undefined") return swal("Warning!", "Please select a file", "info");

            const payload = {
                dateCreated: date,
                expenseName: expenseName,
                description: description,
                expenseAmount: expenseAmount,
                attachApprovalCam: gall,
                outletID: oneOutletStation._id,
                organisationID: oneOutletStation.organisation,
            }

            setListOfExpenses(prev => [...prev, payload]);

            setDate("");
            setExpenseName("");
            setDescription("");
            setExpenseAmount(null);
            setGall("");
            setCam(null);
        }
    }

    const addExpenses = async(url, payload, httpConfig) => {
        let res = await axios.post(url, payload, httpConfig).then((data) => {
            return data;
        });
        return res;
    }

    const addGallExpenses = async(url, formData, httpConfig) => {
        let res = await axios.post(url, formData, httpConfig).then((data) => {
            return data;
        });
        return res;
    }


    const submitAllExpenses = async() => {
        setLoading(true);
        for(let i = 0, max = listOfExpenses.length; i < max; i++){
            if((typeof(listOfExpenses[i].attachApprovalCam) === "string")){
                const url = config.BASE_URL + "/360-station/api/expenses/create";
                const httpConfig = {
                    headers: {
                        "content-type": "multipart/form-data",
                        "Authorization": "Bearer "+ localStorage.getItem('token'),
                    }
                };

                const createExpense = await addExpenses(url, listOfExpenses[i], httpConfig);
                console.log(createExpense, 'expenses is created successfully');
            }else{
                const formData = new FormData();
                formData.append("dateCreated", listOfExpenses[i].dateCreated);
                formData.append("expenseName", listOfExpenses[i].expenseName);
                formData.append("description", listOfExpenses[i].description);
                formData.append("expenseAmount", listOfExpenses[i].expenseAmount);
                formData.append("attachApproval", listOfExpenses[i].attachApprovalCam);
                formData.append("outletID", listOfExpenses[i].outletID);
                formData.append("organisationID", listOfExpenses[i].organisationID);
                const httpConfig = {
                    headers: {
                        "content-type": "multipart/form-data",
                        "Authorization": "Bearer "+ localStorage.getItem('token'),
                    }
                };

                const url = config.BASE_URL + "/360-station/api/expenses/create";

                const addExpenses = await addGallExpenses(url, formData, httpConfig);
                console.log(addExpenses, 'expenses is created successfully');
            }
        }

        props.refresh();
        setListOfExpenses([]);
        setLoading(false);
        swal("Sucess!", "Expenses Recorded Successfully!", "success");

        /*if((typeof(cam) === "string")){
            if(date === "") return swal("Warning!", "Expense date field cannot be empty", "info");
            if(expenseName === "") return swal("Warning!", "Expense name field cannot be empty", "info");
            if(description === "") return swal("Warning!", "Description field cannot be empty", "info");
            if(expenseAmount === "") return swal("Warning!", "Expense amount field cannot be empty", "info");
            if(cam === null) return swal("Warning!", "Please select a file", "info");

            const payload = {
                dateCreated: date,
                expenseName: expenseName,
                description: description,
                expenseAmount: expenseAmount,
                attachApprovalCam: cam,
                outletID: oneOutletStation._id,
                organisationID: oneOutletStation.organisation,
            }

            const url = config.BASE_URL + "/360-station/api/expenses/create";
            const httpConfig = {
                headers: {
                    "content-type": "multipart/form-data",
                    "Authorization": "Bearer "+ localStorage.getItem('token'),
                }
            };
            axios.post(url, payload, httpConfig).then((data) => {
                console.log('form data', data);
            }).then(()=>{
                swal("Success!", "Expenses recorded successfully", "success"); 
            }); 

        }else{
            if(date === "") return swal("Warning!", "Expense date field cannot be empty", "info");
            if(expenseName === "") return swal("Warning!", "Expense name field cannot be empty", "info");
            if(description === "") return swal("Warning!", "Description field cannot be empty", "info");
            if(expenseAmount === "") return swal("Warning!", "Expense amount field cannot be empty", "info");
            if(typeof(gall.name) === "undefined") return swal("Warning!", "Please select a file", "info");

            const formData = new FormData();
            formData.append("dateCreated", date);
            formData.append("expenseName", expenseName);
            formData.append("description", description);
            formData.append("expenseAmount", expenseAmount);
            formData.append("attachApproval", gall);
            formData.append("outletID", oneOutletStation._id);
            formData.append("organisationID", oneOutletStation.organisation);
            const httpConfig = {
                headers: {
                    "content-type": "multipart/form-data",
                    "Authorization": "Bearer "+ localStorage.getItem('token'),
                }
            };

            const url = config.BASE_URL + "/360-station/api/expenses/create";
            axios.post(url, formData, httpConfig).then((data) => {
                console.log('form data', data);
            }).then(()=>{
                swal("Success!", "Expenses recorded successfully", "success");
            });
        }*/
    }

    const deleteFromList = (index) => {
        const newList = [...listOfExpenses];
        newList.pop(index);
        setListOfExpenses(newList);

        setDate("");
        setExpenseName("");
        setDescription("");
        setExpenseAmount(null);
        setCam(null);
        setGall("");
    }

    return(
        <div className='expensesContainer'>
            <ReactCamera open={open} close={setOpen} setDataUri={setCam} />
            <div className='form-container'>
                <div style={{marginTop: '20px'}} className='inputs'>
                    <div className='text'>Date Created</div>
                    <input className='date' type={'date'}  />
                </div>

                <div className='twoInputs'>
                    <div className='inputs2'>
                        <div className='text'>Expenses Name</div>
                        <input value={expenseName} onChange={e => setExpenseName(e.target.value)} className='date' type={'text'}  />
                    </div>

                    <div className='inputs2'>
                        <div className='text'>Expenses Date</div>
                        <input value={date} onChange={e => setDate(e.target.value)} className='date' type={'date'}  />
                    </div>
                </div>

                <div style={{marginTop:'30px'}} className='inputs'>
                    <div className='text'>Description</div>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} style={textAreaStyle} className='date' type={'date'}  />
                </div>

                <div style={{marginTop: '20px'}} className='inputs'>
                    <div className='text'>Expense Amount</div>
                    <input value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} className='date' type={'number'}  />
                </div>

                <div style={{marginTop:'20px'}} className='inputs'>
                    <div className='text'>Expenses Invoice</div>
                    <div className='button-container'>
                        <Button onClick={getPictureFromCam} style={{background:'#216DB2', textTransform:'capitalize'}} className='buttons'>
                            <img style={{width:'22px', height:'18px', marginRight:'10px'}} src={photo} alt="icon" />
                            <div>{typeof(cam) === "string"? "Image taken":<span>Take photo</span>}</div>
                        </Button>
                        <Button onClick={uploadFromGallery} style={{background:'#087B36', textTransform:'capitalize'}} className='buttons'>
                            <img style={{width:'22px', height:'18px', marginRight:'10px'}} src={upload} alt="icon" />
                            <div>{typeof(gall) === "string"? "Upload":<span>File uploaded</span>}</div>
                        </Button>
                    </div>
                </div>
                <input onChange={pickFromGallery} ref={gallery} type={'file'} style={{visibility:'hidden'}} />

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
                        onClick={submitExpenses}
                        variant="contained"> Submit
                    </Button>
                </div>

                <div style={{width:'100%', height:'50px'}}></div>
            </div>

            <div className='right'>
                    <div className='headers'>
                        <div className='headText'>S/N</div>
                        <div className='headText'>date</div>
                        <div className='headText'>Expense Name</div>
                        <div className='headText'>Amount</div>
                        <div className='headText'>Action</div>
                    </div>

                    {
                        listOfExpenses.length === 0?
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
                        listOfExpenses.map((data, index) => {
                            return(
                                <div className='rows'>
                                    <div className='headText'>{index + 1}</div>
                                    <div className='headText'>{data.dateCreated}</div>
                                    <div className='headText'>{data.expenseName}</div>
                                    <div className='headText'>{data.expenseAmount}</div>
                                    <div className='headText'>
                                        <img 
                                            onClick={()=>{deleteFromList(index)}} 
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
                            onClick={submitAllExpenses}
                            variant="contained"> Submit
                        </Button>
                    </div>
            </div>
        </div>
    )
}

const textAreaStyle = {
    height:'150px',
    paddingTop:'10px',
}

const selectStyle2 = {
    width:'200px', 
    height:'35px', 
    borderRadius:'5px',
    background: '#F2F1F1B2',
    color:'#000',
    fontFamily: 'Nunito-Regular',
    fontSize:'14px',
    outline:'none',
    marginTop:'10px'
}

const menu = {
    fontSize:'14px',
    fontFamily:'Nunito-Regular'
}

export default Expenses;