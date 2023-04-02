import "../../styles/compPayment.scss";
import edit from '../../assets/comp/edit.png';
import del from '../../assets/comp/delete.png';
import { useDispatch, useSelector } from "react-redux";
import swal from 'sweetalert';
import DailySalesService from "../../services/DailySales";
import { bulkReports } from "../../store/actions/dailySales";
import { useState } from "react";
import UpdatePayments from "../Modals/DailySales/payments";

const SupplyCard = (props) => {
    return(
        <div className='supply_card'>

            <div style={rows}>
                <div>
                    <div style={title}>138KW-ABJ</div>
                    <div style={label}>Truck No</div>
                </div>
                <div>
                <div style={title}>13,028.03</div>
                    <div style={label}>Litre Qty</div>
                </div>
            </div>

            <div style={rows}>
                <div>
                    <div style={title}>**********</div>
                    <div style={label}>Shortage</div>
                </div>
                <div>
                <div style={title}>13,028.03</div>
                    <div style={label}>Litre Qty</div>
                </div>
            </div>
        </div>
    )
}

const PaymentDetails = () => {

    const {payments, pospayment, sales, lpo, rtVolumes, expenses} = useSelector(state => state.dailySalesReducer.bulkReports);

    const dispatch = useDispatch();
    const currentDate = useSelector(state => state.dailySalesReducer.currentDate);
    const user = useSelector(state => state.authReducer.user);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);

    const [openEdit, setOpenEdit] = useState(false);
    const [oneRecord, setOneRecord] = useState({});

    const resolveUserID = () => {
        if(user.userType === "superAdmin" || user.userType === "admin"){
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


    const getPayments = () => {

        const totalExpenses = expenses.reduce((accum, current) => {
            return Number(accum) + Number(current.expenseAmount);
        }, 0);

        const totalBankPayment = payments.reduce((accum, current) => {
            return Number(accum) + Number(current.amountPaid);
        }, 0);


        const totalPOSPayment = pospayment.reduce((accum, current) => {
            return Number(accum) + Number(current.amountPaid);
        }, 0);


        /*############################################
            Total sales
        ###############################################*/

        const totalPMS = sales.filter(data => data.productType === "PMS").reduce((accum, current) => {
            return Number(accum) + (Number(current.sales) * Number(current.PMSSellingPrice));
        }, 0);

        const totalAGO = sales.filter(data => data.productType === "AGO").reduce((accum, current) => {
            return Number(accum) + (Number(current.sales) * Number(current.AGOSellingPrice));
        }, 0);

        const totalDPK = sales.filter(data => data.productType === "DPK").reduce((accum, current) => {
            return Number(accum) + (Number(current.sales) * Number(current.DPKSellingPrice));
        }, 0);

        /*############################################
            Total lpo sales
        ###############################################*/

        const totalLpoPMS = lpo.filter(data => data.productType === "PMS").reduce((accum, current) => {
            return Number(accum) + (Number(current.lpoLitre) * Number(current.PMSRate));
        }, 0);

        const totalLpoAGO = lpo.filter(data => data.productType === "AGO").reduce((accum, current) => {
            return Number(accum) + (Number(current.lpoLitre) * Number(current.AGORate));
        }, 0);

        const totalLpoDPK = lpo.filter(data => data.productType === "DPK").reduce((accum, current) => {
            return Number(accum) + (Number(current.lpoLitre) * Number(current.DPKRate));
        }, 0);

         /*############################################
            Return to tank
        ###############################################*/

        const pmsRT = rtVolumes.filter(data => data.productType === "PMS").reduce((accum, current) => {
            return Number(accum) + (Number(current.rtLitre) * Number(current.PMSPrice));
        }, 0);

        const agoRT = rtVolumes.filter(data => data.productType === "AGO").reduce((accum, current) => {
            return Number(accum) + (Number(current.rtLitre) * Number(current.AGOPrice));
        }, 0);

        const dpkRT = rtVolumes.filter(data => data.productType === "DPK").reduce((accum, current) => {
            return Number(accum) + (Number(current.rtLitre) * Number(current.DPKPrice));
        }, 0);

        const totalSales = totalPMS + totalAGO + totalDPK;
        const totalLpoSales = totalLpoPMS + totalLpoAGO + totalLpoDPK;
        const totalRT = pmsRT + agoRT + dpkRT;
        const netToBank = (totalSales - totalLpoSales - totalRT) - totalExpenses;
        const totalPayments = totalBankPayment + totalPOSPayment;

        const payment = {
            totalSales: totalSales - totalRT,
            salesAmount: totalSales - totalLpoSales - totalRT,
            netToBank: netToBank,
            outstanding: totalPayments - netToBank
        }

        return payment;
    }

    const updateRecord = (data, bank) => {
        setOpenEdit(true);
        setOneRecord({data: data, bank: bank});
    }

    const deleteRecord = (data, type) => {
        swal({
            title: "Alert!",
            text: "Are you sure you want to delete this record?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                DailySalesService.deleteSales({id: data._id, type: type}).then(data => {
                    getAndAnalyzeDailySales();
                }).then(()=>{
                    swal("Success", "Record deleted successfully", "success");
                });
            }
        });
    }

    const getAndAnalyzeDailySales = () => {
        const salesPayload = {
            organisationID: resolveUserID().id,
            outletID: oneStationData._id,
            onLoad: currentDate === ""? true: false,
            selectedDate: currentDate
        }

        DailySalesService.getDailySalesDataAndAnalyze(salesPayload).then(data => {
            dispatch(bulkReports(data.dailyRecords));
        });
    }

    return(
        <div style={{width:'100%'}}>

<div className="initial_balance_container_mobile">
                {/* Supply records */}
                <div className='mobile_header'>
                    &nbsp;&nbsp;&nbsp; Bank Payments
                </div>
                <div style={{marginBottom:'20px', marginTop:'10px'}} className='balance_mobile_detail'>
                    <div className='sups'>
                        <div className='slide'>
                            <SupplyCard />
                            <SupplyCard />
                            <SupplyCard />
                        </div>
                    </div>
                </div>
            </div>

            <div className="initial_balance_container_mobile">
                {/* Supply records */}
                <div className='mobile_header'>
                    &nbsp;&nbsp;&nbsp; POS Payments
                </div>
                <div style={{marginBottom:'20px', marginTop:'10px'}} className='balance_mobile_detail'>
                    <div className='sups'>
                        <div className='slide'>
                            <SupplyCard />
                            <SupplyCard />
                            <SupplyCard />
                        </div>
                    </div>
                </div>
            </div>

            <div className="payment_details">
                {openEdit && <UpdatePayments data={oneRecord} open={openEdit} close={setOpenEdit} />}
                <div className="details_containser">
                    <div className="details_left">
                        <div className="details_table">
                            <div className="details_title">Bank Payments</div>
                            <div className="detail_table_header">
                                <div className="detail_table_row">S/N</div>
                                <div className="detail_table_row">Bank Name</div>
                                <div className="detail_table_row">Teller No</div>
                                <div className="detail_table_row">Amount</div>
                                {getPerm('16') && <div className="detail_table_row">Action</div>}
                            </div>

                            {
                                payments.length === 0?
                                <div>No record</div>:
                                payments.map((item, index) => {
                                    return(
                                        <div key={index} className="detail_table_header">
                                            <div className="detail_table_row2">{index + 1}</div>
                                            <div className="detail_table_row2">{item.bankName}</div>
                                            <div className="detail_table_row2">{item.tellerNumber}</div>
                                            <div className="detail_table_row2">{item.amountPaid}</div>
                                            {getPerm('16') &&
                                                <div style={ins} className="detail_table_row2">
                                                    <img onClick={()=>{updateRecord(item, "bank")}} style={{width:'20px', height:'20px', marginRight:'10px'}} src={edit} alt="icon" />
                                                    <img onClick={()=>{deleteRecord(item, "bank")}} style={{width:'20px', height:'20px'}} src={del} alt="icon" />
                                                </div>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <div style={{marginTop:'30px'}} className="details_table">
                            <div className="details_title">POS Payments</div>
                            <div className="detail_table_header">
                                <div className="detail_table_row">S/N</div>
                                <div className="detail_table_row">Bank Name</div>
                                <div className="detail_table_row">Terminal ID</div>
                                <div className="detail_table_row">Amount</div>
                                {getPerm('16') && <div className="detail_table_row">Action</div>}
                            </div>

                            {
                                pospayment.length === 0?
                                <div>No records</div>:
                                pospayment.map((item, index) => {
                                    return(
                                        <div key={index} className="detail_table_header">
                                            <div className="detail_table_row2">{index + 1}</div>
                                            <div className="detail_table_row2">{item.posName}</div>
                                            <div className="detail_table_row2">{item.terminalID}</div>
                                            <div className="detail_table_row2">{item.amountPaid}</div>
                                            {getPerm('16') &&
                                                <div style={ins} className="detail_table_row2">
                                                    <img onClick={()=>{updateRecord(item, "pos")}} style={{width:'20px', height:'20px', marginRight:'10px'}} src={edit} alt="icon" />
                                                    <img onClick={()=>{deleteRecord(item, "pos")}} style={{width:'20px', height:'20px'}} src={del} alt="icon" />
                                                </div>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="details_right">
                        <div className="summary_details">
                            <div className="detail_cell">Total Sales</div>
                            <div style={vals} className="detail_cell">{getPayments().totalSales}</div>
                        </div>

                        <div className="summary_details">
                            <div className="detail_cell">Sales Amount (no LPO)</div>
                            <div style={vals} className="detail_cell">{getPayments().salesAmount}</div>
                        </div>

                        <div className="summary_details">
                            <div className="detail_cell">Net to bank</div>
                            <div style={vals} className="detail_cell">{getPayments().netToBank}</div>
                        </div>

                        <div className="summary_details">
                            <div className="detail_cell">Outstanding</div>
                            <div style={vals} className="detail_cell">{getPayments().outstanding}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const vals = {
    background:'#F0F0F0', 
    color:'#000', 
    marginTop:'5px'
}

const ins = {
    background: '#EDEDEDB2',
    color:'#000',
    fontWeight:'600'
}

const rows = {
    width:'90%',
    height:'auto',
    marginTop:'20px',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between'
}

const title = {
    fontSize:'14px',
    fontWeight:'500',
    fontFamily:'Poppins',
    lineHeight:'30px',
    color:'#515151'
}

const label = {
    fontSize:'12px',
    fontWeight:'500',
    fontFamily:'Poppins',
    color:'#07956A'
}


export default PaymentDetails;