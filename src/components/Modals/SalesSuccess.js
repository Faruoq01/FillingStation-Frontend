import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import "../../styles/salessuccess.scss";

const SalesSuccess = (props) => {
    const dispatch = useDispatch();
    const salesStatus = useSelector(state => state.dailySalesReducer.salesStatus);
    console.log(salesStatus, "all promises");

    const handleClose = () => {
        dispatch(salesStatus([]));
    }

    return(
        <Modal
            open={props.open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{display:'flex', justifyContent:'center', alignItems:'center'}}
        >
            <div className='salesModalContainer'>

            </div>
        </Modal>
    )
}

export default SalesSuccess;