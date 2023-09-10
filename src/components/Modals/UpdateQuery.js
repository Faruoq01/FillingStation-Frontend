import React, { useState } from 'react';
import close from '../../assets/close.png';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Modal from '@mui/material/Modal';
import { ThreeDots } from  'react-loader-spinner';
import swal from 'sweetalert';
import '../../styles/lpo.scss';
import QueryService from '../../services/360station/query';

const UpdateQuery = (props) => {
    const [loading, setLoading] = useState(false);
    const [employeeName, setEmployeeName] = useState("");
    const [queryTitle, setQueryTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleClose = () => props.close(false);

    const submit = () => {
        if(employeeName === "") return swal("Warning!", "Employee name field cannot be empty", "info");
        if(queryTitle === "") return swal("Warning!", "Query title field cannot be empty", "info");
        if(description === "") return swal("Warning!", "Description field cannot be empty", "info");

        setLoading(true);

        const payload = {
            employeeName: employeeName,
            queryTitle: queryTitle,
            description: description,
            id: props.id._id
        }
    
        QueryService.updateQuery(payload).then((data) => {
            swal("Success", "Query created successfully!", "success");
        }).then(()=>{
            setLoading(false);
            props.refresh();
            handleClose();
        })
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
                            <div className='head-text'>Update Query</div>
                            <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                        </div>

                       <div className='middleDiv' style={inner}>
                            <div className='inputs'>
                                <div className='head-text2'>Employee Name</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    onChange={e => setEmployeeName(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Query Title</div>
                                <OutlinedInput 
                                    sx={{
                                        width:'100%',
                                        height: '35px', 
                                        marginTop:'5px', 
                                        background:'#EEF2F1', 
                                        border:'1px solid #777777',
                                        fontSize:'12px',
                                    }} placeholder="" 
                                    onChange={e => setQueryTitle(e.target.value)}
                                />
                            </div>

                            <div className='inputs'>
                                <div className='head-text2'>Description</div>
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
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>
                       </div>

                        <div style={{marginTop:'10px'}} className='butt'>
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
    height:'340px',
}

export default UpdateQuery;