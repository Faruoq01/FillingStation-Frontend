import "../../styles/comprehensive.scss";
import pump from '../../assets/comp/pump.png';
import expenses from '../../assets/comp/expenses.png';
import lpo from '../../assets/comp/lpo.png';
import cal from '../../assets/comp/cal.png';
import tank from '../../assets/comp/tank.png';
import bals from '../../assets/comp/bals.png';
import returnTo from '../../assets/comp/returnTo.png';
import InitialBalance from "../Comprehensive/BalanceBF";
import { useEffect, useState } from "react";
import ProductBalance from "../Comprehensive/ProductBalance";
import LPOReport from "../Comprehensive/LPOReport";
import Expenses from "../Comprehensive/Expenses";
import BalanceCF from "../Comprehensive/BalanceCF";
import Dipping from "../Comprehensive/Dipping";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReturnToTank from "../Comprehensive/ReturnToTank";
import PaymentDetails from "../Comprehensive/PaymentDetails";
import { isSafari } from "react-device-detect";
import { bulkReports, currentDateValue } from "../../store/actions/dailySales";
import DailySalesService from "../../services/DailySales";
import { useRef } from "react";
import moment from "moment";
import { Button } from "@mui/material";
import ReportConfirmation from "../Comprehensive/ReportConfirmation";

const months = {
    '01' : 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
}

