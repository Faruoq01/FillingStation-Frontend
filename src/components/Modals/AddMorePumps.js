import React from 'react';
import { useDispatch } from 'react-redux';
import { closeModal, openModal } from '../../store/actions/outlet';
import { useSelector } from 'react-redux';
import close from '../../assets/close.png';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import createTank from '../../assets/createTank.png';
import { ThreeDots } from  'react-loader-spinner';

const AddPumpMore = () => {

    const dispatch = useDispatch();
    const open = useSelector(state => state.outletReducer.openModal);
    const loadingSpinner = useSelector(state => state.authReducer.loadingSpinner);

    const handleClose = () => dispatch(closeModal(0));

    const handleAddPumps = () => {
        dispatch(closeModal(0));
        dispatch(openModal(3));
    }

    const addMoreTanks = () => {
        dispatch(openModal(2));
    }

    return(
        <Modal
            open={open === 6}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{display:'flex', justifyContent:'center', alignItems:'center'}}
        >
            <div style={{height:'430px'}} className='modalContainer2'>
                <div className='inner'>
                    <div className='head'>
                        <div className='head-text'></div>
                        <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                    </div>

                    <div className='tank'>
                        <img style={{width:'300px', height:'250px'}} src={createTank} alt="icon" />
                    </div>

                    <div className='tex'>
                        A new outlets has been created proceed to add tanks and pump
                    </div>

                    <div style={{flexDirection:'column'}} className='butt'>
                        <Button sx={{
                            width:'200px', 
                            height:'30px',  
                            background: '#427BBE',
                            borderRadius: '3px',
                            fontSize:'10px',
                            marginTop:'0px',
                            '&:hover': {
                                backgroundColor: '#427BBE'
                            }
                            }}  
                            onClick={handleAddPumps}
                            variant="contained"> Add Pumps
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

                    <div onClick={addMoreTanks} style={tanks}>Add more tanks</div>
                </div>
            </div>
        </Modal>
    )
}

const tanks = {
    width:'100%',
    marginTop:'20px',
    fontSize:'14px',
    color:'blue',
    textAlign:'center',
}

export default AddPumpMore;