import { Button } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import DailySalesService from '../../services/DailySales';
import '../../styles/report.scss';
import ComprehensiveReports from '../Reports/ConprehensiveReports';
import AGODailySales from './AGODailySales';
import DPKDailySales from './DPKDailySales';
import PMSDailySales from './PMSDailySales';

const LeftTableView = (props) => {

    const getBalance = () => {
        const PMS = props?.data?.filter(data => data.productType === "PMS") || [];
        const AGO = props?.data?.filter(data => data.productType === "AGO") || [];
        const DPK = props?.data?.filter(data => data.productType === "DPK") || [];

        PMS?.sort(function(a, b){
            let res = [0];
            if(typeof a.currentLevel === "undefined"){
                return res;
            }else{
                return Number(a.currentLevel) - Number(b.currentLevel);
            }
        });

        AGO?.sort(function(a, b){
            let res = [0];
            if(typeof a.currentLevel === "undefined"){
                return res;
            }else{
                return Number(a.currentLevel) - Number(b.currentLevel);
            }
        });

        DPK?.sort(function(a, b){
            let res = [0];
            if(typeof a.currentLevel === "undefined"){
                return res;
            }else{
                return Number(a.currentLevel) - Number(b.currentLevel);
            }
        });

        const balances = {pms: PMS[0]?.currentLevel, ago: AGO[0]?.currentLevel,  dpk: DPK[0]?.currentLevel};
        
        return balances;
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
                    <div style={{marginRight:'0px', fontSize:'11px'}} className='cell'>{getBalance()?.pms}</div>
                </div>

                <div className='rows'>
                    <div style={{color:'#06805B', fontSize:'11px'}} className='cell'>AGO</div>
                    <div style={{marginRight:'0px', fontSize:'11px'}} className='cell'>{getBalance()?.ago}</div>
                </div>

                <div className='rows'>
                    <div style={{color:'#06805B', fontSize:'11px'}} className='cell'>DPK</div>
                    <div style={{marginRight:'0px', fontSize:'11px'}} className='cell'>{getBalance()?.dpk}</div>
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
            PMSShort = PMSShort + Number(dm.shortage);
        }

        for(let dm of AGO){
            totalAGO = totalAGO + Number(dm.quantity);
            AGOShort = AGOShort + Number(dm.shortage);
        }

        for(let dm of DPK){
            totalDPK = totalDPK + Number(dm.quantity);
            DPKShort = DPKShort + Number(dm.shortage);
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

    const yesterday = () => {
        const PMS = props?.data?.filter(data => data.productType === "PMS") || [];
        const AGO = props?.data?.filter(data => data.productType === "AGO") || [];
        const DPK = props?.data?.filter(data => data.productType === "DPK") || [];

        let totalPMS = 0;
        let totalAGO = 0;
        let totalDPK = 0;

        for(let pm of PMS){
            totalPMS = totalPMS + Number(pm.currentLevel);
        }

        for(let pm of AGO){
            totalAGO = totalAGO + Number(pm.currentLevel);
        }

        for(let pm of DPK){
            totalDPK = totalDPK + Number(pm.currentLevel);
        }

        const total = {pms: totalPMS, ago: totalAGO, dpk: totalDPK};

        return total;
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
                        <div style={{marginRight:'0px', fontSize:'11px'}} className='cell'>{yesterday()?.pms}</div>
                    </div>

                    <div className='rows'>
                        <div style={{color:'#06805B', fontSize:'11px'}} className='cell'>AGO</div>
                        <div style={{marginRight:'0px', fontSize:'11px'}} className='cell'>{yesterday()?.ago}</div>
                    </div>

                    <div className='rows'>
                        <div style={{color:'#06805B', fontSize:'11px'}} className='cell'>DPK</div>
                        <div style={{marginRight:'0px', fontSize:'11px'}} className='cell'>{yesterday()?.dpk}</div>
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
                                        data.productType === "PMS"? data.PMSRate: data.productType === "AGO"? data.AGORate: data.DPKRate
                                    }</div>
                                    <div style={{marginRight:'0px'}} className='col'>{
                                        data.productType === "PMS"? Number(data.PMSRate)*Number(data.lpoLitre): data.productType === "AGO"? Number(data.AGORate)*Number(data.lpoLitre): Number(data.DPKRate)*Number(data.lpoLitre)
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
        let total = 0;
        for(let exp of expenses){
            total = total + Number(exp.expenseAmount);
        }
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
                            <span style={{marginRight:'20px'}}>Total</span>
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
                        <div style={{marginRight:'5px', width:'50%', background:'#EDEDED', color:'#000'}} className='col'>Bank Name</div>
                        <div style={{width:'50%', display:'flex', justifyContent:'flex-start'}} className='col'>
                            <span style={{marginLeft:'10px'}}>Wema Bank</span>
                        </div>
                    </div>

                    <div style={{marginTop:'5px'}} className='table-heads'>
                        <div style={{marginRight:'5px', width:'50%', background:'#EDEDED', color:'#000'}} className='col'>Teller No</div>
                        <div style={{width:'50%', display:'flex', justifyContent:'flex-start'}} className='col'>
                            <span style={{marginLeft:'10px'}}>892783876564</span>
                        </div>
                    </div>

                    <div style={{marginTop:'5px'}} className='table-heads'>
                        <div style={{marginRight:'5px', width:'50%', background:'#EDEDED', color:'#000'}} className='col'>Teller</div>
                        <div style={{width:'50%', display:'flex', justifyContent:'flex-start'}} className='col'>
                            <span style={{marginLeft:'10px'}}>{bankPayments()}</span>
                        </div>
                    </div>

                    <div style={{marginTop:'5px'}} className='table-heads'>
                        <div style={{marginRight:'5px', width:'50%', background:'#EDEDED', color:'#000'}} className='col'>POS</div>
                        <div style={{width:'50%', display:'flex', justifyContent:'flex-start'}} className='col'>
                            <span style={{marginLeft:'10px'}}>{posPayments()}</span>
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

    const getBalance = () => {
        const PMS = props?.data?.filter(data => data.productType === "PMS");
        const AGO = props?.data?.filter(data => data.productType === "AGO");
        const DPK = props?.data?.filter(data => data.productType === "DPK");

        PMS?.sort(function(a, b){
            let res = [0];
            if(typeof a.currentLevel === "undefined"){
                return res;
            }else{
                return Number(a.currentLevel) - Number(b.currentLevel);
            }
        });

        AGO?.sort(function(a, b){
            let res = [0];
            if(typeof a.currentLevel === "undefined"){
                return res;
            }else{
                return Number(a.currentLevel) - Number(b.currentLevel);
            }
        });

        DPK?.sort(function(a, b){
            let res = [0];
            if(typeof a.currentLevel === "undefined"){
                return res;
            }else{
                return Number(a.currentLevel) - Number(b.currentLevel);
            }
        });

        const balances = {pms: PMS?.shift(), ago: AGO?.shift(),  dpk: DPK?.shift()};

        return balances;
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
                        <div className='col'>{getBalance().pms === 0? 0: getBalance().pms?.currentLevel}</div>
                        {/* <div style={{marginRight:'0px'}} className='col'></div> */}
                    </div>

                    <div className='table-heads2'>
                        <div className='col'>AGO</div>
                        <div className='col'>{getBalance().ago === 0? 0: getBalance().ago?.currentLevel}</div>
                        {/* <div style={{marginRight:'0px'}} className='col'></div> */}
                    </div>

                    <div className='table-heads2'>
                        <div className='col'>DPK</div>
                        <div className='col'>{getBalance().dpk === 0? 0: getBalance().dpk?.currentLevel}</div>
                        {/* <div style={{marginRight:'0px'}} className='col'></div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

const DippingDailySales = (props) => {

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

    useEffect(()=>{
        props.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dailySales = useSelector(state => state.dailySalesReducer.dailySales);
    const lpoRecords = useSelector(state => state.dailySalesReducer.lpoRecords);
    const paymentRecords = useSelector(state => state.dailySalesReducer.paymentRecords);
    const bulkReports = useSelector(state => state.dailySalesReducer.bulkReports);
    const [prints, setPrints] = useState(false);
    const [forwardBalance, setForwardBalance] = useState({});
    console.log(bulkReports, "bulk report")

    const printReport = () => {
        setPrints(true);
    }

    const getYesterdayReport = useCallback(() => {
        const payload = {
            organisationID: props.station.organisation,
            outletID: props.station._id,
            onLoad: true
        }

        DailySalesService.getYesterdayRecords(payload).then(data => {
            setForwardBalance(data);
        }) 
    }, [props.station._id, props.station.organisation])

    useEffect(()=>{
        getYesterdayReport();
    }, [getYesterdayReport])

    return(
        <div className='reportContainer'>
            { prints && <ComprehensiveReports data={dailySales} open={prints} close={setPrints}/>}
            <div className='controls'>
                {/* <Button 
                    variant="contained" 
                    sx={{
                        width:'120px',
                        height:'30px',
                        background:'#06805B',
                        fontSize:'13px',
                        marginLeft:'10px',
                        borderRadius:'5px',
                        textTransform:'capitalize',
                        '&:hover': {
                            backgroundColor: '#06805B'
                        }
                    }}
                    // onClick={()=>{openDailySales("report")}}
                >
                    Date Range
                </Button> */}
                <Button 
                    variant="contained" 
                    disabled
                    sx={{
                        width:'80px',
                        height:'30px',
                        background:'#F36A4C',
                        fontSize:'13px',
                        marginLeft:'10px',
                        borderRadius:'5px',
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

            <div className='mains-report'>
                <div className='left'>
                    <div className='inner-main'>
                        <div className="contains">
                            <div style={{marginBottom:'30px'}} className='table-cont'>
                                <LeftTableView data={forwardBalance?.sales} />
                                <MiddleTableView data={forwardBalance?.supply} />
                                <RightTableView data={forwardBalance?.dipping} />
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
                                <ProductDailySales data={bulkReports?.sales} />
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
    fontSize:'14px',
    fontWeight:'bold',
    fontFamily:'Nunito-Regular'
}

export default ComprehensiveReport;