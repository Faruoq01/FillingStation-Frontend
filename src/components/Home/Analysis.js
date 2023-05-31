import React, { useCallback, useEffect, useState } from 'react';
import '../../styles/payments.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import analysis2 from '../../assets/analysis2.png';
import folder from '../../assets/folder.png';
import folder2 from '../../assets/folder2.png';
import hand from '../../assets/hand.png';
import naira from '../../assets/naira.png';
import me6 from '../../assets/me6.png';
import { useDispatch, useSelector } from 'react-redux';
import OutletService from '../../services/outletService';
import { adminOutlet, getAllStations } from '../../store/actions/outlet';
import AddCostPrice from '../Modals/AddCostPrice';
import CostPriceModal from '../Modals/CostPriceModal';
import { Route, Switch, useHistory } from 'react-router-dom';
import Payments from './Payments';
import Expenses from './Expenses';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import AnalysisService from '../../services/analysis';
import { setAnalysisData } from '../../store/actions/analysis';
import swal from 'sweetalert';
import ApproximateDecimal from '../common/approx';
import { Skeleton } from '@mui/material';
import SalesDisplay from '../Modals/SalesDisplay';
import Varience from '../Modals/Varience';
import { overages } from '../../store/actions/dailySales';
import { dateRange } from '../../store/actions/dashboard';

