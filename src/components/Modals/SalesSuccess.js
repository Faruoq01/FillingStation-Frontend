import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import close from '../../assets/close.png';
import "../../styles/salessuccess.scss";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { salesStatus } from '../../store/actions/dailySales';

const SalesSuccess = (props) => {
    const dispatch = useDispatch();
    const status = useSelector(state => state.dailySalesReducer.salesStatus);
    console.log(status, "all promises");

    const handleClose = () => {
        dispatch(salesStatus([]));
    }

    const Cards = ({item, index}) => {
        
        return(
            <div key={index} className='workArea'>
                <div>
                    <div style={label}>{item.value.data.section}</div>
                </div>
                <div>
                    {typeof item.value === "object" && <CheckCircleIcon sx={{mr: 2, color: '#066348'}} />}
                    {typeof item.value === "undefined" && <ErrorIcon sx={{mr: 2, color: 'red'}} />}
                </div>
            </div>
        )
    }

    return(
        <Modal
            open={salesStatus.length > 0}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{display:'flex', justifyContent:'center', alignItems:'center'}}
        >
            <div className='salesModalContainer'>
                <div className='innerSalesModal'>
                    <div className='closeIcon'>
                        <div className='successRemark'>Record Status</div>
                        <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                    </div>

                    <div className='ins'>
                        {
                            status.length === 0?
                            <div>No record</div>:
                            status.map((item, index) => {
                                return(
                                    <Cards item={item} index={index} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </Modal>
    )
}

const label = {
    fontSize: '12px',
    color: 'green',
    fontWeight: '600',
    marginLeft: '15px'
}

export default SalesSuccess;