const ComprehensiveReport = () => {

    const [collapsible, setCollapsible] = useState(0);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const user = useSelector(state => state.authReducer.user);
    const history = useHistory();
    const dispatch = useDispatch();
    const dateHandle = useRef();

    const [currentDate, setCurrentDate] = useState("");

    const resolveUserID = () => {
        if(user.userType === "superAdmin" || user.userType === "admin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
        }
    }

    useEffect(()=>{
        const todayMoment = moment().format('YYYY-MM-DD HH:mm:ss').split(' ')[0];
        const date = todayMoment.split('-');
        const format = `${date[2]} ${months[date[1]]} ${date[0]}`;
        setCurrentDate(format);

        if(oneStationData === null){
            history.push('/home/daily-sales');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateDate = (e) => {
        // if(!getPerm('4')) return swal("Warning!", "Permission denied", "info");
        const date = e.target.value.split('-');
        const format = `${date[2]} ${months[date[1]]} ${date[0]}`;
        setCurrentDate(format);
        dispatch(currentDateValue(e.target.value));
        getAndAnalyzeDailySales(oneStationData, false, e.target.value);
    }

    const getAndAnalyzeDailySales = (data, status, value) => {
        const salesPayload = {
            organisationID: resolveUserID().id,
            outletID: data._id,
            onLoad: status,
            selectedDate: value
        }

        DailySalesService.getDailySalesDataAndAnalyze(salesPayload).then(data => {
            dispatch(bulkReports(data.dailyRecords));
        });
    }

    return(
        <div className="comprehensive_container">
            <div className="reportings">
                <div className="comp_result">
                    <div style={{width:'100%', display:'flex', flexDirection:'row', justifyContent:'flex-end'}}>
                        <div>
                            <div style={sales}>
                                <input onChange={updateDate} ref={dateHandle} style={{
                                    width: '100px',
                                    height:'30px',
                                    background:'#054834',
                                    fontSize:'12px',
                                    borderRadius:'0px',
                                    textTransform:'capitalize',
                                    display:'flex',
                                    flexDirection:'row',
                                    alignItems:'center',
                                    color:'#fff',
                                    outline:'none',
                                    border:'none',
                                    paddingRight:'10px'
                                }} type="date" />
                                {isSafari || 
                                    <div onClick={()=>{dateHandle.current.showPicker()}} style={cover}>{currentDate}</div>
                                }
                            </div>
                        </div>
                    </div>

                    <Button 
                        variant="contained" 
                        sx={{
                            width:'100px',
                            height:'30px',
                            background:'tomato',
                            fontSize:'12px',
                            marginLeft:'10px',
                            marginRight: '20px',
                            borderRadius:"0px",
                            textTransform:'capitalize',
                            '&:hover': {
                                backgroundColor: 'tomato'
                            }
                        }}
                        // onClick={()=>{openDailySales("report")}}
                    >
                        Print
                    </Button>
                </div>

                <div className="first_layer">
                    <div className="first_top_layer">
                        <div className="back_layer">
                            <div onClick={() => setCollapsible(0)} className="back_icon">
                                <img style={{width:'15px', height:'17px'}} src={bals} alt="icon" />
                            </div>
                        </div>
                        <div className="topic_name">Initial Balance</div>
                    </div>

                    <div className="first_mid_layer">
                        {collapsible === 0 && <InitialBalance />}
                    </div>
                </div>

                <div className="first_layer">
                    <div className="first_top_layer">
                        <div className="back_layer">
                            <div onClick={() => setCollapsible(1)} className="back_icon">
                                <img style={{width:'17px', height:'17px'}} src={pump} alt="icon" />
                            </div>
                        </div>
                        <div className="topic_name">Product Dispensed</div>
                    </div>

                    <div className="first_mid_layer">
                        {collapsible === 1 && <ProductBalance type ={"PMS"} />}
                        {collapsible === 1 && <ProductBalance type ={"AGO"} />}
                        {collapsible === 1 && <ProductBalance type ={"DPK"} />}
                    </div>
                </div>

                <div className="first_layer">
                    <div className="first_top_layer">
                        <div className="back_layer">
                            <div onClick={() => setCollapsible(2)} className="back_icon">
                                <img style={{width:'20px', height:'17px'}} src={returnTo} alt="icon" />
                            </div>
                        </div>
                        <div className="topic_name">Return to Tank</div>
                    </div>

                    <div className="first_mid_layer">
                        {collapsible === 2 && <ReturnToTank />}
                    </div>
                </div>

                <div className="first_layer">
                    <div className="first_top_layer">
                        <div className="back_layer">
                            <div onClick={() => setCollapsible(3)} className="back_icon">
                                <img style={{width:'20px', height:'16px'}} src={lpo} alt="icon" />
                            </div>
                        </div>
                        <div className="topic_name">LPO</div>
                    </div>

                    <div className="first_mid_layer">
                        {collapsible === 3 && <LPOReport />}
                    </div>
                </div>

                <div className="first_layer">
                    <div className="first_top_layer">
                        <div className="back_layer">
                            <div onClick={() => setCollapsible(4)} className="back_icon">
                                <img style={{width:'20px', height:'15px'}} src={expenses} alt="icon" />
                            </div>
                        </div>
                        <div className="topic_name">Expenses</div>
                    </div>

                    <div className="first_mid_layer">
                        {collapsible === 4 && <Expenses />}
                    </div>
                </div>

                <div className="first_layer">
                    <div className="first_top_layer">
                        <div className="back_layer">
                            <div onClick={() => setCollapsible(5)} className="back_icon">
                                <img style={{width:'13px', height:'17px'}} src={cal} alt="icon" />
                            </div>
                        </div>
                        <div className="topic_name">Payments & Net to bank</div>
                    </div>

                    <div className="first_mid_layer">
                        {collapsible === 5 && <PaymentDetails />}
                    </div>
                </div>

                <div className="first_layer">
                    <div className="first_top_layer">
                        <div className="back_layer">
                            <div onClick={() => setCollapsible(6)} className="back_icon">
                                <img style={{width:'16px', height:'16px'}} src={pump} alt="icon" />
                            </div>
                        </div>
                        <div className="topic_name">Product Balance Carried Forward</div>
                    </div>

                    <div className="first_mid_layer">
                        {collapsible === 6 && <BalanceCF />}
                    </div>
                </div>

                <div className="first_layer">
                    <div className="first_top_layer">
                        <div className="back_layer">
                            <div onClick={() => setCollapsible(7)} className="back_icon">
                                <img style={{width:'20px', height:'16px'}} src={tank} alt="icon" />
                            </div>
                        </div>
                        <div className="topic_name">Dipping</div>
                    </div>

                    <div className="first_mid_layer">
                        {collapsible === 7 && <Dipping />}
                    </div>
                </div>

                <div className="first_layer">
                    <div className="first_top_layer">
                        <div className="back_layer">
                            <div onClick={() => setCollapsible(8)} className="back_icon">
                                <img style={{width:'20px', height:'16px'}} src={tank} alt="icon" />
                            </div>
                        </div>
                        <div className="topic_name">Daily report confirmation</div>
                    </div>

                    <div style={{borderLeft:'none'}} className="first_mid_layer">
                        {collapsible === 8 && <ReportConfirmation />}
                    </div>
                </div>
            </div>
        </div>
    )
}

const sales = {
    width:'100%', 
    display:'flex', 
    flexDirection:'row', 
    justifyContent:'flex-end',
    position: 'relative',
    alignItems:'flex-start',
}

const cover = {
    position: 'absolute',
    width:'100px',
    height: '20px',
    background:'#054834',
    fontSize:'12px',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    marginTop:'5px',
    left: '0px',
    color:'#fff'
}

export default ComprehensiveReport;