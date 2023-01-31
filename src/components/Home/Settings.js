import React, {useCallback, useEffect, useRef, useState} from 'react';
import '../../styles/settings.scss';
import rightArrow from '../../assets/rightArrow.png';
import dark from '../../assets/dark.png';
import light from '../../assets/light.png';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateUser } from '../../store/actions/auth';
import swal from 'sweetalert';
import OutletService from '../../services/outletService';
import { adminOutlet, getAllStations } from '../../store/actions/outlet';
import { ThreeDots } from 'react-loader-spinner';
import UserService from '../../services/user';
import axios from 'axios';
import config from '../../constants';

const OutletInfo = (props) => {
    const oneStation = useSelector(state => state.outletReducer.adminOutlet);
    const [id, setID] = useState('');
    const [outletName, setOutletName] = useState('');
    const [noOfPump, setNoOfPump] = useState('');
    const [noOfTank, setNoOfTank] = useState('');
    const [state, setState] = useState('');
    const [town, setTown] = useState('');
    const [lga, setLga] = useState('');
    const [street, setStreet] = useState('');
    const [loadingSpinner, setLoadingSpinner] = useState(false);

    useEffect(()=>{
        setOutletName(oneStation?.outletName);
        setNoOfPump(oneStation?.noOfPumps);
        setNoOfTank(oneStation?.noOfTanks);
        setState(oneStation?.state);
        setTown(oneStation?.city);
        setLga(oneStation?.lga);
        setStreet(oneStation?.alias);
        setID(oneStation?._id);
    }, [
        oneStation?.outletName,
        oneStation?.noOfPumps,
        oneStation?.noOfTanks,
        oneStation?.state,
        oneStation?.city,
        oneStation?.lga,
        oneStation?.alias,
        oneStation?._id
    ]);

    const updateOutlet = () => {
        if(outletName === "") return swal("Warning!", "Outlet name field cannot be empty", "info");
        if(noOfPump === "") return swal("Warning!", "No of pump name field cannot be empty", "info");
        if(noOfTank === "") return swal("Warning!", "No of tank name field cannot be empty", "info");
        if(state === "") return swal("Warning!", "State name field cannot be empty", "info");
        if(town === "") return swal("Warning!", "Town name field cannot be empty", "info");
        if(lga === "") return swal("Warning!", "LGA name field cannot be empty", "info");
        if(street === "") return swal("Warning!", "Street name field cannot be empty", "info");
        setLoadingSpinner(true);

        const payload = {
            id: id,
            outletName: outletName,
            state: state,
            city: state,
            lga: lga,
            area: town,
            alias: street,
            noOfTanks: noOfTank,
            noOfPumps: noOfPump,
            activeState: oneStation.activeState,
        }

        OutletService.updateStation(payload).then(data => {
            swal("Success", "Station updated successfully!", "success");
        }).then(()=>{
            setLoadingSpinner(false);
            props.refresh();
        })
    }

    return(
        <div className='outlet'>
            <div className='lef'>
                <div className='title'>Outlet Information</div>
                <div className='text-group'>
                    <div className='form-text'>Outlet Name</div>
                    <OutlinedInput 
                        sx={{
                            height: '35px', 
                            marginTop:'5px', 
                            background:'#EEF2F1', 
                            border:'1px solid #777777',
                            fontSize:'12px'
                        }} 
                        value={outletName}
                        onChange={e => setOutletName(e.target.value)}
                        placeholder="" 
                    />
                </div>
                <div className='text-group'>
                    <div className='form-text'>No Of Tanks</div>
                    <OutlinedInput 
                        sx={{
                            height: '35px', 
                            marginTop:'5px', 
                            background:'#EEF2F1', 
                            border:'1px solid #777777',
                            fontSize:'12px'
                        }} 
                        value={noOfTank}
                        onChange={e => setNoOfTank(e.target.value)}
                        placeholder="" 
                    />
                </div>
                <div className='text-group'>
                    <div className='form-text'>No Of Pumps</div>
                    <OutlinedInput 
                        sx={{
                            height: '35px', 
                            marginTop:'5px', 
                            background:'#EEF2F1', 
                            border:'1px solid #777777',
                            fontSize:'12px'
                        }} 
                        value={noOfPump}
                        onChange={e => setNoOfPump(e.target.value)}
                        placeholder="" 
                    />
                </div>
                <div className='text-group'>
                    <div className='form-text'>State</div>
                    <OutlinedInput 
                        sx={{
                            height: '35px', 
                            marginTop:'5px', 
                            background:'#EEF2F1', 
                            border:'1px solid #777777',
                            fontSize:'12px'
                        }} 
                        value={state}
                        onChange={e => setState(e.target.value)}
                        placeholder="" 
                    />
                </div>
                <div className='text-group'>
                    <div className='form-text'>Town</div>
                    <OutlinedInput 
                        sx={{
                            height: '35px', 
                            marginTop:'5px', 
                            background:'#EEF2F1', 
                            border:'1px solid #777777',
                            fontSize:'12px'
                        }} 
                        value={town}
                        onChange={e => setTown(e.target.value)}
                        placeholder="" 
                    />
                </div>
            </div>
            <div className='rig'>
                <div style={{marginTop:'50px'}} className='text-group'>
                    <div className='form-text'>LGA</div>
                    <OutlinedInput 
                        sx={{
                            height: '35px', 
                            marginTop:'5px', 
                            background:'#EEF2F1', 
                            border:'1px solid #777777',
                            fontSize:'12px'
                        }} 
                        value={lga}
                        onChange={e => setLga(e.target.value)}
                        placeholder="" 
                    />
                </div>

                <div className='text-group'>
                    <div className='form-text'>Alias</div>
                    <OutlinedInput 
                        sx={{
                            height: '35px', 
                            marginTop:'5px', 
                            background:'#EEF2F1', 
                            border:'1px solid #777777',
                            marginBottom:'30px',
                            fontSize:'12px'
                        }} 
                        value={street}
                        onChange={e => setStreet(e.target.value)}
                        placeholder="" 
                    />
                </div>

                <Button 
                    variant="contained" 
                    sx={{
                        width:'100%',
                        height:'30px',
                        background:'#054834',
                        fontSize:'11px',
                        marginBottom:'20px',
                        '&:hover': {
                            backgroundColor: '#054834'
                        }
                    }}
                    onClick={updateOutlet}
                >
                    Save
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
    )
}

