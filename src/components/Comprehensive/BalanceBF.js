import edit from '../../assets/comp/edit.png';
import del from '../../assets/comp/delete.png';

const InitialBalance = () => {

    const InitialRows = () => {
        return(
            <div style={{marginTop:'5px'}} className="header_balance_container">
                <div style={ins} className="B_forward">
                    <div style={{marginRight:'5px'}} className="b_child">PMS</div>
                    <div className="b_child">20,000</div>
                </div>
                <div style={ins} className="initial_supply">
                    <div style={{marginRight:'5px'}} className="b_child">PMS</div>
                    <div style={{marginRight:'5px'}} className="b_child">10000</div>
                    <div style={{marginRight:'5px'}} className="b_child">0</div>
                    <div className="b_child">1000</div>
                </div>
                <div style={ins} className="B_forward">
                    <div style={{marginRight:'5px'}} className="b_child">PMS</div>
                    <div className="b_child">30000</div>
                </div>
                <div style={ins} className="initial_action">
                    <div className="b_child">
                        <img style={{width:'20px', height:'20px', marginRight:'10px'}} src={edit} alt="icon" />
                        <img style={{width:'20px', height:'20px'}} src={del} alt="icon" />
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div className="initial_balance_container">
            <div className="header_balance_container">
                <div className="B_forward">Balance B/Forward</div>
                <div className="initial_supply">&nbsp; &nbsp; Supply</div>
                <div className="B_forward">Available Balance</div>
                <div className="initial_action">Action</div>
            </div>

            <div style={{marginTop:'5px'}} className="header_balance_container">
                <div style={ins} className="B_forward">
                    <div style={{marginRight:'5px'}} className="b_child">Product Type</div>
                    <div className="b_child">Litre Qty</div>
                </div>
                <div style={ins} className="initial_supply">
                    <div style={{marginRight:'5px'}} className="b_child">Type</div>
                    <div style={{marginRight:'5px'}} className="b_child">Quantity</div>
                    <div style={{marginRight:'5px'}} className="b_child">Shortage</div>
                    <div className="b_child">Overage</div>
                </div>
                <div style={ins} className="B_forward">
                    <div style={{marginRight:'5px'}} className="b_child">Product Type</div>
                    <div className="b_child">Litre Qty</div>
                </div>
                <div style={ins} className="initial_action">
                    <div className="b_child">
                        <img style={{width:'20px', height:'20px', marginRight:'10px'}} src={edit} alt="icon" />
                        <img style={{width:'20px', height:'20px'}} src={del} alt="icon" />
                    </div>
                </div>
            </div>

            <InitialRows />
            <InitialRows />
            <InitialRows />
            <InitialRows />
        </div>
    )
}

const ins = {
    background: 'transparent',
    color:'#000'
}

export default InitialBalance;
