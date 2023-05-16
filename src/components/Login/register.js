import React, {useState} from 'react';
import Button from '@mui/material/Button';
import { ThreeDots } from  'react-loader-spinner';
import { useSelector } from 'react-redux';
import swal from 'sweetalert';
import { register, setSpinner } from '../../store/actions/auth';
import { useDispatch } from 'react-redux';
import '../../styles/login.scss';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import COUNTRIES from '../common/countryList';
const moment = require('moment-timezone');

const Register = (props) => {

    const loadingSpinner = useSelector(state => state.authReducer.loadingSpinner);
    const dispatch = useDispatch();

    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [org, setOrg] = useState('');
    const [location, setLocation] = useState('');
    const [country, setCountry] = useState('');
    const [menus, setMenus] = useState(false);
    const [menus2, setMenus2] = useState(false);
    const [datas, setDatas] = useState(COUNTRIES);
    const [timezone, setTimeZone] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [zones, setZones] = useState([]);

    const switchToRegister = () => props.reg(prev => !prev);

    const registerUser = () => {
        if(firstname === "") return swal("Warning!", "First name field cannot be empty", "info");
        if(lastname === "") return swal("Warning!", "Last name field cannot be empty", "info");
        if(email === "") return swal("Warning!", "Email field cannot be empty", "info");
        if(country === "") return swal("Warning!", "Please select country", "info");
        if(password === "") return swal("Warning!", "Password field cannot be empty", "info");
        if(password !== confirm) return swal("Warning!", "Password must match", "info");
        if(org === "") return swal("Warning!", "Organisation field cannot be empty", "info");
        if(location === "") return swal("Warning!", "Location field cannot be empty", "info");

        const data = {
            firstname: firstname,
            lastname: lastname,
            email: email.toLowerCase(),
            country: country,
            timezone: timezone,
            countryCode: countryCode,
            password: password,
            organisation: org,
            location: location,
        }

        dispatch(setSpinner());
        dispatch(register(data, props));
    }

    const filterCountry = (e) => {
        const list = COUNTRIES.filter(data => !data.name.toUpperCase().indexOf(e.target.value.toUpperCase()));
        setDatas(list);
    }

    const filterTimeZone = (e) => {
        const list = zones.filter(data => !data.toUpperCase().indexOf(e.target.value.toUpperCase()));
        setZones(list);
    }

    const selectedCountry = (data) => {
        setCountry(data.name);
        setCountryCode(data.code);
        setMenus(!menus);
        setZones(moment.tz.zonesForCountry(data.code))
        setTimeZone(moment.tz.zonesForCountry(data.code)[0]);
    }

    const selectedTimeZone = (data) => {
        setTimeZone(data);
        setMenus2(false);
    }

    return(
        <div style={{height:'auto'}} className='login-form-container'>
            <div className='inner-sign'>
                <div className='login-text'>Signup</div>
                <input 
                    className='input-field' 
                    type={'text'} 
                    placeholder="First name"  
                    value={firstname}
                    onChange = {e => setFirstName(e.target.value)}
                />

                <input 
                    style={{marginTop:'20px'}}
                    className='input-field' 
                    type={'text'} 
                    placeholder="Last name"  
                    value={lastname}
                    onChange = {e => setLastName(e.target.value)}
                />

                <input 
                    style={{marginTop:'20px'}}
                    className='input-field' 
                    type={'text'} 
                    placeholder="Email"  
                    value={email}
                    onChange = {e => setEmail(e.target.value)}
                />

                <input 
                    style={{marginTop:'20px'}}
                    className='input-field' 
                    type={'text'} 
                    placeholder="Organisation"  
                    value={org}
                    onChange = {e => setOrg(e.target.value)}
                />

                <div className='single-form'>
                    <div className='input-d'>
                        <div style={{width: '96%', position:'relative'}}>
                            <div onClick={()=>{setMenus(!menus); setMenus2(false)}} className='text-field2'>
                                <span style={{fontWeight:'100', fontSize:'13px'}}>{country===""? "Select Country": country}</span>
                                <KeyboardArrowDownIcon sx={{marginRight:'10px'}} />
                            </div>
                            {menus &&
                                <div className="drop">
                                    <input onChange={(e)=>{filterCountry(e)}} className="searches" type={'text'} placeholder="Search" />
                                    <div className="cons">
                                        {
                                            datas.map((data, index) => {
                                                return(
                                                    <span onClick={()=>{selectedCountry(data)}} key={index} className="ids">&nbsp;&nbsp;&nbsp; {data.name}</span>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div className='single-form'>
                    <div className='input-d'>
                        <div style={{width: '96%', position:'relative'}}>
                            <div onClick={()=>{setMenus2(!menus2); setMenus(false)}} className='text-field2'>
                                <span style={{fontWeight:'100', fontSize:'13px'}}>{timezone===""? "Select Timezone": timezone}</span>
                                <KeyboardArrowDownIcon sx={{marginRight:'10px'}} />
                            </div>
                            {menus2 &&
                                <div className="drop">
                                    <input onChange={(e)=>{filterTimeZone(e)}} className="searches" type={'text'} placeholder="Search" />
                                    <div className="cons">
                                        {
                                            zones.map((data, index) => {
                                                return(
                                                    <span onClick={()=>{selectedTimeZone(data)}} key={index} className="ids">&nbsp;&nbsp;&nbsp; {data}</span>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <input 
                    style={{marginTop:'20px'}}
                    className='input-field' 
                    type={'password'} 
                    placeholder="Password"  
                    value={password}
                    onChange = {e => setPassword(e.target.value)}
                />

                <input 
                    style={{marginTop:'20px'}}
                    className='input-field' 
                    type={'password'} 
                    placeholder="Confirm password"  
                    value={confirm}
                    onChange = {e => setConfirm(e.target.value)}
                />

                <input 
                    style={{marginTop:'20px'}}
                    className='input-field' 
                    type={'text'} 
                    placeholder="Location" 
                    value={location} 
                    onChange = {e => setLocation(e.target.value)}
                />

                <Button sx={{
                    width:'100%', 
                    height:'35px', 
                    background:'#076146', 
                    borderRadius:'24px', 
                    marginTop:'30px',
                    textTransform:"capitalize",
                    '&:hover': {
                        backgroundColor: '#076146'
                    }
                    }}  variant="contained"
                    onClick={registerUser}>Register
                </Button>

                <div style={{height:"35px", alignItems:'center'}} className='reg'>
                    <div>
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
                    <div onClick={switchToRegister} className='register'>Login</div>
                </div>
            </div>
        </div>
    )
}

export default Register;