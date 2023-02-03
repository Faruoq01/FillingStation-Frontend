import { Button, MenuItem, Select } from '@mui/material';
import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DailySalesService from '../../services/DailySales';
import OutletService from '../../services/outletService';
import { adminOutlet, getAllStations } from '../../store/actions/outlet';
import '../../styles/report.scss';
import ComprehensiveReports from '../Reports/ConprehensiveReports';
import AGODailySales from './AGODailySales';
import DPKDailySales from './DPKDailySales';
import PMSDailySales from './PMSDailySales';

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

const approx = (data) => {
    if(data){
        let formattedSale = String(Number(data)?.toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return formattedSale;
    }
}

const LeftTableView = (props) => {

    const getTankLevels = () => {

        const PMS = props?.sales?.filter(data => data.productType === "PMS");
        const AGO = props?.sales?.filter(data => data.productType === "AGO");
        const DPK = props?.sales?.filter(data => data.productType === "DPK");

        let pmsBF = 0;
        let agoBF = 0;
        let dpkBF = 0; 

        if(PMS){
            pmsBF = pmsBF + Number(PMS[0]?.totalTankLevel)
        }

        if(AGO){
            agoBF = agoBF + Number(AGO[0]?.totalTankLevel)
        }

        if(DPK){
            dpkBF = dpkBF + Number(DPK[0]?.totalTankLevel)
        }

        return {pms: pmsBF, ago: agoBF, dpk: dpkBF}
    }

    const getSupply = () => {
        const PMS = props?.supply?.filter(data => data.productType === "PMS") || [];
        const AGO = props?.supply?.filter(data => data.productType === "AGO") || [];
        const DPK = props?.supply?.filter(data => data.productType === "DPK") || [];

        const totalPMS = PMS?.reduce((accum, current) => {
            return Number(accum) + Number(current.quantity);
        }, 0);

        const totalAGO = AGO?.reduce((accum, current) => {
            return Number(accum) + Number(current.quantity);
        }, 0);

        const totalDPK = DPK?.reduce((accum, current) => {
            return Number(accum) + Number(current.quantity);
        }, 0);

        const total = [totalPMS, totalAGO, totalDPK]
        
        return total;
    }

    const getBalanceBF = () => {
        const pmsBalance = getTankLevels().pms - getSupply()[0];
        const agoBalance = getTankLevels().ago - getSupply()[1];
        const dpkBalance = getTankLevels().dpk - getSupply()[2];

        return {pms: isNaN(pmsBalance)? 0: pmsBalance, ago: isNaN(agoBalance)? 0: agoBalance, dpk: isNaN(dpkBalance)? 0: dpkBalance};
    }

    return(
        <div className='column-head1'>
            <div className='header1'>
                <span style={{marginLeft:'10px'}}>Balance B/Forward</span>
            </div>
            <div className='row-cont'>
                <div className='rows'>
                    <div className='cell'>Product Type</div>
                    <div style={{marginRight:'0px'}} className='cell'>Litre Qty</div>
                </div>

                <div className='rows'>
                    <div style={{color:'#06805B', fontSize:'11px'}} className='cell'>PMS</div>
                    <div style={{marginRight:'0px', fontSize:'11px'}} className='cell'>{getBalanceBF()?.pms}</div>
                </div>

                <div className='rows'>
                    <div style={{color:'#06805B', fontSize:'11px'}} className='cell'>AGO</div>
                    <div style={{marginRight:'0px', fontSize:'11px'}} className='cell'>{getBalanceBF()?.ago}</div>
                </div>

                <div className='rows'>
                    <div style={{color:'#06805B', fontSize:'11px'}} className='cell'>DPK</div>
                    <div style={{marginRight:'0px', fontSize:'11px'}} className='cell'>{getBalanceBF()?.dpk}</div>
                </div>
            </div>
        </div>
    )
}

const MiddleTableView = (props) => {
    const getSupply = () => {
        const PMS = props?.data?.filter(data => data.productType === "PMS") || [];
        const AGO = props?.data?.filter(data => data.productType === "AGO") || [];
        const DPK = props?.data?.filter(data => data.productType === "DPK") || [];

        let totalPMS = 0;
        let totalAGO = 0;
        let totalDPK = 0;

        let PMSShort = 0;
        let AGOShort = 0;
        let DPKShort = 0;

        for(let dm of PMS){
            totalPMS = totalPMS + Number(dm.quantity);

            if(dm.shortage !== "None"){
                PMSShort = PMSShort + Number(dm.shortage);
            }
        }

        for(let dm of AGO){
            totalAGO = totalAGO + Number(dm.quantity);

            if(dm.shortage !== "None"){
                AGOShort = AGOShort + Number(dm.shortage);
            }
        }

        for(let dm of DPK){
            totalDPK = totalDPK + Number(dm.quantity);

            if(dm.shortage !== "None"){
                DPKShort = DPKShort + Number(dm.shortage);
            }
        }

        const total = [totalPMS, PMSShort, totalAGO, AGOShort, totalDPK, DPKShort]
        
        return total;
    }
    return(
        <div className='column-head2'>
            <div className='header2'>
                <span style={{marginLeft:'10px'}}>Supply</span>
            </div>
            <div className='row-cont'>
                <div className='rows'>
                    <div className='cell'>Product Type</div>
                    <div className='cell'>Litre Qty</div>
                    <div style={{marginRight:'0px'}} className='cell'>Shortage</div>
                </div>

                <div className='rows'>
                    <div style={{color:'#06805B', fontSize:'11px'}} className='cell'>PMS</div>
                    <div style={{fontSize:'11px'}} className='cell'>{getSupply()[0]}</div>
                    <div style={{marginRight:'0px', fontSize:'11px'}} className='cell'>{getSupply()[1]}</div>
                </div>

                <div className='rows'>
                    <div style={{color:'#06805B', fontSize:'11px'}} className='cell'>AGO</div>
                    <div style={{fontSize:'11px'}} className='cell'>{getSupply()[2]}</div>
                    <div style={{marginRight:'0px', fontSize:'11px'}} className='cell'>{getSupply()[3]}</div>
                </div>

                <div className='rows'>
                    <div style={{color:'#06805B', fontSize:'11px'}} className='cell'>DPK</div>
                    <div style={{fontSize:'11px'}} className='cell'>{getSupply()[4]}</div>
                    <div style={{marginRight:'0px', fontSize:'11px'}} className='cell'>{getSupply()[5]}</div>
                </div>
            </div>
        </div>
    )
}

const RightTableView = (props) => {

    const getTankLevels = () => {

        const PMS = props?.sales?.filter(data => data.productType === "PMS");
        const AGO = props?.sales?.filter(data => data.productType === "AGO");
        const DPK = props?.sales?.filter(data => data.productType === "DPK");

        let pmsBF = 0;
        let agoBF = 0;
        let dpkBF = 0;

        if(PMS){
            pmsBF = pmsBF + Number(PMS[0]?.totalTankLevel)
        }

        if(AGO){
            agoBF = agoBF + Number(AGO[0]?.totalTankLevel)
        }

        if(DPK){
            dpkBF = dpkBF + Number(DPK[0]?.totalTankLevel)
        }

        return {pms: pmsBF, ago: agoBF, dpk: dpkBF}
    }

    const getBalanceBF = () => {

        const pmsBalance = getTankLevels().pms;
        const agoBalance = getTankLevels().ago;
        const dpkBalance = getTankLevels().dpk;
        
        return {pms: isNaN(pmsBalance)? 0:  pmsBalance , ago: isNaN(agoBalance)? 0: agoBalance, dpk: isNaN(dpkBalance)? 0: dpkBalance};
    }

    return(
        <div style={{marginRight:'0px', marginLeft:'5px'}} className='column-head1'>
            <div className='header1'>
                <span style={{marginLeft:'10px'}}>Available Balance</span>
            </div>
            <div className='row-cont'>
                <div className='row-cont'>
                    <div className='rows'>
                        <div className='cell'>Product Type</div>
                        <div style={{marginRight:'0px'}} className='cell'>Litre Qty</div>
                    </div>

                    <div className='rows'>
                        <div style={{color:'#06805B', fontSize:'11px'}} className='cell'>PMS</div>
                        <div style={{marginRight:'0px', fontSize:'11px'}} className='cell'>{getBalanceBF()?.pms}</div>
                    </div>

                    <div className='rows'>
                        <div style={{color:'#06805B', fontSize:'11px'}} className='cell'>AGO</div>
                        <div style={{marginRight:'0px', fontSize:'11px'}} className='cell'>{getBalanceBF()?.ago}</div>
                    </div>

                    <div className='rows'>
                        <div style={{color:'#06805B', fontSize:'11px'}} className='cell'>DPK</div>
                        <div style={{marginRight:'0px', fontSize:'11px'}} className='cell'>{getBalanceBF()?.dpk}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const LPODailySales = (props) => {

    const getTotal = () => {
        let total = 0;
        for(let lpo of props?.data){
            if(lpo.productType === "PMS"){
                total = total + Number(lpo.PMSRate)*Number(lpo.lpoLitre)
            }else if(lpo.productType === "AGO"){
                total = total + Number(lpo.AGORate)*Number(lpo.lpoLitre)
            }else if(lpo.productType === "DPK"){
                total = total + Number(lpo.DPKRate)*Number(lpo.lpoLitre)
            }
        }
        return total;
    }

    const getLpoTotal = (data) => {
        if(data.productType === "PMS"){
            return Number(data.PMSRate)*Number(data.lpoLitre);
        }else if(data.productType === "AGO"){
            return Number(data.AGORate)*Number(data.lpoLitre)
        }else{
            return Number(data.DPKRate)*Number(data.lpoLitre)
        }
    }

    return(
        <div className='sales'>
            <div style={{width:'100%', textAlign:'left', marginBottom:'10px', color:'#06805B', fontSize:'12px', fontWeight:'900'}}>LPO</div>
            <div className='main-sales'>
                <div className='inner'>
                    <div className='table-heads'>
                        <div className='col'>S/N</div>
                        <div className='col'>Account Name</div>
                        <div className='col'>Products</div>
                        <div className='col'>Truck No</div>
                        <div className='col'>Litre (Qty)</div>
                        <div className='col'>Rate</div>
                        <div style={{marginRight:'0px'}} className='col'>Amount</div>
                    </div>

                    {
                        props?.data?.length === 0?
                        <div style={dats}> No Data </div>:
                        props?.data?.map((data, index) => {
                            return(
                                <div key={index} className='table-heads2'>
                                    <div className='col'>{index + 1}</div>
                                    <div className='col'>{data.accountName}</div>
                                    <div className='col'>{data.productType}</div>
                                    <div className='col'>{data.truckNo}</div>
                                    <div className='col'>{data.lpoLitre}</div>
                                    <div className='col'>{
                                        approx(data.productType === "PMS"? data.PMSRate: data.productType === "AGO"? data.AGORate: data.DPKRate)
                                    }</div>
                                    <div style={{marginRight:'0px'}} className='col'>{
                                        approx(getLpoTotal(data))
                                    }</div>
                                </div>
                            )
                        })
                    }

                    <div className='table-heads2'>
                        <div style={{background: "transparent"}} className='col'></div>
                        <div style={{background: "transparent"}} className='col'></div>
                        <div style={{background: "transparent"}} className='col'></div>
                        <div style={{background: "transparent"}} className='col'></div>
                        <div style={{background: "transparent"}} className='col'></div>
                        <div className='col'>Total</div>
                        <div style={{marginRight:'0px'}} className='col'>
                            {
                                getTotal()
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ExpensesDailySales = (props) => {

    const totalExpenses = () => {
        let total = 0;
        for(let exp of props?.data){
            total = total + Number(exp.expenseAmount);
        }
        return total;
    }

    return(
        <div>
            <div style={{width:'100%', textAlign:'left', marginBottom:'10px', color:'#06805B', fontSize:'12px', fontWeight:'900'}}>Expenses</div>
            <div style={{width:'350px'}} className='main-sales'>
                <div className='inner'>
                    <div className='table-heads'>
                        <div className='col'>S/N</div>
                        <div className='col'>Expense Name</div>
                        <div style={{marginRight:'0px'}} className='col'>Amount</div>
                    </div>

                    {
                        props?.data?.length === 0?
                        <div style={dats}> No Data </div>:
                        props?.data?.map((data, index) => {
                            return(
                                <div key={index} className='table-heads2'>
                                    <div className='col'>{index+1}</div>
                                    <div className='col'>{data.expenseName}</div>
                                    <div style={{marginRight:'0px'}} className='col'>{data.expenseAmount}</div>
                                </div>
                            )
                        })
                    }

                    <div className='table-heads2'>
                        <div style={{background: "transparent"}} className='col'></div>
                        <div className='col'>Total</div>
                        <div style={{marginRight:'0px'}} className='col'>{totalExpenses}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ExpensesSummary = ({expenses, sales}) => {

    const totalExpenses = () => {
        const total = expenses.reduce((accum, current) => {
            return Number(accum) + Number(current.expenseAmount);
        }, 0);

        return total;
    }

    const getTotalSales = () => {
        return sales?.AGO?.total?.amount + sales?.PMS?.total?.amount + sales?.DPK?.total?.amount;
    }

    return(
        <div>
            <div style={{width:'100%', textAlign:'left', marginBottom:'10px', color:'#06805B', fontSize:'12px', fontWeight:'900'}}></div>
            <div style={{width:'350px'}} className='main-sales'>
                <div className='inner'>
                    <div className='table-heads'>
                        <div style={{width:'70%', display:'flex', justifyContent:'flex-start'}} className='col'>
                            <span style={{marginLeft:'10px'}}>Total Amount of sales (NGN)</span>
                        </div>
                        <div style={{marginRight:'0px', width:'30%', background:'#EDEDED', color:'#000'}} className='col'>{getTotalSales()}</div>
                    </div>

                    <div style={{marginTop:'5px'}} className='table-heads'>
                        <div style={{width:'70%', display:'flex', justifyContent:'flex-start'}} className='col'>
                            <span style={{marginLeft:'10px'}}>Total Amount of Expenses (NGN)</span>
                        </div>
                        <div style={{marginRight:'0px', width:'30%', background:'#EDEDED', color:'#000'}} className='col'>{totalExpenses()}</div>
                    </div>

                    <div style={{marginTop:'5px'}} className='table-heads2'>
                        <div style={{width:'70%', display:'flex', justifyContent:'flex-end'}} className='col'>
                            <span style={{marginRight:'20px'}}>Net to bank</span>
                        </div>
                        <div style={{marginRight:'0px', width:'30%'}} className='col'>{getTotalSales() - totalExpenses()}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PaymentDailySales = (props) => {

    const bankPayments = () => {
        let total = 0;
        if(props?.data?.bankPayment?.length === 0){
            return 0;
        }else{
            for(let pay of props?.data?.bankPayment){
                total = total + Number(pay.amountPaid);
            }
        }
        return total;
    }

    const posPayments = () => {
        let total = 0;
        if(props?.data?.posPayment?.length === 0){
            return 0;
        }else{
            for(let pay of props?.data?.posPayment){
                total = total + Number(pay.amountPaid);
            }
        }
        return total;
    }

    return(
        <div>
            <div style={{width:'100%', textAlign:'left', marginBottom:'10px', color:'#06805B', fontSize:'12px', fontWeight:'900'}}>Payments</div>
            <div style={{width:'350px'}} className='main-sales'>
                <div className='inner'>
                    <div className='table-heads'>
                        <div style={{marginRight:'5px', width:'50%'}} className='col'>Bank Payment</div>
                        <div style={{width:'50%', display:'flex', justifyContent:'flex-start'}} className='col'>
                            <span style={{marginLeft:'10px'}}>POS Payment</span>
                        </div>
                    </div>

                    <div style={{marginTop:'5px', width:'98%', display: 'flex', flexDirection:'row', justifyContent:'space-between', height:'auto'}} className='table-heads'>
                        <div style={{width:'49%', display:'flex', flexDirection:'column'}}>
                            {
                                props?.data?.bankPayment?.map((data, index) => {
                                    return(
                                        <div key={index} style={{
                                            background:'#EDEDED', 
                                            color:'#000', 
                                            height:'30px', 
                                            marginBottom:'5px'
                                        }} className='col'>{data.bankName+' ('+ data.amountPaid +')'}</div>
                                    )
                                })
                            }
                        </div>
                        <div style={{width:'49%', display:'flex', flexDirection:'column'}}>
                        {
                                props?.data?.posPayment?.map((data, index) => {
                                    return(
                                        <div key={index} style={{
                                            background:'#EDEDED', 
                                            color:'#000', 
                                            height:'30px', 
                                            marginBottom:'5px'
                                        }} className='col'>{data.posName+' ('+ data.amountPaid +')'}</div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div style={{marginTop:'5px'}} className='table-heads'>
                        <div style={{marginRight:'5px', width:'50%', background:'#EDEDED', color:'#000'}} className='col'>Total</div>
                        <div style={{width:'50%', display:'flex', background:'#EDEDED', color:'#000', justifyContent:'flex-start'}} className='col'>
                            <span style={{marginLeft:'10px'}}>{bankPayments() + posPayments()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ProductDailySales = (props) => {

    const getTankLevels = () => {

        const PMS = props?.sales?.filter(data => data.productType === "PMS");
        const AGO = props?.sales?.filter(data => data.productType === "AGO");
        const DPK = props?.sales?.filter(data => data.productType === "DPK");

        let pmsBF = 0;
        let agoBF = 0;
        let dpkBF = 0;

        if(PMS){
            pmsBF = pmsBF + Number(PMS[0]?.balanceCF)
        }

        if(AGO){
            agoBF = agoBF + Number(AGO[0]?.balanceCF)
        }

        if(DPK){
            dpkBF = dpkBF + Number(DPK[0]?.balanceCF)
        }

        return {pms: pmsBF, ago: agoBF, dpk: dpkBF}
    }
    
    const getBalanceBF = () => {
        /*#########################
            Data available balance
        ##########################*/

        const pmsBal = getTankLevels().pms;
        const agoBal = getTankLevels().ago;
        const dpkBal = getTankLevels().dpk;

        return {pms: isNaN(pmsBal)? 0: pmsBal, ago:isNaN(agoBal)? 0: agoBal, dpk: isNaN(dpkBal)? 0: dpkBal};
    }

    return(
        <div>
            <div style={{width:'100%', textAlign:'left', marginBottom:'10px', color:'#06805B', fontSize:'12px', fontWeight:'900'}}>
                Product Balance Carried Forward
            </div>
            <div style={{width:'350px'}} className='main-sales'>
                <div className='inner'>
                    <div className='table-heads'>
                        <div className='col'>Product Type</div>
                        <div className='col'>Litre (Qty)</div>
                        {/* <div style={{marginRight:'0px'}} className='col'>Confirmed by</div> */}
                    </div>

                    <div className='table-heads2'>
                        <div className='col'>PMS</div>
                        <div className='col'>{getBalanceBF().pms === 0? 0: getBalanceBF().pms}</div>
                        {/* <div style={{marginRight:'0px'}} className='col'></div> */}
                    </div>

                    <div className='table-heads2'>
                        <div className='col'>AGO</div>
                        <div className='col'>{getBalanceBF().ago === 0? 0: getBalanceBF().ago}</div>
                        {/* <div style={{marginRight:'0px'}} className='col'></div> */}
                    </div>

                    <div className='table-heads2'>
                        <div className='col'>DPK</div>
                        <div className='col'>{getBalanceBF().dpk === 0? 0: getBalanceBF().dpk}</div>
                        {/* <div style={{marginRight:'0px'}} className='col'></div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

const DippingDailySales = (props) => {console.log(props.data, 'tanks')

    const PMSTanks = props?.data?.filter(data => data.productType === "PMS") || [];
    const AGOTanks = props?.data?.filter(data => data.productType === "AGO") || [];
    const DPKTanks = props?.data?.filter(data => data.productType === "DPK") || [];

    const totalDippings = () => {
        let pms = 0;
        let ago = 0;
        let dpk = 0;

        for(let pm of PMSTanks){
            pms = pms + Number(pm.currentLevel);
        }

        for(let pm of AGOTanks){
            ago = ago + Number(pm.currentLevel);
        }

        for(let pm of DPKTanks){
            dpk = dpk + Number(pm.currentLevel);
        }

        return [pms, ago, dpk];
    }

    return(
        <div style={{width:'100%'}}>
            <div style={{width:'100%', textAlign:'left', marginBottom:'10px', color:'#06805B', fontSize:'12px', fontWeight:'900'}}>
                Dipping
            </div>
            <div style={{width:'100%'}} className='main-sales'>
                <div className='inner'>
                    <div className='table-heads'>
                        <div className='col'>Tank Name</div>
                        <div className='col'>Product Type</div>
                        <div className='col'>Tank Level</div>
                        <div className='col'>Dipping value</div>
                        <div style={{marginRight:'0px'}} className='col'>Difference</div>
                    </div>

                    {
                        props?.data?.length === 0?
                        <div style={dats}> No Data </div>:
                        props?.data?.map((data, index) => {
                            return(
                                <div key={index} className='table-heads2'>
                                    <div className='col'>{data.tankName}</div>
                                    <div className='col'>{data.productType}</div>
                                    <div className='col'>{data.currentLevel}</div>
                                    <div className='col'>{data.dipping}</div>
                                    <div style={{marginRight:'0px'}} className='col'>{Number(data.currentLevel) - Number(data.dipping)}</div>
                                </div>
                            )
                        })
                    }

                    <div className='table-heads2'>
                        <div className='col'>Total</div>
                        <div className='col'>{totalDippings()[0]}</div>
                        <div className='col'>{totalDippings()[1]}</div>
                        <div style={{marginRight:'0px'}} className='col'>{totalDippings()[2]}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ComprehensiveReport = (props) => {

    const dispatch = useDispatch();
    const dateInput = useRef();
    const user = useSelector(state => state.authReducer.user);
    const dailySales = useSelector(state => state.dailySalesReducer.dailySales);
    const lpoRecords = useSelector(state => state.dailySalesReducer.lpoRecords);
    const paymentRecords = useSelector(state => state.dailySalesReducer.paymentRecords);
    const bulkReports = useSelector(state => state.dailySalesReducer.bulkReports);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const [prints, setPrints] = useState(false);
    const [forwardBalance, setForwardBalance] = useState({});
    const [tanks, setTanks] = useState([]);
    const [defaultState, setDefault] = useState(0);
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const [currentDate, setCurrentDate] = useState();
    const [dateValue, setDateValue] = useState(new Date());

    const printReport = () => {
        setPrints(true);
    }

    const getYesterdayReport = useCallback(() => {
        const payload = {
            organisationID: oneStationData?.organisation,
            outletID: oneStationData?._id,
            onLoad: true
        }

        DailySalesService.getYesterdayRecords(payload).then(data => {
            setForwardBalance(data);
        }) 

        OutletService.getAllOutletTanks(payload).then(data => {
            setTanks(data.stations);
        })
    }, [oneStationData?._id, oneStationData?.organisation])

    const getAllProductData = useCallback(() => {

        const payload = {
            organisation: user._id
        }

        if(user.userType === "superAdmin" || user.userType === "admin"){
            // setLoads(true);
            OutletService.getAllOutletStations(payload).then(data => {
                dispatch(getAllStations(data.station));
                if(data.station.length !== 0){
                    setDefault(1);
                }
                dispatch(adminOutlet(data.station[0]));
                return data.station[0];
            }).then(async(data)=>{
                props.getDailySales(data, true, "");
                // setLoads(false);
            });
        }else{
            // setLoads(true);
            OutletService.getOneOutletStation({outletID: user.outletID}).then(data => {
                dispatch(adminOutlet(data.station));
                return data.station;
            }).then(async(data)=>{
                props.getDailySales(data, true, "");
                // setLoads(false);
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        const date = new Date();
        const toString = date.toDateString();
        const [month, day, year] = toString.split(' ');
        const date2 = `${day} ${month} ${year}`;

        setCurrentDate(date2);
        setDateValue(date);

        getAllProductData();
        getYesterdayReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const changeMenu = (index, item ) => {
        setDateValue(new Date());
        setDefault(index);
        dispatch(adminOutlet(item));
        // setLoads(true);

        props.getDailySales(item, true, "");

        const payload = {
            organisationID: item.organisation,
            outletID: item._id,
            onLoad: true
        }

        DailySalesService.getYesterdayRecords(payload).then(data => {
            setForwardBalance(data);
        }) 

        OutletService.getAllOutletTanks(payload).then(data => {
            setTanks(data.stations);
        })

        const date = new Date();
        const toString = date.toDateString();
        const [month, day, year] = toString.split(' ');
        const date2 = `${day} ${month} ${year}`;
        setCurrentDate(date2);
    }

    const changeSalesDate = () => {
        dateInput.current.showPicker();
    }

    const changeDailySales = (e) => {
        setDateValue(e.target.value);
        const date = e.target.value.split('-');
        const format = `${date[2]} ${months[date[1]]} ${date[0]}`;
        setCurrentDate(format);
        props.getDailySales(oneStationData, false, e.target.value);

        const [year, month, day] = e.target.value.split('-');
        const date2 = `${year}-${month}-${day}`;

        const payload = {
            organisationID: oneStationData?.organisation,
            outletID: oneStationData?._id,
            date: date2,
            onLoad: false
        }

        DailySalesService.getYesterdayRecords(payload).then(data => {
            setForwardBalance(data);
        }) 

        OutletService.getAllOutletTanks(payload).then(data => {
            setTanks(data.stations);
        })
    }

    return(
        <div className='reportContainer'>
            { prints && <ComprehensiveReports tanks={tanks} forwardBalance={forwardBalance} data={dailySales} open={prints} close={setPrints}/>}
            <div style={cont} className='controls'>
                <div>
                    {(user.userType === "superAdmin" || user.userType === "admin") &&
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={defaultState}
                            sx={selectStyle2}
                        >
                            <MenuItem style={menu} value={0}>Select Station</MenuItem>
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
                            <MenuItem style={menu} value={0}>{user.userType === "staff" ?oneStationData?.outletName+", "+oneStationData?.alias: "No station created"}</MenuItem>
                        </Select>
                    }
                </div>
                <div style={{position: 'relative'}}>
                    <input value={dateValue} onChange={e => {changeDailySales(e)}} ref={dateInput} style={{visibility:'hidden', marginRight:'20px'}} type="date" />
                    <Button 
                        variant="contained" 
                        sx={{
                            width:'100px',
                            height:'30px',
                            background:'#06805B',
                            fontSize:'11px',
                            marginLeft:'10px',
                            borderRadius:'0px',
                            textTransform:'capitalize',
                            position:'absolute',
                            zIndex:'20',
                            right:'75px',
                            '&:hover': {
                                backgroundColor: '#06805B'
                            }
                        }}
                        onClick={changeSalesDate}
                    >
                        <div>{currentDate}</div>
                    </Button>
                    <Button 
                        variant="contained" 
                        sx={{
                            width:'60px',
                            height:'30px',
                            background:'#F36A4C',
                            fontSize:'11px',
                            marginLeft:'10px',
                            borderRadius:'0px',
                            textTransform:'capitalize',
                            '&:hover': {
                                backgroundColor: '#F36A4C'
                            }
                        }}
                        onClick={printReport}
                    >
                        Print
                    </Button>
                </div>
            </div>

            <div className='mains-report'>
                <div className='left'>
                    <div className='inner-main'>
                        <div className="contains">
                            <div style={{marginBottom:'30px'}} className='table-cont'>
                                <LeftTableView supply={forwardBalance?.supply} data={tanks} sales={forwardBalance?.sales} />
                                <MiddleTableView data={forwardBalance?.supply} />
                                <RightTableView supply={forwardBalance?.supply} data={tanks} sales={forwardBalance?.sales} />
                            </div>
                        </div>

                        <PMSDailySales rep={false} />
                        <AGODailySales rep={false} />
                        <DPKDailySales rep={false} />
                        <LPODailySales data={lpoRecords} />
                        <ExpensesDailySales data = {paymentRecords.expenses} />

                        <div className='paym'>
                            <div className='pleft'>
                                <ExpensesSummary expenses={paymentRecords.expenses} sales={dailySales} />
                            </div>
                            <div className='pleft'>
                                <PaymentDailySales data={paymentRecords} />
                            </div>
                        </div>

                        <div className='paym2'>
                            <div className='pleft'>
                                <ProductDailySales supply={forwardBalance?.supply} data={tanks} sales={forwardBalance?.sales} />
                            </div>
                            <div className='pright'>
                                <DippingDailySales data={bulkReports?.dipping} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='right'>world</div>
            </div>
        </div>
    )
}

const dats = {
    marginTop:'20px',
    fontSize:'12px',
    fontWeight:'bold',
}

const cont = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between'
}

const menu = {
    fontSize:'12px',
}

const selectStyle2 = {
    width:'150px', 
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

export default ComprehensiveReport;