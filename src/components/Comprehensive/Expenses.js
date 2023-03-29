import edit from '../../assets/comp/edit.png';
import del from '../../assets/comp/delete.png';
import { useSelector } from 'react-redux';

const Expenses = () => {

    const {expenses} = useSelector(state => state.dailySalesReducer.bulkReports);

    const ExpensesRow = (props) => {
        return(
            <div style={{marginTop:'5px'}} className="product_balance_header">
                <div style={ins} className="cells">{props.index + 1}</div>
                <div style={ins} className="cells">{props.data.expenseName}</div>
                <div style={ins} className="cells">{props.data.expenseAmount}</div>
                <div style={ins} className="cells">
                    <img style={{width:'20px', height:'20px', marginRight:'10px'}} src={edit} alt="icon" />
                    <img style={{width:'20px', height:'20px'}} src={del} alt="icon" />
                </div>
            </div>
        )
    }

    return(
        <div className="initial_balance_container">
            <div className="product_balance_header">
                <div className="cells">S/N</div>
                <div className="cells">Expense Name</div>
                <div className="cells">Amount</div>
                <div className="cells">Action</div>
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
    )
}

const ins = {
    background: '#EDEDEDB2',
    color:'#000',
    fontWeight:'600'
}

export default Expenses;