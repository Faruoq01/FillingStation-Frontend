import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import close from '../../assets/close.png';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Modal from '@mui/material/Modal';
import { ThreeDots } from  'react-loader-spinner';
import swal from 'sweetalert';
import '../../styles/lpo.scss';
import '../../styles/lpo.scss';
import Radio from '@mui/material/Radio';
import 'react-html5-camera-photo/build/css/index.css';
import AdminUserService from '../../services/adminUsers';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const StaffModal = (props) => {
    const [loading, setLoading] = useState(false);
    const user = useSelector(state => state.authReducer.user);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);

    const [staffName, setStaffName] = useState('');
    const [defaultState, setDefaultState] = useState(0);
    const [sex, setSex] = useState('Male');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [state, setState] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [dateEmployed, setDateEmployed] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [role, setRole] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const changeMenu = (index, item) => {
        setDefaultState(index);
    }

    const handleClose = () => {
        props.close(false)
    };

    /*const handleClose2 = () => {
        setClose2(false);
    }

    const handleClose3 = () => {
        setClose3(false);
    }

    function handleTakePhoto (dataUri) {
        setLoading3(1);
        const url = "http://localhost:3000/360-station/api/uploadFromCamera";
        const payload = {
            image: dataUri,
            token: "Bearer "+ localStorage.getItem('token')
        }
        axios.post(url, payload).then((data) => {
            setStaffImage(data.data.path);
        }).then(()=>{
            setLoading3(2);
            setClose2(false);
        });
    }

    function handlePhotoID (dataUri) {
        setLoading3(1);
        const url = "http://localhost:3000/360-station/api/uploadFromCamera";
        const payload = {
            image: dataUri,
            token: "Bearer "+ localStorage.getItem('token')
        }
        axios.post(url, payload).then((data) => {
            setStaffID(data.data.path);
        }).then(()=>{
            setLoading3(2);
            setClose3(false);
        });
    }*/

    const submit = () => {
        if(oneStationData === null) return swal("Warning!", "Please create a station", "info");
        if(staffName === "") return swal("Warning!", "Staff name field cannot be empty", "info");
        if(sex === "") return swal("Warning!", "Sex field cannot be empty", "info");
        if(email === "") return swal("Warning!", "Email field cannot be empty", "info");
        if(phone === "") return swal("Warning!", "Phone field cannot be empty", "info");
        if(address === "") return swal("Warning!", "Address field cannot be empty", "info");
        if(state === "") return swal("Warning!", "State field cannot be empty", "info");
        if(accountNumber === "") return swal("Warning!", "Account No field cannot be empty", "info");
        if(bankName === "") return swal("Warning!", "Bank name field cannot be empty", "info");
        if(dateEmployed === "") return swal("Warning!", "Date employed field cannot be empty", "info");
        if(dateOfBirth === "") return swal("Warning!", "Date of birth field cannot be empty", "info");
        if(role === "") return swal("Warning!", "Role field cannot be empty", "info");
        if(jobTitle === "") return swal("Warning!", "Job title field cannot be empty", "info");
        if(password === "") return swal("Warning!", "Password field cannot be empty", "info");
        if(confirmPassword !== password) return swal("Warning!", "Password field did not match", "info");

        setLoading(true);
        const payload = {
            staffName: staffName,
            sex: sex,
            email: email,
            phone: phone,
            address: address,
            state: state,
            accountNumber: accountNumber,
            bankName: bankName,
            dateEmployed: dateEmployed,
            dateOfBirth: dateOfBirth,
            role: role,
            jobTitle: jobTitle,
            password: password,
            organisationID: user._id,
            outletID: oneStationData._id,
        }

        AdminUserService.createStaffUsers(payload).then((data) => {
            if(data.hasOwnProperty('message')){
                swal("Error!", data.message, "error");
            }else{
                swal("Success!", "A new user created successfully!", "success");
            }
        }).then(()=>{
            setLoading(false);
            props.refresh();
            handleClose();
        })
    }

    /*const selectedFile = (e) => {
        let file = e.target.files[0];
        setLoading2(1);
        const formData = new FormData();
        formData.append("file", file);
        const config = {
            headers: {
                "content-type": "multipart/form-data",
                "Authorization": "Bearer "+ localStorage.getItem('token'),
            }
        };
        const url = "http://localhost:3000/360-station/api/upload";
        axios.post(url, formData, config).then((data) => {
            setStaffImage(data.data.path);
            console.log('from gallery', data.data.path)
        }).then(()=>{
            setLoading2(2);
        });
    }

    const selectID = (e) => {
        let file = e.target.files[0];
        setLoading2(1);
        const formData = new FormData();
        formData.append("file", file);
        const config = {
            headers: {
                "content-type": "multipart/form-data",
                "Authorization": "Bearer "+ localStorage.getItem('token'),
            }
        };
        const url = "http://localhost:3000/360-station/api/upload";
        axios.post(url, formData, config).then((data) => {
            setStaffID(data.data.path);
            console.log('from gallery', data.data.path)
        }).then(()=>{
            setLoading2(2);
        });
    }

    const CameraModal = (props) => {
        return(
            <Modal
                open={props.open}
                onClose={handleClose2}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ display:'flex', justifyContent:'center', alignItems:'center'}}
            >
                <Camera
                    onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
                    idealResolution = {{width: 200, height: 200}}
                    imageCompression = {0.5}
                    sizeFactor = {0.5}
                />
            </Modal>
        )
    }

    const CameraIDModal = (props) => {
        return(
            <Modal
                open={props.open}
                onClose={handleClose3}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ display:'flex', justifyContent:'center', alignItems:'center'}}
            >
                <Camera
                    onTakePhoto = { (dataUri) => { handlePhotoID(dataUri); } }
                    idealResolution = {{width: 200, height: 200}}
                    imageCompression = {0.5}
                    sizeFactor = {0.5}
                />
            </Modal>
        )
    }*/

    return(
        <Modal
            open={props.open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{display:'flex', justifyContent:'center', alignItems:'center'}}
        >
                <div className='modalContainer2'>
                    <div className='inner'>
                        <div className='head'>
                            <div className='head-text'>Admin Users</div>
                            <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                        </div>

                       <div className='middleDiv' style={inner}>
                            <div className='inputs'>
                                <div className='head-text2'>Staff Name</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    type='text'
                                    onChange={e => setStaffName(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Outlet Name</div>
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
                                    {
                                        props.allOutlets.map((item, index) => {
                                            return(
                                                <MenuItem key={index} style={menu} onClick={()=>{changeMenu(index, item)}} value={index}>{item.outletName}</MenuItem>
                                            )
                                        })  
                                    }
                                </Select>
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Sex</div>
                                <div className='radio'>
                                    <div className='rad-item'>
                                        <Radio onClick={()=>{setSex('Male')}} checked={sex === 'Male'? true: false} />
                                        <div className='head-text2' style={{marginRight:'5px'}}>Male</div>
                                    </div>
                                    <div className='rad-item'>
                                        <Radio onClick={()=>{setSex('Female')}} checked={sex === 'Female'? true: false} />
                                        <div className='head-text2' style={{marginRight:'5px'}}>Female</div>
                                    </div>
                                </div>
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Email</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    type='text'
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Phone Number</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} 
                                    type='number'
                                    placeholder="" 
                                    onChange={e => setPhone(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Home Address</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    type='text'
                                    onChange={e => setAddress(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>State Of Origin</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    type='text'
                                    onChange={e => setState(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Account Number</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    type='text'
                                    onChange={e => setAccountNumber(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Bank Name</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    type='text'
                                    onChange={e => setBankName(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Date Employed</div>
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
                                    onChange={e => setDateEmployed(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Date Of Birth</div>
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
                                    onChange={e => setDateOfBirth(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Role</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    type='text'
                                    onChange={e => setRole(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Job Title</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    type='text'
                                    onChange={e => setJobTitle(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Password</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    type='password'
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Confirm Password</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    type='password'
                                    onChange={e => setConfirmPassword(e.target.value)}
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
                                variant="contained"> Add User
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


const menu = {
    fontSize:'14px',
}

export default StaffModal;