const Appearances = () => {
    const user = useSelector(state => state.authReducer.user);
    const dispatch = useDispatch();
    const [active, setActive] = useState(true);
    const [inActive, setInactive] = useState(false);

    const [sideBar, setSideBar] = useState("0");

    useEffect(()=>{
        setActive(user.isDark === "0"? true: false);
        setInactive(user.isDark === "0"? false: true);
    }, [user.isDark]);

    const selectDarkMode = () => {
        const payload = {
            id: user._id,
            isDark: user.isDark === "0"? "1" : "0"
        }

        UserService.updateUserDarkMode(payload).then((data) => {
            return data
        }).then(data => {
            UserService.getOneUser({id: data.user._id}).then(data => {
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch(updateUser(data.user))
            })
        })
    }

    const changeSideBar = (data, color) => {
        setSideBar(data);

        const payload = {
            id: user._id,
            sideBarMode: color
        }

        UserService.updateUserDarkMode(payload).then((data) => {
            return data
        }).then(data => {
            UserService.getOneUser({id: data.user._id}).then(data => {
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch(updateUser(data.user))
            })
        })
    }

    return(
        <div className='appearance'>
            <div className='app'>
                <div className='head'>Appearances</div>
            </div>
            <div className='details'>
                <div className='detail-text'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Posuere
                </div>
                <div className='theme'>
                    <div className='col'> 
                        <div style={{ fontSize:'12px'}}>Color</div>
                        <div style={{marginTop:'10px'}} className='radio'>
                            <div style={{marginRight:'10px'}} className='color-group'>
                                <div className='colors'>
                                    <img src={dark} alt="icon" style={{width:'30px', height:'30px'}} />
                                </div>
                                <div style={{ fontSize:'12px'}}>Light</div>
                            </div>
                            <Radio onChange={selectDarkMode} checked={active}/>
                        </div>
                        <div style={{marginTop:'10px'}} className='radio'>
                            <div style={{marginRight:'10px'}} className='color-group'>
                                <div style={{background:'#fff'}} className='colors'>
                                    <img src={light} alt="icon" style={{width:'30px', height:'30px'}} />
                                </div>
                                <div style={{ fontSize:'12px'}}>Dark</div>
                            </div>
                            <Radio onChange={selectDarkMode} checked={inActive} />
                        </div>
                    </div>

                    <div className='col2'>
                        <div style={{ fontSize:'12px'}}>Theme</div>
                        <div style={{marginTop:'10px'}} className='radio'>
                            <div className='color-group'>
                                <div style={{background: '#054834'}} className='colors'></div>
                                <div style={{ fontSize:'12px'}}>Green</div>
                            </div>
                            <Radio onChange={()=>{changeSideBar("0", '#054834')}} checked={sideBar === "0"? true: false} />
                        </div>
                        <div className='radio'>
                            <div className='color-group'>
                                <div style={{background:'#181017'}} className='colors'></div>
                                <div style={{ fontSize:'12px'}}>Dark</div>
                            </div>
                            <Radio onChange={()=>{changeSideBar("1", '#181017')}}  checked={sideBar === "1"? true: false} />
                        </div>
                        <div className='radio'>
                            <div className='color-group'>
                                <div style={{background:'#2e3f49'}} className='colors'></div>
                                <div style={{ fontSize:'12px'}}>Party</div>
                            </div>
                            <Radio onChange={()=>{changeSideBar("2", '#2e3f49')}}  checked={sideBar === "2"? true: false} />
                        </div>
                        <div style={{marginBottom:'20px'}} className='radio'>
                            <div className='color-group'>
                                <div style={{background:'#132124'}} className='colors'></div>
                                <div>mood</div>
                            </div>
                            <Radio onChange={()=>{changeSideBar("3", '#132124')}} checked={sideBar === "3"? true: false} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Logo = () => {
    const logos = useRef();
    const [saveFile, setSaveFile] = useState(null);
    const [loadingSpinner, setLoaadingSpinner] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.authReducer.user);

    const browseGallery = () => {
        logos.current.click();
    }

    const fileInputHandler = (e) => {
        let file = e.target.files[0];
        console.log(file)
        setSaveFile(file);
    }

    const updateLogo = () => {
        if(saveFile === null){
            swal("Warning!", "Please select a file to upload!", "info");
        }else{
            if(saveFile.type.split('/')[0] === "image"){
                setLoaadingSpinner(true);
                const formData = new FormData();
                formData.append("file", saveFile);
                formData.append("id", user._id);
                const httpConfig = {
                    headers: {
                        "content-type": "multipart/form-data",
                        "Authorization": "Bearer "+ localStorage.getItem('token'),
                    }
                };
                const url = config.BASE_URL+"/360-station/api/uploadLogoFile";
                axios.post(url, formData, httpConfig).then((data) => {
                    swal("Success!", "Logo updated successfully!", "success");
                }).then(()=>{
                    UserService.getOneUser({id: user._id}).then(data => {
                        localStorage.setItem("user", JSON.stringify(data.user));
                        dispatch(updateUser(data.user));
                    }).then(()=>{
                        setLoaadingSpinner(false);
                    });
                });
            }else{
                swal("Warning!", "Only image files are supported!", "info");
            }
        }
    }

    return(
        <div className='appearance'>
            <div className='app'>
                <div className='head'>Logo (Branding)</div>
            </div>
            <div className='details'>
                <div style={{
                    fontSize:'12px',
                    display:'flex',
                    flexDirection:'row',
                    justifyContent:'flex-start',
                    marginTop:'40px',
                    fontWeight:'bold'
                }}>
                    Logo
                </div>
                <div style={{marginTop:'10px'}} className='detail-text'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Posuere
                </div>

                <div className='browse'>
                    <Button 
                        variant="contained" 
                        sx={{
                            width:'110px',
                            height:'30px',
                            background:'#06805B',
                            fontSize:'11px',
                            '&:hover': {
                                backgroundColor: '#06805B'
                            }
                        }}
                        onClick={browseGallery}
                    >
                        Browse
                    </Button>
                    <span>{saveFile && saveFile.name}</span>

                    <Button 
                        variant="contained" 
                        sx={{
                            width:'100%',
                            height:'30px',
                            background:'#054834',
                            fontSize:'11px',
                            marginTop:'30px',
                            marginBottom:'20px',
                            '&:hover': {
                                backgroundColor: '#054834'
                            }
                        }}
                        onClick={updateLogo}
                    >
                        Save
                    </Button>
                    <input onChange={fileInputHandler} ref={logos} type="file" style={{visibility:'hidden'}} />
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
    )
}

const Password = () => {
    const user = useSelector(state => state.authReducer.user);
    const dispatch = useDispatch();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loadingSpinner, setLoadingSpinner] = useState(false);

    const changePassowrd = () => {
        if(password === "") return swal("Warning!", "Password field cannot be empty", "info");
        if(confirmPassword === "") return swal("Warning!", "Confirm password field cannot be empty", "info");
        if(confirmPassword !== password) return swal("Warning!", "Password did not match", "info");
        setLoadingSpinner(true);

        const payload = {
            id: user._id,
            password: password
        }

        UserService.updateUserDarkMode(payload).then((data) => {
            return data
        }).then(data => {
            UserService.getOneUser({id: data.user._id}).then(data => {
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch(updateUser(data.user));
                setLoadingSpinner(false);
                setPassword("");
                setConfirmPassword("");
                swal("Success!", "Password reset successfully!", "info");
            })
        })
    }

    return(
        <div className='appearance'>
            <div style={{width:'200px', marginTop:'10px'}} className='app'>
                <div className='head'>Change Password</div>
            </div>
            <div className='details'>
                <div className='text-group'>
                    <div className='form-text'>New Password</div>
                    <OutlinedInput 
                        sx={{
                            width:'100%',
                            height: '35px', 
                            marginTop:'5px', 
                            background:'#EEF2F1', 
                            border:'1px solid #777777'
                        }} 
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="" 
                    />
                </div>

                <div style={{marginTop:'20px'}} className='text-group'>
                    <div className='form-text'>Re-type New Password</div>
                    <OutlinedInput 
                        sx={{
                            width:'100%',
                            height: '35px', 
                            marginTop:'5px', 
                            background:'#EEF2F1', 
                            border:'1px solid #777777'
                        }} 
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="" 
                    />
                </div>

                <div style={{marginTop:'20px'}} className='text-group'>
                    <Button 
                        variant="contained" 
                        sx={{
                            width:'100%',
                            height:'30px',
                            background:'#054834',
                            fontSize:'11px',
                            marginTop:'20px',
                            marginBottom:'20px',
                            '&:hover': {
                                backgroundColor: '#054834'
                            }
                        }}
                        onClick={changePassowrd}
                    >
                        Save Changes
                    </Button>
                </div>

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
    )
}

