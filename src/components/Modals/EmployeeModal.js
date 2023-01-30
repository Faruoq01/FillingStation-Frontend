import React from 'react';
import close from '../../assets/close.png';
import avat from '../../assets/avat.png';
import Modal from '@mui/material/Modal';
import '../../styles/lpo.scss';

const EmployeeDetails = (props) => {

    const handleClose = () => props.close(false);

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
                            <div className='head-text'></div>
                            <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                        </div>

                       <div className='middleDiv' style={inner}>
                            <img src={avat} alt="icon" style={{width:'60px', height:'60px', marginTop:'20px', borderRadius:'60px'}} />
                            <div style={main}>
                                <div style={item2}>
                                    <div style={title}>Staff Name</div>
                                </div>
                                <div style={item}>{props.data.staffName}</div>
                            </div>

                            <div style={main}>
                                <div style={item2}>
                                    <div style={title}>Sex</div>
                                </div>
                                <div style={item}>{props.data.sex}</div>
                            </div>

                            <div style={main}>
                                <div style={item2}>
                                    <div style={title}>Uploaded ID</div>
                                </div>
                                <div style={item}>Aminu Faruk Umar</div>
                            </div>

                            <div style={main}>
                                <div style={item2}>
                                    <div style={title}>Phone Number</div>
                                </div>
                                <div style={item}>{props.data.phone}</div>
                            </div>

                            <div style={main}>
                                <div style={item2}>
                                    <div style={title}>Date Of Birth</div>
                                </div>
                                <div style={item}>{props.data.dateOfBirth}</div>
                            </div>

                            <div style={main}>
                                <div style={item2}>
                                    <div style={title}>Home Address</div>
                                </div>
                                <div style={item}>{props.data.address}</div>
                            </div>

                            <div style={main}>
                                <div style={item2}>
                                    <div style={title}>Account Number</div>
                                </div>
                                <div style={item}>{props.data.accountNumber}</div>
                            </div>

                            <div style={main}>
                                <div style={item2}>
                                    <div style={title}>Bank Name</div>
                                </div>
                                <div style={item}>{props.data.bankName}</div>
                            </div>

                            <div style={main}>
                                <div style={item2}>
                                    <div style={title}>State Of Origin</div>
                                </div>
                                <div style={item}>{props.data.state}</div>
                            </div>

                            <div style={main}>
                                <div style={item2}>
                                    <div style={title}>Date Employed</div>
                                </div>
                                <div style={item}>{props.data.dateEmployed}</div>
                            </div>

                            <div style={main}>
                                <div style={item2}>
                                    <div style={title}>Job Title</div>
                                </div>
                                <div style={item}>{props.data.jobTitle}</div>
                            </div>

                            <div style={main}>
                                <div style={item2}>
                                    <div style={title}>Role</div>
                                </div>
                                <div style={item}>{props.data.role}</div>
                            </div>
                       </div>

                        <div style={{marginTop:'10px'}} className='butt'></div>
                        
                    </div>
                </div>
        </Modal>
    )
}

const inner = {
    width:'100%',
    height:'550px',
    overflowY: 'scroll',
    display:'flex',
    flexDirection:'column',
    alignItems:'center'
}

const title = {
    fontSize:'12px',
    padding:'12px',
    background: '#F0F9F7',
    borderRadius: '31px',
}

const item = {
    width:'65%',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    fontSize:'12px',
}

const item2 = {
    width:'35%',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    marginLeft:'20px'
}

const main = {
    width:'100%',
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    marginTop:'20px'
}

export default EmployeeDetails;