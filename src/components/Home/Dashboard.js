import React from 'react';
import '../../styles/dashboard.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import me1 from '../../assets/me1.png';
import me2 from '../../assets/me2.png';
import me4 from '../../assets/me4.png';
import me5 from '../../assets/me5.png';
import me6 from '../../assets/me6.png';
import Button from '@mui/material/Button';
import slideMenu from '../../assets/slideMenu.png';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import OutletService from '../../services/outletService';
import { adminOutlet, getAllStations } from '../../store/actions/outlet';
import { useState } from 'react';
import {useHistory} from 'react-router-dom';
import expense from '../../assets/expense.png';
import DashboardService from '../../services/dashboard';
import { addDashboard, dashboardRecordMore, dashEmployees, utils } from '../../store/actions/dashboard';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import DashboardGraph from '../common/DashboardGraph';
import Skeleton from '@mui/material/Skeleton';

const mobile = window.matchMedia('(max-width: 600px)');

const DashboardImage = (props) => {

    const history = useHistory();
    const dispatch = useDispatch();

    const goToNextScreen = () => {
        switch(props.screen){
            case "employee":{
                history.push("/home/dashEmp");
                break;
            }

            case "activeTank":{
                dispatch(utils({state: "activeTank", station: props?.station}));
                history.push("/home/tank-list");
                break;
            }

            case "inactiveTank":{
                dispatch(utils({state: "inActiveTank", station: props?.station}));
                history.push("/home/tank-list");
                break;
            }
            case "activePump":{
                dispatch(utils({state: "activePump", station: props?.station}));
                history.push("/home/pump-list");
                break;
            }

            case "inactivePump":{
                dispatch(utils({state: "inActivePump", station: props?.station}));
                history.push("/home/pump-list");
                break;
            }

            default:{}
        }
    }

    return(
        <div className='first-image'>
            {props.load?
                <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={110} />:
                <div onClick={goToNextScreen} className='inner-first-image'>
                    <div className='top-first-image'>
                        <div className='top-icon'>
                            <img className="img" src={props.image} alt="icon" />
                        </div>
                        <div className='top-text'>
                            <div className='name'>{props.name}</div>
                            <div className='value'>{props.value}</div>
                        </div>
                    </div>
                    <div className='bottom-first-image'>
                        <img style={{width:'30px', height:'10px'}} src={me6} alt="icon" />
                    </div>
                </div>
            }
        </div>
    )
}

