import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import close from '../../assets/close.png';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Modal from '@mui/material/Modal';
import { ThreeDots } from  'react-loader-spinner';
import swal from 'sweetalert';
import '../../styles/lpo.scss';
import OutletService from '../../services/360station/outletService';
import { useEffect } from 'react';

const PumpUpdate = (props) => {
    const [loading, setLoading] = useState(false);
    const [totalizer, setTotalizer] = useState('');
    const [remark, setRemark] = useState('');
    const oneTank = useSelector(state => state.outletReducer.oneTank);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);

    const handleClose = () => props.close(false);

    useEffect(()=>{
        setTotalizer(props.current.totalizerReading)
    }, [props]);

    function removeSpecialCharacters(str) {
        return str.replace(/[^0-9.]/g, '');
    }

    const submit = () => {
        const prev = (Number(totalizer) - Number(props.current.totalizerReading)) < Number(oneTank.deadStockLevel)
        const detail = oneTank.currentLevel==="None"? true : prev;
        const difference = Number(totalizer) - Number(props.current.totalizerReading)

        if(oneStationData === null) return swal("Warning!", "Please create a station", "info");
        if(totalizer === "") return swal("Warning!", "Quantity field cannot be empty", "info");
        if(props.current.activeState === "0") return swal("Warning!", "Pump is currently inactive, contact admin", "info");
        if(oneTank.activeState === "0") return swal("Warning!", "Tank is currently inactive, contact admin", "info");
        if(Number(totalizer) < Number(props.current.totalizerReading)) return swal("Warning!", "Closing totalizer must be greater than Opening totalizer", "info");
        if((detail)) return swal("Warning!", "Tank deadstock level reached!", "info");
        if(remark === "") return swal("Warning!", "Remark field cannot be empty", "info");

        setLoading(true);

        const payload = {
            id: oneTank._id,
            previousLevel: oneTank.currentLevel,
            totalizer: removeSpecialCharacters(totalizer),
            currentLevel: oneTank.currentLevel === "None"? null: String(Number(oneTank.currentLevel) - difference),
            outletID: oneStationData?._id,
            organisationID: oneStationData?.organisation,
        }

        if(payload.currentLevel !== null){
            OutletService.updateTank(payload).then((data) => {
                return data;
            }).then(()=>{
                setLoading(false);
                handleClose();

                OutletService.pumpUpdate({id: props.current._id, totalizerReading: totalizer}).then((data)=>{
                    swal("Success", data.message, "success");
                }).then(()=>{
                    props.refresh();
                })
            });
            
        }else{
            swal("Warning!", "This is an empty tank!", "info");
        }
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
                            <div className='head-text'>Daily Pump Update</div>
                            <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                        </div>

                       <div className='middleDiv' style={inner}>
                            <div className='inputs'>
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
                                    type='text'
                                    value={totalizer}
                                    onChange={e => setTotalizer(removeSpecialCharacters(e.target.value))}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Host Tank Name</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    value={props.current.hostTankName}
                                    disabled={true}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Host Tank Current Level (Litres)</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    value={oneTank.currentLevel}
                                    disabled={true}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Product Type</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    value={props.current.productType}
                                    disabled={true}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Remark</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} 
                                    multiline
                                    rows={5}
                                    placeholder="" 
                                    onChange={e => setRemark(e.target.value)}
                                />
                            </div>
                       </div>

                        <div style={{marginTop:'10px', height:'30px'}} className='butt'>
                            <Button sx={{
                                width:'100px', 
                                height:'30px',  
                                background: '#427BBE',
                                borderRadius: '3px',
                                fontSize:'10px',
                                marginTop:'10px',
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
}

export default PumpUpdate;