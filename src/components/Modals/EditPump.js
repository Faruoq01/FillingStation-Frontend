import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import close from '../../assets/close.png';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Modal from '@mui/material/Modal';
import { ThreeDots } from  'react-loader-spinner';
import Radio from '@mui/material/Radio';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import swal from 'sweetalert';
import OutletService from '../../services/outletService';
import { removeSpinner, setSpinner } from '../../store/actions/outlet';

const EditPump = (props) => {

    const dispatch = useDispatch();
    const loadingSpinner = useSelector(state => state.authReducer.loadingSpinner);

    const [defaultState, setDefaultState] = useState(0);
    const [productType, setProduct] = useState('');
    const [pumpName, setPumpName] = useState('');
    const [totalizer, setTotalizer] = useState('');
    const [hostTank, setHostTank] = useState(null);

    const handleClose = () => dispatch(props.close(false));

    const handleOpen = () => {
        if(hostTank === null) return swal("Warning!", "Please select host tank", "info");
        if(pumpName === "") return swal("Warning!", "Pump name field cannot be empty", "info");
        if(defaultState === "") return swal("Warning!", "Tank name field cannot be empty", "info");
        if(productType === "") return swal("Warning!", "Product type field cannot be empty", "info");
        if(totalizer === "") return swal("Warning!", "Totalizer field cannot be empty", "info");
        dispatch(setSpinner());

        const data = {
            id: props.data._id,
            pumpName: pumpName,
            hostTank: hostTank._id,
            productType: productType,
            totalizerReading: totalizer,
            organisationID: hostTank.organisationID,
            outletID: hostTank.outletID,
            hostTankName: hostTank.tankName,
        }

        OutletService.pumpUpdate(data).then((data) => {
            dispatch(removeSpinner());
            props.refresh();
            swal("Success", data.message, "success");
        }).then(()=>{
            props.outRefresh();
            handleClose();
        });
    }

    const updateTank = (data, index) => {
        setDefaultState(index);
        setHostTank(data);
    }

    useEffect(()=>{
        const findID = props.allTank.findIndex(data => data._id === props.data.hostTank);
        setDefaultState(findID);
        setProduct(props.data.productType);
        setTotalizer(props.data.totalizerReading);
        setPumpName(props.data.pumpName);
        setHostTank(props.allTank[findID]);
    },[props.data.productType, props.allTank, props.data.totalizerReading, props.data.hostTank, props.data.pumpName]);

    return(
        <Modal
            open={props.open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{display:'flex', justifyContent:'center', alignItems:'center'}}
        >
            <div style={{height:'430px'}} className='modalContainer2'>
                <div className='inner'>
                    <div className='head'>
                        <div className='head-text'>Add Pump</div>
                        <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                    </div>

                    <div style={{marginTop:'15px'}} className='inputs'>
                        <div className='head-text2'>Choose product type</div>
                        <div className='radio'>
                            <div className='rad-item'>
                                <Radio onClick={()=>{setProduct('PMS')}} checked={productType === 'PMS'? true: false} />
                                <div className='head-text2' style={{marginRight:'5px'}}>PMS</div>
                            </div>
                            <div className='rad-item'>
                                <Radio onClick={()=>{setProduct('AGO')}} checked={productType === 'AGO'? true: false} />
                                <div className='head-text2' style={{marginRight:'5px'}}>AGO</div>
                            </div>
                            <div className='rad-item'>
                                <Radio onClick={()=>{setProduct('DPK')}} checked={productType === 'DPK'? true: false} />
                                <div className='head-text2' style={{marginRight:'5px'}}>DPK</div>
                            </div>
                        </div>
                    </div>

                    <div className='inputs'>
                        <div className='head-text2'>Pump Name</div>
                        <OutlinedInput 
                            sx={{
                                width:'100%',
                                height: '35px', 
                                marginTop:'5px', 
                                background:'#EEF2F1', 
                                border:'1px solid #777777',
                                fontSize:'12px',
                            }} placeholder="" 
                            value={pumpName}
                            onChange={e => setPumpName(e.target.value)}
                        />
                    </div>

                    <div style={{marginTop:'15px'}} className='inputs'>
                        <div className='head-text2'>Tank Connected to pump</div>
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
                                props.allTank.map((data, index) => {
                                    return(
                                        <MenuItem onChange={()=>{updateTank(data, index)}} key={index} style={menu} value={index}>{data.tankName}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </div>

                    <div style={{marginTop:'15px'}} className='inputs'>
                        <div className='head-text2'>Totalizer Reading</div>
                        <OutlinedInput 
                            sx={{
                                width:'100%',
                                height: '35px', 
                                marginTop:'5px', 
                                background:'#EEF2F1', 
                                border:'1px solid #777777',
                                fontSize:'12px',
                            }} placeholder="" 
                            value={totalizer}
                            onChange={e => setTotalizer(e.target.value)}
                        />
                    </div>

                    <div style={{height:'30px'}} className='butt'>
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
                            onClick={handleOpen} 
                            variant="contained"> Save
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
            </div>
        </Modal>
    )
}

const menu = {
    fontSize:'14px',
}

export default EditPump;