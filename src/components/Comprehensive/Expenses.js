import edit from '../../assets/comp/edit.png';
import del from '../../assets/comp/delete.png';
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert';
import DailySalesService from '../../services/DailySales';
import { bulkReports } from '../../store/actions/dailySales';
import { useState } from 'react';
import UpdateExpenses from '../Modals/DailySales/expenses';

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

const Expenses = () => {

    const {expenses} = useSelector(state => state.dailySalesReducer.bulkReports);

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

    const ExpensesRow = (props) => {

        const updateRecord = (data) => {
            setOpenEdit(true);
            setOneRecord(data);
        }

        const deleteRecord = (data) => {
            swal({
                title: "Alert!",
                text: "Are you sure you want to delete this record?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    DailySalesService.deleteSales({id: data._id, type:'expenses'}).then(data => {
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
            <div style={{marginTop:'5px'}} className="product_balance_header">
                <div style={ins} className="cells">{props.index + 1}</div>
                <div style={ins} className="cells">{props.data.expenseName}</div>
                <div style={ins} className="cells">{props.data.expenseAmount}</div>
                {getPerm('15') &&
                    <div style={ins} className="cells">
                        <img onClick={()=>{updateRecord(props.data)}} style={{width:'20px', height:'20px', marginRight:'10px'}} src={edit} alt="icon" />
                        <img onClick={()=>{deleteRecord(props.data)}} style={{width:'20px', height:'20px'}} src={del} alt="icon" />
                    </div>
                }
            </div>
        )
    }

    return(
        <div style={{width:'100%'}}>
            <div style={{maxWidth: '700px'}} className="initial_balance_container">
                {openEdit && <UpdateExpenses data={oneRecord} open={openEdit} close={setOpenEdit} />}
                <div className="product_balance_header">
                    <div className="cells">S/N</div>
                    <div className="cells">Expense Name</div>
                    <div className="cells">Amount</div>
                    {getPerm('15') && <div className="cells">Action</div>}
                </div>

                {
                    expenses.length === 0?
                    <div>No records </div>:
                    expenses.map((item, index) => {
                        return(
                            <ExpensesRow key={index} data={item} index={index} />
                        )
                    })
                }
            </div>

            <div className="initial_balance_container_mobile">
                {/* Supply records */}
                <div className='mobile_header'>
                    &nbsp;&nbsp;&nbsp; Expenses
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
        </div>
    )
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

export default Expenses;