const Analysis = (props) => {

    const user = useSelector(state => state.authReducer.user);
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const analysisData = useSelector(state => state.analysisReducer.analysisData);
    const updatedDate = useSelector(state => state.dashboardReducer.dateRange);
    const moment = require('moment-timezone');

    const dispatch = useDispatch();
    const history = useHistory();
    const [defaultState, setDefault] = useState(0);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [type, setType] = useState(false);
    const [mode, setMode] = useState("");
    const [load, setLoad] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [openDetails2, setOpenDetails2] = useState(false);

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
        return user.permission?.analysis[e];
    }

    const getAllOutletData = useCallback(() => {

        if(oneStationData !== null){
            if((getPerm('0') || getPerm('1') || user.userType === "superAdmin")){
                const findID = allOutlets.findIndex(data => data._id === oneStationData._id);
                setDefault(findID + 1);
                return
            }
        }

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
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        getAllOutletData();
    },[getAllOutletData])

    const changeMenu = (index, item ) => {
        if(!getPerm('1') && item === null) return swal("Warning!", "Permission denied", "info");
        setDefault(index);
        dispatch(adminOutlet(item));
        setLoad(true);

        const formatOne = moment(new Date(updatedDate[0])).format('YYYY-MM-DD HH:mm:ss').split(' ')[0];
        const formatTwo = moment(new Date(updatedDate[1])).format('YYYY-MM-DD HH:mm:ss').split(' ')[0];
    
        const payload = {
            organisationID: resolveUserID().id,
            outletID: item === null? "None": item?._id,
            startDate: formatOne,
            endDate: formatTwo
        }

        AnalysisService.getAnalysisData(payload).then(data => {
            dispatch(setAnalysisData(data.analysisData));
            dispatch(overages(data.analysisData.dipping));
        }).then(()=>{
            setLoad(false);
        });
    }
    
    const DashboardImage = (props) => {
        return(
            <>
                {load && <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={110} />}
                {load ||
                    <div style={{margin:'0px'}} onClick={()=>{openCostPrice(props.type)}} className='first-image'>
                        <div style={{marginRight:'10px'}} className='inner-first-image'>
                            <div className='top-first-image'>
                                <div className='top-icon'>
                                    <img style={{width:'50px', height:'40px'}} src={props.image} alt="icon" />
                                </div>
                                <div style={{alignItems:'flex-end', justifyContent:'center', flexDirection:'column'}} className='top-text'>
                                    <div style={{fontSize:'14px', color:'#06805B'}}>{props.name}</div>
                                    <div style={{fontSize:'12px', fontWeight:'bold', marginTop:'5px'}}>{props.value}</div>
                                </div>
                            </div>
                            <div className='bottom-first-image'>
                                <img style=
                                {{width:'30px', height:'10px'}} src={me6} alt="icon" />
                            </div>
                        </div>
                    </div>
                }
            </>
        )
    }

    const openCostPrice = (type) => {

        if(type === "cost" || type === "selling"){
            if(!getPerm('2') || !getPerm('3')) return swal("Warning!", "Permission denied", "info");

            setOpen(true);
            setType(type);
        }else if(type === "payments"){
            if(!getPerm('4')) return swal("Warning!", "Permission denied", "info");

            history.push("/home/analysis/payments");
        }else if(type === "expenses"){
            if(!getPerm('5')) return swal("Warning!", "Permission denied", "info");

            history.push("/home/analysis/expenses");
        }else if(type === "sales"){
            setOpenDetails(true);

        }else if(type === "varience"){
            setOpenDetails2(true);

        }
    }

    const getDateFromRange = (data) => {
        setLoad(true);
        if(!getPerm('6')) return swal("Warning!", "Permission denied", "info");

        const formatOne = moment(new Date(data[0])).format('YYYY-MM-DD HH:mm:ss').split(' ')[0];
        const formatTwo = moment(new Date(data[1])).format('YYYY-MM-DD HH:mm:ss').split(' ')[0];
        dispatch(dateRange([new Date(formatOne), new Date(formatTwo)]));

    
        const payload = {
            organisationID: resolveUserID().id,
            outletID: oneStationData === null? "None": oneStationData?._id,
            startDate: formatOne,
            endDate: formatTwo
        }

        AnalysisService.getAnalysisData(payload).then(data => {
            dispatch(setAnalysisData(data.analysisData));
            dispatch(overages(data.analysisData.dipping));
        }).then(()=>{
            setLoad(false);
        });
    }

    const calculateExpenses = () => {
        if(analysisData.expenses.length === 0){
            return 0;
        }

        const expenseSum = analysisData.expenses.reduce((accum, current) => {
            return Number(accum) + Number(current.expenseAmount);
        }, 0);

        return expenseSum;
    }

    const calculatePayment = () => {

        const bank = analysisData.payments.reduce((accum, current) => {
            return Number(accum) + Number(current.amountPaid);
        }, 0);

        const pos = analysisData.pospayment.reduce((accum, current) => {
            return Number(accum) + Number(current.amountPaid);
        }, 0);

        const sum = bank + pos;

        return sum;
    }

    const totalSales = () => {
        /*#################################################
            Sales records for each product
        ##################################################*/

        const pmsSales = analysisData.sales.filter(data => data.productType === "PMS").reduce((accum, current) => {
            return Number(accum) + Number(current.sales)*Number(current.PMSSellingPrice);
        }, 0);

        const agoSales = analysisData.sales.filter(data => data.productType === "AGO").reduce((accum, current) => {
            return Number(accum) + Number(current.sales)*Number(current.AGOSellingPrice);
        }, 0);

        const dpkSales = analysisData.sales.filter(data => data.productType === "DPK").reduce((accum, current) => {
            return Number(accum) + Number(current.sales)*Number(current.DPKSellingPrice);
        }, 0);

        /*#################################################
            volume records for each product
        ##################################################*/

        const pmsVol = analysisData.sales.filter(data => data.productType === "PMS").reduce((accum, current) => {
            return Number(accum) + Number(current.sales);
        }, 0);

        const agoVol = analysisData.sales.filter(data => data.productType === "AGO").reduce((accum, current) => {
            return Number(accum) + Number(current.sales);
        }, 0);

        const dpkVol = analysisData.sales.filter(data => data.productType === "DPK").reduce((accum, current) => {
            return Number(accum) + Number(current.sales);
        }, 0);

        const totalSales = pmsSales + agoSales + dpkSales

        return {
            totalSales: totalSales, 
            pmsSales: pmsSales, 
            pmsVolume: pmsVol,
            agoSales: agoSales,
            agoVolume: agoVol,
            dpkSales: dpkSales,
            dpkVolume: dpkVol
        };
    }

    const calculateProfit = () => {
        /*#################################################
            Sales records for each product
        ##################################################*/

        const pmsSales = analysisData.sales.filter(data => data.productType === "PMS").reduce((accum, current) => {
            return Number(accum) + Number(current.sales)*Number(current.PMSSellingPrice) - Number(current.sales)*Number(current.PMSCostPrice);
        }, 0);


        const agoSales = analysisData.sales.filter(data => data.productType === "AGO").reduce((accum, current) => {
            return Number(accum) + Number(current.sales)*Number(current.AGOSellingPrice) - Number(current.sales)*Number(current.AGOCostPrice);
        }, 0);

        const dpkSales = analysisData.sales.filter(data => data.productType === "DPK").reduce((accum, current) => {
            return Number(accum) + Number(current.sales)*Number(current.DPKSellingPrice) - Number(current.sales)*Number(current.DPKCostPrice);
        }, 0);

        /*#################################################
            Overages/Shortages records for each product
        ##################################################*/
        
        const pmsDipping = analysisData.sales.filter(data => data.productType === "PMS").reduce((accum, current) => {
            const ID = analysisData?.dipping?.findIndex(data => data.tankID === current.tankID);
            if(ID === -1) return 0;
            const currentDip = analysisData?.dipping[ID];
            const varience = Number(currentDip.dipping) - Number(current.afterSales);

            return Number(accum) + Number(varience)*Number(current.PMSSellingPrice) - Number(varience)*Number(current.PMSCostPrice);
        }, 0);

        const agoDipping = analysisData.sales.filter(data => data.productType === "AGO").reduce((accum, current) => {
            const ID = analysisData?.dipping?.findIndex(data => data.tankID === current.tankID);
            if(ID === -1) return 0;
            const currentDip = analysisData?.dipping[ID];
            const varience = Number(currentDip.dipping) - Number(current.afterSales);

            return Number(accum) + Number(varience)*Number(current.AGOSellingPrice) - Number(varience)*Number(current.AGOCostPrice);
            
        }, 0);

        const dpkDipping = analysisData.sales.filter(data => data.productType === "DPK").reduce((accum, current) => {
            const ID = analysisData?.dipping?.findIndex(data => data.tankID === current.tankID);
            if(ID === -1) return 0;
            const currentDip = analysisData?.dipping[ID];
            const varience = Number(currentDip.dipping) - Number(current.afterSales);

            return Number(accum) + Number(varience)*Number(current.DPKSellingPrice) - Number(varience)*Number(current.DPKCostPrice);
            
        }, 0);

        const totalSales = pmsSales + agoSales + dpkSales;
        const netVareince = pmsDipping + agoDipping + dpkDipping;

        return totalSales + netVareince - calculateExpenses();
    }

    const Variences = () => {
         /*#################################################
            Overages/Shortages records for each product
        ##################################################*/

        const pmsVarSales = analysisData.sales.filter(data => data.productType === "PMS").reduce((accum, current) => {
            const ID = analysisData?.dipping?.findIndex(data => data.tankID === current.tankID);
            if(ID === -1) return 0;
            const currentDip = analysisData?.dipping[ID];
            const varience = Number(currentDip.dipping) - Number(current.afterSales);

            return Number(accum) + Number(varience)*Number(current.PMSSellingPrice) - Number(varience)*Number(current.PMSCostPrice);
        }, 0);

        const agoVarSales = analysisData.sales.filter(data => data.productType === "AGO").reduce((accum, current) => {
            const ID = analysisData?.dipping?.findIndex(data => data.tankID === current.tankID);
            if(ID === -1) return 0;
            const currentDip = analysisData?.dipping[ID];
            const varience = Number(currentDip.dipping) - Number(current.afterSales);

            return Number(accum) + Number(varience)*Number(current.AGOSellingPrice) - Number(varience)*Number(current.AGOCostPrice);
            
        }, 0);

        const dpkVarSales = analysisData.sales.filter(data => data.productType === "DPK").reduce((accum, current) => {
            const ID = analysisData?.dipping?.findIndex(data => data.tankID === current.tankID);
            if(ID === -1) return 0;
            const currentDip = analysisData?.dipping[ID];
            const varience = Number(currentDip.dipping) - Number(current.afterSales);

            return Number(accum) + Number(varience)*Number(current.DPKSellingPrice) - Number(varience)*Number(current.DPKCostPrice);
            
        }, 0);

         /*#################################################
            Overages/Shortages volume records for each product
        ##################################################*/

        const pmsVarVol = analysisData.sales.filter(data => data.productType === "PMS").reduce((accum, current) => {
            const ID = analysisData?.dipping?.findIndex(data => data.tankID === current.tankID);
            if(ID === -1) return 0;
            const currentDip = analysisData?.dipping[ID];
            const varience = Number(currentDip.dipping) - Number(current.afterSales);

            return Number(accum) + Number(varience);
        }, 0);

        const agoVarVol = analysisData.sales.filter(data => data.productType === "AGO").reduce((accum, current) => {
            const ID = analysisData?.dipping?.findIndex(data => data.tankID === current.tankID);
            if(ID === -1) return 0;
            const currentDip = analysisData?.dipping[ID];
            const varience = Number(currentDip.dipping) - Number(current.afterSales);

            return Number(accum) + Number(varience);
        }, 0);

        const dpkVarVol = analysisData.sales.filter(data => data.productType === "DPK").reduce((accum, current) => {
            const ID = analysisData.dipping.findIndex(data => data.tankID === current.tankID);
            if(ID === -1) return 0;
            const currentDip = analysisData?.dipping[ID];
            const varience = Number(currentDip.dipping) - Number(current.afterSales);

            return Number(accum) + Number(varience);
        }, 0);

        const totalSales = pmsVarSales + agoVarSales + dpkVarSales

        return {
            totalSales: totalSales, 
            pmsSales: pmsVarSales, 
            pmsVolume: pmsVarVol,
            agoSales: agoVarSales,
            agoVolume: agoVarVol,
            dpkSales: dpkVarSales,
            dpkVolume: dpkVarVol
        };
    }

    return(
        <div data-aos="zoom-in-down" style={{background: user.isDark === "0"? '#fff': '#404040'}} className='paymentsCaontainer'>
            {open && <AddCostPrice type={type} open={open} close={setOpen} open2={setOpen2} setMode={setMode} />}
            {open2 && <CostPriceModal type={type} open={open2} close={setOpen2} mode={mode} refresh={getAllOutletData} />}
            {openDetails && <SalesDisplay open={openDetails} close={setOpenDetails} dash={totalSales()} />}
            {openDetails2 && <Varience open={openDetails2} close={setOpenDetails2} dash={Variences()} />}
            {props.activeRoute.split('/').length === 3 &&
                <div style={{width:'100%', marginTop:'0px'}} className='inner-pay'>
                    <div className='action'>
                        <div style={{width:'150px'}} className='butt2'>
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={10}
                                sx={{...selectStyle2, backgroundColor:"#06805B", color:'#fff'}}
                            >
                                <MenuItem value={10}>Add Payments</MenuItem>
                                <MenuItem value={20}>Download PDF</MenuItem>
                                <MenuItem value={30}>Print</MenuItem>
                            </Select>
                        </div>
                    </div>

                    <div style={{marginBottom:'0px'}} className='search'>
                        <div className='input-cont'>
                            <div className='second-select'>
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
                                        <MenuItem style={menu} value={0}>{!getPerm('0')? oneStationData?.outletName+", "+oneStationData?.alias: "No station created"}</MenuItem>
                                    </Select>
                                }
                            </div>
                        </div>
                        <div style={{justifyContent:'flex-end'}} className='butt'>
                            <DateRangePicker onChange={getDateFromRange} value={updatedDate} />
                        </div>
                    </div>

                    <div style={contain2}>
                        <div className='imgContainer'>
                            <DashboardImage type={"cost"} right={'10px'} left={'0px'} image={naira} name={'Cost Price'} value={`NGN ${oneStationData?  oneStationData?.PMSCost: "0"}`} />
                            <DashboardImage type={"selling"} right={'10px'} left={'0px'} image={hand} name={'Selling Price'} value={`NGN ${oneStationData? oneStationData?.PMSPrice: "0"}`} />
                            <DashboardImage type={"expenses"} right={'10px'} left={'0px'} image={folder} name={'Expenses'} value={`NGN ${ApproximateDecimal(calculateExpenses())}`} />
                            <DashboardImage type={"payments"} right={'10px'} left={'0px'} image={folder2} name={'Payments'} value={`NGN ${ApproximateDecimal(calculatePayment())}`} />
                            <DashboardImage type={"none"} right={'10px'} left={'0px'} image={analysis2} name={'Profits'} value={`NGN ${ApproximateDecimal(analysisData.dipping.length === 0? 0: calculateProfit())}`} />
                            <DashboardImage type={"sales"} right={'10px'} left={'0px'} image={folder} name={'Total Sales'} value={`NGN ${ApproximateDecimal(totalSales()?.totalSales)}`} />
                            <DashboardImage type={"varience"} right={'10px'} left={'0px'} image={folder2} name={'Varience'} value={`NGN ${ApproximateDecimal(analysisData.dipping.length === 0? 0: Variences().totalSales)}`} />
                        </div>
                    </div>
                </div>
            }

            {props.activeRoute.split('/').length === 4 &&
                <Switch>
                    <Route path='/home/analysis/payments'>
                        <Payments />
                    </Route>
                    <Route path='/home/analysis/expenses'>
                        <Expenses />
                    </Route>
                </Switch>
            }
        </div>
    )
}

const selectStyle2 = {
    width:'100%', 
    height:'35px', 
    borderRadius:'0px',
    background: '#F2F1F1B2',
    color:'#000',
    fontSize:'12px',
    outline:'none',
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border:'1px solid #777777',
    },
}

const contain2 = {
    width:'100%',
}

const menu = {
    fontSize:'12px',
}

export default Analysis;