const Dashboard = (props) => {

    const dispatch = useDispatch();
    const history  = useHistory();
    const approx = require('approximate-number');
    const user = useSelector(state => state.authReducer.user);
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const dashboardData = useSelector(state => state.dashboardReducer.dashboardData);
    const dashboardRecords = useSelector(state => state.dashboardReducer.dashboardRecords);
    const [defaultState, setDefault] = useState(0);
    const [value, setValue] = useState([new Date(), new Date()]);
    const [load, setLoad] = useState(false);

    const resolveUserID = () => {
        if(user.userType === "superAdmin" || user.userType === "admin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
        }
    }

    const collectAndAnalyseData = (data) => {
        let activeTank = data.station.tanks.filter(data => data.activeState === "1");
        let inActiveTank = data.station.tanks.filter(data => data.activeState === "0");
        let activePump = data.station.pumps.filter(data => data.activeState === "1");
        let inActivePump = data.station.pumps.filter(data => data.activeState === "0");

        const payload = {
            count: data.count,
            tanks: {
                activeTank: {count: activeTank.length, list: activeTank},
                inActiveTank: {count: inActiveTank.length, list: inActiveTank}
            },
            pumps: {
                activePumps: {count: activePump.length, list: activePump},
                inActivePumps: {count: inActivePump.length, list: inActivePump}
            },

        }
        dispatch(addDashboard(payload));
    }

    const getAllStationData = useCallback(() => {
        const payload = {
            organisation: resolveUserID().id
        }

        if(user.userType === "superAdmin" || user.userType === "admin"){
            setLoad(true);
            OutletService.getAllOutletStations(payload).then(data => {
                dispatch(getAllStations(data.station));
                dispatch(adminOutlet(null));
                return data.station[0];
            }).then(data => {
                DashboardService.allAttendanceRecords({id: resolveUserID().id, outletID: "None"}).then(data => {
                    dispatch(dashEmployees(data.employees));
                    collectAndAnalyseData(data);
                });

                let rangeOne = new Date(value[0]).toLocaleDateString().split("/");
                rangeOne = rangeOne.map(data => {
                    let res = "0";
                    if(data.length === 1){
                        res = res.concat(data);
                    }else{
                        res = data;
                    }
                    return res;
                });
                const formatOne = rangeOne[2]+"-"+rangeOne[0]+"-"+rangeOne[1];

                let rangeTwo = new Date(value[1]).toLocaleDateString().split("/");
                rangeTwo = rangeTwo.map(data => {
                    let res = "0";
                    if(data.length === 1){
                        res = res.concat(data);
                    }else{
                        res = data;
                    }
                    return res;
                });
                const formatTwo = rangeTwo[2]+"-"+rangeTwo[0]+"-"+rangeTwo[1];

                const payload = {
                    organisation: resolveUserID().id,
                    outletID: "None",
                    startDate: formatOne,
                    endDate: formatTwo
                }

                DashboardService.allSalesRecords(payload).then(data => {
                    const evaluatedDashboard = collectAndEvaluateDashboard(data);
                    dispatch(dashboardRecordMore(evaluatedDashboard));
                }).then(()=>{
                    setLoad(false);
                })
            });
        }else{
            setLoad(true);
            OutletService.getOneOutletStation({outletID: user.outletID}).then(data => {
                dispatch(adminOutlet(data.station));
                return data.station;
            }).then(data => {
                DashboardService.allAttendanceRecords({id: data.organisation, outletID: data._id}).then(data => {
                    dispatch(dashEmployees(data.employees));
                    collectAndAnalyseData(data);
                });

                let rangeOne = new Date(value[0]).toLocaleDateString().split("/");
                rangeOne = rangeOne.map(data => {
                    let res = "0";
                    if(data.length === 1){
                        res = res.concat(data);
                    }else{
                        res = data;
                    }
                    return res;
                });
                const formatOne = rangeOne[2]+"-"+rangeOne[0]+"-"+rangeOne[1];

                let rangeTwo = new Date(value[1]).toLocaleDateString().split("/");
                rangeTwo = rangeTwo.map(data => {
                    let res = "0";
                    if(data.length === 1){
                        res = res.concat(data);
                    }else{
                        res = data;
                    }
                    return res;
                });
                const formatTwo = rangeTwo[2]+"-"+rangeTwo[0]+"-"+rangeTwo[1];

                const payload = {
                    organisation: data?.organisation,
                    outletID: data?._id,
                    startDate: formatOne,
                    endDate: formatTwo
                }

                DashboardService.allSalesRecords(payload).then(data => { 
                    const evaluatedDashboard = collectAndEvaluateDashboard(data);
                    dispatch(dashboardRecordMore(evaluatedDashboard));
                }).then(()=>{
                    setLoad(false);
                })
            });
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user._id, user.userType, user.outletID, dispatch]);

    useEffect(()=>{
        getAllStationData();
    },[getAllStationData]);

    const changeMenu = (index, item ) => {
        setDefault(index);
        dispatch(adminOutlet(item));

        setLoad(true);
        
        let rangeOne = new Date(value[0]).toLocaleDateString().split("/");
        rangeOne = rangeOne.map(data => {
            let res = "0";
            if(data.length === 1){
                res = res.concat(data);
            }else{
                res = data;
            }
            return res;
        });
        const formatOne = rangeOne[2]+"-"+rangeOne[0]+"-"+rangeOne[1];

        let rangeTwo = new Date(value[1]).toLocaleDateString().split("/");
        rangeTwo = rangeTwo.map(data => {
            let res = "0";
            if(data.length === 1){
                res = res.concat(data);
            }else{
                res = data;
            }
            return res;
        });
        const formatTwo = rangeTwo[2]+"-"+rangeTwo[0]+"-"+rangeTwo[1];

        DashboardService.allAttendanceRecords({id: resolveUserID().id, outletID: item === null? "None": item?._id}).then(data => {
            dispatch(dashEmployees(data.employees));
            collectAndAnalyseData(data);
        });

        const payload = {
            organisation: resolveUserID().id,
            outletID: item === null? "None": item?._id,
            startDate: formatOne,
            endDate: formatTwo
        }

        DashboardService.allSalesRecords(payload).then(data => { 
            const evaluatedDashboard = collectAndEvaluateDashboard(data);
            dispatch(dashboardRecordMore(evaluatedDashboard));
        }).then(()=>{
            setLoad(false);
        });
    }

    const goToPayments = () => {
        history.push("/home/analysis/payments");
    }

    const goToExpenses = () => {
        history.push("/home/analysis/expenses");
    }

    const collectAndEvaluateDashboard = (data) => { 
        /* ############################################################
            Analyze total sales
        ##############################################################*/
        let PMS = data.sales.filter(data => data.productType === "PMS");
        let AGO = data.sales.filter(data => data.productType === "AGO");
        let DPK = data.sales.filter(data => data.productType === "DPK");

        let pmsTotalSales = 0;
        let agoTotalSales = 0;
        let dpkTotalSales = 0;

        let pmsTotalLitre = 0;
        let agoTotalLitre = 0;
        let dpkTotalLitre = 0;

        for(let pms of PMS){
            pmsTotalSales = pmsTotalSales + Number(pms.sales)*Number(pms.PMSSellingPrice);
            pmsTotalLitre = pmsTotalLitre + Number(pms.sales);
        }

        for(let ago of AGO){
            agoTotalSales = agoTotalSales + Number(ago.sales)*Number(ago.AGOSellingPrice);
            agoTotalLitre = agoTotalLitre + Number(ago.sales);
        }

        for(let dpk of DPK){
            dpkTotalSales = dpkTotalSales + Number(dpk.sales)*Number(dpk.DPKSellingPrice);
            dpkTotalLitre = dpkTotalLitre + Number(dpk.sales);
        }

        /* ############################################################
            Analyze total supply
        ##############################################################*/

        let PMSSupply = data.supply.filter(data => data.productType === "PMS");
        let AGOSupply  = data.supply.filter(data => data.productType === "AGO");
        let DPKSupply  = data.supply.filter(data => data.productType === "DPK");

        let pmsSupply = 0;
        let agoSupply = 0;
        let dpkSupply = 0;

        for(let sup of PMSSupply){
            pmsSupply = pmsSupply + Number(sup.quantity);
        }

        for(let sup of AGOSupply){
            agoSupply = agoSupply + Number(sup.quantity);
        }

        for(let sup of DPKSupply){
            dpkSupply = dpkSupply + Number(sup.quantity);
        }

        /* ############################################################
            Analyze total expenses
        ##############################################################*/

        let totalExpenses = 0;

        for(let exp of data.expense){
            totalExpenses = totalExpenses + Number(exp.expenseAmount);
        }

        /* ############################################################
            Analyze total payments
        ##############################################################*/

        let totalPayments = 0;
        let totalPosPayments = 0;

        for(let pay of data.payment){
            totalPayments = totalPayments + Number(pay.amountPaid);
        }

        for(let pay of data.posPayment){
            totalPosPayments = totalPosPayments + Number(pay.amountPaid);
        }

        const details = {
            sales:{
                totalAmount: pmsTotalSales + agoTotalSales + dpkTotalSales,
                totalVolume: pmsTotalLitre + agoTotalLitre + dpkTotalLitre
            },

            supply:{
                pmsSupply: pmsSupply,
                agoSupply: agoSupply,
                dpkSupply: dpkSupply
            },
            totalExpenses: totalExpenses,
            incoming: data.incoming,
            payments: {
                totalPayments: totalPayments,
                totalPosPayments: totalPosPayments,
                netToBank: (pmsTotalSales + agoTotalSales + dpkTotalSales) - totalExpenses,
                outstanding: ((pmsTotalSales + agoTotalSales + dpkTotalSales) - totalExpenses) - totalPayments - totalPosPayments
            }
        }

        return details;
    }

    const onChange = (data) => {
        setLoad(true);
        
        let rangeOne = new Date(data[0]).toLocaleDateString().split("/");
        rangeOne = rangeOne.map(data => {
            let res = "0";
            if(data.length === 1){
                res = res.concat(data);
            }else{
                res = data;
            }
            return res;
        });
        const formatOne = rangeOne[2]+"-"+rangeOne[0]+"-"+rangeOne[1];

        let rangeTwo = new Date(data[1]).toLocaleDateString().split("/");
        rangeTwo = rangeTwo.map(data => {
            let res = "0";
            if(data.length === 1){
                res = res.concat(data);
            }else{
                res = data;
            }
            return res;
        });
        const formatTwo = rangeTwo[2]+"-"+rangeTwo[0]+"-"+rangeTwo[1];

        DashboardService.allAttendanceRecords({id: resolveUserID().id, outletID: oneStationData === null? "None": oneStationData?._id}).then(data => {
            dispatch(dashEmployees(data.employees));
            collectAndAnalyseData(data);
        });

        const payload = {
            organisation: resolveUserID().id,
            outletID: oneStationData === null? "None": oneStationData?._id,
            startDate: formatOne,
            endDate: formatTwo
        }

        DashboardService.allSalesRecords(payload).then(data => { 
            const evaluatedDashboard = collectAndEvaluateDashboard(data);
            dispatch(dashboardRecordMore(evaluatedDashboard));
        }).then(()=>{
            setLoad(false);
        })
        setValue(data);
    }

    return(
        <>
            { props.activeRoute.split('/').length === 2 &&
                <div className='dashboardContainer'>
                    <div className='left-dash'>
                        <div style={{width:'auto'}} className='selectItem'>
                            <div style={{marginRight:'10px'}} className='first-select'>
                                <DateRangePicker onChange={onChange} value={value} />
                            </div>
                            <div style={{width: mobile.matches? '230px': "150px"}} className='second-select'>
                                {(user.userType === "superAdmin" || user.userType === "admin") &&
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={defaultState}
                                        sx={selectStyle2}
                                    >
                                        <MenuItem onClick={()=>{changeMenu(0, null)}} style={menu} value={0}>All Stations</MenuItem>
                                        {
                                            allOutlets.map((item, index) => {
                                                return(
                                                    <MenuItem key={index} style={menu} onClick={()=>{changeMenu(index + 1, item)}} value={index + 1}>{item.outletName+ ', ' +item.alias}</MenuItem>
                                                )
                                            })  
                                        }
                                    </Select>
                                }
                                {user.userType === "staff" &&
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={0}
                                        sx={selectStyle2}
                                        disabled
                                    >
                                        <MenuItem style={menu} value={0}>{user.userType === "staff"? oneStationData?.outletName+", "+oneStationData?.alias: "No station created"}</MenuItem>
                                    </Select>
                                }
                            </div>
                        </div>
                        <div className='dashImages'>
                            <DashboardImage load={load} screen={"employee"} image={me1} name={'Current staff'} value={dashboardData?.count}/>
                            <div data-aos="flip-left" className='first-image'>
                                {load?
                                    <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={110} />:
                                    <div className='inner-first-image'>
                                        <div className='top-first-image'>
                                            <div className='top-icon'>
                                                <img className='img' src={me2} alt="icon" />
                                            </div>
                                            <div className='top-text'>
                                                <div style={{ width:'100%', fontSize:'12px', textAlign:'right'}}>
                                                    <div style={{marginTop:'5px', fontWeight:'bold', fontSize:'12px'}}>Liter: <span style={{fontWeight:'bold', fontSize:'12px'}}>{approx(dashboardRecords.sales.totalVolume)}</span> LTR</div>
                                                    <div style={{marginTop:'10px', fontWeight:'bold', fontSize:'12px'}}>
                                                        Total Sales: <span style={{fontWeight:'bold'}}>NGN {approx(dashboardRecords.sales.totalAmount)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='bottom-first-image'>
                                            <img style={{width:'30px', height:'10px'}} src={me6} alt="icon" />
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div style={{marginTop:'40px', fontWeight:'bold', fontSize:'15px', color: user.isDark === '0'? '#000': '#fff'}}>Total Sales</div>
                        <DashboardGraph load={load} station={oneStationData} />
                    </div>
                    <div className='right-dash'>
                        <div className='asset'>
                            <div style={{color: user.isDark === '0'? '#000': '#fff', fontSize:'16px'}} >Asset</div>
                            {load?
                                <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={130} height={35} />:
                                <Button 
                                    variant="contained" 
                                    startIcon={<img style={{width:'15px', height:'10px', marginRight:'15px'}} src={slideMenu} alt="icon" />}
                                    sx={{
                                        width:'150px',
                                        height:'30px',
                                        background:'#06805B',
                                        fontSize:'11px',
                                        borderRadius:'0px',
                                        fontFamily:'Poppins',
                                        textTransform:'capitalize',
                                        '&:hover': {
                                            backgroundColor: '#06805B'
                                        }
                                    }}
                                >
                                    View in details
                                </Button>
                            }
                        </div>
                        <div className='dashImages'>
                            <DashboardImage load={load} station={oneStationData} screen={"activeTank"} image={me4} name={'Active Tank'} value={dashboardData.tanks.activeTank.count} />
                            <DashboardImage load={load} station={oneStationData} screen={"inactiveTank"} image={me4} name={'Inactive Tank'} value={dashboardData.tanks.inActiveTank.count}/>
                        </div>
                        <div style={{marginTop:'15px'}} className='dashImages'>
                            <DashboardImage load={load} station={oneStationData} screen={"activePump"} image={me5} name={'Active Pump'} value={dashboardData.pumps.activePumps.count}/>
                            <DashboardImage load={load} station={oneStationData} screen={"inactivePump"} image={me5} name={'Inactive Pump'} value={dashboardData.pumps.inActivePumps.count}/>
                        </div>

                        <div className='section'>
                            <div className='asset'>
                            <div style={{color: user.isDark === '0'? '#000': '#fff', fontSize:'15px'}} >Supply</div>
                                {load?
                                    <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={130} height={35} />:
                                    <Button 
                                        variant="contained" 
                                        startIcon={<img style={{width:'15px', height:'10px', marginRight:'15px'}} src={slideMenu} alt="icon" />}
                                        sx={{
                                            width:'150px',
                                            height:'30px',
                                            background:'#06805B',
                                            fontSize:'11px',
                                            borderRadius:'0px',
                                            fontFamily:'Poppins',
                                            textTransform:'capitalize',
                                            '&:hover': {
                                                backgroundColor: '#06805B'
                                            }
                                        }}
                                    >
                                        View in details
                                    </Button>
                                }
                            </div>
                            <div className='inner-section'>
                                <div className="cardss">
                                    {load?
                                        <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={90} />:
                                        <>
                                            <div className='left'>
                                                PMS
                                            </div>
                                            <div className='right'>
                                                <div>Litre Qty</div>
                                                <div>{approx(dashboardRecords.supply.pmsSupply)} Litres</div>
                                            </div>
                                        </>
                                    }
                                </div>
                                <div className="cardss">
                                    {load?
                                        <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={90} />:
                                        <>
                                            <div className='left'>
                                                AGO
                                            </div>
                                            <div className='right'>
                                                <div>Litre Qty</div>
                                                <div>{approx(dashboardRecords.supply.agoSupply)} Litres</div>
                                            </div>
                                        </>
                                    }
                                </div>
                                <div style={{marginRight:'0px'}} className="cardss">
                                    {load?
                                        <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={90} />:
                                        <>
                                            <div className='left'>
                                                DPK
                                            </div>
                                            <div className='right'>
                                                <div>Litre Qty</div>
                                                <div>{approx(dashboardRecords.supply.dpkSupply)} Litres</div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>

                            <div style={{marginTop:'40px', width:'100%', display:'flex', flexDirection:'row', justifyContent:'space-between', color: user.isDark === '0'? '#000': '#fff', fontSize:'15px'}} className='bank'>
                                <span>Net to Bank</span><span>Payments</span><span>Outstanding</span>
                            </div>
                            <div onClick={goToPayments} style={{height:'110px', marginTop:'0px'}} className='inner-section'>
                                {load?
                                    <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={90} />:
                                    <div className='inner-content'>
                                        <div className='conts'>
                                            <div className='row-count'>
                                                <div style={{color:'green', fontSize:'12px', fontWeight:'600'}} className='item-count'>NGN {approx(dashboardRecords.payments.netToBank)}</div>
                                                <div style={{color:'#0872D4', fontSize:'12px', fontWeight:'600'}} className='item-count'>Teller</div>
                                                <div style={{color:'#0872D4', fontSize:'12px', fontWeight:'600'}} className='item-count'>NGN {approx(dashboardRecords.payments.totalPayments)}</div>
                                                <div style={{color:'red', fontSize:'12px', fontWeight:'600'}} className='item-count'>NGN {approx(dashboardRecords.payments.totalPosPayments)}</div>
                                            </div>
                                            <div className='row-count'>
                                                <div style={{color:'green', fontSize:'12px', fontWeight:'600'}} className='item-count'></div>
                                                <div style={{color:'#000', fontSize:'12px', fontWeight:'600'}} className='item-count'>POS</div>
                                                <div style={{color:'#000', fontSize:'12px', fontWeight:'600'}} className='item-count'>NGN {approx(dashboardRecords.payments.outstanding)}</div>
                                                <div style={{color:'red', fontSize:'12px', fontWeight:'600'}} className='item-count'></div>
                                            </div>
                                            <div style={{marginTop:'10px'}} className="arrows">
                                                <div className="image">
                                                    <img style={{width:'20px', height:'8px', marginRight:'30px'}} src={me6} alt="icon" />
                                                </div>
                                                <div className="image">
                                                    <img style={{width:'20px', height:'8px', marginRight:'30px'}} src={me6} alt="icon" />
                                                </div>
                                                <div className="image">
                                                    <img style={{width:'20px', height:'8px', marginRight:'30px'}} src={me6} alt="icon" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>

                            <div style={{marginTop:'30px', color: user.isDark === '0'? '#000': '#fff'}} className='bank'>Expenses</div>
                            <div onClick={goToExpenses} style={{height:'110px'}} className='inner-section'>
                                {load?
                                    <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={90} />:
                                    <div style={{
                                        backgroundImage:`url(${expense})`, 
                                        backgroundSize:'contain',
                                        backgroundRepeat:'no-repeat',
                                        display:'flex',
                                        flexDirection:'row',
                                        justifyContent:'flex-end',
                                        alignItems:'center',
                                        }} className='inner-content'>
                                        <span style={{marginRight:'30px', fontSize:'12px', fontWeight:'900'}}>NGN {approx(dashboardRecords.totalExpenses)}</span>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className='station'>
                            <div style={{ color: user.isDark === '0'? '#000': '#fff', fontSize:'15px'}} className='bank'>Station</div>
                            <div className='station-container'>
                                {load?
                                    <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={300} />:
                                    <>
                                        <div className='station-content'>
                                        <div className='inner-stat'>
                                            <div className='inner-header'>Ammasco Oil, Albasu, Kano</div>
                                            <div className='station-slider'>
                                                <div className='slideName'>
                                                    <div className='pms'>PMS</div>
                                                    <progress className='prog' value="70" max="100"> 70% </progress>
                                                </div>
                                                <div className='slideQty'>2500 Ltr</div>
                                            </div>
                                            <div className='station-slider'>
                                                <div className='slideName'>
                                                    <div className='pms'>AGO</div>
                                                    <progress className='prog' value="50" max="100"> 50% </progress>
                                                </div>
                                                <div className='slideQty'>2500 Ltr</div>
                                            </div>
                                            <div className='station-slider'>
                                                <div className='slideName'>
                                                    <div className='pms'>DPK</div>
                                                    <progress className='prog' value="32" max="100"> 32% </progress>
                                                </div>
                                                <div className='slideQty'>2500 Ltr</div>
                                            </div>
                                            <div className='butom'>
                                                <div className='pump-cont'>
                                                    <div>No of Pump</div>
                                                    <div className='amount'>2</div>
                                                </div>
                                                <div style={{marginLeft:'20px'}} className='pump-cont'>
                                                    <div>No of Pump</div>
                                                    <div className='amount'>2</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{marginTop:'0px'}} className='station-content'>
                                        <div className='inner-stat'>
                                            <div className='inner-header'>Ammasco Oil, Albasu, Kano</div>
                                            <div className='station-slider'>
                                                <div className='slideName'>
                                                    <div className='pms'>PMS</div>
                                                    <progress className='prog' value="70" max="100"> 70% </progress>
                                                </div>
                                                <div className='slideQty'>2500 Ltr</div>
                                            </div>
                                            <div className='station-slider'>
                                                <div className='slideName'>
                                                    <div className='pms'>AGO</div>
                                                    <progress className='prog' value="50" max="100"> 50% </progress>
                                                </div>
                                                <div className='slideQty'>2500 Ltr</div>
                                            </div>
                                            <div className='station-slider'>
                                                <div className='slideName'>
                                                    <div className='pms'>DPK</div>
                                                    <progress className='prog' value="32" max="100"> 32% </progress>
                                                </div>
                                                <div className='slideQty'>2500 Ltr</div>
                                            </div>
                                            <div className='butom'>
                                                <div className='pump-cont'>
                                                    <div>No of Pump</div>
                                                    <div className='amount'>2</div>
                                                </div>
                                                <div style={{marginLeft:'20px'}} className='pump-cont'>
                                                    <div>No of Pump</div>
                                                    <div className='amount'>2</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </>
                                }
                            </div>
                        </div>

                        <div style={{display:'flex', flexDirection:'row', width:'100%', marginTop:'30px', justifyContent:'space-between'}} className="tank-text">
                            <div style={{ color: user.isDark === '0'? '#000': '#fff', fontSize:'15px', fontWeight:'bold'}}>Incoming Order</div>
                                <Button 
                                    variant="contained" 
                                    startIcon={<img style={{width:'15px', height:'10px', marginRight:'15px'}} src={slideMenu} alt="icon" />}
                                    sx={{
                                        width:'150px',
                                        height:'30px',
                                        background:'#06805B',
                                        fontSize:'11px',
                                        borderRadius:'0px',
                                        fontFamily:'Poppins',
                                        textTransform:'capitalize',
                                        '&:hover': {
                                            backgroundColor: '#06805B'
                                        }
                                    }}
                                >
                                    View in details
                                </Button>
                        </div>

                        <div style={{width:'100%', marginBottom:'40px'}}>
                            <div className='table-view'>
                                <div className='table-text'>Outlets</div>
                                <div className='table-text'>Date approved</div>
                                <div className='table-text'>Depot</div>
                                <div className='table-text'>Products</div>
                                <div className='table-text'>Quantity</div>
                            </div>
                            
                            {
                                dashboardRecords.incoming.length === 0?
                                <div style={place}>No incoming data</div>:
                                dashboardRecords.incoming.map((data, index) => {
                                    return(
                                        <div key={index} className='table-view2'>
                                            <div className='table-text'>{data.outletName}</div>
                                            <div className='table-text'>{data.createdAt}</div>
                                            <div className='table-text'>{data.depotStation}</div>
                                            <div className='table-text'>{data.product}</div>
                                            <div className='table-text'>{data.quantity}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>     
            }
        </>
    )
}

const place = {
    fontSize:'12px',
    fontWeight:'bold',
    marginTop:'10px',
    color:'green'
}

const selectStyle2 = {
    width:'100%', 
    height:'30px', 
    borderRadius:'0px',
    background: '#F2F1F1B2',
    color:'#000',
    fontSize:'12px',
    outline:'none',
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border:'1px solid #777777',
    },
}

const menu = {
    fontSize:'12px',
}

export default Dashboard;