const Email = () => {
    const [email, setEmail] = useState("");
    const user = useSelector(state => state.authReducer.user);
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const dispatch = useDispatch();

    const changeEmail = () => {
        if(email === "") return swal("Warning!", "Email field cannot be empty", "info");
        if(!email.includes('@')) return swal("Warning!", "Please put a valid email", "info");
        if(!email.includes('.')) return swal("Warning!", "Please put a valid email", "info");
        setLoadingSpinner(true);

        const payload = {
            id: user._id,
            email: email
        }

        UserService.updateUserDarkMode(payload).then((data) => {
            return data
        }).then(data => {
            UserService.getOneUser({id: data.user._id}).then(data => {
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch(updateUser(data.user));
                setLoadingSpinner(false);
                setEmail("");
                swal("Success!", "Email reset successfully!", "info");
            })
        })
    }

    return(
        <div className='appearance'>
            <div style={{width:'200px', marginTop:'10px'}} className='app'>
                <div className='head'>Change Email</div>
            </div>
            <div className='details'>
                <div className='text-group'>
                    <div className='form-text'>Email</div>
                    <OutlinedInput 
                        sx={{
                            width:'100%',
                            height: '35px', 
                            marginTop:'5px', 
                            fontSize:'12px',
                            background:'#EEF2F1', 
                            border:'1px solid #777777'
                        }} 
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="" 
                    />
                </div>

                <div style={{marginTop:'20px'}} className='text-group'>
                    <Button 
                        variant="contained" 
                        sx={{
                            width:'100%',
                            height:'30px',
                            background:'#054834',
                            fontSize:'11px',
                            marginTop:'20px',
                            marginBottom:'20px',
                            '&:hover': {
                                backgroundColor: '#054834'
                            }
                        }}
                        onClick={changeEmail}
                    >
                        Save
                    </Button>
                </div>
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
    )
}

