import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '../../store/actions/outlet';
import { useSelector } from 'react-redux';
import close from '../../assets/close.png';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Modal from '@mui/material/Modal';
import { ThreeDots } from  'react-loader-spinner';
import states from '../../modules/states';
import swal from 'sweetalert';
import { createFillingStation } from '../../store/actions/outlet';
import '../../styles/payments.scss';
import AddStationLocationMap from '../common/AddStationLocationMap';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import { GoogleApiWrapper } from "google-maps-react";
import upload from '../../assets/upload.png';
import axios from 'axios';
import config from '../../constants';

const CreateFillingStation = (props) => {

    const dispatch = useDispatch();
    const attach = useRef();
    const open = useSelector(state => state.outletReducer.openModal);
    const user = useSelector(state => state.authReducer.user);

    const handleClose = () => dispatch(closeModal(0));
    const [defaultState, setDefaultState] = useState(0);
    const [local, setLocal] = useState(0);
    const [loading2, setLoading2] = useState(0);
    const [uploadFile, setUpload] = useState('');
    
    const [outletName, setOutletName] = useState('');
    const [state, setState] = useState(states.listOfStates[0].state);
    const [city, setCity] = useState('');
    const [lga, setLga] = useState(states.listOfStates[0].lgas[0]);
    const [alias, setAlias] = useState('');
    const [pmsCost, setPMSCost] = useState('');
    const [pmsPrice, setPMSPrice] = useState('');
    const [agoCost, setAGOCost] = useState('');
    const [agoPrice, setAGOPrice] = useState('');
    const [dpkCost, setDPKCost] = useState('');
    const [dpkPrice, setDPKPrice] = useState('');
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const resolveUserID = () => {
        if(user.userType === "superAdmin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
        }
    }

    const handleTankModal = async() => {

        if(outletName === "") return swal("Warning!", "Outlet name field cannot be empty", "info");
        if(state === "") return swal("Warning!", "State field cannot be empty", "info");
        if(city === "") return swal("Warning!", "City field cannot be empty", "info");
        if(lga === "") return swal("Warning!", "LGA field cannot be empty", "info");
        if(pmsCost === "") return swal("Warning!", "PMS Cost field cannot be empty", "info");
        if(pmsPrice === "") return swal("Warning!", "PMS Price field cannot be empty", "info");
        if(agoCost === "") return swal("Warning!", "AGO Cost field cannot be empty", "info");
        if(agoPrice === "") return swal("Warning!", "AGO Price field cannot be empty", "info");
        if(dpkCost === "") return swal("Warning!", "DPK Cost field cannot be empty", "info");
        if(dpkPrice === "") return swal("Warning!", "DPK Price field cannot be empty", "info");
        if(alias === "") return swal("Warning!", "Alias field cannot be empty", "info");
        if(longitude === "") return swal("Warning!", "Longitude field cannot be empty", "info");
        if(latitude === "") return swal("Warning!", "latitude field cannot be empty", "info");
        if(uploadFile === "") return swal("Warning!", "File upload cannot be empty", "info");
        setLoadingSpinner(true);

        const data = {
            outletName: outletName,
            state: state,
            city: city,
            lga: lga,
            alias: alias,
            noOfTanks: "",
            noOfPumps: "",
            image: uploadFile,
            PMSCost: removeSpecialCharacters(pmsCost),
            PMSPrice: removeSpecialCharacters(pmsPrice),
            AGOCost: removeSpecialCharacters(agoCost),
            AGOPrice: removeSpecialCharacters(agoPrice),
            DPKCost: removeSpecialCharacters(dpkCost),
            DPKPrice: removeSpecialCharacters(dpkPrice),
            organisation: resolveUserID().id,
            longitude: longitude,
            latitude: latitude
        }
        
        await dispatch(createFillingStation(data, setLoadingSpinner));
        await dispatch(closeModal(0));
        await props.getStations();
        dispatch(openModal(4));
    }

    const handleMenuSelection = (item) => {
        setDefaultState(item.target.dataset.value);
        setState(states.listOfStates[item.target.dataset.value].state);
    }

    const handleLgaSelection = (item) => {
        setLocal(item.target.dataset.value);
        setLga(states.listOfStates[defaultState].lgas[item.target.dataset.value]);
    }

    const handleChange = address => {
        setCity(address)
    };
     
    const handleSelect = address => {
        setCity(address);
        geocodeByAddress(address)
        .then(results => getLatLng(results[0]))
        .then(latLng => {
            setLongitude(latLng.lng);
            setLatitude(latLng.lat);
        })
        .catch(error => console.error('Error', error));
    };

    function removeSpecialCharacters(str) {
        return str.replace(/[^0-9.]/g, '');
    }

    const uploadProductOrders = () => {
        attach.current.click();
    }

    const selectedFile = (e) => {
        let file = e.target.files[0];
        setLoading2(1);
        const formData = new FormData();
        formData.append("file", file);
        const httpConfig = {
            headers: {
                "content-type": "multipart/form-data",
                "Authorization": "Bearer "+ localStorage.getItem('token'),
            }
        };
        const url = `${config.BASE_URL}/360-station/api/upload`;
        axios.post(url, formData, httpConfig).then((data) => {
            setUpload(data.data.path);
        }).then(()=>{
            setLoading2(2);
        });
    }

    return(
        <Modal
            open={open === 1}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{display:'flex', justifyContent:'center', alignItems:'center'}}
        >
                <div className='modalContainer2'>
                    <div className='inner'>
                        <div className='head'>
                            <div className='head-text'>Create Filling Station</div>
                            <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                        </div>

                        <div style={{width:'100%', height:'480px', overflowX:'hidden', overflowY:'scroll'}}>
                            <div className='inputs'>
                                <div className='head-text2'>Outlet Name</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    onChange={e => setOutletName(e.target.value)}
                                />
                            </div>

                            <div style={{marginTop:'15px'}} className='inputs'>
                                <div className='head-text2'>Choose state</div>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={defaultState}
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }}
                                >
                                    {
                                        states.listOfStates.map((item, index) => {
                                            return(
                                                <MenuItem style={menu} key={index} onClick={handleMenuSelection} value={index}>{item.state}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </div>

                            <div style={{marginTop:'15px'}} className='inputs'>
                                <div className='head-text2'>LGA</div>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={local}
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }}
                                >
                                    {
                                        states.listOfStates[defaultState].lgas.map((item, index) => {
                                            return(
                                                <MenuItem style={menu} key={index} onClick={handleLgaSelection} value={index}>{item}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </div>

                            <div style={{marginTop:'15px'}} className='inputs'>
                                <div className='head-text2'>Address (Full address)</div>
                                <PlacesAutocomplete
                                    value={city}
                                    onChange={handleChange}
                                    onSelect={handleSelect}
                                >
                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <div style={{width:'100%'}}>
                                        <input
                                        style={{
                                            width:'96%',
                                            height: '35px', 
                                            marginTop:'5px', 
                                            background:'#EEF2F1', 
                                            fontSize:'12px',
                                            borderRadius:'0px',
                                            paddingLeft:'10px',
                                            border:'1px solid #777777',
                                            outline:'none'
                                        }}
                                        {...getInputProps({
                                            placeholder: '',
                                            className: 'location-search-input',
                                        })}
                                        />
                                        <div className="autocomplete-dropdown-container">
                                            {loading && <div>Loading...</div>}
                                            {
                                                suggestions.map(suggestion => {
                                                    const className = suggestion.active
                                                    ? 'suggestion-item--active'
                                                    : 'suggestion-item';
                                                    // inline style for demonstration purpose
                                                    const style = suggestion.active
                                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                    return (
                                                    <div
                                                        {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                        style,
                                                        })}
                                                    >
                                                        <span style={mens}>{suggestion.description}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    )}
                                </PlacesAutocomplete>
                            </div>

                            <div style={{marginTop:'15px'}} className='inputs'>
                                <div className='head-text2'>Alias</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    onChange={e => setAlias(e.target.value)}
                                />
                            </div>

                            <div style={{marginTop:'15px'}} className='inputs'>
                                <div className='head-text2'>PMS Cost Price</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    type={'text'}
                                    value={pmsCost}
                                    onChange={e => setPMSCost(e.target.value)}
                                />
                            </div>

                            <div style={{marginTop:'15px'}} className='inputs'>
                                <div className='head-text2'>PMS Selling Price</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    type={'text'}
                                    value={pmsPrice}
                                    onChange={e => setPMSPrice(e.target.value)}
                                />
                            </div>

                            <div style={{marginTop:'15px'}} className='inputs'>
                                <div className='head-text2'>AGO Cost Price</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    type={'text'}
                                    value={agoCost}
                                    onChange={e => setAGOCost(e.target.value)}
                                />
                            </div>

                            <div style={{marginTop:'15px'}} className='inputs'>
                                <div className='head-text2'>AGO Selling Price</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    type={'text'}
                                    value={agoPrice}
                                    onChange={e => setAGOPrice(e.target.value)}
                                />
                            </div>

                            <div style={{marginTop:'15px'}} className='inputs'>
                                <div className='head-text2'>DPK Cost Price</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    type={'text'}
                                    value={dpkCost}
                                    onChange={e => setDPKCost(e.target.value)}
                                />
                            </div>

                            <div style={{marginTop:'15px'}} className='inputs'>
                                <div className='head-text2'>DPK Selling Price</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    type={'text'}
                                    value={dpkPrice}
                                    onChange={e => setDPKPrice(e.target.value)}
                                />
                            </div>

                            <div style={{marginTop:'15px'}} className='inputs'>
                                <div className='head-text2'>Longitude</div>
                                <OutlinedInput 
                                    disabled
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    value={longitude}
                                />
                            </div>

                            <div style={{marginTop:'15px'}} className='inputs'>
                                <div className='head-text2'>Latitude</div>
                                <OutlinedInput 
                                    disabled
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        fontSize:'12px',
                                        borderRadius:'0px',
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            border:'1px solid #777777',
                                        },
                                    }} placeholder="" 
                                    value={latitude}
                                />
                            </div>

                            <AddStationLocationMap 
                                city={city} 
                                long={setLongitude} 
                                lat={setLatitude} 
                                lt={latitude}
                                ln={longitude}
                            />
                            {/* 'openingHour': req.body.openingHour,
                        'closingHour': req.body.closingHour,
                        'startWeekday': req.body.startWeekday,
                        'endWeekday': req.body.endWeekday, */}
                            <div style={{marginTop:'15px'}} className='inputs'>
                                <div className='head-text2'>Latitude</div>
                                <div style={flat}>
                                    <OutlinedInput 
                                        disabled
                                        sx={{
                                            width:'48%',
                                            height: '35px', 
                                            marginTop:'5px', 
                                            background:'#EEF2F1', 
                                            fontSize:'12px',
                                            borderRadius:'0px',
                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                border:'1px solid #777777',
                                            },
                                        }} placeholder="" 
                                        value={latitude}
                                    />
                                    <OutlinedInput 
                                        disabled
                                        sx={{
                                            width:'48%',
                                            height: '35px', 
                                            marginTop:'5px', 
                                            background:'#EEF2F1', 
                                            fontSize:'12px',
                                            borderRadius:'0px',
                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                border:'1px solid #777777',
                                            },
                                        }} placeholder="" 
                                        value={latitude}
                                    />
                                </div>
                            </div>
                            
                            <Button sx={{
                                width:'100%', 
                                height:'35px',  
                                background: '#427BBE',
                                borderRadius: '3px',
                                fontSize:'10px',
                                marginTop:'30px',
                                '&:hover': {
                                    backgroundColor: '#427BBE'
                                }
                                }} 
                                onClick={uploadProductOrders}
                                variant="contained"> 
                                <img style={{width:'25px', height:'20px', marginRight:'10px'}} src={upload} alt={'icon'} />
                                { loading2 === 0 && <div>Attachment</div>}
                                { loading2 === 1 &&
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
                                { loading2 === 2 && <div style={{color:'#fff', fontSize:'12px'}}>Success</div>}
                            </Button>
                            <input onChange={selectedFile} ref={attach} type="file" style={{visibility:'hidden'}} />

                        </div>

                        <div style={{height:'30px'}} className='butt'>
                            <Button disabled={loadingSpinner} sx={{
                                width:'100px', 
                                height:'30px',  
                                background: '#427BBE',
                                borderRadius: '3px',
                                fontSize:'10px',
                                marginTop:'00px',
                                '&:hover': {
                                    backgroundColor: '#427BBE'
                                }
                                }} 
                                onClick={handleTankModal} 
                                variant="contained"> Save
                            </Button>

                            {loadingSpinner?
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

const flat = {
    display: 'flex',
    flexDirection: 'row',
}

const menu = {
    fontSize:'14px',
}

const mens = {
    width:'100%',
    height:'auto',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start',
    marginTop:'5px',
    border:'1px solid #ccc',
    borderTopColor:'transparent',
    borderLeft:'none',
    borderRight:'none',
    paddingBottom:'5px',
    fontSize:'12px',
    fontFamily:'Poppins',
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyDZnZ15rSQS_2CluQE47CY5MRqAHGdUYZY",
    libraries: ["places"]
})(CreateFillingStation);