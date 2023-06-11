import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import { ThreeDots } from  'react-loader-spinner';
import swal from 'sweetalert';
import '../../../styles/pays.scss';

const UpdatePayments = (props) => {
    const [loading, setLoading] = useState(false);
    const user = useSelector(state => state.authReducer.user);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);

    const handleClose = () => props.close(false);

    const resolveUserID = () => {
        if(user.userType === "superAdmin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
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
            <div style={{height:'auto', overflow:'hidden'}} className='modalContainer2'>
                <div class="master-container">
                    <div class="card coupons">
                        <label class="title">Update payments</label>
                        <form class="form">
                            <input type="text" placeholder="Apply your new payments here!" class="input_field"/>
                            <button>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

const inner = {
    width:'100%',
    height:'340px',
}

export default UpdatePayments;