const DeleteOutlet = (props) => {
    const [station, setStation] = useState("");
    const oneStation = useSelector(state => state.outletReducer.adminOutlet);
    const [loadingSpinner, setLoadingSpinner] = useState(false);

    useEffect(()=>{
        setStation(oneStation?.outletName)
    }, [oneStation.outletName]);

    const deleteStation = () => {
        if(station === "") return swal("Warning!", "Please select a station", "info");

        setLoadingSpinner(true);

        const payload = {
            id: oneStation._id,
        }

        OutletService.deleteOutletStation(payload).then((data) => {
            swal("Success!", "Outlet deleted successfully!", "info");
        }).then(data => {
            setLoadingSpinner(false);
            props.refresh();
        });
    }

    return(
        <div className='appearance'>
            <div style={{width:'200px', marginTop:'10px'}} className='app'>
                <div className='head'>Delete Outlet</div>
            </div>
            <div className='details'>
                <div className='text-group'>
                    <div style={{ fontWeight:'bold', fontSize:'12px'}}>Notice</div>
                    <div style={{
                        fontSize:'12px', 
                        marginTop:'10px',
                        textAlign:'left'
                    }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Posuere  
                    </div>
                </div>

                <div style={{marginTop:'20px'}} className='text-group'>
                    <div className='form-text'>Why do you want to delete outlets?</div>
                    <OutlinedInput 
                        sx={{
                            width:'100%',
                            height: '35px', 
                            marginTop:'5px', 
                            background:'#EEF2F1', 
                            border:'1px solid #777777',
                            fontSize:'12px',
                        }}
                        disabled={true} 
                        value={station}
                        placeholder="" 
                    />
                </div>

                <div style={{marginTop:'20px'}} className='text-group'>
                    <Button 
                        variant="contained" 
                        sx={{
                            width:'100%',
                            height:'30px',
                            background:'#054834',
                            fontSize:'11px',
                            marginTop:'20px',
                            marginBottom:'20px',
                            '&:hover': {
                                backgroundColor: '#054834'
                            }
                        }}
                        onClick={deleteStation}
                    >
                        Save
                    </Button>
                </div>
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
    )
}

const Settings = (props) => {

    const [nav, setNav] = useState(0);
    const [defaultState, setDefault] = useState(0);
    const dispatch = useDispatch();
    const user = useSelector(state => state.authReducer.user);
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);

    const logouts = () => {
        swal({
            title: "Alert!",
            text: "Are you sure you want to logout?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                dispatch(logout());
                props.history.push('/login');
            }
        });
    }

    const getStationData = useCallback(() => {
        const payload = {
            organisation: user._id
        }

        if(user.userType === "superAdmin" || user.userType === "admin"){
            OutletService.getAllOutletStations(payload).then(data => {
                dispatch(getAllStations(data.station));
                if(data.station.length !== 0){
                    setDefault(1);
                }
                dispatch(adminOutlet(data.station[0]));
                return data.station[0];
            });
        }else{
            OutletService.getOneOutletStation({outletID: user.outletID}).then(data => {
                dispatch(adminOutlet(data.station));
                return data.station;
            });
        }
    }, [user._id, user.userType, user.outletID, dispatch]);

    useEffect(()=>{
        getStationData();
    },[getStationData]);

    const changeMenu = (index, item ) => {
        setDefault(index);
        dispatch(adminOutlet(item));
    }
    
    return(

        <div data-aos="zoom-in-down" className='settingsContainer'>
            <div className='action'>
                <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={1}
                    sx={{
                        backgroundColor:"#06805B", 
                        color:'#fff', 
                        height:'35px',  
                        width:'150px', 
                        fontSize:'12px',
                        marginRight:'20px'
                    }}
                >
                    <MenuItem value={1}>Action</MenuItem>
                    <MenuItem onClick={()=>{setNav(0)}} value={2}>Outlet Information</MenuItem>
                    <MenuItem onClick={()=>{setNav(1)}} value={3}>Appearances</MenuItem>
                    <MenuItem onClick={()=>{setNav(2)}} value={4}>Logo (Branding)</MenuItem>
                    <MenuItem onClick={()=>{setNav(3)}} value={5}>Change Password</MenuItem>
                    <MenuItem onClick={()=>{setNav(4)}} value={6}>Change Email</MenuItem>
                    <MenuItem onClick={()=>{setNav(5)}} value={7}>Delete Outlet</MenuItem>
                    <MenuItem onClick={logouts} value={8}>Logout</MenuItem>
                </Select>
            </div>
            <div className='inner-container'>
                <div className='leftSettings'>
                    <div className='linspace'>
                        <div onClick={()=>{setNav(0)}} className='accord'>
                            <div style={nav === 0? active: inActive}>Outlet Information</div>
                            <img style={{width:'7px', height:'13px'}} src={rightArrow} alt="icon" />
                        </div>
                        <div onClick={()=>{setNav(1)}} className='accord'>
                            <div style={nav === 1? active: inActive} className='text'>Appearances</div>
                            <img style={{width:'7px', height:'13px'}} src={rightArrow} alt="icon" />
                        </div>
                        <div onClick={()=>{setNav(2)}} className='accord'>
                            <div style={nav === 2? active: inActive} className='text'>Logo ( Branding )</div>
                            <img style={{width:'7px', height:'13px'}} src={rightArrow} alt="icon" />
                        </div>
                        <div onClick={()=>{setNav(3)}} className='accord'>
                            <div style={nav === 3? active: inActive} className='text'>Change Password</div>
                            <img style={{width:'7px', height:'13px'}} src={rightArrow} alt="icon" />
                        </div>
                        <div onClick={()=>{setNav(4)}} className='accord'>
                            <div style={nav === 4? active: inActive} className='text'>Change Email</div>
                            <img style={{width:'7px', height:'13px'}} src={rightArrow} alt="icon" />
                        </div>
                        <div onClick={()=>{setNav(5)}} className='accord'>
                            <div style={nav === 5? active: inActive} className='text'>Delete Outlets</div>
                            <img style={{width:'7px', height:'13px'}} src={rightArrow} alt="icon" />
                        </div>
                        <div onClick={logouts} className='accord'>
                            <div style={{color:'#1F1F1F'}} className='text'>Logout</div>
                            <img style={{width:'7px', height:'13px'}} src={rightArrow} alt="icon" />
                        </div>
                    </div>
                </div>
                <div className='rightSettings'>
                    <div className='inner'>
                        <div style={contain}>
                            <div className='second-select'>
                                {(user.userType === "superAdmin" || user.userType === "admin") &&
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={defaultState}
                                        sx={selectStyle2}
                                    >
                                        <MenuItem style={menu} value={0}>Select Station</MenuItem>
                                        {
                                            allOutlets.map((item, index) => {
                                                return(
                                                    <MenuItem key={index} style={menu} onClick={()=>{changeMenu(index + 1, item)}} value={index + 1}>{item.outletName+ ', ' +item.alias}</MenuItem>
                                                )
                                            })  
                                        }
                                    </Select>
                                }
                                {user.userType === "staff" &&
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={0}
                                        sx={selectStyle2}
                                        disabled
                                    >
                                        <MenuItem style={menu} value={0}>{user.userType === "staff"? oneStationData?.outletName+", "+oneStationData?.alias: "No station created"}</MenuItem>
                                    </Select>
                                }
                            </div>
                        </div>
                        { nav === 0 && <OutletInfo refresh={getStationData} />}
                        { nav === 1 && <Appearances />}
                        { nav === 2 && <Logo />}
                        { nav === 3 && <Password />}
                        { nav === 4 && <Email />}
                        { nav === 5 && <DeleteOutlet refresh={getStationData} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

const menu = {
    fontSize:'12px',
}

const active = {
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '12px',
    lineHeight: '150.4%',
    color: '#06805B',
}

const inActive = {
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '12px',
    lineHeight: '150.4%',
    color: '#1F1F1F',
}

const selectStyle2 = {
    width:'160px', 
    height:'35px', 
    borderRadius:'0px',
    background: '#054834',
    color:'#fff',
    fontSize:'12px',
    outline:'none',
    marginBottom: '10px',
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border:'1px solid #777777',
    },
}

const contain = {
    width:'100%',
    display:'flex',
    flexDirection:'row',
    justifyContent:'flex-start'
}

export default Settings;