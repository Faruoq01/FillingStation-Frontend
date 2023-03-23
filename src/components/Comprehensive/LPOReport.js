import edit from '../../assets/comp/edit.png';
import del from '../../assets/comp/delete.png';

const LPOReport = () => {

    const LPORows = () => {
        return(
            <div style={{marginTop:'5px'}} className="product_balance_header">
                <div style={ins} className="cells">1</div>
                <div style={{...ins, width:'150%'}} className="cells">Aminu Faruk </div>
                <div style={ins} className="cells">PMS</div>
                <div style={ins} className="cells">XXXXX</div>
                <div style={ins} className="cells">20000</div>
                <div style={ins} className="cells">185</div>
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
                <div style={{width:'150%'}} className="cells">Account Name</div>
                <div className="cells">Product</div>
                <div className="cells">Truck No</div>
                <div className="cells">Quantity</div>
                <div className="cells">Rate</div>
                <div className="cells">Amount</div>
                <div className="cells">Action</div>
            </div>

            <LPORows />
            <LPORows />
            <LPORows />
            <LPORows />
            <LPORows />
            <LPORows />
        </div>
    )
}

const ins = {
    background: '#EDEDEDB2',
    color:'#000',
    fontWeight:'600'
}

export default LPOReport;