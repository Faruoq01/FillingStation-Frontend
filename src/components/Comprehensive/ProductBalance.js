import edit from '../../assets/comp/edit.png';
import del from '../../assets/comp/delete.png';

const ProductBalance = (props) => { 

    const ProductRow = () => {
        return(
            <div style={{marginTop:'5px'}} className="product_balance_header">
                <div style={ins} className="cells">Pump 1</div>
                <div style={ins} className="cells">2000</div>
                <div style={ins} className="cells">5000</div>
                <div style={ins} className="cells">3000</div>
                <div style={ins} className="cells">100</div>
                <div style={ins} className="cells">185</div>
                <div style={ins} className="cells">20</div>
                <div style={ins} className="cells">20000</div>
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
                <div className="cells">{props.type}</div>
                <div className="cells">Opening</div>
                <div className="cells">Closing</div>
                <div className="cells">Differences</div>
                <div className="cells">LPO</div>
                <div className="cells">Rate</div>
                <div className="cells">R/T</div>
                <div className="cells">Amount</div>
                <div className="cells">Action</div>
            </div>

            <ProductRow />
            <ProductRow />
            <ProductRow />
            <ProductRow />
            <ProductRow />
        </div>
    )
}

const ins = {
    background: '#EDEDEDB2',
    color:'#000',
    fontWeight:'600'
}

export default ProductBalance;