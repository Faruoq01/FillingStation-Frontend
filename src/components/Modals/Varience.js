import React from 'react';
import close from '../../assets/close.png';
import pumpHead from '../../assets/pumpHead.png';
import Modal from '@mui/material/Modal';
import '../../styles/cost.scss'
import { useDispatch } from 'react-redux';
import { overageType } from '../../store/actions/dailySales';
import { useHistory } from 'react-router-dom';

const Varience = (props) => {

    const handleClose = () => props.close(false);
    const dispatch = useDispatch();
    const history = useHistory();

    const approx2 = (data) => {
        const changeToString = String(data);

        const findIndex = changeToString.indexOf(".");
        if(findIndex === -1){
            return changeToString;
        }

        const splitDataByDecimal = changeToString.split('.');
        const splitFractions = splitDataByDecimal[1].split('');
        if(splitFractions.length <= 2){
            return changeToString;
        }
        
        let fractionBuilder = splitFractions[0];
        if(Number(splitFractions[2] > 5)){
            const tenths = Number(splitFractions[1]) + 1;
            fractionBuilder = fractionBuilder.concat("", tenths);

        }else{
            fractionBuilder = fractionBuilder.concat(splitFractions[1]);
        }

        const approxNumber = splitDataByDecimal[0].concat(".", fractionBuilder);

        return approxNumber;
    }

    const changePage = (data) => {
        if(data === 'pms'){
            dispatch(overageType("PMS"));
            history.push("/home/overage");

        }else if(data === "ago"){
            dispatch(overageType("AGO"));
            history.push("/home/overage");

        }else if(data === "dpk"){
            dispatch(overageType("DPK"));
            history.push("/home/overage");
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
            <div style={{background:'#fff', padding:'10px'}} className='modalContainer'>
                <div style={{height:'85%'}} className='inner'>
                    <div className='head'>
                        <div className='head-text'></div>
                        <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                    </div>
                    <div className='cont'>
                        <div className='card'>
                            <div onClick={()=>changePage("pms")} className='inCard'>
                                <div className='left'>
                                    <img src={pumpHead} style={{width:'80px', height:'80px'}} alt="icon" />
                                </div>
                                <div className='right'>
                                    <div className='content'>
                                        <span className='head'>PMS</span>
                                        <span className='head'>{approx2(props.dash.pmsVolume)} Ltrs</span>
                                        <div style={{marginTop:'10px'}} className='cont'>Varience Amount</div>
                                        <div className='cont'>NGN {approx2(props.dash.pmsSales)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='card'>
                            <div onClick={()=>changePage("ago")} className='inCard'>
                                <div className='left'>
                                    <img src={pumpHead} style={{width:'80px', height:'80px'}} alt="icon" />
                                </div>
                                <div className='right'>
                                    <div className='content'>
                                        <span className='head'>AGO</span>
                                        <span className='head'>{approx2(props.dash.agoVolume)} Ltrs</span>
                                        <div style={{marginTop:'10px'}} className='cont'>Varience Amount</div>
                                        <div className='cont'>NGN {approx2(props.dash.agoSales)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='card'>
                            <div onClick={()=>changePage("dpk")} className='inCard'>
                                <div className='left'>
                                    <img src={pumpHead} style={{width:'80px', height:'80px'}} alt="icon" />
                                </div>
                                <div className='right'>
                                    <div className='content'>
                                        <span className='head'>DPK</span>
                                        <span className='head'>{approx2(props.dash.dpkVolume)} Ltrs</span>
                                        <div style={{marginTop:'10px'}} className='cont'>Varience Amount</div>
                                        <div className='cont'>NGN {approx2(props.dash.dpkSales)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default Varience;;