import edit from '../../assets/comp/edit.png';
import del from '../../assets/comp/delete.png';

const Expenses = () => {

    const ExpensesRow = () => {
        return(
            <div style={{marginTop:'5px'}} className="product_balance_header">
                <div style={ins} className="cells">1</div>
                <div style={ins} className="cells">Station generator </div>
                <div style={ins} className="cells">2000000</div>
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

            <ExpensesRow />
            <ExpensesRow />
            <ExpensesRow />
            <ExpensesRow />
            <ExpensesRow />
            <ExpensesRow />
        </div>
    )
}

const ins = {
    background: '#EDEDEDB2',
    color:'#000',
    fontWeight:'600'
}

export default Expenses;