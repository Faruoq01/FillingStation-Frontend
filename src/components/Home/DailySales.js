import React, {useCallback, useEffect, useState} from 'react';
import '../../styles/dailySales.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import me5 from '../../assets/me5.png';
import slideMenu from '../../assets/slideMenu.png';
import Button from '@mui/material/Button';
import PMSTank from '../Outlet/PMSTank';
import AGOTank from '../Outlet/AGOTank';
import DPKTank from '../Outlet/DPKTank';
import { useDispatch, useSelector } from 'react-redux';
import OutletService from '../../services/outletService';
import { adminOutlet, getAllOutletTanks, getAllStations, tankListType } from '../../store/actions/outlet';
import { Route, Switch, useHistory } from 'react-router-dom';
import PMSDailySales from '../DailySales/PMSDailySales';
import AGODailySales from '../DailySales/AGODailySales';
import DPKDailySales from '../DailySales/DPKDailySales';
import ComprehensiveReport from '../DailySales/ComprehensiveReport';
import ListAllTanks from '../Outlet/TankList';
import DailySalesService from '../../services/DailySales';
import { bulkReports, currentDateValue, dailySupplies, lpoRecords, overages, passAllDailySales, passCummulative, passExpensesAndPayments, passIncomingOrder, paymentRecords, storemonthlyBarData, supplies } from '../../store/actions/dailySales';
import BarChartGraph from '../common/BarChartGraph';
import { Skeleton, Stack } from '@mui/material';
import swal from 'sweetalert';
import ApproximateDecimal from '../common/approx';
import OveragesAndShortages from '../DailySales/OveragesAndShortages';
import { dateRange, setSales } from '../../store/actions/dashboard';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ButtonDatePicker from '../common/CustomDatePicker';

// const mediaMatch = window.matchMedia('(max-width: 450px)');

