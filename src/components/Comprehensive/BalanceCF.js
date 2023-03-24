import edit from '../../assets/comp/edit.png';
import del from '../../assets/comp/delete.png';

const BalanceCF = () => {

    const ExpensesRow = () => {
        return(
            <div style={{marginTop:'5px'}} className="product_balance_header">
                <div style={ins} className="cells">1</div>
                <div style={ins} className="cells">PMS </div>
                <div style={ins} className="cells">2000000</div>
                <div style={ins} className="cells">Said</div>
                <div style={ins} className="cells">
                    <img style={{width:'20px', height:'20px', marginRight:'10px'}} src={edit} alt="icon" />
                    <img style={{width:'20px', height:'20px'}} src={del} alt="icon" />
                </div>
            </div>
        )
    }

    return(
        <div style={{width:'100%'}}>
            <div className="initial_balance_container">
                <div className="product_balance_header">
                    <div className="cells">S/N</div>
                    <div className="cells">Product Type</div>
                    <div className="cells">Quantity</div>
                    <div className="cells">Confirmed By</div>
                    <div className="cells">Action</div>
                </div>

                <ExpensesRow />
                <ExpensesRow />
                <ExpensesRow />
                <ExpensesRow />
                <ExpensesRow />
                <ExpensesRow />
            </div>

            <div className="initial_balance_container_mobile"></div>
        </div>
    )
}

const ins = {
    background: '#EDEDEDB2',
    color:'#000',
    fontWeight:'600'
}

export default BalanceCF;