const DailySales = (props) => {
    const moment = require('moment-timezone');
    const date = new Date();
    const toString = date.toDateString();
    const [day, year, month] = toString.split(' ');
    const date2 = `${day} ${month} ${year}`;
    const [value, setValue] = React.useState(null);

    const user = useSelector(state => state.authReducer.user);
    const dipping = useSelector(state => state.dailySalesReducer.overages);
    const {balances} = useSelector(state => state.dailySalesReducer.bulkReports);
    const dispatch = useDispatch();
    const history = useHistory();
    const [load, setLoads] = useState(false);
    const tankList = useSelector(state => state.outletReducer.tankList);
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const [defaultState, setDefault] = useState(0);
    const dailySales = useSelector(state => state.dailySalesReducer.dailySales);
    const payments = useSelector(state => state.dailySalesReducer.payments);
    const dailyIncoming = useSelector(state => state.dailySalesReducer.dailyIncoming);
    const cummulativeTotals = useSelector(state => state.dailySalesReducer.cummulative);
    const dailySupplys = useSelector(state => state.dailySalesReducer.dailySupplies);
    const currentDate2 = useSelector(state => state.dailySalesReducer.currentDate);
    
    const resolveUserID = () => {
        if(user.userType === "superAdmin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
        }
    }

    const getPerm = (e) => {
        if(user.userType === "superAdmin"){
            return true;
        }
        return user.permission?.dailySales[e];
    }


    const getMasterRows = ({sales, lpo, rtVolumes}) => {

        // filter all records by product Type
        const salesPMSData = sales.filter(data => data.productType === "PMS");
        const salesAGOData = sales.filter(data => data.productType === "AGO");
        const salesDPKData = sales.filter(data => data.productType === "DPK");

        const lpoPMSData = lpo.filter(data => data.productType === "PMS");
        const lpoAGOData = lpo.filter(data => data.productType === "AGO");
        const lpoDPKData = lpo.filter(data => data.productType === "DPK");

        const rtPMSData = rtVolumes.filter(data => data.productType === "PMS");
        const rtAGOData = rtVolumes.filter(data => data.productType === "AGO");
        const rtDPKData = rtVolumes.filter(data => data.productType === "DPK");


        const pmsTotals = () => {

            /*#####################
                PMS sales in litres
            ######################*/
            const pmsSales = salesPMSData.reduce((accum, current) => {
                return Number(accum) + Number(current.sales);
            }, 0);

            const pmsLpoSales = lpoPMSData.reduce((accum, current) => {
                return Number(accum) + Number(current.lpoLitre);
            }, 0);

            const pmsRTSales = rtPMSData.reduce((accum, current) => {
                return Number(accum) + Number(current.rtLitre);
            }, 0);


            /*#########################
                PMS sales in cash price
            ##########################*/
            const pmsPrice = salesPMSData.reduce((accum, current) => {
                return Number(accum) + Number(current.sales)*Number(current.PMSSellingPrice);
            }, 0);

            const pmsLPOPrice = lpoPMSData.reduce((accum, current) => {
                return Number(accum) + Number(current.lpoLitre)*Number(current.PMSRate);
            }, 0);

            const pmsRTPrice = rtPMSData.reduce((accum, current) => {
                return Number(accum) + Number(current.rtLitre)*Number(current.PMSPrice);
            }, 0);

            const pmsTotalDetails = {
                totalDifference: pmsSales - pmsLpoSales + pmsRTSales,
                totalLpo: pmsLpoSales,
                totalrt: pmsRTSales,
                amount: pmsPrice - pmsLPOPrice + pmsRTPrice,
                lpoAmount: pmsLPOPrice,
                noLpoAmount: pmsPrice - pmsLPOPrice - pmsRTPrice,
            }

            return pmsTotalDetails;
        }


        const agoTotals = () => {

            /*#####################
                AGO sales in litres
            ######################*/
            const agoSales = salesAGOData.reduce((accum, current) => {
                return Number(accum) + Number(current.sales);
            }, 0);

            const agoLpoSales = lpoAGOData.reduce((accum, current) => {
                return Number(accum) + Number(current.lpoLitre);
            }, 0);

            const agoRTSales = rtAGOData.reduce((accum, current) => {
                return Number(accum) + Number(current.rtLitre);
            }, 0);

            /*#########################
                AGO sales in cash price
            ##########################*/
            const agoPrice = salesAGOData.reduce((accum, current) => {
                return Number(accum) + Number(current.sales)*Number(current.AGOSellingPrice);
            }, 0);

            const agoLPOPrice = lpoAGOData.reduce((accum, current) => {
                return Number(accum) + Number(current.lpoLitre)*Number(current.AGORate);
            }, 0);

            const agoRTPrice = rtAGOData.reduce((accum, current) => {
                return Number(accum) + Number(current.rtLitre)*Number(current.AGOPrice);
            }, 0);

            const agoTotalDetails = {
                totalDifference: agoSales - agoLpoSales + agoRTSales,
                totalLpo: agoLpoSales,
                totalrt: agoRTSales,
                amount: agoPrice - agoLPOPrice + agoRTPrice,
                lpoAmount: agoLPOPrice,
                noLpoAmount: agoPrice - agoLPOPrice - agoRTPrice,
            }

            return agoTotalDetails;
        }


        const dpkTotals = () => {

            /*#####################
                DPK sales in litres
            ######################*/
            const dpkSales = salesDPKData.reduce((accum, current) => {
                return Number(accum) + Number(current.sales);
            }, 0);

            const dpkLpoSales = lpoDPKData.reduce((accum, current) => {
                return Number(accum) + Number(current.lpoLitre);
            }, 0);

            const dpkRTSales = rtDPKData.reduce((accum, current) => {
                return Number(accum) + Number(current.rtLitre);
            }, 0);

            /*#########################
                DPK sales in cash price
            ##########################*/
            const dpkPrice = salesDPKData.reduce((accum, current) => {
                return Number(accum) + Number(current.sales)*Number(current.DPKSellingPrice);
            }, 0);

            const dpkLPOPrice = lpoDPKData.reduce((accum, current) => {
                return Number(accum) + Number(current.lpoLitre)*Number(current.DPKRate);
            }, 0);

            const dpkRTPrice = rtDPKData.reduce((accum, current) => {
                return Number(accum) + Number(current.rtLitre)*Number(current.DPKPrice);
            }, 0);

            const dpkTotalDetails = {
                totalDifference: dpkSales - dpkLpoSales + dpkRTSales,
                totalLpo: dpkLpoSales,
                totalrt: dpkRTSales,
                amount: dpkPrice - dpkLPOPrice + dpkRTPrice,
                lpoAmount: dpkLPOPrice,
                noLpoAmount: dpkPrice - dpkLPOPrice - dpkRTPrice
            }

            return dpkTotalDetails;
        }

        const masterDailySales = {
            PMS: {
                sales: salesPMSData,
                lpo: lpoPMSData,
                rt: rtPMSData,
                total: pmsTotals()
            },
            AGO: {
                sales: salesAGOData,
                lpo: lpoAGOData,
                rt: rtAGOData,
                total: agoTotals()
            },
            DPK: {
                sales: salesDPKData,
                lpo: lpoDPKData,
                rt: rtDPKData,
                total: dpkTotals()
            },
        }

        dispatch(passAllDailySales(masterDailySales));
    }

    const getAggregatePayment = ({expenses, bankPayment, posPayment}) => {
        let totalExpenses = 0;
        let totalPayment = 0;
        let oneBankPayment = 0;
        let onePosPayment = 0;

        for(let expense of expenses){
            totalExpenses = totalExpenses + Number(expense.expenseAmount);
        }

        for(let bankpay of bankPayment){
            totalPayment = totalPayment + Number(bankpay.amountPaid);
            oneBankPayment  = oneBankPayment + Number(bankpay.amountPaid);
        }

        for(let pospay of posPayment){
            totalPayment = totalPayment + Number(pospay.amountPaid);
            onePosPayment = onePosPayment + Number(pospay.amountPaid);
        }

        const total = {
            expenses: totalExpenses,
            payments: totalPayment,
            oneBankPayment: oneBankPayment,
            onePosPayment: onePosPayment,
        }

        dispatch(passExpensesAndPayments(total));
    }

    const SupplyDataSummary = (supplies) => {
        let totalPMS = 0;
        let totalAGO = 0;
        let totalDPK = 0;
        for(let supply of supplies){
            if(supply.productType === "PMS"){
                totalPMS = totalPMS + Number(supply.quantity);
            }else if(supply.productType === "AGO"){
                totalAGO = totalAGO + Number(supply.quantity);
            }else if(supply.productType === "DPK"){
                totalDPK = totalDPK + Number(supply.quantity);
            }
        }

        const totals = {
            PMS: totalPMS,
            AGO: totalAGO,
            DPK: totalDPK
        }

        return totals
    }

    const getAndAnalyzeDailySales = async(data, onLoad, selectedDate) => {
        const salesPayload = {
            organisationID: resolveUserID().id,
            outletID: data === null? "None": data?._id,
            onLoad: onLoad,
            selectedDate: selectedDate
        }

        DailySalesService.getDailySalesDataAndAnalyze(salesPayload).then(data => {

            const salesDataRecord = {
                sales: data.dailyRecords.sales,
                lpo: data.dailyRecords.lpo,
                rtVolumes: data.dailyRecords.rtVolumes,
            }

            const paymentsRecords = {
                expenses: data.dailyRecords.expenses,
                bankPayment: data.dailyRecords.payments,
                posPayment: data.dailyRecords.pospayment,
            }

            const supplyRecords = SupplyDataSummary(data.dailyRecords.supply);

            dispatch(paymentRecords(paymentsRecords));
            getAggregatePayment(paymentsRecords);
            dispatch(bulkReports(data.dailyRecords));
            dispatch(overages(data.dailyRecords.dipping));
            dispatch(setSales(data.dailyRecords.sales));
            dispatch(supplies(data.dailyRecords.supply));
            
            dispatch(lpoRecords(data.dailyRecords.lpo));
            getMasterRows(salesDataRecord);

            dispatch(getAllOutletTanks(data.dailyRecords.tanks));
            dispatch(dailySupplies(supplyRecords));
            dispatch(passIncomingOrder(data.dailyRecords.incoming));

        }).then(()=>{
            setLoads(false);
        });
    }

    const getAllProductData = useCallback(() => {

        if(oneStationData !== null){
            if((getPerm('0') || getPerm('1') || user.userType === "superAdmin")){
                const findID = allOutlets.findIndex(data => data._id === oneStationData._id);
                setDefault(findID + 1);
                
                let todayDate = moment().format('YYYY-MM-DD HH:mm:ss').split(' ')[0];
                if(currentDate2 === ""){
                    getAndAnalyzeDailySales(oneStationData, true, todayDate);
                    dispatch(dateRange([new Date(todayDate), new Date(todayDate)]));
                }else{
                    getAndAnalyzeDailySales(oneStationData, false, currentDate2);
                }

                const payload = {
                    organisationID: resolveUserID().id,
                    outletID: oneStationData._id,
                }

                DailySalesService.getAllMonthlyReports(payload).then(data => { 
                    const payments = data.expense.payment.concat(data.expense.posPayment);
                    const expense = data.expense.expense;
        
                    dispatch(storemonthlyBarData({expenses: expense, payments: payments}));
                });
                return
            }
        }

        setLoads(true);
        const payload = {
            organisation: resolveUserID().id
        }

        OutletService.getAllOutletStations(payload).then(data => {
            dispatch(getAllStations(data.station));
            if((getPerm('0') || user.userType === "superAdmin") && oneStationData === null){
                if(!getPerm('1')) setDefault(1);
                dispatch(adminOutlet(null));
                return "None";
            }else{

                OutletService.getOneOutletStation({outletID: user.outletID}).then(data => {
                    dispatch(adminOutlet(data.station));
                });

                return user.outletID;
            }
        }).then(async(data)=>{
            getAndAnalyzeDailySales(null, true, "");

            const payload = {
                organisationID: resolveUserID().id,
                outletID: data,
            }

            DailySalesService.getAllMonthlyReports(payload).then(data => { 
                const payments = data.expense.payment.concat(data.expense.posPayment);
                const expense = data.expense.expense;
    
                dispatch(storemonthlyBarData({expenses: expense, payments: payments}));
            });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        getAllProductData();
    },[getAllProductData]);

    const getCummulativeVolumePerProduct = (pms, ago, dpk) => {
        let totalPMS = 0;
        let PMSTankCapacity = 0;
        let totalAGO = 0;
        let AGOTankCapacity = 0;
        let totalDPK = 0;
        let DPKTankCapacity = 0;
        
        const today = moment().format('YYYY-MM-DD HH:mm:ss').split(' ')[0];
        const getDate = currentDate2 === ""? today: currentDate2.format('YYYY-MM-DD');
        
        if(today === getDate){

            totalPMS = pms.reduce((accum, current) => {
                return Number(accum) + Number(current.currentLevel)
            }, 0);

            PMSTankCapacity = pms.reduce((accum, current) => {
                return Number(accum) + Number(current.tankCapacity)
            }, 0);

            totalAGO = ago.reduce((accum, current) => {
                return Number(accum) + Number(current.currentLevel)
            }, 0);

            AGOTankCapacity = ago.reduce((accum, current) => {
                return Number(accum) + Number(current.tankCapacity)
            }, 0);

            totalDPK = dpk.reduce((accum, current) => {
                return Number(accum) + Number(current.currentLevel)
            }, 0);

            DPKTankCapacity = dpk.reduce((accum, current) => {
                return Number(accum) + Number(current.tankCapacity)
            }, 0);

        }else{

            const pmsTanks = dipping.filter(data => data.productType === "PMS");
            const agoTanks = dipping.filter(data => data.productType === "AGO");
            const dpkTanks = dipping.filter(data => data.productType === "DPK");

            totalPMS = pmsTanks.reduce((accum, current) => {
                return Number(accum) + Number(current.afterSales)
            }, 0);

            PMSTankCapacity = pmsTanks.reduce((accum, current) => {
                return Number(accum) + Number(current.tankCapacity)
            }, 0);

            totalAGO = agoTanks.reduce((accum, current) => {
                return Number(accum) + Number(current.afterSales)
            }, 0);

            AGOTankCapacity = agoTanks.reduce((accum, current) => {
                return Number(accum) + Number(current.tankCapacity)
            }, 0);

            totalDPK = dpkTanks.reduce((accum, current) => {
                return Number(accum) + Number(current.afterSales)
            }, 0);

            DPKTankCapacity = dpkTanks.reduce((accum, current) => {
                return Number(accum) + Number(current.tankCapacity)
            }, 0);
        }

        let PMSDeadStock = 0;
        let AGODeadStock = 0;
        let DPKDeadStock = 0;

        const payload = {
            totalPMS: totalPMS,
            PMSTankCapacity: PMSTankCapacity === 0? 33000: PMSTankCapacity,
            PMSDeadStock: PMSDeadStock,
            totalAGO: totalAGO,
            AGOTankCapacity: AGOTankCapacity === 0? 33000: AGOTankCapacity,
            AGODeadStock: AGODeadStock,
            totalDPK: totalDPK,
            DPKTankCapacity: DPKTankCapacity === 0? 33000: DPKTankCapacity,
            DPKDeadStock: DPKDeadStock,
        }

        return payload;
    }

    const getProductTanks = useCallback(() => {
        const PMSList = tankList.filter(tank => tank.productType === "PMS");
        const AGOList = tankList.filter(tank => tank.productType === "AGO");
        const DPKList = tankList.filter(tank => tank.productType === "DPK");

        const cummulative = getCummulativeVolumePerProduct(PMSList, AGOList, DPKList);
        dispatch(passCummulative(cummulative));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tankList, dispatch]);

    useEffect(()=>{
        setValue(currentDate2);
        getProductTanks();
    }, [currentDate2, getProductTanks]);

    const changeMenu = (index, item ) => {
        if(!getPerm('1') && item === null) return swal("Warning!", "Permission denied", "info");
        setDefault(index);
        dispatch(adminOutlet(item));
        setLoads(true);

        let todayDate = moment().format('YYYY-MM-DD HH:mm:ss').split(' ')[0];
        
        if(currentDate2 === ""){
            getAndAnalyzeDailySales(item, true, todayDate);
        }else{
            getAndAnalyzeDailySales(item, false, currentDate2);
        }

        const payload = {
            organisationID: resolveUserID().id,
            outletID: item === null? "None": item?._id
        }
        OutletService.getAllOutletTanks(payload).then(data => {
            dispatch(getAllOutletTanks(data.stations));
            setLoads(false);
        });

        DailySalesService.getAllMonthlyReports(payload).then(data => { 
            const payments = data.expense.payment.concat(data.expense.posPayment);
            const expense = data.expense.expense;

            dispatch(storemonthlyBarData({expenses: expense, payments: payments}));
        });
    }

    const openDailySales = (data) => {
        if(load) return;
        if(oneStationData === null) return swal("Warning!", "Please select a station", "info");
        if(!getPerm('2')) return swal("Warning!", "Permission denied", "info");

        if(data === "pms"){
            props.history.push('/home/daily-sales/pms');
        }else if(data === "ago"){
            props.history.push('/home/daily-sales/ago');
        }else if(data === "dpk"){
            props.history.push('/home/daily-sales/dpk');
        }else if(data === "report"){
            props.history.push('/home/daily-sales/report');
        }
    }

    const goToTanks = (product) => {
        if(!getPerm('3')) return swal("Warning!", "Permission denied", "info");
        dispatch(tankListType(product));
        history.push('/home/outlets/list');
    }

    const convertDate = (newValue) => {
        const getDate = newValue === ""? date2: newValue.format('MM/DD/YYYY');
        const date = new Date(getDate);
        const toString = date.toDateString();
        const [day, year, month] = toString.split(' ');
        const finalDate = `${day} ${month} ${year}`;

        return finalDate;
    }

    const updateDate = (newValue) => {
        if(!getPerm('4')) return swal("Warning!", "Permission denied", "info");
        setValue(newValue);

        const getDate = newValue === ""? date2: newValue.format('YYYY-MM-DD');
        setLoads(true);
        dispatch(currentDateValue(newValue));
        getAndAnalyzeDailySales(oneStationData, false, getDate);

        dispatch(dateRange([new Date(getDate), new Date(getDate)]));
    }

    const goToSupply = () => {
        if(!getPerm('5')) return swal("Warning!", "Permission denied", "info");
        history.push("/home/supply")
    }

    const goToLPO = () => {
        if(!getPerm('7')) return swal("Warning!", "Permission denied", "info");
        history.push("/home/record-sales/lpo");
    }

    const goToInc = () => {
        if(!getPerm('8')) return swal("Warning!", "Permission denied", "info");
        history.push("/home/inc-orders");
    }

    const goToPagesInd = (data) => {
        if(data === 'exp') return history.push('/home/analysis/expenses');
        if(data === 'pay') return history.push('/home/analysis/payments');
    }      
    
    return(
        <>
            { props.activeRoute.split('/').length === 3 &&
                <div className='daily-sales-container'>
                    <div className='daily-left'>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <div >
                                {getPerm('0') &&
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
                                {getPerm('0') ||
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={0}
                                        sx={selectStyle2}
                                        disabled
                                    >
                                        <MenuItem style={menu} value={0}>{!getPerm('0')?oneStationData?.outletName+", "+oneStationData?.alias: "No station created"}</MenuItem>
                                    </Select>
                                }
                            </div>
                            <Button 
                                variant="contained" 
                                sx={{
                                    width:'210px',
                                    height:'30px',
                                    background:'#06805B',
                                    fontSize:'12px',
                                    marginLeft:'10px',
                                    borderRadius:"0px",
                                    textTransform:'capitalize',
                                    '&:hover': {
                                        backgroundColor: '#06805B'
                                    }
                                }}
                                onClick={()=>{openDailySales("report")}}
                            >
                                View comprehensive report
                            </Button>
                        </div>

                        <div className='item-dash-daily'>
                            <div data-aos="flip-left" className="dash-item">
                                {load?
                                    <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={110} />:
                                    <div onClick={()=>{openDailySales("pms")}} className="inner-dash-item">
                                        <div className="dash-image">
                                            <img className="imag" src={me5} alt="icon" />
                                        </div>
                                        <div className="dash-details">
                                            <div style={{display:'flex',marginRight:'10px', flexDirection:'column', alignItems:'flex-start'}}>
                                                <div style={{ fontWeight:'bold', fontSize:'12px'}}>PMS</div>
                                                <div style={{ fontWeight:'bold', marginTop:'5px', fontSize:'12px'}}>Litre {
                                                    ApproximateDecimal(dailySales.hasOwnProperty("PMS")? Number(dailySales.PMS.total.totalDifference): 0)
                                                } ltr</div>
                                                <div style={{ fontWeight:'bold', marginTop:'5px', fontSize:'12px'}}>Total NGN {
                                                    ApproximateDecimal(dailySales.hasOwnProperty("PMS")? dailySales.PMS.total.amount: 0)
                                                }</div>
                                            </div>
                                        </div>

                                        {/* Mobile views below here */}
                                        <div className='mobile-detail'>
                                            <div className="top-icon">
                                                <img style={{width:'25px', height:'25px'}} src={me5} alt="icon" />
                                                <div className='top-head-text'>PMS Sales</div>
                                            </div>
                                            <div className='top-head-tx'>Litre {
                                                    ApproximateDecimal(dailySales.hasOwnProperty("PMS")? Number(dailySales.PMS.total.totalDifference): 0)
                                                } ltr </div>
                                            <div className='top-head-tx'>Total N {
                                                ApproximateDecimal(dailySales.hasOwnProperty("PMS")? dailySales.PMS.total.amount: 0)
                                            } </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div data-aos="flip-left" className="dash-item">
                                {load?
                                    <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={110} />:
                                    <div onClick={()=>{openDailySales("ago")}} className="inner-dash-item">
                                        <div className="dash-image">
                                            <img className="imag" src={me5} alt="icon" />
                                        </div>
                                        <div className="dash-details">
                                            <div style={{display:'flex',marginRight:'10px', flexDirection:'column', alignItems:'flex-start'}}>
                                                <div style={{fontWeight:'bold', fontSize:'12px'}}>AGO</div>
                                                <div style={{fontWeight:'bold', marginTop:'5px', fontSize:'12px'}}>Litre {
                                                    ApproximateDecimal(dailySales.hasOwnProperty("PMS")? Number(dailySales.AGO.total.totalDifference): 0)
                                                } ltr</div>
                                                <div style={{fontWeight:'bold', marginTop:'5px', fontSize:'12px'}}>Total NGN {
                                                    ApproximateDecimal(dailySales.hasOwnProperty("AGO")? dailySales.AGO.total.amount: 0)
                                                }</div>
                                            </div>
                                        </div>

                                        {/* Mobile views below here */}
                                        <div className='mobile-detail'>
                                            <div className="top-icon">
                                                <img style={{width:'25px', height:'25px'}} src={me5} alt="icon" />
                                                <div className='top-head-text'>AGO Sales</div>
                                            </div>
                                            <div className='top-head-tx'>Litre {
                                                    ApproximateDecimal(dailySales.hasOwnProperty("PMS")? Number(dailySales.AGO.total.totalDifference): 0)
                                                } ltr </div>
                                            <div className='top-head-tx'>Total N {
                                                ApproximateDecimal(dailySales.hasOwnProperty("PMS")? dailySales.AGO.total.amount: 0)
                                            } </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div data-aos="flip-left" className="dash-item">
                                {load?
                                    <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={110} />:
                                    <div onClick={()=>{openDailySales("dpk")}} className="inner-dash-item">
                                        <div className="dash-image">
                                            <img className="imag" src={me5} alt="icon" />
                                        </div>
                                        <div className="dash-details">
                                            <div style={{display:'flex',marginRight:'10px', flexDirection:'column', alignItems:'flex-start'}}>
                                                <div style={{ fontWeight:'bold', fontSize:'12px'}}>DPK</div>
                                                <div style={{ fontWeight:'bold', marginTop:'5px', fontSize:'12px'}}>Litre {
                                                    ApproximateDecimal(dailySales.hasOwnProperty("PMS")? Number(dailySales.DPK.total.totalDifference): 0)
                                                } ltr</div>
                                                <div style={{ fontWeight:'bold', marginTop:'5px', fontSize:'12px'}}>TotaL NGN {
                                                    ApproximateDecimal(dailySales.hasOwnProperty("DPK")? dailySales.DPK.total.amount: 0)
                                                }</div>
                                            </div>
                                        </div>

                                        {/* Mobile views below here */}
                                        <div className='mobile-detail'>
                                            <div className="top-icon">
                                                <img style={{width:'25px', height:'25px'}} src={me5} alt="icon" />
                                                <div className='top-head-text'>DPK Sales</div>
                                            </div>
                                            <div className='top-head-tx'>Litre {
                                                    ApproximateDecimal(dailySales.hasOwnProperty("PMS")? Number(dailySales.DPK.total.totalDifference): 0)
                                                } ltr </div>
                                            <div className='top-head-tx'>Total N {
                                                ApproximateDecimal(dailySales.hasOwnProperty("PMS")? dailySales.DPK.total.amount: 0)
                                            } </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>

                        <div style={{color: user.isDark === '0'? '#000': '#fff'}} className="tank-text">Tank Stock Levels</div>
                        <div className="tank-container">
                            {load?
                                <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={450} />:
                                <div className="tank-inner">
                                    <div className="tanks">
                                        <div className='tank-head'>PMS</div>
                                        <div style={{fontWeight:'500'}} className='level'>Level: {ApproximateDecimal(cummulativeTotals.totalPMS)} Ltr</div>
                                        <div style={{fontWeight:'500'}} className='capacity'>Capacity: {ApproximateDecimal(cummulativeTotals.PMSTankCapacity)} Ltr</div>
                                        <div onClick={()=>{goToTanks("PMS")}} className='canvas-container'>
                                            <PMSTank/>
                                        </div>
                                    </div>
                                    <div className="tanks">
                                        <div className='tank-head'>AGO</div>
                                            <div style={{fontWeight:'500'}} className='level'>Level: {ApproximateDecimal(cummulativeTotals.totalAGO)} Ltr</div>
                                            <div style={{fontWeight:'500'}} className='capacity'>Capacity: {ApproximateDecimal(cummulativeTotals.AGOTankCapacity)} Ltr</div>
                                            <div onClick={()=>{goToTanks("AGO")}} className='canvas-container'>
                                                <AGOTank/>
                                            </div>
                                        </div>
                                    <div className="tanks">
                                        <div className='tank-head'>DPK</div>
                                        <div style={{fontWeight:'500'}} className='level'>Level: {ApproximateDecimal(cummulativeTotals.totalDPK)} Ltr</div>
                                        <div style={{fontWeight:'500'}} className='capacity'>Capacity: {ApproximateDecimal(cummulativeTotals.DPKTankCapacity)} Ltr</div>
                                        <div onClick={()=>{goToTanks("DPK")}} className='canvas-container'>
                                            <DPKTank/>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>

                        <OveragesAndShortages path={"sales"} />
                    </div>

                    <div className='daily-right'>
                        <div style={{width:'100%', display:'flex', flexDirection:'row', justifyContent:'flex-end'}}>
                            <div>
                                <div style={sales}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Stack spacing={1}>
                                            <ButtonDatePicker
                                                label={`${
                                                    value == null || "" ? date2 : convertDate(value)
                                                }`}
                                                value={value}
                                                onChange={(newValue) => updateDate(newValue)}
                                            />
                                        </Stack>
                                    </LocalizationProvider>
                                </div>
                            </div>
                        </div>

                        <div style={{marginTop:'10px'}} className='expen'>
                            <div onClick={()=>{goToPagesInd('exp')}} style={{background:'#108CFF'}} className='child'>
                                {load?
                                    <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={105} />:
                                    <div className='ins'>
                                        <div>Expenses</div>
                                        <div>N {ApproximateDecimal(payments.hasOwnProperty("payments")? payments.expenses: "0")}</div>
                                    </div>
                                }
                            </div>
                            <div onClick={()=>{goToPagesInd('pay')}} style={{background:'#06805B'}} className='child'>
                                {load?
                                    <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={105} />:
                                    <div className='ins'>
                                        <div>Payments</div>
                                        <div>N {ApproximateDecimal(payments.hasOwnProperty("payments")? payments.payments: "0")}</div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div style={{color: user.isDark === '0'? '#000': '#fff', marginTop:'30px'}} className="tank-text">Expenses And Payments</div>
                        <BarChartGraph load={load} station={oneStationData} />

                        <div style={{marginTop:'30px'}} className='asset'>
                            <div style={{color: user.isDark === '0'? '#000': '#fff'}} className="tank-text">Supply</div>
                            {load?
                                <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'130px'} height={35} />:
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
                                    onClick={goToSupply}
                                >
                                    View in details
                                </Button>
                            }
                        </div>
                        <div className='inner-section'>
                            <div className="cardss">
                                {load?
                                    <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={105} />:
                                    <>
                                        <div className='left'>
                                            PMS
                                        </div>
                                        <div className='right'>
                                            <div>Litre Qty</div>
                                            <div>{ApproximateDecimal(dailySupplys.hasOwnProperty("PMS")? dailySupplys.PMS: "0")}</div>
                                        </div>
                                    </>
                                }
                            </div>
                            <div className="cardss">
                                {load?
                                    <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={105} />:
                                    <>
                                        <div className='left'>
                                            AGO
                                        </div>
                                        <div className='right'>
                                            <div>Litre Qty</div>
                                            <div>{ApproximateDecimal(dailySupplys.hasOwnProperty("AGO")? dailySupplys.AGO: "0")}</div>
                                        </div>
                                    </>
                                }
                            </div>
                            <div style={{marginRight:'0px'}} className="cardss">
                                {load?
                                    <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={105} />:
                                    <>
                                        <div className='left'>
                                            DPK
                                        </div>
                                        <div className='right'>
                                            <div>Litre Qty</div>
                                            <div>{ApproximateDecimal(dailySupplys.hasOwnProperty("DPK")? dailySupplys.DPK: "0")}</div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>

                        <div style={{marginTop:'30px'}} className='section'>
                            <div className='alisss'>
                                <div style={{color: user.isDark === '0'? '#000': '#fff'}} className="tank-text">Net to bank</div>
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
                                    onClick={()=>{history.push("/home/analysis/payments")}}
                                >
                                    View in details
                                </Button>
                            </div>
                            <div className='inner-section'>
                                <div className='inner-content'>
                                    <div className='conts'>
                                        <div className='row-count'>
                                            <div style={{fontSize:'12px', fontWeight:'bold'}} className='item-count'>Net to bank</div>
                                            <div style={{fontSize:'12px', fontWeight:'bold'}} className='item-count'>Payment</div>
                                            <div style={{fontSize:'12px', fontWeight:'bold'}} className='item-count'>
                                                NGN {ApproximateDecimal(payments.hasOwnProperty("payments")? payments.payments: "0")}
                                            </div>
                                            <div style={{fontSize:'12px', fontWeight:'bold'}} className='item-count'>Outstanding</div>
                                        </div>
                                        <div className='row-count'>
                                            <div className='item-count'>
                                                NGN {ApproximateDecimal((dailySales.hasOwnProperty("PMS") && payments.hasOwnProperty("expenses"))? Number(dailySales.PMS.total.noLpoAmount) + Number(dailySales.AGO.total.noLpoAmount) + Number(dailySales.DPK.total.noLpoAmount) - Number(payments.expenses) : "0")}
                                            </div>
                                            <div style={{color:'#0872D4'}}  className='item-count'>Teller</div>
                                            <div style={{color:'#0872D4'}} className='item-count'>
                                                NGN {ApproximateDecimal(payments.hasOwnProperty("oneBankPayment")? payments.oneBankPayment: "0")}
                                            </div>
                                            <div style={{color:'red'}} className='item-count'>
                                                {ApproximateDecimal((dailySales.hasOwnProperty("PMS") && payments.hasOwnProperty("expenses"))? Number(payments.payments) - (Number(dailySales.PMS.total.noLpoAmount) + Number(dailySales.AGO.total.noLpoAmount) + Number(dailySales.DPK.total.noLpoAmount) - Number(payments.expenses)) : "0")}
                                            </div>
                                        </div>
                                        <div className='row-count'>
                                            <div className='item-count'></div>
                                            <div style={{color:'#000'}}  className='item-count'>POS</div>
                                            <div style={{color:'#000'}} className='item-count'>
                                                NGN {ApproximateDecimal(payments.hasOwnProperty("onePosPayment")? payments.onePosPayment: "0")}
                                            </div>
                                            <div className='item-count'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{marginTop:'30px'}} className='section'>
                            <div className='alisss'>
                            <div style={{color: user.isDark === '0'? '#000': '#fff'}} className="tank-text">LPO</div>
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
                                    onClick={goToLPO}
                                >
                                    View in details
                                </Button>
                            </div>
                            <div className='inner-section'>
                                <div className='inner-content'>
                                    <div className='conts'>
                                        <div className='row-count'>
                                            <div style={{fontSize:'13px', fontWeight:'bold'}} className='item-count'>Total LPO (Ltrs)</div>
                                            <div style={{fontSize:'13px', fontWeight:'bold'}} className='item-count'>Total Amount</div>
                                        </div>
                                        <div className='row-count'>
                                            <div className='item-count'>
                                                {ApproximateDecimal(dailySales.hasOwnProperty("PMS")? Number(dailySales.PMS.total.totalLpo) + Number(dailySales.AGO.total.totalLpo) + Number(dailySales.DPK.total.totalLpo): "0")} Litres
                                            </div>
                                            <div className='item-count'>
                                                NGN {ApproximateDecimal(dailySales.hasOwnProperty("PMS")?  Number(dailySales.PMS.total.lpoAmount) + Number(dailySales.AGO.total.lpoAmount) + Number(dailySales.DPK.total.lpoAmount): "0")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{display:'flex', flexDirection:'row', width:'100%', marginTop:'40px', justifyContent:'space-between'}} className="tank-text">
                            <div style={{color: user.isDark === '0'? '#000': '#fff'}} className="tank-text">Incoming Order</div>
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
                                    onClick={goToInc}
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
                                dailyIncoming.length === 0?
                                <div style={dats}> No incoming order today </div>:
                                dailyIncoming.map((data, index) => {
                                    return(
                                        <div key={index} className='table-view2'>
                                            <div className='table-text'>{data.outletName}</div>
                                            <div className='table-text'>{data.createdAt.split('T')[0]}</div>
                                            <div className='table-text'>{data.depotStation}</div>
                                            <div className='table-text'>{data.product}</div>
                                            <div className='table-text'>{ApproximateDecimal(data.quantity)}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>  
                    </div>
                </div>
            }
            { props.activeRoute.split('/').length === 4 &&
                <div style={contain}>
                    <Switch>
                        <Route path='/home/daily-sales/pms'>
                            <PMSDailySales/>
                        </Route>
                        <Route path='/home/daily-sales/ago'>
                            <AGODailySales/>
                        </Route>
                        <Route path='/home/daily-sales/dpk'>
                            <DPKDailySales/>
                        </Route>
                        <Route path='/home/daily-sales/report'>
                            <ComprehensiveReport cummulate = {getProductTanks} station={oneStationData}/>
                        </Route>
                        <Route path='/home/outlets/list'>
                            <ListAllTanks refresh={getAllProductData}/>
                        </Route>
                    </Switch>
                </div>
            }
        </>
    )
}

const dats = {
    marginTop:'20px',
    fontSize:'12px',
    fontWeight:'bold',
}

const contain = {
    width:'100%',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    marginTop:'20px'
}

const menu = {
    fontSize:'12px',
}

const selectStyle2 = {
    width:'130px', 
    height: '30px',
    borderRadius:'0px',
    background: '#F2F1F1B2',
    color:'#000',
    fontSize:'12px',
    outline:'none',
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border:'1px solid #777777',
    },
}

const sales = {
    width:'100%', 
    height:'35px',
    display:'flex', 
    flexDirection:'row', 
    justifyContent:'flex-end',
    position: 'relative',
    alignItems:'flex-start',
}

export default DailySales;